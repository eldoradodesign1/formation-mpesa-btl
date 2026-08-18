/**
 * Momentum Delta — présentation 16:9 à dominante anthracite et rouge signal, organisée comme un parcours de terrain.
 */
import { useCallback, useEffect, useState } from "react";
import {
  Award,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Expand,
  Grid2X2,
  LayoutDashboard,
  LogOut,
  X,
} from "lucide-react";
import { AssessmentPanel, TrainingLogin } from "@/components/TrainingAccess";
import { CertificatePanel, SupervisorPanel } from "@/components/LearningTools";
import { clearTrainingToken, createCertificate, getSupervisorDashboard, getTrainingOverview, getTrainingToken, saveAssessment, saveModuleProgress, type SupervisorDashboard, type TrainingOverview, type TrainingUser } from "@/lib/trainingGateway";
import { canAccessSupervision, isCertificateEligible } from "@shared/trainingCompletion";
import { getPresentationKeyAction } from "@shared/presentationKeyboard";

const brandMark = "/formation-mpesa-btl/images/mark.png";

type Slide = {
  module: string;
  kicker: string;
  title: string;
  subtitle?: string;
  theme?: "paper" | "red" | "merchant" | "global" | "security" | "cover";
  compact?: boolean;
  kind:
    | "cover"
    | "agenda"
    | "clients"
    | "identities"
    | "merchant"
    | "merchantPaymentIntro"
    | "merchantPaymentRoute"
    | "merchantPaymentBA"
    | "route"
    | "rules"
    | "visaIntro"
    | "visaOptions"
    | "visaSecurity"
    | "mikiliIntro"
    | "eligibility"
    | "sender"
    | "tanzania"
    | "mikiliRules"
    | "rallongeIntro"
    | "rallongeEligibility"
    | "rallongeUsage"
    | "rallongeRepayment"
    | "takeaway"
    | "quiz"
    | "close";
  content?: string[];
  code?: string;
  aside?: string;
};

