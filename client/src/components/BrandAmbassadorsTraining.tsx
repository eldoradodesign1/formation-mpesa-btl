import type { ReactNode } from "react";

type PanelProps = { title: string; children: ReactNode; focus?: boolean; tag?: string };

function Panel({ title, children, focus = false, tag }: PanelProps) {
  return (
    <section className={`comparison-card${focus ? " comparison-card--focus" : ""}`}>
      {tag && <span className="comparison-card__tag">{tag}</span>}
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return <div className="bullet-stack">{items.map((item) => <div className="bullet-stack__item" key={item}>{item}</div>)}</div>;
}

function Steps({ items }: { items: string[] }) {
  return <div className="takeaway-list">{items.map((item, index) => <div className="takeaway-item" key={item}><span className="takeaway-item__n">{String(index + 1).padStart(2, "0")}</span>{item}</div>)}</div>;
}

const sections: Record<string, ReactNode> = {
  "ba-intro": (
    <div className="hostess-hero-copy ba-hero-copy">
      <span className="micro-label">Activation · conseil · confiance</span>
      <p>Un bon ambassadeur ne pousse pas un produit : il aide la bonne personne à comprendre une option utile.</p>
      <div className="hostess-hero-copy__pillars"><span>Écoute</span><span>Information fiable</span><span>Choix libre</span><span>Protection M-Pesa</span></div>
    </div>
  ),
  "ba-role": (
    <div className="comparison-grid">
      <Panel title="La valeur du BA" tag="Du contact à l'action">
        <p>Faire connaître une offre, repérer un besoin, l’expliquer clairement et faciliter la prochaine étape prévue par la campagne.</p>
        <Bullets items={["Créer une conversation brève et choisie, pas une interruption.", "Adapter l’exemple à l’usage réellement exprimé.", "Démontrer uniquement avec le support et la procédure validés."]} />
      </Panel>
      <Panel title="Un rôle de conseil — pas d’autorisation" tag="Limites professionnelles" focus>
        <p>Le client décide et réalise lui-même toute action sensible sur son téléphone.</p>
        <Bullets items={["Pas de promesse d’éligibilité, de gain, de gratuité ou de résultat.", "Pas de saisie du PIN, OTP ou mot de passe ; pas de transaction réelle à la place du client.", "Toute question hors brief est vérifiée ou transmise au référent."]} />
      </Panel>
    </div>
  ),
  "ba-readiness": (
    <div className="takeaway-layout">
      <Steps items={["Brief : objectif, public, durée, emplacement et action attendue — sans inventer une cible.", "Offre : version datée, prix/frais, conditions, limites, exclusions et preuve officielle.", "Rôle : ce que je peux dire ou faire, et ce qui exige un agent habilité.", "Équipe : superviseur, binôme, pause, relève et canal d’urgence réellement joignable.", "Matériel : badge, support validé, téléphone de démonstration et reporting prévu."]} />
      <aside className="takeaway-quote"><p>Sans brief à jour, pas d’argument improvisé : je vérifie avant de présenter.</p><span>Avant le premier contact</span></aside>
    </div>
  ),
  "ba-approach": (
    <div className="rule-cards ba-rule-cards">
      {[["A", "Aborder avec tact : choisir un moment opportun, rester visible et demander la permission."], ["C", "Comprendre : poser une question ouverte puis écouter sans couper."], ["T", "Traduire l’offre en utilité reliée au besoin exprimé."], ["I", "Informer avec le support officiel : conditions, frais, limites et prochaine étape."], ["F", "Faciliter le choix : répondre, orienter ou conclure sans pression ni relance après refus."]].map(([value, label]) => <div className="rule-card" key={value}><span className="rule-card__value">{value}</span><span className="rule-card__label">{label}</span></div>)}
    </div>
  ),
  "ba-discovery": (
    <div className="two-column-copy">
      <Panel title="Écouter avant de présenter" tag="Découverte">
        <Bullets items={["« Comment faites-vous aujourd’hui pour… ? »", "« Qu’est-ce qui compte le plus pour vous : la simplicité, le coût ou autre chose ? »", "Reformuler en une phrase : « Si je comprends bien, votre priorité est… »", "S’arrêter dès que le besoin est clair ; ne pas transformer la découverte en interrogatoire."]} />
      </Panel>
      <Panel title="Ne pas collecter par réflexe" tag="Données minimales" focus>
        <Bullets items={["Ne pas demander PIN, OTP, mot de passe, solde ou historique de transactions.", "Ne pas photographier une pièce d’identité ou l’écran du client.", "Ne relever des coordonnées que si le brief l’autorise, que la finalité est claire et que la personne y consent.", "En cas de doute sur la donnée ou le formulaire : suspendre et demander au superviseur."]} />
      </Panel>
    </div>
  ),
  "ba-presentation": (
    <div className="takeaway-layout">
      <div className="ba-pitch"><span className="micro-label">Exemple — à compléter avec l’offre validée</span><p>« Vous m’avez dit que <em>[besoin exprimé]</em> est important. <em>[Nom du service]</em> peut vous aider à <em>[bénéfice confirmé]</em>. Voici les conditions et frais indiqués dans le support. Souhaitez-vous que je vous explique la prochaine étape ? »</p></div>
      <aside className="takeaway-quote"><p>Un seul bénéfice pertinent, une condition essentielle, une question ouverte.</p><span>Présentation en 30 secondes</span></aside>
    </div>
  ),
  "ba-demo": (
    <div className="route-layout">
      <aside className="route-aside"><div><span className="micro-label">Démonstration sûre</span><span className="route-aside__code">VOIR<br />FAIRE</span><p>Montrer le parcours avec le support validé, puis laisser le client garder la main.</p></div><span className="route-aside__count">4 gestes</span></aside>
      <div className="route-steps"><div className="route-steps__spine" aria-hidden="true" />{["Demander l’accord avant de montrer ou de toucher un appareil de démonstration.", "Utiliser un téléphone de démonstration, des données fictives et la version officielle à jour.", "Expliquer les étapes ; ne jamais demander au client de dire ou montrer son secret.", "Si la personne veut activer le service, orienter vers le parcours officiel : elle saisit et confirme elle-même.", "Arrêter si le menu, le prix ou le résultat ne correspond pas au brief ; appeler le référent."] .map((item) => <div className="route-step" key={item}>{item}</div>)}</div>
    </div>
  ),
  "ba-objections": (
    <div className="comparison-grid">
      <Panel title="Accueillir la réserve" tag="Écouter · clarifier">
        <Bullets items={["« C’est trop cher. » → « Quel budget ou quel coût voulez-vous comparer ? »", "« Je n’en ai pas besoin. » → « Bien compris. Merci de m’avoir écouté. »", "« Je vais réfléchir. » → « Bien sûr. Voici le support officiel si vous souhaitez y revenir. »"]} />
      </Panel>
      <Panel title="Répondre sans pousser" tag="Jamais de pression" focus>
        <Bullets items={["Reconnaître la préoccupation ; ne pas contredire le vécu.", "Répondre avec un fait validé, pas avec un argument fabriqué.", "Dire « je vérifie » quand la réponse dépend d’une condition.", "Accepter un non, une hésitation ou la fin de l’échange sans relance insistante."]} />
      </Panel>
    </div>
  ),
  "ba-activation": (
    <div className="two-column-copy">
      <Panel title="Le client garde le contrôle" tag="Activation">
        <Bullets items={["Vérifier que la personne veut continuer et que le service est disponible selon les règles du moment.", "Présenter le parcours officiel depuis le support à jour ; ne pas garantir l’éligibilité.", "Le client saisit lui-même numéro, montant, choix et PIN ; le BA détourne le regard des secrets.", "Le client lit les conditions et confirme lui-même chaque transaction."]} />
      </Panel>
      <Panel title="Aucune transaction de formation" tag="Sécurité financière" focus>
        <Bullets items={["Ne pas tester l’offre sur le compte, le numéro ou l’argent réel du prospect.", "Ne pas avancer de fonds, prendre le téléphone ou conserver le PIN.", "Ne pas annoncer qu’un paiement, transfert ou remboursement est réussi sans confirmation officielle du client.", "En cas d’échec ou de doute : ne pas recommencer à l’aveugle, orienter vers le canal officiel."]} />
      </Panel>
    </div>
  ),
  "ba-trust": (
    <div className="two-column-copy">
      <Panel title="Les secrets restent secrets" tag="M-Pesa">
        <Bullets items={["Ne jamais demander, voir, écrire, dicter, photographier ou transmettre PIN, OTP et mots de passe.", "Protéger l’écran du client des regards ; ne jamais prendre son téléphone pour saisir une donnée.", "Ne jamais envoyer un lien ou un QR code non fourni par les supports validés.", "En cas de message suspect, d’usurpation ou de fraude présumée : cesser l’action et alerter le canal prévu."]} />
      </Panel>
      <Panel title="Transparence avant conversion" tag="Information confirmée" focus>
        <Bullets items={["Présenter le coût total communiqué, les conditions d’éligibilité et les limites importantes.", "Distinguer clairement le service M-Pesa de toute offre ou initiative de campagne.", "Ne pas retenir une condition défavorable pour obtenir une adhésion.", "La confiance et la décision éclairée priment sur le chiffre d’activation du jour."]} />
      </Panel>
    </div>
  ),
  "ba-refusal": (
    <div className="comparison-grid">
      <Panel title="Avant l’échange" tag="Lire les signaux">
        <Bullets items={["Une personne pressée, occupée ou engagée ailleurs peut ne pas être disponible.", "Ne pas bloquer la file, l’entrée, la circulation ni l’accès au service.", "Une seule ouverture brève suffit : « Bonjour, souhaitez-vous une information sur… ? »"]} />
      </Panel>
      <Panel title="Après un refus" tag="La bonne conclusion" focus>
        <Bullets items={["Remercier : « Très bien, merci. Je vous laisse poursuivre. »", "Cesser immédiatement l’approche et libérer l’espace.", "Ne pas rappeler la personne, la suivre ou changer d’angle pour contourner son refus.", "Ne pas qualifier le refus comme un échec individuel dans le reporting."]} />
      </Panel>
    </div>
  ),
  "ba-safety": (
    <div className="takeaway-layout">
      <Steps items={["Lieu : rester dans la zone autorisée, publique, éclairée et visible.", "Équipe : confirmer binôme, référent, téléphone chargé et code d’alerte du brief.", "Risque : interrompre l’activité si menace, harcèlement, foule ou déplacement rendent le poste dangereux.", "Sortie : se déplacer vers une zone sûre avec l’équipe ; ne pas suivre ni confronter une personne.", "Relais : joindre le responsable, la sécurité ou les secours selon la procédure locale ; ne pas improviser."]} />
      <aside className="takeaway-quote"><p>Un objectif de campagne ne justifie jamais un poste isolé ni une interaction qui ne paraît pas sûre.</p><span>Personnes d’abord</span></aside>
    </div>
  ),
  "ba-reporting": (
    <div className="two-column-copy">
      <Panel title="Mesurer la qualité du travail" tag="Fin de poste">
        <Bullets items={["Présence et créneaux réellement couverts.", "Contacts proposés et conversations acceptées — avec définition commune.", "Questions fréquentes, besoins compris et orientations effectuées.", "Intérêt ou activation selon les indicateurs de campagne explicitement validés.", "Incidents, matériel ou information manquante nécessitant un suivi."]} />
      </Panel>
      <Panel title="Des chiffres honnêtes, des données minimales" tag="Faits · pas de pression" focus>
        <Bullets items={["Ne pas gonfler, dédupliquer ou inventer les chiffres.", "Ne pas enregistrer les refus comme défauts de la personne ou du BA.", "Ne remonter que les données approuvées par le brief ; aucun PIN, OTP ou détail financier.", "Remonter une condition qui empêche de bien faire : flux, support, couverture, signal ou accessibilité."]} />
      </Panel>
    </div>
  ),
  "ba-roleplay": (
    <div className="rule-cards ba-roleplay-cards">
      {[["01 · Shop", "La commerçante demande si un paiement M-Pesa lui garantit plus de clients. Découvrir son besoin, expliquer seulement la valeur confirmée et ne promettre aucun volume."], ["02 · Activation", "Le prospect accepte de regarder la démonstration puis tend son téléphone déverrouillé. Demander son accord, lui rendre le contrôle et ne jamais voir le PIN ou l’OTP."], ["03 · Rue", "Une personne refuse l’offre tandis que l’affluence monte. Remercier, libérer le passage, protéger le binôme et noter le flux comme contexte — pas comme faute."]].map(([value, label]) => <div className="rule-card" key={value}><span className="rule-card__value">{value}</span><span className="rule-card__label">{label}</span></div>)}
    </div>
  ),
  "ba-scorecard": (
    <div className="rule-cards ba-scorecard">
      {[["0–2", "Préparation : connaît objectif, offre datée, frais, référent et procédure."], ["0–2", "Contact : observe, demande la permission, écoute et respecte le refus."], ["0–2", "Conseil : relie le service au besoin avec un fait vérifié et une limite claire."], ["0–2", "Démo : utilise du matériel fictif, laisse le téléphone et la décision au client."], ["0–2", "Protection : ne voit ni ne saisit PIN/OTP, collecte uniquement le nécessaire."], ["0–2", "Terrain : tient son poste sans bloquer, s’arrête face au risque et donne un relais factuel."], ["10/12", "Seuil indicatif de maîtrise : toute erreur liée aux secrets ou à une transaction réelle exige une reprise guidée."], ["COACHING", "Retour : fait observé → effet → prochaine action ; une occasion manquée n’annule pas une interaction professionnelle sûre."]].map(([value, label]) => <div className="rule-card" key={`${value}-${label}`}><span className="rule-card__value">{value}</span><span className="rule-card__label">{label}</span></div>)}
    </div>
  ),
};

export default function BrandAmbassadorsTraining({ section }: { section: string }) {
  return sections[section] ?? <p>Contenu de formation indisponible.</p>;
}
