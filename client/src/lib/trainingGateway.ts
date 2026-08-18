const gatewayUrl = "https://upkzlppvwckriuidnyvq.supabase.co/functions/v1/training-gateway";
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

export async function loginTraining(phone: string, password: string) {
  const response = await request<{ token: string; expiresAt: string; user: TrainingUser }>("/login", {
    method: "POST",
    body: JSON.stringify({ phone, password }),
  });
  window.localStorage.setItem(tokenStorageKey, response.token);
  return response;
}

export function getTrainingOverview(token: string) {
  return request<TrainingOverview>("/overview", {}, token);
}

export function saveModuleProgress(token: string, payload: { moduleCode: string; currentSlide: number; totalSlides: number; status: "in_progress" | "completed" }) {
  return request<{ success: true }>("/progress", { method: "POST", body: JSON.stringify(payload) }, token);
}

export function saveAssessment(token: string, payload: { moduleCode: string; score: number; correctAnswers: number; totalQuestions: number; answers: Record<string, number> }) {
  return request<{ success: true; isPassed: boolean }>("/assessment", { method: "POST", body: JSON.stringify(payload) }, token);
}
