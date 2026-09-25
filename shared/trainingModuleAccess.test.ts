import { describe, expect, it } from "vitest";
import { canAccessTrainingModule, filterAccessibleTrainingCodes, hostessModuleCode } from "./trainingModuleAccess";

describe("training module access", () => {
  it("réserve Formation Hôtesses aux hôtesses et aux rôles de supervision", () => {
    expect(canAccessTrainingModule({ role: "agent", category: "hostess" }, hostessModuleCode)).toBe(true);
    expect(canAccessTrainingModule({ role: "supervisor", category: "operations" }, hostessModuleCode)).toBe(true);
    expect(canAccessTrainingModule({ role: "admin", category: "operations" }, hostessModuleCode)).toBe(true);
    expect(canAccessTrainingModule({ role: "super_admin", category: "operations" }, hostessModuleCode)).toBe(true);
    expect(canAccessTrainingModule({ role: "agent", category: "brand_ambassador" }, hostessModuleCode)).toBe(false);
  });

  it("conserve les autres modules pour chaque profil et ouvre Hôtesses en visiteur", () => {
    expect(canAccessTrainingModule({ role: "agent", category: "brand_ambassador" }, "mikili")).toBe(true);
    expect(canAccessTrainingModule(null, hostessModuleCode, true)).toBe(true);
  });

  it("filtre le catalogue sans altérer les modules autorisés", () => {
    const catalogue = [{ code: "clients" }, { code: hostessModuleCode }, { code: "vodacom-privilege" }];
    expect(filterAccessibleTrainingCodes(catalogue, { role: "agent", category: "brand_ambassador" }).map((module) => module.code)).toEqual(["clients", "vodacom-privilege"]);
    expect(filterAccessibleTrainingCodes(catalogue, { role: "agent", category: "hostess" }).map((module) => module.code)).toEqual(["clients", hostessModuleCode, "vodacom-privilege"]);
  });
});
