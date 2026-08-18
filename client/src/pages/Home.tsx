/**
 * Momentum Delta — présentation 16:9 à dominante anthracite et rouge signal, organisée comme un parcours de terrain.
 */
import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Expand,
  Grid2X2,
  List,
  X,
} from "lucide-react";

const brandMark = "/manus-storage/mpesa-btl-mark_cba7e3e0.png";

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

const moduleNames = ["Ouverture", "Clients M-Pesa", "Petit Commerce", "M-Pesa Carte Visa", "M-Pesa Mikili", "M-Pesa Rallonge", "Conclusion"];

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
          <div className="brand-signature brand-signature--hero"><img src={brandMark} alt="" /><span><b>M-PESA</b><small>BTL Learning</small></span></div>
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
            {moduleNames.slice(1, 6).map((name, index) => <div className="module-list__item" key={name}><span className="module-list__number">{formatNumber(index)}</span><b>{name}</b><span>Module</span></div>)}
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
      return <div className="global-flow"><div><p className="global-flow__big">L’argent envoyé de l’étranger arrive <em>directement</em> sur le compte M-Pesa.</p><p className="global-flow__desc">Une réponse aux besoins d’une clientèle qui souhaite recevoir simplement des fonds envoyés par ses proches depuis l’étranger.</p></div><div className="flow-points"><div className="flow-point"><span className="flow-point__index">01</span><div><b>Un proche initie le transfert</b><span>Depuis le partenaire disponible dans son pays.</span></div></div><div className="flow-point"><span className="flow-point__index">02</span><div><b>MFS vérifie le parcours</b><span>Le KYC du bénéficiaire et les contrôles nécessaires sont pris en compte.</span></div></div><div className="flow-point"><span className="flow-point__index">03</span><div><b>Le bénéficiaire est notifié</b><span>Les fonds sont crédités sur le compte M-Pesa si le contrôle est concluant.</span></div></div></div></div>;
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
      return <div className="close-layout"><div className="brand-signature brand-signature--close"><img src={brandMark} alt="" /><span><b>M-PESA</b><small>BTL Learning</small></span></div><p className="close-layout__statement" dangerouslySetInnerHTML={{ __html: slide.title }} /><p className="close-layout__small">{slide.subtitle}</p></div>;
  }
}

