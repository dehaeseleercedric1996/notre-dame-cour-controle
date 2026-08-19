# Vérification de l’action rapide

## Scénario fonctionnel

Depuis `/controle`, le membre du personnel ouvre un équipement puis sélectionne **« Marquer comme vérifié »**. Les cinq critères — sécurité, fiabilité, stabilité, état général et propreté — passent immédiatement au statut **conforme**. Les commentaires déjà saisis sont conservés.

L’interface affiche ensuite la progression mise à jour et le message de confirmation. L’état de saisie devient « Enregistrement en cours… », puis « Modifications enregistrées » lorsque le brouillon automatique est accepté.

## Vérification automatisée

La suite Vitest couvre la transformation des cinq critères et l’envoi d’un brouillon contenant cinq lignes conformes à la procédure de sauvegarde. La compilation TypeScript et les **14 tests** passent.

## Vérification visuelle

Le bouton est visible dans le parcours guidé sur ordinateur et smartphone. Les captures responsive confirment que l’action reste accessible avant les cinq champs de critères et que la signature finale demeure disponible après la navigation.
