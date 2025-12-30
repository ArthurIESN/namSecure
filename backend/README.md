## Installation
1. **Build the shared folder:**
```bash
cd shared
npm install
npx tsc
npm link
```

# Lancer le projet  avec Docker
```bash
cd backend
docker-compose up
```

# Lancer le projet  sans Docker
```bash
cd backend
npm install
npm link '@namSecure/shared'
npm run createDB
npx prisma db pull
npx prisma generate
npm run dev
```


