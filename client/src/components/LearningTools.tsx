import { useState } from "react";
import { Award, Download, FileSpreadsheet, Loader2, UsersRound, X } from "lucide-react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import type { SupervisorDashboard, TrainingUser } from "@/lib/trainingGateway";

type Certificate = { certificate_number: string; issued_at: string };

function certificateFileName(name: string | null) {
  return `certificat-mpesa-btl-${(name || "participant").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}.pdf`;
}

function downloadCertificate(user: TrainingUser, certificate: Certificate) {
  const document = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const width = document.internal.pageSize.getWidth();
  const height = document.internal.pageSize.getHeight();
  document.setFillColor(20, 20, 20);
  document.rect(0, 0, width, height, "F");
  document.setDrawColor(230, 0, 40);
  document.setLineWidth(2);
  document.rect(12, 12, width - 24, height - 24);
  document.setTextColor(230, 0, 40);
  document.setFont("helvetica", "bold");
  document.setFontSize(18);
  document.text("M-PESA · BTL LEARNING", width / 2, 38, { align: "center" });
  document.setTextColor(248, 243, 234);
  document.setFontSize(32);
  document.text("CERTIFICAT DE RÉUSSITE", width / 2, 62, { align: "center" });
  document.setFont("helvetica", "normal");
  document.setFontSize(14);
  document.text("Ce certificat atteste que", width / 2, 83, { align: "center" });
  document.setFont("helvetica", "bold");
  document.setFontSize(26);
  document.text(user.fullName || user.phone, width / 2, 101, { align: "center", maxWidth: width - 80 });
  document.setFont("helvetica", "normal");
  document.setFontSize(14);
  document.text("a validé l’ensemble des modules et évaluations de la formation", width / 2, 120, { align: "center" });
  document.setFont("helvetica", "bold");
  document.setFontSize(18);
  document.text("Produits & Services M-Pesa", width / 2, 134, { align: "center" });
  document.setFont("helvetica", "normal");
  document.setFontSize(10);
  document.setTextColor(184, 170, 162);
  document.text(`Référence : ${certificate.certificate_number}`, 28, height - 30);
  document.text(`Émis le ${new Date(certificate.issued_at).toLocaleDateString("fr-FR")}`, width - 28, height - 30, { align: "right" });
  document.save(certificateFileName(user.fullName));
}

export function CertificatePanel({ user, certificate, eligible, onClose, onIssue }: { user: TrainingUser; certificate: Certificate | null; eligible: boolean; onClose: () => void; onIssue: () => Promise<Certificate> }) {
  const [working, setWorking] = useState(false);
  const [issued, setIssued] = useState(certificate);
  const [error, setError] = useState("");

  const issue = async () => {
    setWorking(true);
    setError("");
    try {
      const next = await onIssue();
      setIssued(next);
      downloadCertificate(user, next);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le certificat n’a pas pu être généré.");
    } finally {
      setWorking(false);
    }
  };

  return <aside className="learning-panel certificate-panel" role="dialog" aria-modal="true" aria-label="Certificat de formation"><div className="learning-panel__heading"><div><span className="micro-label">Réussite de parcours</span><h2>Votre certificat</h2></div><button type="button" onClick={onClose} aria-label="Fermer le certificat"><X size={19} /></button></div><div className="certificate-panel__content"><Award size={42} /><p>{issued ? "Votre certificat est disponible et peut être téléchargé autant de fois que nécessaire." : eligible ? "Tous les modules et leurs évaluations sont validés. Votre certificat est prêt à être généré." : "Le certificat devient disponible après avoir terminé et validé chaque module."}</p>{issued && <span className="certificate-panel__number">{issued.certificate_number}</span>}{error && <p className="certificate-panel__error">{error}</p>}{issued ? <button type="button" onClick={() => downloadCertificate(user, issued)}><Download size={16} /> Télécharger en PDF</button> : <button type="button" disabled={!eligible || working} onClick={issue}>{working ? <><Loader2 size={16} className="spin" /> Génération…</> : <><Award size={16} /> Générer mon certificat</>}</button>}</div></aside>;
}

function exportRows(dashboard: SupervisorDashboard) {
  return dashboard.agents.map((agent) => ({
    "Nom de l’agent": agent.fullName || "—",
    "Téléphone": agent.phone,
    "Catégorie": agent.category,
    "Modules terminés": `${agent.completedModules}/${agent.totalModules}`,
    "Modules validés": `${agent.validatedModules}/${agent.totalModules}`,
    "Score moyen": agent.averageScore === null ? "—" : `${agent.averageScore}%`,
    "Dernière activité": agent.lastActivity ? new Date(agent.lastActivity).toLocaleString("fr-FR") : "—",
  }));
}

function downloadCsv(rows: ReturnType<typeof exportRows>) {
  const headers = Object.keys(rows[0] || { "Nom de l’agent": "" });
  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const content = [headers.join(";"), ...rows.map((row) => headers.map((header) => escape(row[header as keyof typeof row])).join(";"))].join("\n");
  const blob = new Blob(["\ufeff", content], { type: "text/csv;charset=utf-8" });
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = "resultats-mpesa-btl.csv";
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

function downloadExcel(rows: ReturnType<typeof exportRows>) {
  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Résultats");
  XLSX.writeFile(book, "resultats-mpesa-btl.xlsx");
}

export function SupervisorPanel({ dashboard, onClose }: { dashboard: SupervisorDashboard; onClose: () => void }) {
  const rows = exportRows(dashboard);
  const completed = dashboard.agents.filter((agent) => agent.completedModules === dashboard.moduleCount).length;
  const average = dashboard.agents.length ? Math.round(dashboard.agents.reduce((sum, agent) => sum + (agent.averageScore ?? 0), 0) / dashboard.agents.length) : 0;
  return <aside className="supervisor-panel" role="dialog" aria-modal="true" aria-label="Tableau de bord superviseur"><div className="learning-panel__heading"><div><span className="micro-label">{dashboard.scope === "global" ? "Vision globale" : "Agents affectés"}</span><h2>Suivi de formation</h2></div><button type="button" onClick={onClose} aria-label="Fermer le tableau de bord"><X size={19} /></button></div><div className="supervisor-metrics"><div><span>Personnes suivies</span><b>{dashboard.agents.length}</b></div><div><span>Parcours terminés</span><b>{completed}</b></div><div><span>Score moyen</span><b>{average}%</b></div></div><div className="supervisor-actions"><button type="button" onClick={() => downloadCsv(rows)}><Download size={15} /> CSV</button><button type="button" onClick={() => downloadExcel(rows)}><FileSpreadsheet size={15} /> Excel</button></div>{dashboard.agents.length === 0 ? <div className="supervisor-empty"><UsersRound size={28} /><p>Aucun utilisateur n’est actuellement visible dans votre périmètre.</p></div> : <div className="supervisor-table"><table><thead><tr><th>Participant</th><th>Parcours</th><th>Tests</th><th>Score</th><th>Activité</th></tr></thead><tbody>{dashboard.agents.map((agent) => <tr key={agent.id}><td><b>{agent.fullName || "Utilisateur non renseigné"}</b><small>{agent.phone} · {agent.category}</small></td><td>{agent.completedModules}/{agent.totalModules}</td><td>{agent.validatedModules}/{agent.totalModules}</td><td>{agent.averageScore === null ? "—" : `${agent.averageScore}%`}</td><td>{agent.lastActivity ? new Date(agent.lastActivity).toLocaleDateString("fr-FR") : "—"}</td></tr>)}</tbody></table></div>}</aside>;
}
