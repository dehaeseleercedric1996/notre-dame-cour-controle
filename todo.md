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

## Gestion personnalisée des critères

- [x] Créer un modèle de critères personnalisables
- [x] Permettre d’ajouter un critère
- [x] Permettre de modifier un critère
- [x] Permettre de réordonner les critères
- [x] Permettre d’archiver et restaurer un critère
- [x] Restreindre la gestion aux membres autorisés
- [x] Préserver les critères utilisés dans les contrôles historiques
- [x] Adapter le formulaire de contrôle aux critères actifs
- [x] Adapter les exports PDF aux critères du rapport
- [x] Ajouter les tests de gestion et de conservation des critères

## Export historique des critères

- [x] Utiliser explicitement les critères présents dans les lignes du rapport pour le PDF
- [x] Tester un critère renommé ou archivé conservé dans la représentation historique

## Repérage visuel des critères récents

- [x] Définir les seuils de récence pour les badges Nouveau et Modifié
- [x] Exposer les dates de création et de dernière modification des critères
- [x] Ajouter le badge Nouveau avec un code couleur dédié
- [x] Ajouter le badge Modifié avec un code couleur dédié
- [x] Vérifier que les badges disparaissent après la période de récence
- [x] Tester les règles de récence et l’affichage responsive

## Améliorations opérationnelles demandées

- [x] Ajouter la prise et l’association de photos aux anomalies
- [x] Ajouter un suivi d’anomalies avec statut, responsable et échéance
- [x] Ajouter les actions correctives et leur clôture
- [x] Ajouter les notifications ou rappels mensuels
- [x] Ajouter l’historique détaillé des modifications par utilisateur et date
- [x] Ajouter un filtre des critères récents
- [x] Ajouter la fiche détaillée de chaque équipement
- [x] Ajouter les statistiques annuelles de conformité et d’anomalies
- [x] Ajouter une validation finale en deux étapes avant clôture
- [x] Tester les nouvelles fonctions et l’affichage responsive

## État de livraison des améliorations

- [x] Ajouter la prise et l’association de photos aux anomalies
- [x] Ajouter un suivi d’anomalies avec statut, responsable et échéance
- [x] Ajouter les actions correctives et leur clôture
- [x] Ajouter l’interface de configuration des rappels mensuels
- [x] Ajouter l’endpoint sécurisé de rappel périodique
- [x] Ajouter l’historique détaillé des modifications signées
- [x] Ajouter un filtre des critères récents
- [x] Ajouter la fiche détaillée de chaque équipement
- [x] Ajouter les statistiques annuelles de conformité et d’anomalies
- [x] Conserver la validation finale en deux étapes avant clôture
- [x] Tester les nouvelles fonctions et l’affichage responsive
- [x] Préparer l’activation du job périodique de rappel après publication de l’application (configuration et endpoint prêts)

## Correctifs avant livraison enrichie

- [x] Afficher dans la liste des anomalies le responsable, l’échéance et le statut
- [x] Permettre l’édition complète du responsable et de l’échéance d’une anomalie
- [x] Préparer la création et la configuration du job périodique réel du rappel mensuel en production (création déclenchée depuis l’interface après publication)
- [x] Ajouter des tests Vitest dédiés aux anomalies, rappels, audit et statistiques
- [x] Revalider les parcours responsive après ces correctifs

## Derniers écarts à corriger avant checkpoint

- [x] Remplacer la saisie d’ID responsable par une sélection de membres autorisés avec affichage du nom
- [x] Permettre l’édition du responsable et de l’échéance pour tous les états pertinents d’une anomalie
- [x] Ajouter des tests Vitest pour les mutations anomalies, la configuration Heartbeat et le callback mensuel
- [x] Capturer une vérification responsive ciblée du panneau des anomalies en création et édition

## Ajustements finaux issus de la revue

- [x] Précharger la résolution existante lors de l’édition et permettre la mise à jour responsable/échéance d’une anomalie résolue sans ressaisie obligatoire
- [x] Capturer une vérification responsive ciblée du panneau des anomalies en création et édition sur desktop et mobile

- [x] Capturer une preuve responsive ciblée du panneau des anomalies avec les champs responsable, échéance et résolution clairement visibles

## Publication GitHub

- [ ] Créer un dépôt GitHub privé et y publier le projet sans secrets ni dépendances générées
- [ ] Vérifier le contenu publié et fournir le lien du dépôt
