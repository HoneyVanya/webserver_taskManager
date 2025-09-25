# --- STAGE 1: The "Builder" ---
FROM node:18-alpine AS builder

RUN df -h

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install --omit=dev

# --- STAGE 2: The Final "Runner" ---
FROM node:18-alpine

RUN df -h

RUN apk add --no-cache curl

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/swagger.yaml ./swagger.yaml

EXPOSE 3000

CMD ["npm", "start"]