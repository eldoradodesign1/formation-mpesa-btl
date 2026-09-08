import { describe, expect, it } from "vitest";
import { calculateAssessmentResult } from "./trainingAssessment";
import { vodacomPrivilegeAssessmentQuestions } from "./vodacomPrivilegeAssessment";

describe("vodacomPrivilegeAssessmentQuestions", () => {
  it("propose une évaluation renforcée de onze questions", () => {
    expect(vodacomPrivilegeAssessmentQuestions).toHaveLength(11);
    expect(vodacomPrivilegeAssessmentQuestions.every((question) => question.options.length === 4)).toBe(true);
  });

  it("valide le module à partir de neuf bonnes réponses sur onze", () => {
    const answers = Object.fromEntries(vodacomPrivilegeAssessmentQuestions.map((question) => [question.id, question.answer]));
    const nineCorrect = { ...answers, "privilege-1": 1, "privilege-2": 1 };
    const eightCorrect = { ...nineCorrect, "privilege-3": 1 };

    expect(calculateAssessmentResult(vodacomPrivilegeAssessmentQuestions, eightCorrect)).toEqual({ correctAnswers: 8, score: 73, isPassed: false });
    expect(calculateAssessmentResult(vodacomPrivilegeAssessmentQuestions, nineCorrect)).toEqual({ correctAnswers: 9, score: 82, isPassed: true });
    expect(calculateAssessmentResult(vodacomPrivilegeAssessmentQuestions, answers)).toEqual({ correctAnswers: 11, score: 100, isPassed: true });
  });
});
