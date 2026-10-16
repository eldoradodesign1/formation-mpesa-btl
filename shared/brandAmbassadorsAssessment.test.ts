import { describe, expect, it } from "vitest";
import { brandAmbassadorsAssessmentQuestions, brandAmbassadorsModuleCode } from "./brandAmbassadorsAssessment";

describe("Brand Ambassadors assessment", () => {
  it("uses its own persistent module code and unique question identifiers", () => {
    expect(brandAmbassadorsModuleCode).toBe("formation-brand-ambassadors");
    expect(new Set(brandAmbassadorsAssessmentQuestions.map((question) => question.id)).size).toBe(brandAmbassadorsAssessmentQuestions.length);
    expect(brandAmbassadorsAssessmentQuestions).toHaveLength(12);
  });

  it("provides four valid choices and an in-range answer for each question", () => {
    for (const question of brandAmbassadorsAssessmentQuestions) {
      expect(question.options).toHaveLength(4);
      expect(Number.isInteger(question.answer)).toBe(true);
      expect(question.answer).toBeGreaterThanOrEqual(0);
      expect(question.answer).toBeLessThan(question.options.length);
    }
    expect(new Set(brandAmbassadorsAssessmentQuestions.map((question) => question.answer)).size).toBeGreaterThan(1);
  });
});
