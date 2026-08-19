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

## Gestion administrateur des équipements

- [x] Ajouter l’interface administrateur de création d’un équipement
- [x] Ajouter l’interface administrateur de modification d’un équipement
- [x] Ajouter l’archivage réversible des équipements
- [x] Restreindre les opérations d’équipement au rôle administrateur
- [x] Préserver les équipements archivés dans les anciens rapports
- [x] Vérifier les opérations d’équipement par tests unitaires

## Conservation des équipements archivés

- [x] Charger les métadonnées actives et archivées référencées par les rapports historiques
- [x] Inclure les équipements archivés dans les filtres d’historique lorsqu’ils existent dans un rapport
- [x] Utiliser les métadonnées historiques pour générer les PDF
- [x] Ajouter les tests de modification d’équipement et de conservation historique

- [x] Générer les PDF historiques uniquement à partir des équipements référencés dans le rapport

## Affichage tableau des équipements

- [x] Remplacer la liste administrateur par un tableau lisible
- [x] Conserver les actions modifier, archiver et restaurer dans le tableau
- [x] Adapter le tableau à l’affichage smartphone
- [x] Vérifier visuellement le tableau sur ordinateur et mobile

- [x] Effectuer une vérification visuelle authentifiée du tableau administrateur sur desktop et mobile

## Accès commun du personnel autorisé

- [x] Supprimer la distinction administrateur / inspecteur dans l’interface
- [x] Autoriser tout membre approuvé à ajouter, modifier, archiver et restaurer les équipements
- [x] Supprimer la gestion des comptes réservée à un administrateur
- [x] Afficher l’auteur des actions de gestion des équipements
- [x] Permettre à chaque membre autorisé de signer ses contrôles et ses modifications
- [x] Adapter les tests aux permissions communes du personnel autorisé

## Traçabilité complète des actions

- [x] Afficher le nom du dernier auteur et la date de son action dans le tableau
- [x] Harmoniser les tests restants avec le modèle de personnel autorisé
- [x] Tester explicitement ajout, modification, archivage et restauration signés

## Harmonisation finale des tests

- [x] Remplacer les noms et libellés Inspecteur des fixtures par Personnel autorisé
- [x] Vérifier qu’aucun test métier ne dépend fonctionnellement d’un rôle administrateur ou inspecteur

## Vérification globale des permissions

- [x] Centraliser le contexte de test du personnel autorisé
- [x] Vérifier globalement que les procédures métier utilisent accessStatus et non role
