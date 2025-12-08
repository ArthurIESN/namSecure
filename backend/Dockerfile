FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY setup.js ./

COPY prisma ./prisma

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm run setup && npm run dev"]
