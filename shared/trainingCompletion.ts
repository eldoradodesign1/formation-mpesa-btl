export const supervisionRoles = new Set(["supervisor", "admin", "sub_admin", "superadmin"]);

export function canAccessSupervision(role: string | null | undefined) {
  return supervisionRoles.has(role || "");
}

export function isCertificateEligible(
  modules: Array<{ code: string }>,
  progress: Array<{ module_code: string; status: string }>,
  attempts: Array<{ module_code: string; is_passed: boolean }>,
) {
  return modules.length > 0 && modules.every((module) => progress.some((item) => item.module_code === module.code && item.status === "completed") && attempts.find((item) => item.module_code === module.code)?.is_passed === true);
}