const slides: Slide[] = [
  {
    module: "Ouverture",
    kicker: "Session BTL · Produits & Services",
    title: "M-Pesa\nau service\ndu quotidien.",
    subtitle: "Une formation pratique pour expliquer les parcours, qualifier les besoins et sécuriser chaque conversation client.",
    theme: "cover",
    kind: "cover",
  },
  {
    module: "Ouverture",
    kicker: "Notre objectif",
    title: "Transformer chaque question client en réponse utile.",
    subtitle: "Cette session donne une méthode de conseil claire, des repères d’éligibilité et les séquences USSD essentielles.",
    theme: "paper",
    kind: "agenda",
  },
  {
    module: "Ouverture",
    kicker: "Le parcours",
    title: "Cinq services. Une même exigence : la clarté.",
    subtitle: "Chaque module suit une logique simple : comprendre le besoin, vérifier l’éligibilité, guider le parcours et retenir les règles.",
    kind: "agenda",
  },
  {
    module: "Clients M-Pesa",
    kicker: "Module 01 · profils clients",
    title: "Deux catégories de clients à reconnaître immédiatement.",
    subtitle: "Vodacash distingue les clients individuels et les clients Business, couramment appelés agents M-Pesa.",
    kind: "clients",
  },
  {
    module: "Clients M-Pesa",
    kicker: "Module 01 · Lite & Premium",
    title: "Le niveau du compte détermine les possibilités du client.",
    subtitle: "L’enregistrement du client est la première étape avant de recommander un service ou d’expliquer une limite.",
    theme: "paper",
    kind: "clients",
  },
  {
    module: "Clients M-Pesa",
    kicker: "Module 01 · identification",
    title: "Le compte Premium s’appuie sur une identité recevable.",
    subtitle: "Présentez les justificatifs clairement afin de faciliter un enregistrement correct dès le départ.",
    theme: "paper",
    kind: "identities",
  },
  {
    module: "Petit Commerce",
    kicker: "Module 02 · encaisser",
    title: "Encaisser sa vente, sans mélanger son activité et son compte personnel.",
    subtitle: "Petit Commerce permet au client Premium avec activité lucrative de recevoir les paiements dans un compte M-Pesa séparé.",
    theme: "merchant",
    kind: "merchant",
  },
  {
    module: "Petit Commerce",
    kicker: "Module 02 · activation",
    title: "Activez le compte marchand en six jalons.",
    subtitle: "Le client Premium doit activer le service avant de pouvoir recevoir les paiements de ses clients.",
    kind: "route",
    code: "*1122#",
    aside: "Création du compte Petit Commerce",
    content: [
      "Composez *1122# puis validez avec Yes.",
      "Choisissez l’option 5. Petit Commerce.",
      "Sélectionnez 1. Créer mon compte.",
      "Acceptez les termes et conditions.",
      "Saisissez votre PIN M-Pesa.",
      "Attendez le message de confirmation.",
    ],
  },
  {
    module: "Petit Commerce",
    kicker: "Module 02 · paiement",
    title: "Le paiement marchand se confirme avant l’envoi.",
    subtitle: "Accompagnez le client jusqu’à la validation finale : numéro marchand, montant, raison du paiement et PIN.",
    theme: "paper",
    kind: "route",
    code: "*1122#",
    aside: "Paiement Petit Commerce",
    compact: true,
    content: [
      "Composez *1122# puis validez.",
      "Sélectionnez 5. Petit Commerce.",
      "Sélectionnez 2. Payer Petit Commerce.",
      "Saisissez le numéro du marchand.",
      "Saisissez le montant à payer.",
      "Indiquez la raison du paiement.",
      "Saisissez votre PIN M-Pesa.",
      "Choisissez 1. Confirmer ou 2. Annuler.",
    ],
  },
  {
    module: "Petit Commerce",
    kicker: "Module 02 · à retenir",
    title: "Un service d’encaissement pensé pour les activités génératrices de revenus.",
    subtitle: "Petits commerçants, vendeurs en ligne et entrepreneurs peuvent recevoir un paiement M-Pesa dans un compte distinct.",
    kind: "rules",
    content: [
      "La base Premium est éligible au service.",
      "Si l’option 5 n’apparaît pas, le client peut solliciter l’assignation via la ligne 1111.",
      "Le service est uniquement disponible en CDF.",
      "Le plafond communiqué est de 7 050 000 CDF.",
      "Les frais de retrait restent applicables.",
    ],
  },
  {
    module: "Paiement Marchand",
    kicker: "Module 03 · encaissement client",
    title: "Faire payer le client directement chez le marchand.",
    subtitle: "Le Paiement Marchand permet au client de régler un produit ou un service avec son compte M-Pesa, sans manipulation d’espèces.",
    theme: "merchant",
    kind: "merchantPaymentIntro",
  },
  {
    module: "Paiement Marchand",
    kicker: "Module 03 · parcours client",
    title: "Le marchand communique son numéro. Le client vérifie, puis confirme.",
    subtitle: "Le bon réflexe terrain consiste à faire valider le numéro marchand et le montant avant toute confirmation finale.",
    theme: "paper",
    kind: "merchantPaymentRoute",
    code: "N° MARCHAND",
    aside: "Parcours de paiement client",
    compact: true,
    content: [
      "Le client choisit le produit ou le service à payer.",
      "Le marchand communique son numéro marchand.",
      "Le client saisit le numéro et le montant dans son parcours M-Pesa.",
      "Le client vérifie les informations, puis confirme la transaction.",
      "Le marchand reçoit la confirmation avant de remettre le produit ou le service.",
    ],
  },
  {
    module: "Paiement Marchand",
    kicker: "Module 03 · posture Brand Ambassador",
    title: "Présenter une solution d’encaissement, pas une promesse non confirmée.",
    subtitle: "Le Brand Ambassador qualifie le commerce, explique les avantages concrets et oriente vers la procédure officielle en vigueur.",
    kind: "merchantPaymentBA",
  },
  {
    module: "M-Pesa Carte Visa",
    kicker: "Module 03 · paiement en ligne",
    title: "Payer en ligne, ici comme à l’international.",
    subtitle: "La carte Visa M-Pesa permet d’utiliser l’argent logé sur le compte M-Pesa pour réaliser des transactions en ligne.",
    kind: "visaIntro",
  },
  {
    module: "M-Pesa Carte Visa",
    kicker: "Module 03 · création",
    title: "Créer la carte virtuelle, étape par étape.",
    subtitle: "Guidez le client dans le menu M-Pesa USD jusqu’à la confirmation de sa carte Visa virtuelle.",
    theme: "paper",
    kind: "route",
    code: "*1122#",
    aside: "Création de la carte virtuelle",
    compact: true,
    content: [
      "Composez *1122#.",
      "Sélectionnez 1. M-Pesa USD.",
      "Sélectionnez 5. Mes paiements.",
      "Sélectionnez 4. M-Pesa Carte Visa.",
      "Sélectionnez 1. Carte virtuelle.",
      "Sélectionnez Créer une M-Pesa Carte Visa.",
      "Confirmez puis saisissez le mot de passe M-Pesa.",
      "Attendez le message de confirmation.",
    ],
  },
  {
    module: "M-Pesa Carte Visa",
    kicker: "Module 03 · raccourci et gestion",
    title: "Un raccourci pour créer, consulter et contrôler la carte.",
    subtitle: "Depuis M-Pesa USD, le menu Carte Visa donne accès directement aux options de gestion essentielles.",
    kind: "visaOptions",
  },
  {
    module: "M-Pesa Carte Visa",
    kicker: "Module 03 · sécurité et tarifs",
    title: "Le CVV sécurise la carte. Les frais doivent être expliqués précisément.",
    subtitle: "Le client reçoit le numéro de carte, le CVV et sa période de validité lors de la création. La carte est valable six mois à compter de sa création.",
    theme: "security",
    kind: "visaSecurity",
    compact: true,
  },
  {
    module: "M-Pesa Mikili",
    kicker: "Module 04 · réception internationale",
    title: "Recevoir de l’argent de l’étranger, directement sur M-Pesa.",
    subtitle: "M-Pesa Mikili s’appuie sur le partenariat avec MFS Africa pour offrir au client M-Pesa une nouvelle voie de réception de fonds.",
    theme: "global",
    kind: "mikiliIntro",
  },
  {
    module: "M-Pesa Mikili",
    kicker: "Module 04 · éligibilité",
    title: "Avant le transfert : vérifier le profil et la conformité.",
    subtitle: "Le contrôle de l’éligibilité protège le client, l’expéditeur et la transaction elle-même.",
    kind: "eligibility",
  },
  {
    module: "M-Pesa Mikili",
    kicker: "Module 04 · parcours expéditeur",
    title: "L’expéditeur utilise l’application ou le lien de son partenaire.",
    subtitle: "MFS est intégré avec différentes plateformes et applications financières ; la plateforme choisie guide ensuite le transfert vers M-Pesa.",
    theme: "paper",
    kind: "sender",
  },
  {
    module: "M-Pesa Mikili",
    kicker: "Module 04 · notification",
    title: "Une transaction aboutie est notifiée au bénéficiaire.",
    subtitle: "Après validation, le bénéficiaire reçoit une notification SMS. Le transfert depuis la Tanzanie suit un parcours dédié.",
    kind: "tanzania",
  },
  {
    module: "M-Pesa Mikili",
    kicker: "Module 04 · limites et disponibilité",
    title: "Les limites sont aussi importantes que la promesse du service.",
    subtitle: "Rendez les règles visibles avant tout conseil : profil, plafond, fréquence, disponibilité et caractère définitif du transfert.",
    kind: "mikiliRules",
  },
  {
    module: "M-Pesa Mikili",
    kicker: "Module 04 · envoi régional",
    title: "Envoyer vers l’Afrique, de région en partenaire.",
    subtitle: "Le menu Envoi Mikili guide le client jusqu’au choix du pays, de l’opérateur, du taux et du numéro du bénéficiaire.",
    theme: "paper",
    kind: "route",
    code: "*1122#",
    aside: "Envoi M-Pesa Mikili",
    compact: true,
    content: [
      "Composez *1122# puis validez avec Yes.",
      "Sélectionnez 1. M-Pesa USD.",
      "Sélectionnez 1. Envoi Argent.",
      "Sélectionnez 6. Envoi Mikili.",
      "Choisissez une région : Afrique Australe, Centrale, Est ou Ouest.",
      "Choisissez le pays, par exemple la Zambie.",
      "Choisissez le partenaire, par exemple MTN ou Airtel Zambie.",
      "Vérifiez le taux ou sélectionnez Envoi Argent.",
      "Saisissez le numéro de téléphone puis suivez les instructions.",
    ],
  },
  {
    module: "M-Pesa Rallonge",
    kicker: "Module 05 · découvert ponctuel",
    title: "Quand le solde manque, la Rallonge peut compléter la transaction ciblée.",
    subtitle: "Le service offre à un client individuel M-Pesa éligible un découvert instantané lorsque son solde est nul ou insuffisant.",
    theme: "red",
    kind: "rallongeIntro",
  },
  {
    module: "M-Pesa Rallonge",
    kicker: "Module 05 · éligibilité et limite",
    title: "L’éligibilité définit la Rallonge proposée au client.",
    subtitle: "Le client doit disposer d’un compte Premium et présenter une activité régulière sur M-Pesa ainsi que sur les services GSM.",
    kind: "rallongeEligibility",
  },
  {
    module: "M-Pesa Rallonge",
    kicker: "Module 05 · usage",
    title: "La Rallonge intervient au moment où le client en a besoin.",
    subtitle: "Le client reçoit la proposition de découvert au cours d’une transaction ciblée et doit accepter les termes et conditions disponibles sur vodacom.cd.",
    theme: "paper",
    kind: "rallongeUsage",
  },
  {
    module: "M-Pesa Rallonge",
    kicker: "Module 05 · remboursement",
    title: "Le coût, le prélèvement automatique et les pénalités doivent être compris avant l’acceptation.",
    subtitle: "Expliquez les frais annoncés, la récupération automatique des crédits entrants et les conséquences d’un retard prolongé.",
    compact: true,
    kind: "rallongeRepayment",
  },
  {
    module: "Conclusion",
    kicker: "Les réflexes BTL",
    title: "Cinq réflexes pour un conseil M-Pesa juste et rassurant.",
    subtitle: "Les bonnes réponses commencent toujours par le besoin réel du client et le statut de son compte.",
    theme: "paper",
    kind: "takeaway",
  },
  {
    module: "Conclusion",
    kicker: "Vérification rapide",
    title: "Trois questions pour ancrer les règles clés.",
    subtitle: "Laissez le groupe répondre, puis utilisez la touche A ou le bouton pour révéler les réponses de référence.",
    kind: "quiz",
  },
  {
    module: "Conclusion",
    kicker: "Fin de session",
    title: "Rendez chaque parcours plus <em>simple</em> pour le client.",
    subtitle: "Identifiez l’éligibilité. Expliquez le parcours. Sécurisez la transaction.",
    theme: "red",
    kind: "close",
  },
];