export default function Home() {
  const [current, setCurrent] = useState(() => {
    const requested = Number.parseInt(new URLSearchParams(window.location.search).get("slide") ?? "1", 10);
    return Number.isFinite(requested) ? Math.max(0, Math.min(slides.length - 1, requested - 1)) : 0;
  });
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [showDeck, setShowDeck] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const goTo = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
    setDirection(nextIndex >= current ? "forward" : "backward");
    setCurrent(nextIndex);
    setShowAnswers(false);
  }, [current]);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
  }, []);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        goTo(current + 1);
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp" || event.key === "Backspace") {
        event.preventDefault();
        goTo(current - 1);
      }
      if (event.key === "Home") { event.preventDefault(); goTo(0); }
      if (event.key === "End") { event.preventDefault(); goTo(slides.length - 1); }
      if (event.key.toLowerCase() === "g") setShowDeck((value) => !value);
      if (event.key === "?" || (event.key === "/" && event.shiftKey)) setShowHelp((value) => !value);
      if (event.key.toLowerCase() === "f") toggleFullscreen();
      if (event.key.toLowerCase() === "a" && slides[current].kind === "quiz") setShowAnswers((value) => !value);
      if (event.key === "Escape") { setShowDeck(false); setShowHelp(false); }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [current, goTo, toggleFullscreen]);

  const slide = slides[current];
  const theme = getSlideTheme(slide);
  const moduleIndex = Math.max(0, moduleNames.indexOf(slide.module));

  return (
    <main className="mpesa-deck" aria-label="Présentation de formation M-Pesa BTL">
      <div className="presentation-shell">
        <div className="presentation-frame">
          <aside className="rail" aria-label="Repères de la présentation">
            <div className="rail__brand"><img src={brandMark} alt="Marque graphique BTL" /></div>
            <div className="rail__label">M-Pesa / BTL Learning</div>
            <div className="rail__rule" />
            <div className="rail__position">{formatNumber(moduleIndex + 1)}</div>
          </aside>
          <section className="slide-stage" aria-live="polite">
            <article key={current} className={`slide ${theme} ${slide.compact ? "compact" : ""} ${direction === "forward" ? "slide--forward" : "slide--backward"}`}>
              {slide.kind !== "cover" && slide.kind !== "close" && <div className="slide__topline"><span className="eyebrow">{slide.kicker}</span><span className="micro-label">{slide.module}</span></div>}
              {slide.kind !== "cover" && slide.kind !== "close" && <h1 className="slide__title">{slide.title}</h1>}
              {slide.kind !== "cover" && slide.kind !== "close" && slide.subtitle && <p className="slide__subtitle">{slide.subtitle}</p>}
              <div className="slide__body"><SlideContent slide={slide} showAnswers={showAnswers} toggleAnswers={() => setShowAnswers((value) => !value)} /></div>
              <footer className="slide__footer"><span>Formation Produits & Services M-Pesa · Usage interne</span><span>{formatNumber(current)} / {formatNumber(slides.length - 1)}</span></footer>
            </article>
          </section>
        </div>
      </div>

      <nav className="control-strip" aria-label="Contrôles de la présentation">
        <button type="button" className="control-button" onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Slide précédente"><ChevronLeft size={19} /></button>
        <button type="button" className="control-button" onClick={() => goTo(current + 1)} disabled={current === slides.length - 1} aria-label="Slide suivante"><ChevronRight size={19} /></button>
        <span className="control-divider" />
        <button type="button" className="control-button" onClick={() => setShowDeck((value) => !value)} aria-label="Afficher le sommaire"><List size={18} /></button>
        <button type="button" className="control-button" onClick={toggleFullscreen} aria-label="Basculer en plein écran"><Expand size={17} /></button>
        <button type="button" className="control-button" onClick={() => setShowHelp((value) => !value)} aria-label="Afficher les raccourcis clavier"><CircleHelp size={18} /></button>
      </nav>

      {showDeck && <aside className="deck-panel" aria-label="Sommaire des slides"><div className="panel-heading"><div><span className="micro-label">Navigation</span><h2>Parcourir la formation</h2></div><button type="button" aria-label="Fermer le sommaire" onClick={() => setShowDeck(false)}><X size={19} /></button></div><div className="deck-panel__list">{slides.map((item, index) => <button key={`${item.title}-${index}`} type="button" onClick={() => { goTo(index); setShowDeck(false); }} className={`deck-panel__item ${current === index ? "deck-panel__item--active" : ""}`}><span>{formatNumber(index)}</span><b>{item.title.replace(/<[^>]+>/g, "").replace(/\n/g, " ")}</b></button>)}</div></aside>}

      {showHelp && <aside className="help-panel" role="dialog" aria-modal="true" aria-label="Raccourcis clavier"><span className="micro-label">Mode présentateur</span><h2>Pilotez au clavier.</h2><div className="help-grid"><div><kbd>→ / espace</kbd>Slide suivante</div><div><kbd>← / retour</kbd>Slide précédente</div><div><kbd>Home / End</kbd>Début / fin</div><div><kbd>G</kbd>Sommaire</div><div><kbd>F</kbd>Plein écran</div><div><kbd>A</kbd>Réponses du quiz</div><div><kbd>?</kbd>Cette aide</div><div><kbd>Échap</kbd>Fermer un panneau</div></div><button type="button" className="help-close" onClick={() => setShowHelp(false)}>Reprendre la présentation</button></aside>}
    </main>
  );
}
