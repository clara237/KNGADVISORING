# Utilise Node pour builder le frontend
FROM node:20-alpine AS build

WORKDIR /app

# Copier les fichiers package.json et lock
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Builder pour production
RUN npm run build

# Étape finale : servir les fichiers statiques avec un serveur léger
FROM nginx:stable-alpine

# Copier les fichiers build dans nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la config nginx (optionnel : pour redirection SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]