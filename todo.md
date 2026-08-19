# Projet TODO

- [x] Authentification sécurisée réservée au personnel autorisé
- [x] Gestion des rôles administrateur et inspecteur
- [x] Modèle de données des équipements de la cour
- [x] Modèle de données des contrôles mensuels
- [x] Critères exacts : sécurité, fiabilité, stabilité, état général, propreté
- [x] Statuts exacts : conforme, non conforme, à surveiller
- [x] Commentaire libre pour chaque critère et équipement
- [x] Tableau de bord du mois en cours
- [x] Indicateurs vert / orange / rouge par équipement
- [x] Vue des contrôles passés
- [x] Historique mensuel continu
- [x] Filtres par date et par équipement
- [x] Génération de rapports PDF par mois
- [x] Inclusion obligatoire de la signature de l’inspecteur dans le PDF
- [x] Téléchargement des rapports PDF
- [x] Sauvegarde automatique en base de données en ligne
- [x] Interface responsive pour smartphone et ordinateur
- [x] Design professionnel, aéré et cohérent
- [x] Tests unitaires des règles métier et des procédures
- [x] Vérification visuelle desktop et mobile
- [x] Vérification des états de chargement, erreurs et listes vides

## Correctifs de conformité avant livraison

- [x] Restreindre l’accès au personnel autorisé du collège avec une allowlist contrôlée côté serveur
- [x] Remplacer le rôle générique user par le rôle inspecteur dans le modèle métier et les permissions
- [x] Garantir qu’un PDF ne peut être exporté que si le rapport est signé
- [x] Ajouter des tests Vitest pour la sauvegarde, la signature et les permissions
- [x] Ajouter un état d’erreur explicite pour le tableau de bord
