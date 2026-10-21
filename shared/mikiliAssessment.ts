/**
 * Quiz Mikili, repris du document « Quiz de formation – M-Pesa Mikili » (BTL Africa).
 * Les questions ouvertes sont corrigées par une grille automatique indicative.
 */
export type MikiliAnswer = number | string | string[];
export type MikiliAnswers = Record<string, MikiliAnswer>;
export type MikiliChoiceQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
};

export const mikiliChoiceQuestions: MikiliChoiceQuestion[] = [
  { id: "mikili-1", prompt: "Quel est l’objectif principal de M-Pesa Mikili ?", options: ["Acheter des forfaits Internet uniquement", "Recevoir sur son compte M-Pesa de l’argent envoyé depuis l’étranger", "Retirer gratuitement de l’argent chez un agent", "Créer un compte bancaire classique"], answer: 1 },
  { id: "mikili-2", prompt: "Quel type de compte est requis pour recevoir de l’argent via M-Pesa Mikili ?", options: ["M-Pesa Lite", "M-Pesa Agent uniquement", "M-Pesa Premium correctement enregistré", "N’importe quel numéro de téléphone"], answer: 2 },
  { id: "mikili-3", prompt: "Quelle condition supplémentaire doit respecter le bénéficiaire ?", options: ["Être commerçant", "Ne pas figurer sur les listes de sanctions internationales liées à la fraude et au blanchiment", "Posséder une carte VISA", "Avoir un compte en dollars uniquement"], answer: 1 },
  { id: "mikili-4", prompt: "Quel est le montant maximum d’un dépôt M-Pesa Mikili selon le manuel ?", options: ["500 USD", "1 000 USD", "1 500 USD", "2 500 USD"], answer: 2 },
  { id: "mikili-5", prompt: "Combien de dépôts au maximum un client peut-il recevoir par jour ?", options: ["3", "5", "10", "Sans limite"], answer: 1 },
  { id: "mikili-6", prompt: "Quel est le montant cumulé maximal des dépôts journaliers ?", options: ["1 000 USD", "1 500 USD", "2 500 USD", "4 500 USD"], answer: 1 },
  { id: "mikili-7", prompt: "Que se passe-t-il une fois le transfert abouti ?", options: ["Le client doit se rendre dans une banque", "Le bénéficiaire reçoit une notification SMS", "Le transfert est automatiquement annulé", "Le bénéficiaire doit créer un compte M-Pesa Lite"], answer: 1 },
  { id: "mikili-8", prompt: "Quel partenaire est cité dans le manuel comme exemple d’application d’envoi ?", options: ["Taptap Send", "WhatsApp", "Facebook", "Google Maps"], answer: 0 },
  { id: "mikili-9", prompt: "Quel est l’un des avantages de M-Pesa Mikili ?", options: ["Les fonds sont directement crédités sur le compte M-Pesa", "Le client doit obligatoirement retirer l’argent dans une banque", "Le service est réservé aux agents M-Pesa", "Le service fonctionne uniquement à Kinshasa"], answer: 0 },
  { id: "mikili-10", prompt: "Selon le manuel, le service M-Pesa Mikili dispose-t-il d’une possibilité de reversal ?", options: ["Oui, dans tous les cas", "Oui, uniquement le jour même", "Non, le service n’a pas de reversal", "Le manuel ne précise pas"], answer: 2 },
  { id: "mikili-11", prompt: "Un client M-Pesa Lite peut recevoir de l’argent via M-Pesa Mikili.", options: ["Vrai", "Faux"], answer: 1 },
  { id: "mikili-12", prompt: "L’expéditeur doit disposer de l’application ou du lien de la plateforme d’envoi et s’y inscrire ou s’y connecter.", options: ["Vrai", "Faux"], answer: 0 },
  { id: "mikili-13", prompt: "L’expéditeur doit avoir de l’argent disponible sur son compte de la plateforme.", options: ["Vrai", "Faux"], answer: 0 },
  { id: "mikili-14", prompt: "Le bénéficiaire peut recevoir l’argent M-Pesa Mikili partout en RDC, selon le manuel.", options: ["Vrai", "Faux"], answer: 0 },
  { id: "mikili-15", prompt: "MFS vérifie le KYC du bénéficiaire et s’assure de l’expéditeur avant d’autoriser la transaction.", options: ["Vrai", "Faux"], answer: 0 },
];

