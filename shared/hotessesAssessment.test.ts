import { describe, expect, it } from "vitest";
import { hotessesAssessmentQuestions } from "./hotessesAssessment";
import { calculateAssessmentResult } from "./trainingAssessment";

describe("hotessesAssessmentQuestions", () => {
  it("propose une évaluation exhaustive de douze questions à quatre options", () => {
    expect(hotessesAssessmentQuestions).toHaveLength(12);
    expect(hotessesAssessmentQuestions.every((question) => question.options.length === 4)).toBe(true);
  });

  it("maintient le seuil de 80 % à dix bonnes réponses sur douze", () => {
    const answers = Object.fromEntries(hotessesAssessmentQuestions.map((question) => [question.id, question.answer]));
    const tenCorrect = { ...answers, "hotesses-1": 1, "hotesses-2": 1 };
    const nineCorrect = { ...tenCorrect, "hotesses-3": 1 };

    expect(calculateAssessmentResult(hotessesAssessmentQuestions, nineCorrect)).toEqual({ correctAnswers: 9, score: 75, isPassed: false });
    expect(calculateAssessmentResult(hotessesAssessmentQuestions, tenCorrect)).toEqual({ correctAnswers: 10, score: 83, isPassed: true });
    expect(calculateAssessmentResult(hotessesAssessmentQuestions, answers)).toEqual({ correctAnswers: 12, score: 100, isPassed: true });
  });
});
