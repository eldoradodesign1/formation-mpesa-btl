import { describe, expect, it } from "vitest";
import { hotessesAssessmentQuestions } from "./hotessesAssessment";
import { calculateAssessmentResult } from "./trainingAssessment";

describe("hotessesAssessmentQuestions", () => {
  it("propose une évaluation complète de seize questions à quatre options", () => {
    expect(hotessesAssessmentQuestions).toHaveLength(16);
    expect(hotessesAssessmentQuestions.every((question) => question.options.length === 4)).toBe(true);
  });

  it("couvre posture, régulation, limites, protection M-Pesa et escalade", () => {
    const content = hotessesAssessmentQuestions.flatMap((question) => [question.prompt, ...question.options]).join(" ");
    expect(content).toMatch(/présence professionnelle/i);
    expect(content).toMatch(/PAUSE/i);
    expect(content).toMatch(/numéro personnel/i);
    expect(content).toMatch(/PIN, un OTP/i);
    expect(content).toMatch(/L\.I\.E\.R/i);
    expect(content).toMatch(/F\.A\.I\.T\.S/i);
  });

  it("maintient le seuil de 80 % à treize bonnes réponses sur seize", () => {
    const answers = Object.fromEntries(hotessesAssessmentQuestions.map((question) => [question.id, question.answer]));
    const thirteenCorrect = { ...answers, "hotesses-1": 1, "hotesses-2": 1, "hotesses-3": 1 };
    const twelveCorrect = { ...thirteenCorrect, "hotesses-4": 1 };

    expect(calculateAssessmentResult(hotessesAssessmentQuestions, twelveCorrect)).toEqual({ correctAnswers: 12, score: 75, isPassed: false });
    expect(calculateAssessmentResult(hotessesAssessmentQuestions, thirteenCorrect)).toEqual({ correctAnswers: 13, score: 81, isPassed: true });
    expect(calculateAssessmentResult(hotessesAssessmentQuestions, answers)).toEqual({ correctAnswers: 16, score: 100, isPassed: true });
  });
});
