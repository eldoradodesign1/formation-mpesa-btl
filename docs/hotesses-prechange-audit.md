# Audit pré-modification — Module « Formation Hôtesses »

**Date :** 25 septembre 2026
**Périmètre :** application de formation M-Pesa BTL, catalogue Supabase, Edge Functions de formation, publication GitHub Pages et parcours Invité.
**Conclusion :** le socle existant est fonctionnel et peut recevoir un module supplémentaire à condition de synchroniser le contenu de l’interface, le catalogue Supabase et les contrôles d’accès côté Edge Function. Aucun changement applicatif, aucune migration et aucune donnée de suivi n’ont été modifiés pendant la phase d’audit.

## État de référence vérifié

Le répertoire de travail applicatif était propre au démarrage de l’audit et aligné sur le checkpoint local `da97730`. Le dépôt GitHub Pages est sur sa branche `main` au commit publié `306a008`. La page publique répond avec un statut HTTP 200, affiche correctement l’écran de connexion, propose le mode Invité, charge le QR code et déclare un manifeste PWA valide. Le test visuel public du parcours Invité a également confirmé le sélecteur des sept modules déjà publiés et la navigation par panneaux. [1] [2]

Les commandes de validation de référence ont toutes réussi : `pnpm check`, `pnpm test` et `pnpm build`. Les cinq fichiers Vitest ont exécuté dix tests avec succès. Les avertissements de build restent connus et inchangés : les visuels historiques hébergés dans Manus Storage sont résolus à l’exécution, et le bundle principal dépasse le seuil de 500 kB. Ces avertissements ne bloquent pas la publication actuelle.

| Élément audité | Résultat | Conséquence pour le module Hôtesses |
| --- | --- | --- |
| Interface React, TypeScript et navigation clavier | Fonctionnelle | Les slides Hôtesses doivent réemployer les composants et raccourcis existants. |
| Mode Invité | Fonctionnel et lecture seule | Le nouveau module doit rester visible pour un invité, sans enregistrement de progression ni réponse au quiz. |
| Évaluations et seuil de réussite | Fonctionnels à 80 % | Le nouveau quiz doit avoir une banque dédiée, quatre choix par question et des tests de seuil. |
| Certificat | Fonctionnel selon les modules visibles | Une hôtesse devra valider les huit modules actifs ; un Brand Ambassador restera évalué sur les modules qui lui sont accessibles. |
| Dashboard, exports et cotation | Fonctionnels sur le périmètre existant | Le total de modules doit être calculé par utilisateur, afin de ne pas pénaliser les catégories qui n’accèdent pas à Hôtesses. |
| GitHub Pages et PWA | Fonctionnels | Les nouveaux visuels doivent être externalisés et le cache du service worker devra être incrémenté à la publication. |

## Intégrité des données et catalogue de formation

Le catalogue contient actuellement sept modules actifs, du module `clients` au module `vodacom-privilege`. La table de sessions comporte 40 enregistrements, la progression 26 enregistrements, les évaluations une tentative, les cotations 24 enregistrements et aucun certificat n’a encore été émis. La vérification des clés fonctionnelles ne révèle aucun doublon de progression par couple utilisateur/module ni de cotation par couple évaluateur/participant.

La répartition réelle des utilisateurs confirme l’existence des catégories nécessaires au contrôle demandé : 34 agents `hostess`, 43 `brand_ambassador`, ainsi que des profils opérationnels ayant les rôles `supervisor`, `sub_admin`, `admin` et `super_admin`. Les noms, téléphones et mots de passe n’ont pas été consultés ni exportés.

## Analyse des droits à appliquer

Le catalogue actuel n’a pas de colonne de visibilité par catégorie. Le nouveau module peut néanmoins être protégé sans créer de nouvelle base ni modifier les modules existants en appliquant une règle explicite dans les deux couches concernées.

> Le module `formation-hotesses` sera accessible à toute hôtesse connectée, aux rôles de supervision et d’administration déjà reconnus par la formation, ainsi qu’aux visiteurs en lecture seule. Il ne sera pas présenté dans la séance complète, le sélecteur de séances, les évaluations ou la certification des autres agents.

L’interface actuelle possède un catalogue statique de slides et de séances. Il faut donc filtrer à la fois la séance autonome Hôtesses et les slides Hôtesses insérées dans la formation complète. Sans ce filtrage, un lien profond ou la formation complète exposerait le contenu au mauvais profil.

L’Edge Function `training-gateway` renvoie aujourd’hui tous les modules actifs et accepte une progression ou une évaluation sans vérifier la visibilité du code de module. Cette règle doit être renforcée côté serveur. Elle devra aussi être utilisée pour le calcul du certificat et des totaux affichés dans le dashboard. Cette double application évite qu’un agent contourne l’interface en appelant directement une route de progression ou d’évaluation.

## Préservation de la direction visuelle

La direction « Momentum Delta » est cohérente et doit être préservée : fond anthracite, rouge signal `#E60028`, contraste crème, Space Grotesk pour les titres, DM Sans pour les textes, rail vertical, cartes directionnelles et animations courtes. Le responsive actuel est intégré au même fichier de styles et son comportement mobile a été examiné. Les nouveaux écrans réutiliseront les compositions existantes et ajouteront seulement des variantes photographiques dédiées, sans modifier le système de contrôle, le login ou le layout desktop validé.

## Points hors périmètre conservés sans remédiation

L’audit Supabase remonte des avis de sécurité et de performance historiques couvrant de nombreuses tables, politiques et fonctions hors formation. Il identifie notamment trois tables non liées avec RLS désactivé, ainsi que des avis de politiques RLS et d’indexation. Ces éléments n’ont pas été modifiés, car ils ne sont pas nécessaires à l’ajout du module et une correction globale risquerait de modifier des usages existants. Les tables de formation sont utilisées par les Edge Functions avec une clé de service et ne seront pas ouvertes directement par la nouvelle interface. [3]

## Plan d’intégration approuvé par l’audit

La mise en œuvre ajoutera un module autonome de 65 minutes, quatorze slides, un quiz de douze questions, deux jeux de rôle et une grille de cotation terrain. Le contenu distinguera nettement l’hôtesse d’accueil événementiel de l’hôtesse de proximité. Il couvrira la préparation, la ponctualité, la tenue, l’accueil, l’approche consentie, l’écoute, l’empathie, la communication non manipulatrice, la gestion des émotions, les cas difficiles, l’éthique, le reporting et l’escalade.

Trois visuels originaux sont prévus : une scène d’accueil événementiel, une conversation de proximité en lieu fixe et une scène de préparation de terrain. Ils seront générés sans logos ni texte et externalisés dans Manus Storage, afin de ne pas alourdir le dépôt GitHub Pages.

## Références

[1]: https://eldoradodesign1.github.io/formation-mpesa-btl/ "Formation M-Pesa BTL — publication GitHub Pages"
[2]: https://github.com/eldoradodesign1/formation-mpesa-btl "Dépôt GitHub Formation M-Pesa BTL"
[3]: https://supabase.com/docs/guides/database/database-linter "Supabase Database Linter — interprétation des avis de sécurité et de performance"
