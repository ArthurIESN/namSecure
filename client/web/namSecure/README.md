## Installation
1. **Build the shared folder:**
```bash
cd shared
npm install
npx tsc
npm link
```

# Lancer le projet
```bash
cd client/web/namSecure
npm install
npm link '@namSecure/shared'
npm run dev
```