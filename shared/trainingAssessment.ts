export type AssessmentAnswerKey = {
  id: string;
  answer: number;
};

export function calculateAssessmentResult(questions: AssessmentAnswerKey[], answers: Record<string, number>) {
  const correctAnswers = questions.reduce((total, question) => total + (answers[question.id] === question.answer ? 1 : 0), 0);
  const score = questions.length === 0 ? 0 : Math.round((correctAnswers / questions.length) * 100);
  return {
    correctAnswers,
    score,
    isPassed: score >= 80,
  };
}
