# Contrôle Cour Notre-Dame — transfert vers serveur

Cette archive contient l’application web du Collège Notre-Dame de Basse-Wavre, son code client et serveur, son schéma Drizzle, ses migrations SQL, ses tests Vitest et les fichiers de configuration nécessaires à une installation sur un serveur Node.js.

> **Important :** aucun secret, fichier `.env`, jeton OAuth, mot de passe de base de données ou clé S3 n’est inclus dans l’archive. Ces valeurs doivent être recréées directement dans l’environnement du nouveau serveur.

## Prérequis

Le serveur cible doit disposer de Node.js 22 ou d’une version LTS compatible, de pnpm, d’une base MySQL ou TiDB accessible par le serveur, d’un nom de domaine avec HTTPS recommandé, et d’un mécanisme de sauvegarde de la base de données. Le stockage des photos et des fichiers doit utiliser le service S3 compatible déjà prévu par l’application ou un équivalent correctement configuré.

| Élément | Valeur attendue |
|---|---|
| Runtime | Node.js 22 recommandé |
| Gestionnaire de paquets | pnpm |
| Base de données | MySQL ou TiDB |
| Serveur applicatif | Node.js, reverse proxy HTTPS recommandé |
| Port | Utiliser la variable `PORT`; ne pas le coder en dur |
| Stockage | S3 compatible pour les photos d’anomalies |
| Tâches périodiques | Service Heartbeat ou mécanisme équivalent capable d’appeler le callback sécurisé |

## Installation

Décompressez l’archive dans un dossier de déploiement, puis installez les dépendances :

```bash
pnpm install --frozen-lockfile
```

Créez ensuite les variables d’environnement dans le gestionnaire de secrets du serveur. Ne placez pas ces valeurs dans Git ni dans cette archive.

| Variable | Utilisation |
|---|---|
| `DATABASE_URL` | Connexion MySQL/TiDB de production |
| `JWT_SECRET` | Signature des sessions |
| `VITE_APP_ID` | Identifiant de l’application OAuth |
| `OAUTH_SERVER_URL` | Serveur OAuth Manus |
| `VITE_OAUTH_PORTAL_URL` | Portail de connexion OAuth côté client |
| `OWNER_OPEN_ID` | Identifiant OAuth du propriétaire autorisé |
| `OWNER_NAME` | Nom du propriétaire du projet |
| `BUILT_IN_FORGE_API_URL` | API serveur pour notifications, stockage et Heartbeat |
| `BUILT_IN_FORGE_API_KEY` | Clé serveur de l’API intégrée |
| `VITE_FRONTEND_FORGE_API_URL` | API intégrée accessible au frontend |
| `VITE_FRONTEND_FORGE_API_KEY` | Clé frontend correspondante |
| `VITE_ANALYTICS_ENDPOINT` | Endpoint analytique, si utilisé |
| `VITE_ANALYTICS_WEBSITE_ID` | Identifiant analytique, si utilisé |
| `VITE_APP_TITLE` | Titre affiché de l’application |
| `VITE_APP_LOGO` | Logo affiché, si configuré |

Les variables liées au stockage S3 doivent également être renseignées selon l’implémentation de stockage du serveur cible. Vérifiez le fichier `server/storage.ts` et le helper de stockage fourni par votre plateforme avant le premier démarrage.

## Base de données

Vérifiez d’abord que `DATABASE_URL` pointe vers la base de production. Les migrations SQL sont présentes dans `drizzle/`. Appliquez-les dans l’ordre croissant des fichiers, sans supprimer les données existantes :

```bash
pnpm drizzle-kit migrate
```

Si votre environnement ne permet pas l’exécution directe de Drizzle Kit, l’administrateur de base de données peut exécuter les fichiers SQL de `drizzle/` dans l’ordre. Une sauvegarde complète de la base doit être réalisée avant toute migration.

## Tests et compilation

Avant le démarrage en production, vérifiez le typage et la suite de tests :

```bash
pnpm check
pnpm test
```

La version transférée a été validée avec **34 tests Vitest passants** dans l’environnement de développement d’origine.

## Construction et démarrage

Construisez le frontend et le serveur regroupé :

```bash
pnpm build
```

Démarrez ensuite l’application :

```bash
NODE_ENV=production pnpm start
```

Le reverse proxy doit transmettre les requêtes HTTPS vers le port défini par `PORT`. Le serveur applicatif ne doit pas être exposé directement sur Internet sans HTTPS et sans une politique de sauvegarde adaptée.

## OAuth et URL publiques

Configurez l’URL publique du nouveau serveur dans le fournisseur OAuth et vérifiez que le callback OAuth attendu par l’application est autorisé. Testez ensuite une connexion avec un compte autorisé. Les comptes non approuvés doivent rester bloqués par le contrôle d’accès serveur.

## Rappel mensuel Heartbeat

La configuration du rappel est intégrée à l’application. Après publication et démarrage en production, ouvrez l’interface **Rappel mensuel**, définissez le jour et l’heure UTC, puis enregistrez. L’application crée ou met à jour le job Heartbeat, persiste son `scheduleCronTaskUid` et protège le callback :

```text
POST /api/scheduled/monthly-reminder
```

Le callback n’accepte pas un appel ordinaire. Il vérifie l’identité cron et le `taskUid`, recherche la configuration correspondante en base, puis envoie la notification uniquement si le rappel est activé. Après activation, vérifiez dans le tableau de bord Heartbeat que le job est actif et qu’une prochaine exécution est planifiée.

## Sauvegardes

Planifiez des sauvegardes automatiques de la base MySQL/TiDB et vérifiez régulièrement leur restauration sur une base de test. Les photos d’anomalies sont conservées dans le stockage objet : configurez sa réplication ou sa politique de sauvegarde indépendamment de la base. La base contient les métadonnées, les signatures, les journaux et les références vers les fichiers ; elle ne doit pas être considérée comme un remplacement du stockage objet.

## Mise à jour ultérieure

Pour une mise à jour, sauvegardez d’abord la base et le stockage objet, copiez la nouvelle archive, exécutez `pnpm install --frozen-lockfile`, appliquez les migrations, lancez `pnpm check` et `pnpm test`, puis reconstruisez avec `pnpm build`. Redémarrez enfin le service Node.js et vérifiez l’authentification, la création d’un brouillon, l’ajout d’une anomalie avec photo et l’accès aux rapports PDF.

## Fichiers exclus volontairement

Les dépendances `node_modules`, le dossier de build `dist`, les journaux `.manus-logs`, les métadonnées internes `.manus`, le dossier Git et tous les fichiers de secrets sont exclus de l’archive. Ils doivent être régénérés ou configurés sur le serveur cible.

## Dépannage rapide

| Symptôme | Vérification |
|---|---|
| L’application ne démarre pas | Vérifier `DATABASE_URL`, `JWT_SECRET`, `PORT` et les logs Node.js |
| Connexion impossible | Vérifier les URL et callbacks OAuth autorisés |
| PDF ou photo indisponible | Vérifier le stockage S3 et ses permissions |
| Rappel non reçu | Vérifier `scheduleCronTaskUid`, l’état Heartbeat et l’URL HTTPS du callback |
| Migration échouée | Sauvegarder la base, lire le SQL concerné et appliquer les migrations dans l’ordre |

Cette notice décrit le transfert technique. La configuration réelle du fournisseur d’hébergement, du DNS, du reverse proxy, de la base et du stockage reste à effectuer avec les identifiants propres au serveur cible.
