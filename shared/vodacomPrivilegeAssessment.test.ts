import { describe, expect, it } from "vitest";
import { calculateAssessmentResult } from "./trainingAssessment";
import { vodacomPrivilegeAssessmentQuestions } from "./vodacomPrivilegeAssessment";

describe("vodacomPrivilegeAssessmentQuestions", () => {
  it("propose une évaluation renforcée de dix questions", () => {
    expect(vodacomPrivilegeAssessmentQuestions).toHaveLength(10);
    expect(vodacomPrivilegeAssessmentQuestions.every((question) => question.options.length === 4)).toBe(true);
  });

  it("valide le module à partir de huit bonnes réponses sur dix", () => {
    const answers = Object.fromEntries(vodacomPrivilegeAssessmentQuestions.map((question) => [question.id, question.answer]));
    const eightCorrect = { ...answers, "privilege-1": 1, "privilege-2": 1 };

    expect(calculateAssessmentResult(vodacomPrivilegeAssessmentQuestions, eightCorrect)).toEqual({ correctAnswers: 8, score: 80, isPassed: true });
    expect(calculateAssessmentResult(vodacomPrivilegeAssessmentQuestions, answers)).toEqual({ correctAnswers: 10, score: 100, isPassed: true });
  });
});
