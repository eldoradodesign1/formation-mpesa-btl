import { createClient } from "npm:@supabase/supabase-js@2";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-training-token",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const out = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...headers, "Content-Type": "application/json" },
});

const db = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);

const managementRoles = new Set(["supervisor", "admin", "sub_admin", "superadmin", "super_admi", "super_admin"]);
const superAdminRoles = new Set(["superadmin", "super_admi", "super_admin"]);
const hostessModuleCode = "formation-hotesses";

type TrainingUser = {
  id: string;
  phone: string;
  full_name: string | null;
  role: string;
  user_category: string;
};

type TrainingModule = {
  code: string;
  title: string;
  description: string;
  estimated_minutes: number;
  position: number;
};

function canAccessModule(user: Pick<TrainingUser, "role" | "user_category">, moduleCode: string) {
  if (moduleCode !== hostessModuleCode) return true;
  return user.user_category === "hostess" || managementRoles.has(user.role);
}

async function activeModules() {
  const { data, error } = await db
    .from("training_modules")
    .select("code,title,description,estimated_minutes,position")
    .eq("is_active", true)
    .order("position");
  if (error) throw error;
  return (data || []) as TrainingModule[];
}

async function sessionOf(req: Request) {
  const token = req.headers.get("x-training-token") || req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;

  const { data: session } = await db
    .from("training_sessions")
    .select("id,user_id,expires_at")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (!session) return null;
  await db.from("training_sessions").update({ last_seen_at: new Date().toISOString() }).eq("id", session.id);

  const { data: user } = await db
    .from("users")
    .select("id,phone,full_name,role,user_category")
    .eq("id", session.user_id)
    .maybeSingle();

  return user ? { ...session, user: user as TrainingUser } : null;
}

