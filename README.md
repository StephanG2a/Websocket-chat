# Chat WebSocket - NestJS & Next.js

Application de chat en temps réel avec authentification et base de données PostgreSQL.

## Prérequis

- Node.js
- Docker
- npm

## Installation et démarrage étape par étape

### Étape 1 : Cloner le projet
```bash
git clone <repo-url>
cd Websocket-chat
```

### Étape 2 : Démarrer la base de données PostgreSQL
```bash
cd backend
docker-compose up -d
```
**Attendre** que PostgreSQL démarre complètement.

### Étape 3 : Installer les dépendances backend
```bash
npm install
```

### Étape 4 : Configurer Prisma et la base de données
```bash
# Générer le client Prisma
npx prisma generate

# Synchroniser la base de données
npx prisma db push
```

### Étape 5 : Démarrer le backend
```bash
npm run start:dev
```
**Laisser ce terminal ouvert.** Le backend démarre sur http://localhost:3001

### Étape 6 : Démarrer le frontend
```bash
cd Websocket-chat/frontend
npm install
npm run dev
```

Le frontend démarre sur :
- http://localhost:3000

## Technologies

- Backend: NestJS, Socket.IO, Prisma, PostgreSQL
- Frontend: Next.js, TypeScript, Tailwind CSS 