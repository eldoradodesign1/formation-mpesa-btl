import { useState } from "react";
import { ClipboardCheck, Loader2, X } from "lucide-react";
import { loginTraining, type TrainingUser } from "@/lib/trainingGateway";
import { calculateAssessmentResult } from "@shared/trainingAssessment";

type Question = { id: string; prompt: string; options: string[]; answer: number };
const joinQrCode = `${import.meta.env.BASE_URL}images/join-qr.png`;

export function TrainingLogin({ onSuccess, onGuest }: { onSuccess: (token: string, user: TrainingUser) => void; onGuest: () => void }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginTraining(phone, password);
      onSuccess(result.token, result.user);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  };

  return <main className="training-login" aria-label="Connexion à la formation M-Pesa BTL"><section className="training-login__card"><div className="training-login__mark" aria-hidden="true"><i /><i /><i /></div><span className="micro-label">BTL Learning · Accès formation</span><h1>Entrez dans le parcours.</h1><p>Utilisez les mêmes identifiants que votre espace BTL Deployment Tracker.</p><form onSubmit={submit}><label><span>Numéro de téléphone</span><input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="Ex. 081…" required /></label><label><span>Mot de passe</span><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" placeholder="Votre mot de passe" required /></label>{error && <p className="training-login__error" role="alert">{error}</p>}<button type="submit" disabled={loading}>{loading ? <><Loader2 size={16} className="spin" /> Connexion…</> : "Accéder à la formation"}</button></form><button type="button" className="training-login__guest" onClick={onGuest}>Se connecter comme invité</button><div className="training-login__join"><img src={joinQrCode} alt="QR code pour rejoindre la formation M-Pesa BTL" /><p><b>Rejoindre la formation</b><span>Scannez ce code avec votre téléphone.</span></p></div><small>La progression et les tests sont enregistrés automatiquement par module.</small></section></main>;
}

export function AssessmentPanel({ sessionLabel, questions, onClose, onSubmit, readOnly = false }: { sessionLabel: string; questions: Question[]; onClose: () => void; onSubmit: (answers: Record<string, number>, score: number, correctAnswers: number) => Promise<void>; readOnly?: boolean }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; correct: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const completed = Object.keys(answers).length === questions.length;
  const submit = async () => {
    if (!completed || saving) return;
    const { correctAnswers: correct, score } = calculateAssessmentResult(questions, answers);
    setSaving(true);
    try {
      await onSubmit(answers, score, correct);
      setResult({ score, correct });
    } finally {
      setSaving(false);
    }
  };

  return <aside className="assessment-panel" role="dialog" aria-modal="true" aria-label={`Évaluation ${sessionLabel}`}><div className="assessment-panel__heading"><div><span className="micro-label">Évaluation de module</span><h2>{sessionLabel}</h2></div><button type="button" onClick={onClose} aria-label="Fermer l’évaluation"><X size={19} /></button></div>{readOnly ? <><p className="assessment-panel__intro">Mode Invité : questions consultables, réponses et résultats désactivés.</p><div className="assessment-questions">{questions.map((question, questionIndex) => <fieldset key={question.id}><legend><span>{String(questionIndex + 1).padStart(2, "0")}</span>{question.prompt}</legend><div>{question.options.map((option, optionIndex) => <button key={option} type="button" disabled className="assessment-option"><b>{String.fromCharCode(65 + optionIndex)}</b>{option}</button>)}</div></fieldset>)}</div></> : result ? <div className="assessment-result"><ClipboardCheck size={34} /><span className="micro-label">Résultat enregistré</span><strong>{result.score} %</strong><p>{result.correct} bonne{result.correct > 1 ? "s" : ""} réponse{result.correct > 1 ? "s" : ""} sur {questions.length}. {result.score >= 80 ? "Module validé." : "Reprenez les repères essentiels avant de continuer."}</p><button type="button" onClick={onClose}>Revenir à la formation</button></div> : <><p className="assessment-panel__intro">Quatre questions pour vérifier les repères opérationnels. Un score de 80 % valide le module.</p><div className="assessment-questions">{questions.map((question, questionIndex) => <fieldset key={question.id}><legend><span>{String(questionIndex + 1).padStart(2, "0")}</span>{question.prompt}</legend><div>{question.options.map((option, optionIndex) => <button key={option} type="button" onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))} className={answers[question.id] === optionIndex ? "assessment-option assessment-option--selected" : "assessment-option"}><b>{String.fromCharCode(65 + optionIndex)}</b>{option}</button>)}</div></fieldset>)}</div><button type="button" className="assessment-submit" disabled={!completed || saving} onClick={submit}>{saving ? "Enregistrement…" : "Valider mes réponses"}</button></>}</aside>;
}