export const mikiliSequenceSteps = [
  { id: "region", label: "Choisir la région, puis le pays et l’opérateur disponible." },
  { id: "dial", label: "Composer *1122# puis sélectionner M-Pesa USD." },
  { id: "numero", label: "Saisir le numéro de téléphone du bénéficiaire et suivre les instructions." },
  { id: "envoi", label: "Sélectionner Envoi Argent, puis Envoi Mikili." },
  { id: "taux", label: "Choisir Vérification de taux ou Envoi Argent selon le besoin." },
] as const;
export const mikiliCorrectOrder = ["dial", "envoi", "region", "taux", "numero"];

export const mikiliOpenQuestions = [
  { id: "mikili-17", prompt: "Un client possède un compte M-Pesa Lite et veut recevoir 200 USD de son frère à l’étranger. Que lui expliquez-vous ?", sample: "Il doit disposer d’un compte M-Pesa Premium correctement enregistré pour être éligible à M-Pesa Mikili." },
  { id: "mikili-18", prompt: "Un client a déjà reçu cinq dépôts M-Pesa Mikili aujourd’hui. Peut-il en recevoir un sixième le même jour selon le manuel ? Justifiez.", sample: "Non. Le plafond est fixé à cinq dépôts par jour, pour un total cumulé ne dépassant pas 1 500 USD." },
  { id: "mikili-19", prompt: "Citez deux avantages de M-Pesa Mikili pour le bénéficiaire.", sample: "Recevoir de l’argent depuis l’étranger ; fonds directement crédités sur M-Pesa ; aucune obligation de passer par une banque pour recevoir l’argent." },
] as const;

export const mikiliQuestionCount = 19;
export const mikiliMaximumPoints = 20;

const normalize = (value: string) =>
  value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, " ");

function openAnswerIsCorrect(id: string, response: string): boolean {
  const text = normalize(response);
  if (id === "mikili-17") return /premium/.test(text);
  if (id === "mikili-18") {
    return /\b(non|impossible|pas|ne peut|refus|limite|maximum)\b/.test(text) && /(\b5\b|cinq)/.test(text);
  }
  if (id === "mikili-19") {
    const advantages = [
      /(etranger|international|diaspora|transfert depuis|hors du pays)/.test(text),
      /(direct|credit|sur (son |le )?compte|sans retrait)/.test(text),
      /(sans (passer|aller)|pas besoin|aucune obligation|pas necessaire|eviter).{0,45}(banque|institution financiere)/.test(text) || /(banque|institution financiere).{0,35}(inutile|pas besoin|evit)/.test(text),
    ];
    return advantages.filter(Boolean).length >= 2;
  }
  return false;
}

export function calculateMikiliResult(answers: MikiliAnswers) {
  const correctChoices = mikiliChoiceQuestions.filter(question => answers[question.id] === question.answer).length;
  const order = answers["mikili-16"];
  const correctPositions = Array.isArray(order) ? mikiliCorrectOrder.filter((step, index) => order[index] === step).length : 0;
  const orderPoints = correctPositions === 5 ? 2 : correctPositions >= 3 ? 1 : 0;
  const correctOpen = mikiliOpenQuestions.filter(question => openAnswerIsCorrect(question.id, typeof answers[question.id] === "string" ? answers[question.id] as string : "")).length;
  const points = correctChoices + orderPoints + correctOpen;
  const correctAnswers = correctChoices + (correctPositions === 5 ? 1 : 0) + correctOpen;
  const score = Math.round(points / mikiliMaximumPoints * 100);
  return { points, score, correctAnswers, isPassed: score >= 80, correctPositions, correctOpen };
}
