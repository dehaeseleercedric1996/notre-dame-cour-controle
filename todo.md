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

## Expérience de contrôle améliorée

- [x] Ajouter une progression claire du contrôle mensuel
- [x] Organiser la saisie par équipement avec navigation précédent/suivant
- [x] Ajouter un résumé des équipements et critères restant à vérifier
- [x] Ajouter des boutons de statut plus grands et adaptés au terrain
- [x] Permettre de marquer rapidement un équipement comme vérifié
- [x] Afficher l’état de sauvegarde automatique du contrôle
- [x] Améliorer la saisie mobile de la signature et des commentaires
- [x] Ajouter une confirmation avant la clôture du contrôle
- [x] Tester le nouveau parcours sur ordinateur et smartphone

## Parcours de contrôle guidé

- [x] Afficher une progression globale du contrôle
- [x] Naviguer équipement par équipement avec boutons précédent et suivant
- [x] Afficher les critères restant à compléter
- [x] Agrandir les boutons de statut pour la saisie sur le terrain
- [x] Ajouter un résumé des équipements vérifiés et à vérifier
- [x] Afficher clairement l’état de sauvegarde automatique
- [x] Améliorer la saisie mobile des commentaires et de la signature
- [x] Confirmer la clôture du contrôle avant enregistrement définitif
- [x] Tester le parcours sur ordinateur et smartphone

## Compléments d’expérience à valider

- [x] Afficher la liste des critères non renseignés pour l’équipement courant
- [x] Afficher un résumé explicite des équipements restant à vérifier
- [x] Améliorer réellement les zones de commentaire et de signature sur mobile
- [x] Capturer et vérifier le parcours de contrôle sur desktop après les changements

## Action rapide par équipement

- [x] Ajouter une action explicite « marquer cet équipement comme vérifié »
- [x] Appliquer rapidement le statut conforme aux cinq critères de l’équipement
- [x] Tester la sauvegarde automatique après cette action rapide
- [x] Vérifier l’action rapide sur desktop et mobile

## Preuve de l’action rapide

- [x] Ajouter un test de la logique qui marque les cinq critères comme conformes
- [x] Vérifier que l’action rapide déclenche le brouillon automatique
- [x] Documenter la vérification fonctionnelle du clic rapide

## Scénario vérifiable de sauvegarde rapide

- [x] Tester le payload de brouillon produit après validation rapide d’un équipement
- [x] Documenter le scénario clic, passage à conforme et sauvegarde automatique confirmée

## Résumé double vérifié

- [x] Afficher distinctement les équipements vérifiés et ceux restant à vérifier
- [x] Vérifier visuellement le résumé double sur le parcours mobile