async function summary(users: TrainingUser[]) {
  const modules = await activeModules();
  const codesByUserId = new Map(users.map((user) => [
    user.id,
    modules.filter((module) => canAccessModule(user, module.code)).map((module) => module.code),
  ]));
  const ids = users.map((user) => user.id);

  if (!ids.length) return { codesByUserId, progress: [], attempts: [] };

  const [{ data: progress }, { data: attempts }] = await Promise.all([
    db.from("training_module_progress").select("user_id,module_code,current_slide,total_slides,status,updated_at").in("user_id", ids),
    db.from("training_assessment_attempts").select("user_id,module_code,score,is_passed,submitted_at").in("user_id", ids).order("submitted_at", { ascending: false }).limit(1000),
  ]);

  return { codesByUserId, progress: progress || [], attempts: attempts || [] };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  const path = new URL(req.url).pathname.replace(/.*\/training-gateway/, "") || "/";

  if (req.method === "POST" && path === "/login") {
    const { phone, password } = await req.json().catch(() => ({}));
    if (!phone || !password) return out({ error: "Numéro de téléphone et mot de passe requis." }, 400);

    const normalizedPhone = String(phone).trim().replace(/\s+/g, "");
    const { data: user } = await db
      .from("users")
      .select("id,phone,full_name,role,user_category,password_hash")
      .eq("phone", normalizedPhone)
      .maybeSingle();

    if (!user || user.password_hash !== String(password)) return out({ error: "Identifiants incorrects." }, 401);

    await db.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id);
    const { data: session, error } = await db.from("training_sessions").insert({ user_id: user.id }).select("token,expires_at").single();
    if (error || !session) return out({ error: "Impossible d’ouvrir la session." }, 500);

    return out({
      token: session.token,
      expiresAt: session.expires_at,
      user: { id: user.id, phone: user.phone, fullName: user.full_name, role: user.role, category: user.user_category },
    });
  }

  const session = await sessionOf(req);
  if (!session) return out({ error: "Session invalide ou expirée." }, 401);

  if (req.method === "GET" && path === "/overview") {
    const [modules, progress, attempts, certificate] = await Promise.all([
      activeModules(),
      db.from("training_module_progress").select("module_code,current_slide,total_slides,status,started_at,completed_at,updated_at").eq("user_id", session.user_id),
      db.from("training_assessment_attempts").select("module_code,score,is_passed,submitted_at").eq("user_id", session.user_id).order("submitted_at", { ascending: false }).limit(100),
      db.from("training_certificates").select("certificate_number,issued_at").eq("user_id", session.user_id).maybeSingle(),
    ]);

    const visibleModules = modules.filter((module) => canAccessModule(session.user, module.code));
    const visibleCodes = new Set(visibleModules.map((module) => module.code));
    return out({
      user: session.user,
      modules: visibleModules,
      progress: (progress.data || []).filter((item) => visibleCodes.has(item.module_code)),
      attempts: (attempts.data || []).filter((item) => visibleCodes.has(item.module_code)),
      certificate: certificate.data || null,
    });
  }

  if (req.method === "POST" && path === "/progress") {
    const { moduleCode, currentSlide, totalSlides, status } = await req.json().catch(() => ({}));
    if (!moduleCode || !Number.isInteger(currentSlide) || !Number.isInteger(totalSlides)) return out({ error: "Progression invalide." }, 400);

    const modules = await activeModules();
    if (!modules.some((module) => module.code === moduleCode) || !canAccessModule(session.user, moduleCode)) {
      return out({ error: "Ce module n’est pas accessible pour ce profil." }, 403);
    }

    const now = new Date().toISOString();
    const nextStatus = status === "completed" ? "completed" : currentSlide > 0 ? "in_progress" : "not_started";
    const { error } = await db.from("training_module_progress").upsert({
      user_id: session.user_id,
      module_code: moduleCode,
      current_slide: currentSlide,
      total_slides: totalSlides,
      status: nextStatus,
      started_at: currentSlide > 0 ? now : null,
      completed_at: nextStatus === "completed" ? now : null,
      updated_at: now,
    }, { onConflict: "user_id,module_code" });

    return error ? out({ error: "Impossible d’enregistrer la progression." }, 500) : out({ success: true });
  }

  if (req.method === "POST" && path === "/assessment") {
    const { moduleCode, score, correctAnswers, totalQuestions, answers } = await req.json().catch(() => ({}));
    if (!moduleCode || typeof score !== "number" || !Number.isInteger(correctAnswers) || !Number.isInteger(totalQuestions) || totalQuestions <= 0) {
      return out({ error: "Résultat d’évaluation invalide." }, 400);
    }

    const modules = await activeModules();
    if (!modules.some((module) => module.code === moduleCode) || !canAccessModule(session.user, moduleCode)) {
      return out({ error: "Ce module n’est pas accessible pour ce profil." }, 403);
    }

    const { error } = await db.from("training_assessment_attempts").insert({
      user_id: session.user_id,
      module_code: moduleCode,
      score,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      is_passed: score >= 80,
      answers: answers || {},
    });

    return error ? out({ error: "Impossible d’enregistrer le résultat." }, 500) : out({ success: true, isPassed: score >= 80 });
  }

  if (req.method === "GET" && path === "/dashboard") {
    const scope = superAdminRoles.has(session.user.role)
      ? "global"
      : session.user.role === "admin" || session.user.role === "sub_admin"
        ? "operational"
        : session.user.role === "supervisor"
          ? "assigned"
          : null;

    if (!scope) return out({ error: "Accès superviseur requis." }, 403);

    let query = db.from("users").select("id,full_name,phone,role,user_category");
    if (scope === "operational") query = query.in("role", ["agent", "supervisor", "sub_admin"]);
    if (scope === "assigned") query = query.eq("supervisor_id", session.user.id).neq("role", "admin");

    const { data: users, error } = await query.order("full_name");
    if (error) return out({ error: "Impossible de charger les utilisateurs." }, 500);

    const people = (users || []) as TrainingUser[];
    const data = await summary(people);
    const agents = people.map((person) => {
      const allowedCodes = data.codesByUserId.get(person.id) || [];
      const allowedSet = new Set(allowedCodes);
      const progress = data.progress.filter((item) => item.user_id === person.id && allowedSet.has(item.module_code));
      const latest = new Map<string, typeof data.attempts[number]>();
      data.attempts
        .filter((item) => item.user_id === person.id && allowedSet.has(item.module_code))
        .forEach((item) => { if (!latest.has(item.module_code)) latest.set(item.module_code, item); });

      const attempts = [...latest.values()];
      const completedModules = progress.filter((item) => item.status === "completed").length;
      const validatedModules = allowedCodes.filter((code) => latest.get(code)?.is_passed).length;
      const averageScore = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + Number(item.score), 0) / attempts.length) : null;
      const lastActivity = [...progress.map((item) => item.updated_at), ...attempts.map((item) => item.submitted_at)].filter(Boolean).sort().at(-1) || null;

      return {
        id: person.id,
        fullName: person.full_name,
        phone: person.phone,
        category: person.user_category,
        completedModules,
        validatedModules,
        totalModules: allowedCodes.length,
        averageScore,
        lastActivity,
      };
    });

    return out({
      scope: scope === "global" ? "global" : scope === "assigned" ? "assigned" : "global",
      viewerRole: session.user.role,
      moduleCount: Math.max(0, ...agents.map((agent) => agent.totalModules)),
      agents,
    });
  }

  if (req.method === "POST" && path === "/certificate") {
    const data = await summary([session.user]);
    const allowedCodes = data.codesByUserId.get(session.user_id) || [];
    const allowedSet = new Set(allowedCodes);
    const progress = data.progress.filter((item) => item.user_id === session.user_id && allowedSet.has(item.module_code));
    const latest = new Map<string, typeof data.attempts[number]>();
    data.attempts
      .filter((item) => item.user_id === session.user_id && allowedSet.has(item.module_code))
      .forEach((item) => { if (!latest.has(item.module_code)) latest.set(item.module_code, item); });

    if (!allowedCodes.every((code) => progress.some((item) => item.module_code === code && item.status === "completed") && latest.get(code)?.is_passed)) {
      return out({ error: "Le certificat est disponible après validation de tous les modules accessibles." }, 422);
    }

    const { data: existing } = await db.from("training_certificates").select("certificate_number,issued_at").eq("user_id", session.user_id).maybeSingle();
    if (existing) return out({ certificate: existing, user: session.user });

    const number = `BTL-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const { data: certificate, error } = await db
      .from("training_certificates")
      .insert({ user_id: session.user_id, certificate_number: number })
      .select("certificate_number,issued_at")
      .single();

    return error ? out({ error: "Impossible de créer le certificat." }, 500) : out({ certificate, user: session.user });
  }

  return out({ error: "Route inconnue." }, 404);
});
