# KNG Advising

Cabinet d'expertise spécialisé dans les sciences de gestion (Cameroun). Site vitrine avec formulaire de contact validé côté serveur.

## Structure du projet

```
KNGADVISORING/
├── frontend/          # Application React (Vite + TypeScript + shadcn/ui)
└── backend/           # API Django REST pour validation du formulaire
```

## Prérequis

- **Docker** et **Docker Compose**

## Lancement avec Docker

```bash
docker compose up --build
```

- Frontend : http://localhost:8080
- Backend API : http://localhost:8000/api/

Le proxy Vite redirige les requêtes `/api/*` vers le backend. La base de données SQLite est persistée dans un volume Docker.

## Installation en local (sans Docker)

Prérequis : Node.js 18+, Python 3.10+

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows : venv\Scripts\activate
pip install -r requirements.txt
mkdir -p data
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Le site est sur http://localhost:8080.

## API de contact

- **POST** `/api/contact/`  
  Corps JSON : `{ "nom", "email", "sujet", "message" }`  
  Les données sont enregistrées en base et un email est envoyé à l'admin (h.gwet@tbs-education.org).  
  Les champs texte sont automatiquement débarrassés des espaces superflus et
  la validation côté serveur garantit un nom propre (lettres, espaces,
  tirets, apostrophes) ainsi qu'une longueur minimale pour le message.

  Le projet intègre désormais des tests unitaires backend et frontend pour
  prévenir toute régression liée à l'envoi du formulaire.

  Le point de terminaison de contact a été marqué `@csrf_exempt` afin que
  les requêtes issues du dev‑server Vite (même proxyées) ne soient jamais rejetées
  à cause d’un jeton CSRF manquant. On a également désactivé les
  `SessionAuthentication` de DRF (`@authentication_classes([])`), sinon la
  présence d’un cookie de session déclenchait un contrôle CSRF avant même que
  `@csrf_exempt` ne soit consulté. L’API reste publique : la seule protection
  est la validation du formulaire.

### Configuration email (SMTP)

Sans configuration SMTP, les emails sont affichés dans les logs du conteneur backend (mode développement).

Pour envoyer les vrais emails en production, définir dans `docker-compose.yml` ou `.env` :

| Variable | Description |
|----------|-------------|
| `EMAIL_HOST` | Serveur SMTP (ex: smtp.gmail.com) |
| `EMAIL_PORT` | Port (souvent 587) |
| `EMAIL_USE_TLS` | true/false |
| `EMAIL_HOST_USER` | Login SMTP |
| `EMAIL_HOST_PASSWORD` | Mot de passe (ou mot de passe d'application Gmail) |

Le destinataire par défaut des notifications de contact a été changé pour
`kengni.clara03@gmail.com` via la variable d'environnement `ADMIN_EMAIL`.

> **Note CSRF :** lors du développement le frontend tourne sur 8080. Django doit
> connaître cette origine pour valider les requêtes POST cross‑origin. Le port est
> ajouté automatiquement à `CSRF_TRUSTED_ORIGINS` via les variables
> d'environnement (voir `backend/config/settings.py`). Si vous obtenez
> l'erreur « Origin checking failed », ajoutez `http://localhost:8080` à cet
> ensemble ou utilisez `CORS_ALLOW_CREDENTIALS=true` pour l'envoyer.

## Déploiement

Voir **[DEPLOYMENT.md](DEPLOYMENT.md)** pour héberger le site en ligne (Render, Railway, VPS).

## Technologies

### Frontend
- React 18, TypeScript
- Vite
- Tailwind CSS, shadcn/ui
- react-hook-form, zod

### Backend
- Django 5
- Django REST Framework
- django-cors-headers