const moduleNames = ["Ouverture", "Clients M-Pesa", "Petit Commerce", "Paiement Marchand", "M-Pesa Carte Visa", "M-Pesa Mikili", "M-Pesa Rallonge", "Conclusion"];

type Session = {
  id: string;
  label: string;
  labelShort: string;
  description: string;
  duration: string;
  slideIndexes: number[];
  moduleCode?: string;
};

const sessions: Session[] = [
  { id: "complete", label: "Formation complète", labelShort: "Complète", description: "L’intégralité des produits, les tests et la conclusion.", duration: "2 h 20", slideIndexes: slides.map((_, index) => index) },
  { id: "clients", label: "Module 1 · Clients M-Pesa", labelShort: "Clients", description: "Profils Lite et Premium, éligibilité et pièces acceptées.", duration: "15 min", slideIndexes: [3, 4, 5], moduleCode: "clients" },
  { id: "commerce", label: "Module 2 · Petit Commerce", labelShort: "Petit Commerce", description: "Compte marchand, activation, paiement et règles d’usage.", duration: "20 min", slideIndexes: [6, 7, 8, 9], moduleCode: "petit-commerce" },
  { id: "paiement-marchand", label: "Module 3 · Paiement Marchand", labelShort: "Paiement Marchand", description: "Paiement client chez le commerçant, validation et message terrain.", duration: "20 min", slideIndexes: [10, 11, 12], moduleCode: "paiement-marchand" },
  { id: "visa", label: "Module 4 · M-Pesa Carte Visa", labelShort: "Carte Visa", description: "Carte virtuelle, création, options de gestion, sécurité et frais.", duration: "20 min", slideIndexes: [13, 14, 15, 16], moduleCode: "carte-visa" },
  { id: "mikili", label: "Module 5 · M-Pesa Mikili", labelShort: "Mikili", description: "Réception depuis l’étranger, limites, notification et envoi régional.", duration: "30 min", slideIndexes: [17, 18, 19, 20, 21, 22], moduleCode: "mikili" },
  { id: "rallonge", label: "Module 6 · M-Pesa Rallonge", labelShort: "Rallonge", description: "Découvert ponctuel, éligibilité, usage, remboursement et pénalités.", duration: "25 min", slideIndexes: [23, 24, 25, 26], moduleCode: "rallonge" },
];

type AssessmentQuestion = { id: string; prompt: string; options: string[]; answer: number };

const assessmentQuestions: Record<string, AssessmentQuestion[]> = {
  clients: [
    { id: "clients-1", prompt: "Quel niveau de compte permet d’accéder aux transactions en USD ?", options: ["Lite", "Premium correctement enregistré", "Business uniquement", "Aucun compte"], answer: 1 },
    { id: "clients-2", prompt: "Avant de présenter un produit, quel réflexe est prioritaire ?", options: ["Identifier le type et le niveau du compte", "Promettre un avantage", "Demander le PIN", "Changer le numéro du client"], answer: 0 },
    { id: "clients-3", prompt: "Un document d’identité recevable sert principalement à :", options: ["Obtenir une carte SIM", "Passer un compte au statut Premium", "Recevoir un prêt", "Créer un compte marchand"], answer: 1 },
    { id: "clients-4", prompt: "Quelle posture est correcte si une information n’est pas confirmée ?", options: ["L’inventer pour aider", "La vérifier dans le support ou auprès du superviseur", "Ignorer la question", "Garantir le résultat"], answer: 1 },
  ],
  "petit-commerce": [
    { id: "commerce-1", prompt: "Quel besoin principal couvre Petit Commerce ?", options: ["Recevoir un transfert international", "Séparer les recettes commerciales du compte personnel", "Payer en ligne", "Retirer chez un agent"], answer: 1 },
    { id: "commerce-2", prompt: "Quel profil doit disposer du compte de base adapté avant l’activation ?", options: ["Client Lite", "Client Premium", "Nouveau client sans compte", "Visiteur étranger sans document"], answer: 1 },
    { id: "commerce-3", prompt: "Que faut-il attendre après avoir saisi le PIN dans le parcours d’activation ?", options: ["Un message de confirmation", "Un appel du marchand", "Un code CVV", "Une facture papier"], answer: 0 },
    { id: "commerce-4", prompt: "Quelle orientation est correcte si l’option Petit Commerce n’apparaît pas ?", options: ["Réessayer sans limite", "Solliciter l’assistance selon la procédure communiquée", "Utiliser le PIN d’un autre client", "Promettre une activation immédiate"], answer: 1 },
  ],
  "paiement-marchand": [
    { id: "merchant-1", prompt: "Quel est le rôle du numéro marchand dans le paiement ?", options: ["Identifier le bénéficiaire du paiement", "Remplacer le PIN du client", "Servir de code de réduction", "Créer un compte Lite"], answer: 0 },
    { id: "merchant-2", prompt: "À quel moment le marchand doit-il remettre le produit ou fournir le service ?", options: ["Avant le paiement", "Après la confirmation du paiement", "Après un retrait cash", "Après l’appel du BA"], answer: 1 },
    { id: "merchant-3", prompt: "Quel avantage est le plus juste à présenter au commerçant ?", options: ["Crédit garanti", "Paiement digital complémentaire et encaissement facilité", "Suppression obligatoire du cash", "Commission non confirmée"], answer: 1 },
    { id: "merchant-4", prompt: "Face à un commerce intéressé, le BA commence par :", options: ["Forcer l’inscription", "Comprendre l’activité et le besoin", "Demander le mot de passe", "Promettre un bénéfice"], answer: 1 },
  ],
  "carte-visa": [
    { id: "visa-1", prompt: "La Carte Visa M-Pesa est destinée principalement à :", options: ["Des achats en ligne", "Des retraits uniquement", "L’enregistrement d’un agent", "L’envoi de SMS"], answer: 0 },
    { id: "visa-2", prompt: "Quelle information de sécurité ne doit pas être partagée sans vigilance ?", options: ["Le CVV", "Le nom du produit", "La date de formation", "Le numéro de module"], answer: 0 },
    { id: "visa-3", prompt: "Après la création, le client peut notamment gérer sa carte pour :", options: ["Modifier le CVV ou bloquer la carte", "Changer sa SIM automatiquement", "Créer un compte marchand", "Supprimer son compte Premium"], answer: 0 },
    { id: "visa-4", prompt: "Quel élément faut-il clarifier avant toute décision client ?", options: ["Les frais applicables", "La couleur du téléphone", "Le quartier du BA", "La marque du navigateur"], answer: 0 },
  ],
  mikili: [
    { id: "mikili-1", prompt: "M-Pesa Mikili permet principalement :", options: ["De recevoir des fonds depuis l’étranger", "D’ouvrir une carte Visa", "De créer un commerce", "De demander un découvert"], answer: 0 },
    { id: "mikili-2", prompt: "Quel profil est requis pour recevoir le service selon le module ?", options: ["Lite", "Premium correctement enregistré", "Compte sans identité", "Compte marchand uniquement"], answer: 1 },
    { id: "mikili-3", prompt: "Quel point doit être expliqué avant l’opération ?", options: ["L’absence de reversal prévue", "Une remise automatique", "Un crédit garanti", "La fermeture du compte"], answer: 0 },
    { id: "mikili-4", prompt: "Comment le bénéficiaire est-il informé après une transaction aboutie ?", options: ["Par notification SMS", "Par courrier", "Par appel obligatoire du BA", "Par carte Visa"], answer: 0 },
  ],
  rallonge: [
    { id: "rallonge-1", prompt: "Dans quelle situation la Rallonge intervient-elle ?", options: ["Quand le solde est insuffisant pour une transaction ciblée", "À l’ouverture du compte", "Après un retrait cash", "Pour toute demande de crédit"], answer: 0 },
    { id: "rallonge-2", prompt: "Quel profil peut être éligible selon le module ?", options: ["Un client Premium actif", "Tout compte Lite", "Un visiteur sans compte", "Un marchand sans activité"], answer: 0 },
    { id: "rallonge-3", prompt: "Comment le remboursement est-il présenté dans le module ?", options: ["Automatique lors d’un crédit entrant sur le compte CDF", "Uniquement en espèces", "Jamais récupéré", "Par le BA directement"], answer: 0 },
    { id: "rallonge-4", prompt: "Avant l’acceptation, quel sujet doit être compris ?", options: ["Les frais, conditions et pénalités", "La couleur de la SIM", "Le nom de l’agent", "Le code du marchand"], answer: 0 },
  ],
};

