const gatewayUrl = "https://upkzlppvwckriuidnyvq.supabase.co/functions/v1/training-gateway";
const ratingsGatewayUrl = "https://upkzlppvwckriuidnyvq.supabase.co/functions/v1/training-ratings";
const tokenStorageKey = "mpesa_btl_training_token";

export type TrainingUser = {
  id: string;
  phone: string;
  fullName: string | null;
  role: string;
  category: string;
};

export type TrainingOverview = {
  user: TrainingUser;
  modules: Array<{ code: string; title: string; description: string; estimated_minutes: number; position: number }>;
  progress: Array<{ module_code: string; current_slide: number; total_slides: number; status: "not_started" | "in_progress" | "completed" }>;
  attempts: Array<{ module_code: string; score: number; is_passed: boolean; submitted_at: string }>;
  certificate: { certificate_number: string; issued_at: string } | null;
};

export type SupervisorAgent = {
  id: string;
  fullName: string | null;
  phone: string;
  category: string;
  completedModules: number;
  validatedModules: number;
  totalModules: number;
  averageScore: number | null;
  supervisorRating: number | null;
  supervisorComment: string | null;
  consolidatedScore: number | null;
  lastActivity: string | null;
};

export type SupervisorDashboard = {
  scope: "assigned" | "global";
  viewerRole: string;
  moduleCount: number;
  canRate: boolean;
  agents: SupervisorAgent[];
};

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${gatewayUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "x-training-token": token } : {}),
      ...(options.headers ?? {}),
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "La demande n’a pas abouti.");
  return body as T;
}

export function getTrainingToken() {
  return window.localStorage.getItem(tokenStorageKey);
}

export function clearTrainingToken() {
  window.localStorage.removeItem(tokenStorageKey);
}

async function ratingsRequest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${ratingsGatewayUrl}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(token ? { "x-training-token": token } : {}), ...(options.headers ?? {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "La cotation n’a pas abouti.");
  return body as T;
}

export async function loginTraining(phone: string, password: string) {
  const response = await request<{ token: string; expiresAt: string; user: TrainingUser }>("/login", {
    method: "POST",
    body: JSON.stringify({ phone, password }),
  });
  window.localStorage.setItem(tokenStorageKey, response.token);
  return response;
}

export async function getTrainingOverview(token: string) {
  const overview = await request<TrainingOverview & { user: TrainingUser & { full_name?: string | null; user_category?: string } }>("/overview", {}, token);
  return {
    ...overview,
    user: {
      ...overview.user,
      fullName: overview.user.fullName ?? overview.user.full_name ?? null,
      category: overview.user.category ?? overview.user.user_category ?? "",
    },
  };
}

export function saveModuleProgress(token: string, payload: { moduleCode: string; currentSlide: number; totalSlides: number; status: "in_progress" | "completed" }) {
  return request<{ success: true }>("/progress", { method: "POST", body: JSON.stringify(payload) }, token);
}

export function saveAssessment(token: string, payload: { moduleCode: string; score: number; correctAnswers: number; totalQuestions: number; answers: Record<string, number> }) {
  return request<{ success: true; isPassed: boolean }>("/assessment", { method: "POST", body: JSON.stringify(payload) }, token);
}

export async function getSupervisorDashboard(token: string) {
  const [dashboard, ratings] = await Promise.all([request<Omit<SupervisorDashboard, "canRate">>("/dashboard", {}, token), ratingsRequest<{ canRate: boolean; ratings: Array<{ agent_id: string; rating: number; comment: string | null }> }>("/", {}, token)]);
  const byAgent = new Map(ratings.ratings.map((rating) => [rating.agent_id, rating]));
  return { ...dashboard, canRate: ratings.canRate, agents: dashboard.agents.map((agent) => { const rating = byAgent.get(agent.id); const supervisorRating = rating?.rating ?? null; const consolidatedScore = agent.averageScore === null ? (supervisorRating === null ? null : supervisorRating * 20) : supervisorRating === null ? agent.averageScore : Math.round(agent.averageScore * 0.8 + supervisorRating * 20); return { ...agent, supervisorRating, supervisorComment: rating?.comment ?? null, consolidatedScore }; }) };
}

export function saveSupervisorRating(token: string, payload: { agentId: string; rating: number; comment: string }) { return ratingsRequest<{ success: true }>("/", { method: "POST", body: JSON.stringify(payload) }, token); }

export function createCertificate(token: string) {
  return request<{ certificate: { certificate_number: string; issued_at: string }; user: TrainingUser }>("/certificate", { method: "POST" }, token);
}
