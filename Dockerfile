# --- STAGE 1: Dependencies ---
# Use Node.js v22-alpine for all stages
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Also copy the prisma schema, as it's needed for the generate step
COPY prisma ./prisma
RUN npm install
# Run generate in the deps stage to ensure the client is available for the builder
RUN npx prisma generate

# --- STAGE 2: Builder ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# The prisma client is now inside node_modules, so we just copy the schema
COPY prisma ./prisma
COPY . .
# We don't need to generate again, but we do need to build
RUN npm run build

# --- STAGE 3: Production Runner ---
FROM node:22-alpine AS runner
WORKDIR /app
# We only need production dependencies
COPY --from=deps /app/package.json ./package-lock.json ./
RUN npm install --omit=dev
# Copy the built code, prisma schema, AND the generated client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/swagger.yaml ./swagger.yaml

RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/healthz || exit 1

EXPOSE 3000
CMD ["npm", "start"]