function getInitialSessionId() {
  const requested = new URLSearchParams(window.location.search).get("session");
  return sessions.some((session) => session.id === requested) ? requested! : "complete";
}

function getInitialSlide(sessionId: string) {
  const session = sessions.find((item) => item.id === sessionId) ?? sessions[0];
  const requested = Number.parseInt(new URLSearchParams(window.location.search).get("slide") ?? "1", 10) - 1;
  return session.slideIndexes.includes(requested) ? requested : session.slideIndexes[0];
}

function formatNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function getSlideTheme(slide: Slide) {
  if (slide.theme === "paper") return "slide--paper";
  if (slide.theme === "red") return "slide--red";
  if (slide.theme === "merchant") return "image-split image-split--merchant";
  if (slide.theme === "global") return "image-split image-split--global";
  if (slide.theme === "security") return "image-split image-split--security";
  if (slide.theme === "cover") return "cover-slide";
  return "";
}

function BrandMark({ variant = "default" }: { variant?: "default" | "hero" | "close" }) {
  return <span className={`brand-monogram brand-monogram--${variant}`} aria-hidden="true"><i /><i /><i /></span>;
}

function Route({ slide }: { slide: Slide }) {
  return (
    <div className="route-layout">
      <aside className="route-aside">
        <div>
          <span className="micro-label">Code de départ</span>
          <span className="route-aside__code">{slide.code}</span>
          <p>{slide.aside}</p>
        </div>
        <span className="route-aside__count">{slide.content?.length} étapes guidées</span>
      </aside>
      <div className="route-steps">
        <div className="route-steps__spine" aria-hidden="true" />
        {slide.content?.map((step) => <div key={step} className="route-step">{step}</div>)}
      </div>
    </div>
  );
}

function BulletStack({ items }: { items: string[] }) {
  return <div className="bullet-stack">{items.map((item) => <div key={item} className="bullet-stack__item">{item}</div>)}</div>;
}

