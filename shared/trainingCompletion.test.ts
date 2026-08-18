import { describe, expect, it } from "vitest";
import { canAccessSupervision, isCertificateEligible } from "./trainingCompletion";

describe("training completion access", () => {
  it("ouvre la supervision aux rôles autorisés uniquement", () => {
    expect(canAccessSupervision("supervisor")).toBe(true);
    expect(canAccessSupervision("sub_admin")).toBe(true);
    expect(canAccessSupervision("admin")).toBe(true);
    expect(canAccessSupervision("superadmin")).toBe(true);
    expect(canAccessSupervision("agent")).toBe(false);
  });

  it("n’autorise le certificat que si chaque module est terminé et validé", () => {
    const modules = [{ code: "clients" }, { code: "visa" }];
    expect(isCertificateEligible(modules, [{ module_code: "clients", status: "completed" }, { module_code: "visa", status: "completed" }], [{ module_code: "clients", is_passed: true }, { module_code: "visa", is_passed: true }])).toBe(true);
    expect(isCertificateEligible(modules, [{ module_code: "clients", status: "completed" }, { module_code: "visa", status: "completed" }], [{ module_code: "clients", is_passed: true }, { module_code: "visa", is_passed: false }])).toBe(false);
  });
});
