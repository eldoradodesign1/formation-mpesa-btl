import { useState } from "react";
import { ArrowDown, ArrowUp, ClipboardCheck, X } from "lucide-react";
import {
  calculateMikiliResult,
  mikiliChoiceQuestions,
  mikiliCorrectOrder,
  mikiliMaximumPoints,
  mikiliOpenQuestions,
  mikiliQuestionCount,
  mikiliSequenceSteps,
  type MikiliAnswers,
} from "@shared/mikiliAssessment";

type Props = {
  sessionLabel: string;
  onClose: () => void;
  onSubmit: (answers: MikiliAnswers, score: number, correctAnswers: number) => Promise<void>;
  readOnly?: boolean;
};
const initialSequence = mikiliSequenceSteps.map((step) => step.id);

export function MikiliAssessmentPanel({ sessionLabel, onClose, onSubmit, readOnly = false }: Props) {
  const [answers, setAnswers] = useState<MikiliAnswers>({});
  const [sequence, setSequence] = useState<string[]>([...initialSequence]);
  const [sequenceTouched, setSequenceTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calculateMikiliResult> | null>(null);

  const complete = mikiliChoiceQuestions.every((q) => typeof answers[q.id] === "number")
    && sequenceTouched
    && mikiliOpenQuestions.every((q) => typeof answers[q.id] === "string" && String(answers[q.id]).trim().length > 0);

  const moveStep = (index: number, direction: -1 | 1) => {
    if (readOnly || result) return;
    const target = index + direction;
    if (target < 0 || target >= sequence.length) return;
    setSequence((old) => {
      const next = [...old];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setSequenceTouched(true);
  };

  const submit = async () => {
    if (!complete || saving || readOnly) return;
    const submitted = { ...answers, "mikili-16": sequence };
    const grading = calculateMikiliResult(submitted);
    setSaving(true);
    setError("");
    try {
      await onSubmit(submitted, grading.score, grading.correctAnswers);
      setResult(grading);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "L’enregistrement du résultat a échoué. Réessayez.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="assessment-panel" role="dialog" aria-modal="true" aria-label={`Évaluation ${sessionLabel}`}>
      <div className="assessment-panel__heading">
        <div><span className="micro-label">Évaluation de module · BTL Africa</span><h2>{sessionLabel}</h2></div>
        <button type="button" onClick={onClose} aria-label="Fermer l’évaluation"><X size={19} /></button>
      </div>
      {result ? (
        <div className="assessment-result">
          <ClipboardCheck size={34} />
          <span className="micro-label">Résultat enregistré</span>
          <strong>{result.points} / {mikiliMaximumPoints}</strong>
          <p>{result.score} % · {result.isPassed ? "Module validé." : "Score inférieur au seuil de validation de 80 %."} Les questions ouvertes sont corrigées automatiquement à titre indicatif.</p>
          <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,.15)", paddingTop: 18 }}>
            <p style={{ marginBottom: 12 }}><b>Question 16 — ordre attendu :</b> {mikiliCorrectOrder.map((id, index) => `${index + 1}. ${mikiliSequenceSteps.find(step => step.id === id)?.label}`).join(" ")}</p>
            {mikiliOpenQuestions.map((q) => <p key={q.id} style={{ marginBottom: 12 }}><b>{q.id.slice(-2)} — Corrigé indicatif :</b> {q.sample}</p>)}
          </div>
          <button type="button" onClick={onClose}>Revenir à la formation</button>
        </div>
      ) : (
        <>
          <p className="assessment-panel__intro">
            {readOnly ? "Mode Invité : questions consultables, saisie et résultats désactivés." : "19 questions · 20 points · durée conseillée : 15 à 20 minutes. Une note de 80 % valide le module."}
          </p>
          <div className="assessment-questions">
            <h3 style={{ fontSize: 13, color: "#f8f3ea", margin: "4px 0 0" }}>Partie A — Questions à choix multiples (10 points)</h3>
            {mikiliChoiceQuestions.map((question, index) => (
              <div key={question.id}>
                {index === 10 && <h3 style={{ fontSize: 13, color: "#f8f3ea", margin: "10px 0 18px" }}>Partie B — Vrai ou Faux (5 points)</h3>}
                <fieldset>
                  <legend><span>{String(index + 1).padStart(2, "0")}</span>{question.prompt}</legend>
                  <div>
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={option}
                        type="button"
                        disabled={readOnly}
                        aria-pressed={answers[question.id] === optionIndex}
                        onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                        className={answers[question.id] === optionIndex ? "assessment-option assessment-option--selected" : "assessment-option"}
                      >
                        <b>{index < 10 ? String.fromCharCode(65 + optionIndex) : optionIndex === 0 ? "V" : "F"}</b>{option}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            ))}
            <h3 style={{ fontSize: 13, color: "#f8f3ea", margin: "10px 0 0" }}>Partie C — Procédure et mise en situation (5 points)</h3>
            <fieldset>
              <legend><span>16</span>Remettez les étapes suivantes dans le bon ordre pour envoyer de l’argent à l’international depuis le menu M-Pesa : (2 points)</legend>
              <div>
                {sequence.map((stepId, index) => {
                  const step = mikiliSequenceSteps.find((entry) => entry.id === stepId);
                  return <div key={stepId} style={{ display: "grid", gridTemplateColumns: "26px 1fr auto", alignItems: "center", gap: 8, padding: "9px 10px", border: "1px solid rgba(255,255,255,.15)", color: "#f8f3ea", fontSize: 12 }}>
                    <b style={{ color: "#e60028" }}>{index + 1}.</b>
                    <span>{step?.label}</span>
                    <span style={{ display: "flex", gap: 4 }}>
                      <button type="button" disabled={readOnly || index === 0} onClick={() => moveStep(index, -1)} aria-label={`Monter l’étape ${index + 1}`} style={{ padding: 5, color: "#fff", background: "transparent", border: "1px solid #444" }}><ArrowUp size={15} /></button>
                      <button type="button" disabled={readOnly || index === sequence.length - 1} onClick={() => moveStep(index, 1)} aria-label={`Descendre l’étape ${index + 1}`} style={{ padding: 5, color: "#fff", background: "transparent", border: "1px solid #444" }}><ArrowDown size={15} /></button>
                    </span>
                  </div>;
                })}
                <small style={{ color: "#b8aaa2" }}>{sequenceTouched ? "Ordre modifié." : "Utilisez les flèches pour classer les étapes."}</small>
              </div>
            </fieldset>
            {mikiliOpenQuestions.map((question, index) => (
              <fieldset key={question.id}>
                <legend><span>{index + 17}</span>{question.prompt} (1 point)</legend>
                <div>
                  <textarea
                    rows={3}
                    aria-label={`Réponse à la question ${index + 17}`}
                    placeholder="Votre réponse…"
                    disabled={readOnly}
                    value={typeof answers[question.id] === "string" ? answers[question.id] as string : ""}
                    onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                    style={{ width: "100%", minHeight: 90, resize: "vertical", padding: 12, border: "1px solid rgba(255,255,255,.2)", background: "#101010", color: "#f8f3ea", fontFamily: "inherit", fontSize: 13 }}
                  />
                </div>
              </fieldset>
            ))}
          </div>
          {!readOnly && <>
            <p style={{ margin: "20px 0 0", fontSize: 11, lineHeight: 1.45, color: "#b8aaa2" }}>Les réponses libres sont comparées automatiquement à une grille indicative de mots-clés. Un formateur peut apprécier d’autres formulations valables.</p>
            {error && <p role="alert" className="training-login__error" style={{ marginTop: 12 }}>{error}</p>}
            <button type="button" className="assessment-submit" onClick={submit} disabled={!complete || saving}>
              {saving ? "Enregistrement…" : "Valider mes réponses"}
            </button>
          </>}
        </>
      )}
    </aside>
  );
}
