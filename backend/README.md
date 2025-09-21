# namSecure Backend API

API HTTP construite avec Node.js, Express et TypeScript.

## 🚀 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Copier le fichier d'environnement :
```bash
cp .env.example .env
```

3. Modifier les variables d'environnement dans le fichier `.env` selon vos besoins.

## 🛠️ Scripts disponibles

- `npm run dev` - Démarre le serveur en mode développement avec rechargement automatique
- `npm run build` - Compile le TypeScript en JavaScript
- `npm start` - Démarre le serveur en production (nécessite un build)
- `npm run watch` - Compile le TypeScript en mode watch
- `npm run clean` - Supprime le dossier de build

## 📁 Structure du projet

```
src/
├── controllers/     # Logique métier des routes
├── routes/         # Définition des routes Express
├── middleware/     # Middlewares personnalisés
├── types/          # Types TypeScript
├── utils/          # Fonctions utilitaires
├── config/         # Configuration de l'application
└── index.ts        # Point d'entrée de l'application
```

## 🔌 API Endpoints

### Santé de l'API
- `GET /` - Page d'accueil de l'API
- `GET /api/health` - Vérification de santé basique
- `GET /api/health/detailed` - Vérification de santé détaillée

### Utilisateurs
- `GET /api/users` - Récupérer tous les utilisateurs
- `GET /api/users/:id` - Récupérer un utilisateur par ID
- `POST /api/users` - Créer un nouvel utilisateur
- `PUT /api/users/:id` - Mettre à jour un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

## 🔧 Configuration

Le serveur utilise les variables d'environnement suivantes :

- `PORT` - Port du serveur (défaut: 3000)
- `NODE_ENV` - Environnement (development/production)

## 📝 Exemple d'utilisation

### Créer un utilisateur
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Doe",
    "prenom": "John",
    "email": "john.doe@example.com"
  }'
```

### Récupérer tous les utilisateurs
```bash
curl http://localhost:3000/api/users
```

## 🛡️ Sécurité

L'API utilise plusieurs middlewares de sécurité :
- **Helmet** - Protection contre les vulnérabilités communes
- **CORS** - Gestion des requêtes cross-origin
- **Morgan** - Logging des requêtes HTTP

## 🚧 Développement

Pour développer sur cette API :

1. Démarrez en mode développement : `npm run dev`
2. L'API sera accessible sur `http://localhost:3000`
3. Les modifications sont rechargées automatiquement

## 📦 Prochaines étapes

- [ ] Intégration d'une base de données (MongoDB/PostgreSQL)
- [ ] Authentification JWT
- [ ] Tests unitaires et d'intégration
- [ ] Documentation Swagger/OpenAPI
- [ ] Validation des données avec Joi/Yup
- [ ] Rate limiting
