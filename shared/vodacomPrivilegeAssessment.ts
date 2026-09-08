export type VodacomPrivilegeQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
};

export const vodacomPrivilegeAssessmentQuestions: VodacomPrivilegeQuestion[] = [
  { id: "privilege-1", prompt: "Quelle démarche doit précéder la présentation détaillée d’une offre Vodacom Privilège ?", options: ["Comprendre l’usage, le budget et les besoins du client", "Réciter tous les volumes disponibles", "Demander le PIN M-Pesa", "Promettre une activation immédiate"], answer: 0 },
  { id: "privilege-2", prompt: "Quel volume Internet est communiqué pour l’offre Gold 2 500 U dans le manuel ?", options: ["10 GB", "20 GB", "30 GB", "50 GB"], answer: 2 },
  { id: "privilege-3", prompt: "Quel avantage supplémentaire est associé à Gold 2 500 U selon le support de campagne ?", options: ["Deux envois M-Pesa gratuits et une carte M-Pesa gratuite", "Le partage sans quota", "Une carte Visa renouvelée automatiquement", "Un remboursement de découvert"], answer: 0 },
  { id: "privilege-4", prompt: "Quelle offre Platinum mentionne le partage du forfait avec quotas et une carte M-Pesa Visa gratuite ?", options: ["Platinum 5 000 U", "Platinum 7 500 U", "Platinum 10 000 U uniquement", "Gold 3 500 U"], answer: 0 },
  { id: "privilege-5", prompt: "Quelle formulation traduit correctement l’approche avantage → utilité ?", options: ["Les minutes convertibles donnent plus de flexibilité entre appels et Internet", "Cette offre résout tous les problèmes du client", "L’activation est forcément immédiate", "Le client doit choisir l’offre la plus chère"], answer: 0 },
  { id: "privilege-6", prompt: "Face à « C’est trop cher », quelle réponse est la plus professionnelle ?", options: ["Vous devez prendre l’offre aujourd’hui", "Regardons votre utilisation pour identifier une offre adaptée à votre budget et à vos besoins", "C’est le prix, il n’y a rien à expliquer", "Je vous garantis que ce sera gratuit"], answer: 1 },
  { id: "privilege-7", prompt: "Que doit faire l’hôtesse lorsqu’une information d’éligibilité ou d’activation n’est pas confirmée ?", options: ["Inventer une raison plausible", "Vérifier ou orienter vers le service compétent", "Promettre une solution technique", "Demander au client de donner son PIN"], answer: 1 },
  { id: "privilege-8", prompt: "Quelle règle M-Pesa est impérative pendant l’accompagnement ?", options: ["Demander le PIN pour aller plus vite", "Saisir le PIN à la place du client", "Ne jamais demander ni saisir le PIN du client", "Noter le PIN pour une prochaine visite"], answer: 2 },
  { id: "privilege-9", prompt: "Dans la méthode CALMER, que signifie le E ?", options: ["Évaluer le prix", "Escalader si nécessaire", "Enregistrer le PIN", "Écourter la conversation"], answer: 1 },
  { id: "privilege-10", prompt: "Dans le jeu de rôle, quel profil correspond le mieux à Gold 2 500 U ?", options: ["Un client au budget de 2 500 U, consommant beaucoup Internet et utilisant régulièrement M-Pesa", "Un client qui refuse toute conversation", "Un client sans ligne Vodacom", "Un client souhaitant seulement un retrait en espèces"], answer: 0 },
  { id: "privilege-11", prompt: "Quel chemin USSD faut-il conseiller par défaut pour accéder à Vodacom Privilège ?", options: ["Composer *1111# puis choisir 4. Privilège", "Composer *1122# puis choisir 5. Petit Commerce", "Composer *160# puis choisir 1. Club Privilège", "Composer un code direct sans passer par le menu"], answer: 0 },
];
