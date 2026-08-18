import { describe, expect, it } from "vitest";
import { calculateAssessmentResult } from "./trainingAssessment";

const questions = [
  { id: "q1", answer: 1 },
  { id: "q2", answer: 0 },
  { id: "q3", answer: 2 },
  { id: "q4", answer: 3 },
];

describe("calculateAssessmentResult", () => {
  it("calcule un module validé à partir de 80 %", () => {
    expect(calculateAssessmentResult(questions, { q1: 1, q2: 0, q3: 2, q4: 1 })).toEqual({
      correctAnswers: 3,
      score: 75,
      isPassed: false,
    });
    expect(calculateAssessmentResult(questions, { q1: 1, q2: 0, q3: 2, q4: 3 })).toEqual({
      correctAnswers: 4,
      score: 100,
      isPassed: true,
    });
  });

  it("retourne un score nul pour une banque de questions vide", () => {
    expect(calculateAssessmentResult([], {})).toEqual({ correctAnswers: 0, score: 0, isPassed: false });
  });
});
