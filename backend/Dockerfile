FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY . .

RUN npm run build

RUN mkdir -p /app/img

EXPOSE 3000

CMD ["sh", "-c", "sleep 5 && npm run createDB && sleep 2 && npm run setup && npm run dev"]
