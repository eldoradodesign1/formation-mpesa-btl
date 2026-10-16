import { canAccessSupervision } from "./trainingCompletion";

export const hostessModuleCode = "formation-hotesses";
export const brandAmbassadorsModuleCode = "formation-brand-ambassadors";

type TrainingAccessUser = {
  role?: string | null;
  category?: string | null;
};

export function canAccessTrainingModule(user: TrainingAccessUser | null | undefined, moduleCode: string, isGuest = false) {
  if (isGuest) return true;
  if (moduleCode === hostessModuleCode) return user?.category === "hostess" || canAccessSupervision(user?.role);
  if (moduleCode === brandAmbassadorsModuleCode) return user?.category === "brand_ambassador" || canAccessSupervision(user?.role);
  return true;
}

export function filterAccessibleTrainingCodes<T extends { code: string }>(modules: T[], user: TrainingAccessUser | null | undefined, isGuest = false) {
  return modules.filter((module) => canAccessTrainingModule(user, module.code, isGuest));
}
