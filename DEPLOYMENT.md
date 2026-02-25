# Guide de déploiement – KNG Advising

Ce guide décrit comment héberger le site en ligne (frontend + backend + base de données).

---

## Option 1 : PythonAnywhere (recommandé – gratuit)

[PythonAnywhere](https://www.pythonanywhere.com) permet d'héberger Django + React sur un seul domaine, idéal pour ce projet.

### Prérequis
- Compte [PythonAnywhere](https://www.pythonanywhere.com) (gratuit)
- Projet poussé sur **GitHub**

### Étapes

#### 1. Build du frontend en local

```bash
cd /home/clara/Téléchargements/KNGADVISORING/frontend
npm ci
# Pas de VITE_API_BASE : on utilise /api (même domaine = pas de CORS)
npm run build
```

Le dossier `frontend/dist/` est créé. **PythonAnywhere gratuit n'a pas Node.js** – tu dois build en local et inclure `frontend/dist/` dans Git (ou le copier manuellement).

#### 2. Pousser sur GitHub (inclure le build frontend)

```bash
cd /home/clara/Téléchargements/KNGADVISORING
git add .
git add -f frontend/dist
git commit -m "Deploy PythonAnywhere: backend + frontend"
git push origin main
```

`git add -f frontend/dist` force l’ajout du build pour PythonAnywhere (gratuit, pas de Node.js).

#### 3. Sur PythonAnywhere

1. Créer un compte sur [pythonanywhere.com](https://www.pythonanywhere.com)
2. **Dashboard** → **Web** → **Add a new web app** → **Manual configuration** (pas Flask)
3. **Code** : **Source code** = `https://github.com/clara237/KNGADVISORING.git`, **Working directory** = `/home/TON_USERNAME/KNGADVISORING`
4. **Virtualenv** : créer un venv puis :
   ```bash
   cd /home/TON_USERNAME
   python3 -m venv KNGADVISORING_venv
   source KNGADVISORING_venv/bin/activate
   pip install -r KNGADVISORING/backend/requirements.txt
   ```
5. **WSGI** : éditer le fichier WSGI (ex. `/var/www/TON_USERNAME_pythonanywhere_com_wsgi.py`) :
   ```python
   import sys
   import os
   path = '/home/TON_USERNAME/KNGADVISORING/backend'
   if path not in sys.path:
       sys.path.insert(0, path)
   os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'
   os.environ['DJANGO_DEBUG'] = 'false'
   from django.core.wsgi import get_wsgi_application
   application = get_wsgi_application()
   ```
6. **Static files** (Web → Static files) :
   - URL `/static/` → `/home/TON_USERNAME/KNGADVISORING/backend/staticfiles`
   - URL `/assets/` → `/home/TON_USERNAME/KNGADVISORING/frontend/dist/assets`
7. **Bash** :
   ```bash
   cd /home/TON_USERNAME/KNGADVISORING
   git pull
   # Si frontend/dist n'est pas dans Git : build en local puis rsync/scp, ou utilise un plan PythonAnywhere avec Node
   cd backend
   python manage.py migrate
   python manage.py collectstatic --noinput
   python manage.py createsuperuser
   ```
8. **Reload** l'app web (bouton vert)

Le site sera disponible sur `https://TON_USERNAME.pythonanywhere.com` (frontend + API + admin).

---

## Option 2 : Render (gratuit)

[Render](https://render.com) propose un plan gratuit adapté à ce projet.

### Prérequis
- Compte [Render](https://render.com)
- Projet poussé sur **GitHub** ou **GitLab**

### Étapes

#### 1. Vérifier le dépôt Git (déjà fait dans ton cas)

Si ce n’est pas déjà fait :

```bash
cd /home/clara/Téléchargements/KNGADVISORING
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/KNGADVISORING.git
git push -u origin main
```

Dans ton cas, **le compte Render est déjà créé et le dépôt est déjà connecté** : tu peux donc passer directement à l’étape suivante.

#### 2. Créer un Blueprint Render (déploiement automatique recommandé)

1. Aller sur [dashboard.render.com](https://dashboard.render.com)
2. **New** → **Blueprint**
3. Connecter le dépôt GitHub
4. Render détecte automatiquement le fichier `render.yaml` à la racine du projet
5. Cliquer sur **Apply** pour créer les services (API/backend, frontend, base de données si définie)

#### 3. Configurer les variables d’environnement

**API (backend)** – Onglet *Environment* du service `kngadvising-api` :

| Variable | Valeur | Notes |
|----------|--------|-------|
| `CORS_ALLOWED_ORIGINS` | `https://VOTRE-FRONTEND.onrender.com` | URL du frontend une fois déployé |
| `EMAIL_HOST`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` | (optionnel) | Pour les emails réels |

**Frontend** – Onglet *Environment* du service `kngadvising` :

| Variable | Valeur | Notes |
|----------|--------|-------|
| `VITE_API_BASE` | `https://kngadvising-api.onrender.com/api` | URL de l’API |

**Ordre** : déployer d’abord le backend, récupérer son URL, puis renseigner `VITE_API_BASE` et `CORS_ALLOWED_ORIGINS`, puis redéployer si besoin.

#### 4. Créer un superutilisateur (admin Django)

1. Ouvrir le service backend
2. **Shell** (onglet)
3. Exécuter : `python manage.py createsuperuser`

---

## Option 3 : Railway

[Railway](https://railway.app) offre environ 5 $/mois de crédit gratuit.

### Étapes

1. Créer un projet : [railway.app/new](https://railway.app/new)
2. **Add PostgreSQL**
3. **Add GitHub Repo** → sélectionner le dépôt
4. Créer 2 services :
   - **backend** : dossier `backend`, Dockerfile détecté
   - **frontend** : dossier `frontend`, type Static Site
5. Dans le service **backend**, ajouter :
   - `DATABASE_URL` → variable interne de la base PostgreSQL
   - `DJANGO_ALLOWED_HOSTS` → `*`
   - `CORS_ALLOWED_ORIGINS` → URL du frontend
6. Dans le service **frontend** :
   - Build : `npm install && npm run build`
   - Output : `dist`
   - `VITE_API_BASE` → URL publique de l’API (ex. `https://xxx.railway.app/api`)

---

## Option 4 : VPS (DigitalOcean, OVH, etc.)

Pour un serveur Linux classique avec Docker :

```bash
# Sur le serveur
git clone https://github.com/VOTRE_USERNAME/KNGADVISORING.git
cd KNGADVISORING
```

Créer un fichier `.env` avec :

```
DATABASE_URL=postgres://user:password@host:5432/kngadvising
DJANGO_SECRET_KEY=une-clé-secrète-longue-et-aléatoire
DJANGO_DEBUG=false
DJANGO_ALLOWED_HOSTS=votredomaine.com,www.votredomaine.com
CORS_ALLOWED_ORIGINS=https://votredomaine.com
ADMIN_EMAIL=h.gwet@tbs-education.org
```

Pour la base PostgreSQL :

```bash
# Exemple avec Docker
docker run -d --name postgres -e POSTGRES_DB=kngadvising -e POSTGRES_USER=user -e POSTGRES_PASSWORD=pass -p 5432:5432 postgres:16
```

Adapter `docker-compose.yml` pour utiliser PostgreSQL au lieu de SQLite (via `DATABASE_URL`), puis :

```bash
docker compose up -d
```

---

## Résumé des variables d’environnement

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `DATABASE_URL` | Production | URL PostgreSQL (`postgres://user:pass@host:5432/db`) |
| `DJANGO_SECRET_KEY` | Production | Clé secrète (générée automatiquement sur Render) |
| `DJANGO_ALLOWED_HOSTS` | Production | Domaines autorisés (séparés par des virgules) |
| `CORS_ALLOWED_ORIGINS` | Production | URL(s) du frontend (séparées par des virgules) |
| `VITE_API_BASE` | Production | URL de l’API (ex. `https://api.votresite.com/api`) |
| `ADMIN_EMAIL` | Non | Email de notification (défaut : h.gwet@tbs-education.org) |
| `EMAIL_HOST`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` | Non | SMTP pour l’envoi des emails |

---

## Domaine personnalisé

### Render
- **Settings** du service → **Custom Domains** → ajouter le domaine
- Configurer les DNS (CNAME vers l’URL Render)

### Railway
- **Settings** du service → **Domains** → ajouter un domaine
- Suivre les indications DNS

---

## Vérifications post-déploiement

1. Ouvrir l’URL du frontend et tester le formulaire de contact
2. Se connecter à l’admin Django : `https://API_URL/admin/`
3. Vérifier que les emails arrivent (ou les logs en mode console)
