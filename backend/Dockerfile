FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm run dev"]
