import { describe, expect, it } from "vitest";
import { brandAmbassadorsModuleCode, canAccessTrainingModule, filterAccessibleTrainingCodes, hostessModuleCode } from "./trainingModuleAccess";

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

  it("réserve la Formation Brand Ambassadors aux BA et aux rôles de supervision", () => {
    expect(canAccessTrainingModule({ role: "agent", category: "brand_ambassador" }, brandAmbassadorsModuleCode)).toBe(true);
    expect(canAccessTrainingModule({ role: "supervisor", category: "operations" }, brandAmbassadorsModuleCode)).toBe(true);
    expect(canAccessTrainingModule({ role: "admin", category: "operations" }, brandAmbassadorsModuleCode)).toBe(true);
    expect(canAccessTrainingModule({ role: "agent", category: "hostess" }, brandAmbassadorsModuleCode)).toBe(false);
    expect(canAccessTrainingModule({ role: "agent", category: "operations" }, brandAmbassadorsModuleCode)).toBe(false);
    expect(canAccessTrainingModule(null, brandAmbassadorsModuleCode, true)).toBe(true);
  });

  it("filtre le catalogue sans altérer les modules autorisés", () => {
    const catalogue = [{ code: "clients" }, { code: hostessModuleCode }, { code: brandAmbassadorsModuleCode }, { code: "vodacom-privilege" }];
    expect(filterAccessibleTrainingCodes(catalogue, { role: "agent", category: "brand_ambassador" }).map((module) => module.code)).toEqual(["clients", brandAmbassadorsModuleCode, "vodacom-privilege"]);
    expect(filterAccessibleTrainingCodes(catalogue, { role: "agent", category: "hostess" }).map((module) => module.code)).toEqual(["clients", hostessModuleCode, "vodacom-privilege"]);
  });
});
