# POC Dynamic Fields — Laravel / React / Oracle 19c

POC de champs dynamiques : un meta-modele administrable en React qui genere des formulaires dynamiques, avec stockage JSON dans Oracle 19c.

## Stack

- **Backend** : Laravel 13 + PHP 8.4 + yajra/laravel-oci8 v13
- **Frontend** : React 19 + TypeScript + Vite + Tailwind CSS v4
- **BDD** : Oracle Free 23ai (compatible 19c — voir section compatibilite)
- **Infra** : Docker Compose

## Pre-requis

- Docker Desktop
- ~3 Go d'espace disque (image Oracle Free 23ai slim)

## Lancement

```bash
# 1. Cloner et se placer dans le projet
cd poc-ocl19-dynamicfields

# 2. Lancer la stack
docker compose up --build
```

Le premier demarrage prend du temps :
- **Oracle** : ~30-60s (initialisation BDD)
- **Backend PHP** : build du Dockerfile avec Instant Client Oracle
- **Frontend** : `npm install` automatique

Suivre les logs pour voir quand tout est pret :
```bash
docker compose logs -f
```

Le backend attend automatiquement qu'Oracle soit healthy avant de demarrer (healthcheck).

### 3. Lancer les migrations Laravel

Une fois Oracle pret :

```bash
docker compose exec backend php artisan migrate
```

### 4. Acceder a l'application

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5173       |
| API      | http://localhost:8000/api   |
| Oracle   | localhost:1521 (Service: FREEPDB1) |

Credentials Oracle :
- **SYS** : `secret`
- **App** : `dynfields` / `dynfields`

## Utilisation

1. Ouvrir **http://localhost:5173**
2. Creer un template de formulaire (ex: "Contact")
3. Cliquer sur le template → definir des champs :
   - Nom (text, obligatoire)
   - Age (number)
   - Date de naissance (date)
   - Actif (boolean)
   - Service (select : IT / RH / Finance)
4. Sauvegarder les champs
5. Cliquer sur "Voir les donnees soumises" → "Nouveau formulaire"
6. Remplir le formulaire dynamique → Soumettre
7. Les donnees apparaissent dans le tableau avec des colonnes dynamiques

## API REST

```
GET/POST     /api/form-templates
GET/PUT/DEL  /api/form-templates/{id}
GET/POST     /api/form-templates/{id}/field-definitions
PUT          /api/form-templates/{id}/field-definitions/bulk
GET/PUT/DEL  /api/field-definitions/{id}
GET/POST     /api/form-templates/{id}/entities
GET/PUT/DEL  /api/entities/{id}
```

## Compatibilite Oracle 19c

Le POC tourne sur `gvenzl/oracle-free:23-slim` (Oracle 23ai Free) pour des raisons de support ARM natif. Toutes les fonctionnalites Oracle utilisees sont disponibles en Oracle 19c natif.

### Fonctionnalites Oracle utilisees

| Fonctionnalite | Utilisation dans le POC | Disponible en 19c |
|----------------|------------------------|-------------------|
| `IS JSON` (check constraint) | Contrainte sur les colonnes CLOB `data`, `options`, `validation_rules` pour garantir un JSON valide | Oui (depuis 12.1.0.2) |
| `CLOB` | Stockage des champs JSON (`entities.data`, `field_definitions.options`, `field_definitions.validation_rules`) | Oui |
| `GENERATED ALWAYS AS IDENTITY` | Colonnes `id` auto-incrementees (via `yajra/laravel-oci8` sequences) | Oui (depuis 12c) |
| `FOREIGN KEY` / `CASCADE DELETE` | Relations entre `form_templates`, `field_definitions`, `entities` | Oui |
| `TIMESTAMP` | Colonnes `created_at` / `updated_at` | Oui |
| OCI8 / PDO_OCI | Connexion PHP via Oracle Instant Client 23 (compatible 19c) | Oui |
| TNS / Service Name | Connexion au PDB via `service_name` | Oui |

### Fonctionnalites Oracle 23ai **non utilisees** (pour rester compatible 19c)

| Fonctionnalite 23ai | Alternative utilisee (compatible 19c) |
|----------------------|---------------------------------------|
| Type natif `JSON` | `CLOB` + contrainte `IS JSON` |
| JSON Relational Duality Views | Lecture/ecriture JSON via l'ORM (Eloquent) |
| `JSON_VALUE`, `JSON_QUERY`, `JSON_TABLE` | Non necessaires — le JSON est lu/ecrit en bloc via Eloquent, pas requete cote SQL |

### Migration vers Oracle 19c natif

Pour deployer sur un Oracle 19c en production, il suffit de :
1. Changer `DB_HOST` / `DB_PORT` / `DB_DATABASE` dans `.env`
2. Creer l'utilisateur `dynfields` avec les grants adequats
3. Lancer `php artisan migrate`

Aucune modification de code n'est necessaire.

## Arret

```bash
docker compose down          # arret simple (donnees Oracle preservees)
docker compose down -v       # arret + suppression du volume Oracle
```