function SlideContent({ slide, showAnswers, toggleAnswers }: { slide: Slide; showAnswers: boolean; toggleAnswers: () => void }) {
  switch (slide.kind) {
    case "cover":
      return (
        <div>
          <div className="brand-signature brand-signature--hero"><BrandMark variant="hero" /><span><b>M-PESA</b><small>BTL Learning</small></span></div>
          <div className="cover-kicker">Formation BTL</div>
          <h1 className="slide__title">{slide.title.split("\n").map((line) => <span key={line} className="block">{line}</span>)}</h1>
          <p className="slide__subtitle">{slide.subtitle}</p>
          <div className="cover-meta"><span>Usage interne</span><span>Base de référence · 22 juin 2026</span></div>
        </div>
      );
    case "agenda":
      return (
        <div className="agenda-path">
          <div className="agenda-path__lead">
            <p className="agenda-path__quote">« Identifier l’éligibilité. Expliquer le parcours. Sécuriser la transaction. »</p>
            <p className="agenda-path__note">{slide.subtitle}</p>
          </div>
          <div className="module-list">
            {moduleNames.slice(1, 7).map((name, index) => <div className="module-list__item" key={name}><span className="module-list__number">{formatNumber(index)}</span><b>{name}</b><span>Module</span></div>)}
          </div>
        </div>
      );
    case "clients":
      return (
        <div className="comparison-grid">
          <section className="comparison-card">
            <span className="comparison-card__tag">Profil de clientèle</span>
            <h3>Individuel</h3>
            <p>Toute personne disposant d’un compte M-Pesa. Selon son enregistrement, elle possède un compte Lite ou Premium.</p>
            <div className="metric-row"><div className="metric-row__item"><span className="metric-row__number">Lite</span><span className="metric-row__label">Compte non correctement enregistré</span></div><div className="metric-row__item"><span className="metric-row__number">Premium</span><span className="metric-row__label">Compte correctement enregistré</span></div></div>
          </section>
          <section className="comparison-card comparison-card--focus">
            <span className="comparison-card__tag">Profil de clientèle</span>
            <h3>Business</h3>
            <p>Les clients Business sont communément appelés agents M-Pesa. Ils constituent une catégorie distincte du client individuel.</p>
            <div className="metric-row"><div className="metric-row__item"><span className="metric-row__number">Agent</span><span className="metric-row__label">Service de proximité</span></div><div className="metric-row__item"><span className="metric-row__number">BTL</span><span className="metric-row__label">Conseil et orientation</span></div></div>
          </section>
        </div>
      );
    case "identities":
      return (
        <div className="id-layout">
          <div className="id-stamp"><strong>PREMIUM<em>compte correctement enregistré</em></strong></div>
          <div className="check-list">
            {["Passeport", "Passeport + visa valide pour les étrangers", "Carte d’électeur", "Permis de conduire", "Carte d’étudiant attestée par une université reconnue", "Carte de police ou de l’armée", "Carte d’identité nationale", "Liste de bénéficiaires sociaux dûment identifiés", "Carte de réfugié valide délivrée par la Commission nationale des réfugiés"].map((item) => <div className="check-list__item" key={item}><span className="check-list__tick">✓</span>{item}</div>)}
          </div>
        </div>
      );
    case "merchant":
      return <div className="service-promise"><div className="service-promise__lead">Un compte distinct pour encaisser son activité.</div><p className="service-promise__text">Le client individuel Premium avec activité lucrative peut recevoir le paiement de ses produits dans un autre compte M-Pesa dissocié de son compte individuel.</p><div className="service-promise__flag">Préalable : le service Petit Commerce doit être activé avant la réception des paiements.</div></div>;
    case "merchantPaymentIntro":
      return <div className="merchant-flow"><div className="merchant-flow__statement">Client <span>→</span> M-Pesa <span>→</span> Marchand <span>→</span> Produit ou service</div><div className="merchant-flow__cards"><div><b>Pour le client</b><p>Un paiement pratique depuis son téléphone, en complément du cash.</p></div><div><b>Pour le marchand</b><p>Un encaissement digital et une option de paiement supplémentaire.</p></div></div></div>;
    case "merchantPaymentRoute":
      return <Route slide={slide} />;
    case "merchantPaymentBA":
      return <div className="two-column-copy"><section className="copy-panel"><h3>Le message simple</h3><p>« Vos clients peuvent régler leurs achats avec M-Pesa, de manière pratique, sans devoir payer en espèces. »</p><BulletStack items={["Identifiez les commerces qui reçoivent des paiements clients.", "Expliquez le principe et les avantages avec des mots simples.", "Orientez vers la procédure officielle d’enregistrement."]} /></section><section className="copy-panel"><h3>Les limites de posture</h3><BulletStack items={["Ne promettez jamais un crédit, une commission ou un avantage non confirmé.", "Ne demandez pas le PIN du client et ne validez pas à sa place.", "En cas de doute, vérifiez l’information auprès du superviseur ou du support officiel."]} /></section></div>;
    case "route":
      return <Route slide={slide} />;
    case "rules":
      return <div className="takeaway-layout"><div className="takeaway-list">{slide.content?.map((rule, index) => <div key={rule} className="takeaway-item"><span className="takeaway-item__n">0{index + 1}</span>{rule}</div>)}</div><aside className="takeaway-quote"><p>Encaisser, c’est aussi mieux séparer l’activité.</p><span>Petit Commerce</span></aside></div>;
    case "visaIntro":
      return <div className="global-flow"><div><p className="global-flow__big">Une carte <em>virtuelle</em> pour les transactions en ligne.</p><p className="global-flow__desc">Le client utilise les fonds disponibles sur son compte M-Pesa pour régler des paiements en ligne dans le pays ou à l’étranger.</p></div><div className="flow-points"><div className="flow-point"><span className="flow-point__index">01</span><div><b>Créer</b><span>Ouvrir la carte virtuelle depuis le menu M-Pesa USD.</span></div></div><div className="flow-point"><span className="flow-point__index">02</span><div><b>Utiliser</b><span>Réaliser des transactions en ligne avec les informations de la carte.</span></div></div><div className="flow-point"><span className="flow-point__index">03</span><div><b>Gérer</b><span>Modifier le CVV, consulter, bloquer, débloquer ou annuler.</span></div></div></div></div>;
    case "visaOptions":
      return <div className="two-column-copy"><section className="copy-panel"><h3>Le raccourci</h3><BulletStack items={["Composez *1122#.", "Sélectionnez 1. M-Pesa USD.", "Sélectionnez l’option 7. M-Pesa Carte Visa.", "Sélectionnez 1. Créer M-Pesa Carte Visa."]} /></section><section className="copy-panel"><h3>Les options de gestion</h3><BulletStack items={["2. Changer le CVV", "3. Voir les détails de la carte", "4. Bloquer la carte", "5. Débloquer la carte", "6. Annuler la carte"]} /></section></div>;
    case "visaSecurity":
      return <div className="two-column-copy"><section className="copy-panel"><h3>À expliquer au client</h3><BulletStack items={["Le CVV (ou CVC) est un code de sécurité qui aide à réduire la fraude.", "Le numéro de carte comporte généralement 16 chiffres.", "À la création : numéro de carte, CVV et validité sont communiqués.", "La carte est valable 6 mois à partir de sa création."]} /></section><section className="copy-panel"><h3>Frais des services</h3><div className="table-wrap"><table className="rate-table"><thead><tr><th>Service</th><th>Frais USD</th></tr></thead><tbody>{[["Créer la carte Visa", "1"], ["Changer le CVV", "0,50"], ["Voir les détails", "1"], ["Bloquer la carte", "1"], ["Débloquer la carte", "2"], ["Annuler la carte", "3"]].map(([service, price]) => <tr key={service}><td>{service}</td><td>{price}</td></tr>)}</tbody></table></div></section></div>;
    case "mikiliIntro":
      return <div className="global-flow"><div><p className="global-flow__big">Une réception <em>directe</em>, vérifiée et notifiée.</p><p className="global-flow__desc">Le transfert de fonds depuis l’étranger s’appuie sur le partenaire disponible dans le pays de l’expéditeur et arrive sur le compte M-Pesa du bénéficiaire si le contrôle est concluant.</p></div><div className="flow-points"><div className="flow-point"><span className="flow-point__index">01</span><div><b>Un proche initie le transfert</b><span>Depuis le partenaire disponible dans son pays.</span></div></div><div className="flow-point"><span className="flow-point__index">02</span><div><b>MFS vérifie le parcours</b><span>Le KYC du bénéficiaire et les contrôles nécessaires sont pris en compte.</span></div></div><div className="flow-point"><span className="flow-point__index">03</span><div><b>Le bénéficiaire est notifié</b><span>Les fonds sont crédités sur le compte M-Pesa si le contrôle est concluant.</span></div></div></div></div>;
    case "eligibility":
      return <div className="two-column-copy"><section className="copy-panel"><h3>Client éligible</h3><BulletStack items={["Détenir un compte M-Pesa Premium correctement enregistré.", "Ne pas figurer sur les listes de sanctions internationales liées notamment à la fraude ou au blanchiment d’argent."]} /></section><section className="copy-panel"><h3>Rôle du partenaire</h3><BulletStack items={["MFS s’intègre à des plateformes et applications financières partenaires.", "L’expéditeur utilise le lien ou l’application disponible dans son pays.", "La plateforme recueille le montant et le numéro du bénéficiaire M-Pesa avant validation."]} /></section></div>;
    case "sender":
      return <div className="route-layout"><aside className="route-aside"><div><span className="micro-label">Parcours expéditeur</span><span className="route-aside__code">WEB<br/>APP</span><p>Le partenaire financier disponible dans le pays de l’expéditeur guide chaque étape.</p></div><span className="route-aside__count">4 étapes de préparation</span></aside><div className="route-steps">{["Télécharger l’application partenaire ou ouvrir le lien web.", "Créer un compte ou se connecter à la plateforme.", "Disposer des fonds nécessaires sur son compte.", "Saisir le transfert vers M-Pesa puis suivre les instructions de validation."].map((item) => <div className="route-step" key={item}>{item}</div>)}</div></div>;
    case "tanzania":
      return <div className="route-layout"><aside className="route-aside"><div><span className="micro-label">Depuis la Tanzanie</span><span className="route-aside__code">*150*00#</span><p>À l’issue d’un transfert abouti, le bénéficiaire reçoit une notification de réception.</p></div><span className="route-aside__count">Parcours international</span></aside><div className="route-steps">{["Composez *150*00#.", "Sélectionnez Send Money.", "Sélectionnez International Transfers.", "Suivez les instructions jusqu’à la validation du transfert."].map((item) => <div className="route-step" key={item}>{item}</div>)}</div></div>;
    case "mikiliRules":
      return <div className="rule-cards">{[["Premium", "Service réservé au client M-Pesa Premium correctement enregistré."], ["5 / jour", "Le client peut recevoir jusqu’à cinq dépôts par jour."], ["1 500 USD", "Plafond cumulé journalier communiqué et plafond maximal d’un dépôt."], ["Pas de reversal", "Le service ne prévoit pas de reversal : expliquez ce point avant l’opération."], ["Toute la RDC", "Le client peut recevoir les fonds sur toute l’étendue de la RDC."], ["Partenaires", "Exemples de partenaires de lancement : Hello Paisa, Paysend et Capital Services SARL."]].map(([value, label]) => <div className="rule-card" key={value}><span className="rule-card__value">{value}</span><span className="rule-card__label">{label}</span></div>)}</div>;
    case "rallongeIntro":
      return <div className="two-column-copy"><section className="copy-panel"><h3>Le principe</h3><p>La Rallonge octroie un découvert instantané à un client individuel M-Pesa éligible lorsque son solde est nul ou insuffisant, afin de compléter la balance nécessaire à une transaction ciblée.</p></section><section className="copy-panel"><h3>Les transactions prises en charge</h3><BulletStack items={["Envoi d’argent sans frais de retrait", "Achat de crédit ou de forfaits pour soi", "Achat de produits", "Réabonnement à Canal+, Startimes, Easy TV ou Bleusat", "DStv est pris en charge uniquement pour le paiement en dollar"]} /></section></div>;
    case "rallongeEligibility":
      return <div className="comparison-grid"><section className="comparison-card"><span className="comparison-card__tag">Critères</span><h3>Premium et actif</h3><BulletStack items={["Avoir un compte M-Pesa Premium.", "Effectuer régulièrement des transactions M-Pesa.", "Utiliser régulièrement les services GSM : appels, SMS et internet.", "Le service est disponible uniquement en franc."]} /></section><section className="comparison-card comparison-card--focus"><span className="comparison-card__tag">Découvert</span><h3>50 à 470 000 FC</h3><p>Le montant est défini selon les critères d’éligibilité et le client peut effectuer des transactions à hauteur de la limite qui lui est accordée.</p><div className="metric-row"><div className="metric-row__item"><span className="metric-row__number">0,5 à 200 USD</span><span className="metric-row__label">Fourchette également communiquée dans le manuel</span></div></div></section></div>;
    case "rallongeUsage":
      return <div className="takeaway-layout"><div className="takeaway-list">{["Le service intervient au point d’exécution d’une transaction ciblée.", "Le client reçoit une proposition de découvert selon la limite qui lui est accordée.", "Le client doit accepter les termes et conditions du service.", "Les conditions sont indiquées comme disponibles sur www.vodacom.cd."].map((item, index) => <div className="takeaway-item" key={item}><span className="takeaway-item__n">0{index + 1}</span>{item}</div>)}</div><aside className="takeaway-quote"><p>La proposition arrive quand le besoin se présente.</p><span>Rallonge · usage contextuel</span></aside></div>;
    case "rallongeRepayment":
      return <div className="two-column-copy"><section className="copy-panel"><h3>Remboursement automatique</h3><BulletStack items={["10 % de frais sur le montant du prêt, plus 16 % de TVA, sont indiqués dans le manuel.", "1 % de frais d’intérêts journaliers, plus 16 % de TVA, sont également indiqués.", "Le découvert est remboursé automatiquement lorsque le compte CDF est crédité par une transaction entrante.", "Exemples de crédits entrants : P2P, dépôt, paiement en masse, bureau de change ou transfert de journal."]} /></section><section className="copy-panel"><h3>Retard et pénalités</h3><BulletStack items={["Une pénalité de 1 % de frais d’intérêts journaliers est appliquée à partir de la réception du découvert.", "Après trente jours, le processus de pénalités est suspendu et 10 % de frais de traitement sont facturés.", "Une période de grâce de deux jours est accordée pour rembourser.", "Au-delà, le client est écarté du processus et ne bénéficie plus de M-Pesa Rallonge."]} /></section></div>;
    case "takeaway":
      return <div className="takeaway-layout"><div className="takeaway-list">{["Commencez toujours par identifier le type et le niveau du compte client.", "Clarifiez le besoin avant de choisir le service à présenter.", "Annoncez les conditions d’éligibilité et les limites avant de guider le parcours USSD.", "Faites confirmer les informations sensibles : numéro, montant, PIN et choix final.", "Rappelez les règles importantes : frais, absence de reversal, remboursement ou assistance 1111 selon le service."].map((item, index) => <div className="takeaway-item" key={item}><span className="takeaway-item__n">0{index + 1}</span>{item}</div>)}</div><aside className="takeaway-quote"><p>Le bon conseil rend le service plus sûr.</p><span>Réflexe BTL</span></aside></div>;
    case "quiz":
      return <div className="quiz-layout"><div className="quiz-intro">Testons les réflexes.<span>Le formateur peut recueillir les réponses, puis révéler le corrigé lorsque le groupe est prêt.</span><button type="button" className="quiz-button" onClick={toggleAnswers}>{showAnswers ? "Masquer les réponses" : "Révéler les réponses"}</button></div><div className="quiz-questions">{[["Quel type de compte doit avoir le client pour recevoir un transfert M-Pesa Mikili ?", "Un compte M-Pesa Premium correctement enregistré."], ["Quel menu faut-il choisir dans *1122# pour activer Petit Commerce ?", "L’option 5. Petit Commerce, puis Créer mon compte."], ["Quand la Rallonge intervient-elle ?", "Lorsque le client exécute une transaction ciblée et que son solde est nul ou insuffisant."]].map(([question, answer]) => <div className="quiz-question" key={question}><b>{question}</b>{showAnswers && <div className="quiz-answer">Réponse : {answer}</div>}</div>)}</div></div>;
    case "close":
      return <div className="close-layout"><div className="brand-signature brand-signature--close"><BrandMark variant="close" /><span><b>M-PESA</b><small>BTL Learning</small></span></div><p className="close-layout__statement" dangerouslySetInnerHTML={{ __html: slide.title }} /><p className="close-layout__small">{slide.subtitle}</p></div>;
  }
}

