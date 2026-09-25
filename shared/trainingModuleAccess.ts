import { canAccessSupervision } from "./trainingCompletion";

export const hostessModuleCode = "formation-hotesses";

type TrainingAccessUser = {
  role?: string | null;
  category?: string | null;
};

export function canAccessTrainingModule(user: TrainingAccessUser | null | undefined, moduleCode: string, isGuest = false) {
  if (moduleCode !== hostessModuleCode) return true;
  if (isGuest) return true;
  return user?.category === "hostess" || canAccessSupervision(user?.role);
}

export function filterAccessibleTrainingCodes<T extends { code: string }>(modules: T[], user: TrainingAccessUser | null | undefined, isGuest = false) {
  return modules.filter((module) => canAccessTrainingModule(user, module.code, isGuest));
}
