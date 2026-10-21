import { describe, expect, it } from "vitest";
import {
  calculateMikiliResult,
  mikiliChoiceQuestions,
  mikiliCorrectOrder,
  mikiliMaximumPoints,
  mikiliOpenQuestions,
  mikiliQuestionCount,
  mikiliSequenceSteps,
  type MikiliAnswers,
} from "./mikiliAssessment";

const correctAnswers: MikiliAnswers = {
  ...Object.fromEntries(mikiliChoiceQuestions.map((question) => [question.id, question.answer])),
  "mikili-16": [...mikiliCorrectOrder],
  "mikili-17": "Il lui faut un compte M-Pesa Premium correctement enregistré.",
  "mikili-18": "Non, cinq dépôts seulement sont autorisés par jour.",
  "mikili-19": "Recevoir des fonds depuis l’étranger, crédités directement sur le compte M-Pesa.",
};

describe("quiz M-Pesa Mikili (document BTL Africa)", () => {
  it("contient 10 QCM, 5 Vrai/Faux, 1 ordre et 3 réponses libres : 19 questions", () => {
    expect(mikiliChoiceQuestions).toHaveLength(15);
    expect(mikiliChoiceQuestions.slice(0, 10).every((question) => question.options.length === 4)).toBe(true);
    expect(mikiliChoiceQuestions.slice(10).every((question) => question.options.join("/") === "Vrai/Faux")).toBe(true);
    expect(mikiliSequenceSteps).toHaveLength(5);
    expect(new Set(mikiliCorrectOrder).size).toBe(5);
    expect(mikiliOpenQuestions).toHaveLength(3);
    expect(mikiliQuestionCount).toBe(19);
    expect(mikiliMaximumPoints).toBe(20);
  });

  it("reproduit les réponses 1 à 15 du corrigé", () => {
    expect(mikiliChoiceQuestions.map((question) => question.answer)).toEqual([
      1, 2, 1, 2, 1, 1, 1, 0, 0, 2,
      1, 0, 0, 0, 0,
    ]);
  });

  it("attribue 20/20 au corrigé intégral", () => {
    expect(calculateMikiliResult(correctAnswers)).toMatchObject({
      points: 20, score: 100, correctAnswers: 19, isPassed: true, correctPositions: 5, correctOpen: 3,
    });
  });

  it("ne valide pas des réponses incorrectes ou manquantes", () => {
    const answers: MikiliAnswers = {
      ...Object.fromEntries(mikiliChoiceQuestions.map((question) => [question.id, (question.answer + 1) % question.options.length])),
      "mikili-16": mikiliSequenceSteps.map((step) => step.id),
      "mikili-17": "Compte Lite suffisant",
      "mikili-18": "Oui, sans limite",
      "mikili-19": "Un téléphone et une carte VISA",
    };
    expect(calculateMikiliResult(answers)).toMatchObject({ points: 0, score: 0, isPassed: false });
  });

  it("calcule la réussite sur le barème pondéré de 20 points, sans modifier les autres évaluations", () => {
    const answers = { ...correctAnswers, "mikili-17": "aucune idée", "mikili-18": "aucune idée", "mikili-19": "aucune idée" };
    const result = calculateMikiliResult(answers);
    expect(result.points).toBe(17);
    expect(result.score).toBe(85);
    expect(result.isPassed).toBe(true);
  });
});