export default function Home() {
  const [sessionId, setSessionId] = useState(getInitialSessionId);
  const [current, setCurrent] = useState(() => getInitialSlide(getInitialSessionId()));
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [showDeck, setShowDeck] = useState(() => new URLSearchParams(window.location.search).get("selector") === "1");
  const [showHelp, setShowHelp] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [trainingToken, setTrainingToken] = useState<string | null>(() => getTrainingToken());
  const [trainingUser, setTrainingUser] = useState<TrainingUser | null>(null);
  const [trainingOverview, setTrainingOverview] = useState<TrainingOverview | null>(null);
  const [trainingReady, setTrainingReady] = useState(() => !getTrainingToken());
  const [showAssessment, setShowAssessment] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showSupervisor, setShowSupervisor] = useState(false);
  const [supervisorDashboard, setSupervisorDashboard] = useState<SupervisorDashboard | null>(null);
  const [dashboardError, setDashboardError] = useState("");

  const activeSession = sessions.find((session) => session.id === sessionId) ?? sessions[0];
  const currentPosition = Math.max(0, activeSession.slideIndexes.indexOf(current));
  const activeAssessment = activeSession.moduleCode ? assessmentQuestions[activeSession.moduleCode] : undefined;
  const activeProgress = trainingOverview?.progress.find((item) => item.module_code === activeSession.moduleCode);
  const activeAttempt = trainingOverview?.attempts.find((item) => item.module_code === activeSession.moduleCode);
  const canSupervise = canAccessSupervision(trainingUser?.role);
  const trainingModules = trainingOverview?.modules ?? [];
  const trainingProgress = trainingOverview?.progress ?? [];
  const trainingAttempts = trainingOverview?.attempts ?? [];
  const certificateEligible = isCertificateEligible(trainingModules, trainingProgress, trainingAttempts);

  useEffect(() => {
    if (!trainingToken) {
      setTrainingReady(true);
      return;
    }
    let active = true;
    setTrainingReady(false);
    getTrainingOverview(trainingToken).then((overview) => {
      if (!active) return;
      setTrainingOverview(overview);
      setTrainingUser(overview.user);
    }).catch(() => {
      if (!active) return;
      clearTrainingToken();
      setTrainingToken(null);
      setTrainingUser(null);
      setTrainingOverview(null);
    }).finally(() => {
      if (active) setTrainingReady(true);
    });
    return () => { active = false; };
  }, [trainingToken]);

  const goTo = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
    setDirection(nextIndex >= current ? "forward" : "backward");
    setCurrent(nextIndex);
    setShowAnswers(false);
  }, [current]);

  const goRelative = useCallback((offset: number) => {
    const session = sessions.find((item) => item.id === sessionId) ?? sessions[0];
    const position = Math.max(0, session.slideIndexes.indexOf(current));
    const nextPosition = Math.max(0, Math.min(session.slideIndexes.length - 1, position + offset));
    goTo(session.slideIndexes[nextPosition]);
  }, [current, goTo, sessionId]);

  const startSession = useCallback((nextSessionId: string) => {
    const nextSession = sessions.find((session) => session.id === nextSessionId) ?? sessions[0];
    setSessionId(nextSession.id);
    setDirection("forward");
    setCurrent(nextSession.slideIndexes[0]);
    setShowAnswers(false);
    setShowAssessment(false);
    setShowDeck(false);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
  }, []);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    search.set("session", sessionId);
    search.set("slide", String(current + 1));
    window.history.replaceState(null, "", `${window.location.pathname}?${search.toString()}`);
  }, [current, sessionId]);

  useEffect(() => {
    if (!trainingToken || !activeSession.moduleCode) return;
    const status = currentPosition === activeSession.slideIndexes.length - 1 ? "completed" : "in_progress";
    void saveModuleProgress(trainingToken, {
      moduleCode: activeSession.moduleCode,
      currentSlide: currentPosition + 1,
      totalSlides: activeSession.slideIndexes.length,
      status,
    }).catch(() => undefined);
  }, [activeSession.moduleCode, activeSession.slideIndexes.length, currentPosition, trainingToken]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const action = getPresentationKeyAction(event);
      if (action === "next") {
        event.preventDefault();
        goRelative(1);
      }
      if (action === "previous") {
        event.preventDefault();
        goRelative(-1);
      }
      if (action === "start") { event.preventDefault(); goTo(activeSession.slideIndexes[0]); }
      if (action === "end") { event.preventDefault(); goTo(activeSession.slideIndexes[activeSession.slideIndexes.length - 1]); }
      if (action === "sessions") setShowDeck((value) => !value);
      if (action === "help") setShowHelp((value) => !value);
      if (action === "fullscreen") toggleFullscreen();
      if (action === "assessment") {
        if (slides[current].kind === "quiz") setShowAnswers((value) => !value);
        else if (activeAssessment) setShowAssessment(true);
      }
      if (action === "close") { setShowDeck(false); setShowHelp(false); setShowAssessment(false); setShowCertificate(false); setShowSupervisor(false); }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [activeAssessment, activeSession.slideIndexes, current, goRelative, goTo, toggleFullscreen]);

  const slide = slides[current];
  const theme = getSlideTheme(slide);
  const moduleIndex = Math.max(0, moduleNames.indexOf(slide.module));

  const handleLogin = (token: string, user: TrainingUser) => {
    setTrainingUser(user);
    setTrainingToken(token);
    setTrainingReady(false);
  };

  const handleAssessment = async (answers: Record<string, number>, score: number, correctAnswers: number) => {
    if (!trainingToken || !activeSession.moduleCode || !activeAssessment) return;
    await saveAssessment(trainingToken, { moduleCode: activeSession.moduleCode, score, correctAnswers, totalQuestions: activeAssessment.length, answers });
    setTrainingOverview(await getTrainingOverview(trainingToken));
  };

  const openSupervisor = async () => {
    if (!trainingToken) return;
    setDashboardError("");
    try {
      setSupervisorDashboard(await getSupervisorDashboard(trainingToken));
      setShowSupervisor(true);
    } catch (cause) {
      setDashboardError(cause instanceof Error ? cause.message : "Impossible de charger le suivi.");
    }
  };

  const issueCertificate = async () => {
    if (!trainingToken) throw new Error("Session invalide.");
    const result = await createCertificate(trainingToken);
    setTrainingOverview((current) => current ? { ...current, certificate: result.certificate } : current);
    return result.certificate;
  };

  const logoutTraining = () => {
    clearTrainingToken();
    setTrainingToken(null);
    setTrainingUser(null);
    setTrainingOverview(null);
    setShowDeck(false);
    setShowAssessment(false);
    setShowCertificate(false);
    setShowSupervisor(false);
  };

  if (!trainingReady) return <main className="training-loading"><span>Connexion au parcours…</span></main>;
  if (!trainingUser) return <TrainingLogin onSuccess={handleLogin} />;

  return (
    <main className="mpesa-deck" aria-label="Présentation de formation M-Pesa BTL">
      <button type="button" className="session-indicator" onClick={() => setShowDeck(true)} aria-label="Afficher les informations de la session connectée"><span className="session-indicator__dot" /><span><b>{trainingUser.fullName || "Agent connecté"}</b><small>{trainingUser.role.replace(/_/g, " ")} · session connectée</small></span></button>
      <div className="presentation-shell">
        <div className="presentation-frame">
          <aside className="rail" aria-label="Repères de la présentation">
            <div className="rail__brand" aria-label="Monogramme BTL à trois chevrons"><BrandMark /></div>
            <div className="rail__label">M-Pesa / BTL Learning</div>
            <div className="rail__rule" />
            <div className="rail__position">{activeSession.id === "complete" ? formatNumber(moduleIndex + 1) : `${formatNumber(currentPosition)} / ${formatNumber(activeSession.slideIndexes.length - 1)}`}</div>
          </aside>
          <section className="slide-stage" aria-live="polite">
            <article key={current} className={`slide ${theme} ${slide.compact ? "compact" : ""} ${direction === "forward" ? "slide--forward" : "slide--backward"}`}>
              {slide.kind !== "cover" && slide.kind !== "close" && <div className="slide__topline"><span className="eyebrow">{slide.kicker}</span><span className="micro-label">{slide.module}</span></div>}
              {slide.kind !== "cover" && slide.kind !== "close" && slide.kind !== "mikiliIntro" && <h1 className="slide__title">{slide.title}</h1>}
              {slide.kind !== "cover" && slide.kind !== "close" && slide.kind !== "mikiliIntro" && slide.subtitle && <p className="slide__subtitle">{slide.subtitle}</p>}
              <div className="slide__body"><SlideContent slide={slide} showAnswers={showAnswers} toggleAnswers={() => setShowAnswers((value) => !value)} /></div>
              <footer className="slide__footer"><span>{activeSession.id === "complete" ? "Formation Produits & Services M-Pesa · Usage interne" : `${activeSession.label} · Séance autonome`}</span><span>{formatNumber(currentPosition)} / {formatNumber(activeSession.slideIndexes.length - 1)}</span></footer>
            </article>
          </section>
        </div>
      </div>

      <nav className="control-strip" aria-label="Contrôles de la présentation">
        <button type="button" className="control-button" onClick={() => goRelative(-1)} disabled={currentPosition === 0} aria-label="Slide précédente"><ChevronLeft size={19} /></button>
        <button type="button" className="control-button" onClick={() => goRelative(1)} disabled={currentPosition === activeSession.slideIndexes.length - 1} aria-label="Slide suivante"><ChevronRight size={19} /></button>
        <span className="control-divider" />
        <button type="button" className="control-button" onClick={() => setShowDeck((value) => !value)} aria-label="Choisir une séance"><Grid2X2 size={18} /></button>
        {activeAssessment && <button type="button" className="control-button" onClick={() => setShowAssessment(true)} aria-label="Lancer l’évaluation du module"><ClipboardCheck size={18} /></button>}
        <button type="button" className="control-button" onClick={() => setShowCertificate(true)} aria-label="Afficher mon certificat"><Award size={18} /></button>
        {canSupervise && <button type="button" className="control-button" onClick={openSupervisor} aria-label="Ouvrir le tableau de bord superviseur"><LayoutDashboard size={18} /></button>}
        <button type="button" className="control-button" onClick={toggleFullscreen} aria-label="Basculer en plein écran"><Expand size={17} /></button>
        <button type="button" className="control-button" onClick={() => setShowHelp((value) => !value)} aria-label="Afficher les raccourcis clavier"><CircleHelp size={18} /></button>
        <button type="button" className="control-button" onClick={logoutTraining} aria-label="Se déconnecter de la formation"><LogOut size={17} /></button>
      </nav>

      {showDeck && <aside className="deck-panel" aria-label="Sélecteur de séances"><div className="panel-heading"><div><span className="micro-label">{trainingUser.fullName || "Agent connecté"}</span><h2>Choisir une séance</h2></div><button type="button" aria-label="Fermer le sélecteur de séances" onClick={() => setShowDeck(false)}><X size={19} /></button></div><div className="session-grid">{sessions.map((session) => { const progress = trainingOverview?.progress.find((item) => item.module_code === session.moduleCode); const attempt = trainingOverview?.attempts.find((item) => item.module_code === session.moduleCode); return <button key={session.id} type="button" onClick={() => startSession(session.id)} className={`session-card ${session.id === activeSession.id ? "session-card--active" : ""}`}><span className="session-card__duration">{session.duration}</span><b>{session.label}</b><small>{session.description}</small><span className="session-card__count">{session.moduleCode ? `${progress?.status === "completed" ? "Parcours terminé" : `${progress?.current_slide || 0}/${session.slideIndexes.length} slides`} · ${attempt ? `${attempt.score}%` : "test à faire"}` : `${session.slideIndexes.length} slides`}</span></button>; })}</div><div className="deck-panel__section"><span className="micro-label">Séance active · {activeSession.labelShort}{activeProgress ? ` · ${activeProgress.status === "completed" ? "terminée" : "en cours"}` : ""}{activeAttempt ? ` · dernier test ${activeAttempt.score}%` : ""}</span><div className="deck-panel__list">{activeSession.slideIndexes.map((slideIndex, index) => { const item = slides[slideIndex]; return <button key={`${item.title}-${slideIndex}`} type="button" onClick={() => { goTo(slideIndex); setShowDeck(false); }} className={`deck-panel__item ${current === slideIndex ? "deck-panel__item--active" : ""}`}><span>{formatNumber(index)}</span><b>{item.title.replace(/<[^>]+>/g, "").replace(/\n/g, " ")}</b></button>; })}</div>{activeAssessment && <button type="button" className="deck-panel__assessment" onClick={() => { setShowDeck(false); setShowAssessment(true); }}>Lancer le test du module</button>}</div></aside>}

      {showHelp && <aside className="help-panel" role="dialog" aria-modal="true" aria-label="Raccourcis clavier"><span className="micro-label">Mode présentateur</span><h2>Pilotez au clavier.</h2><div className="help-grid"><div><kbd>→ / espace</kbd>Slide suivante</div><div><kbd>← / retour</kbd>Slide précédente</div><div><kbd>Home / End</kbd>Début / fin de séance</div><div><kbd>G ou M</kbd>Choisir une séance</div><div><kbd>F</kbd>Plein écran</div><div><kbd>A</kbd>Test ou réponses du quiz</div><div><kbd>?</kbd>Cette aide</div><div><kbd>Échap</kbd>Fermer un panneau</div></div><button type="button" className="help-close" onClick={() => setShowHelp(false)}>Reprendre la présentation</button></aside>}
      {showAssessment && activeAssessment && <AssessmentPanel sessionLabel={activeSession.label} questions={activeAssessment} onClose={() => setShowAssessment(false)} onSubmit={handleAssessment} />}
      {showCertificate && <CertificatePanel user={trainingUser} certificate={trainingOverview?.certificate || null} eligible={certificateEligible} onClose={() => setShowCertificate(false)} onIssue={issueCertificate} />}
      {showSupervisor && supervisorDashboard && <SupervisorPanel dashboard={supervisorDashboard} onClose={() => setShowSupervisor(false)} />}
      {dashboardError && <div className="session-error" role="status">{dashboardError}</div>}
    </main>
  );
}
