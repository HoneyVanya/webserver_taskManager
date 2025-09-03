# --- STAGE 1: The "Builder" ---
# We start with a full Node.js image that includes all the tools
# needed to install dependencies and compile our TypeScript.
FROM node:18-alpine AS builder

# Set the working directory inside the container.
WORKDIR /app

# Copy the package.json and package-lock.json files.
COPY package*.json ./
# Install all dependencies, including the devDependencies needed for the build.
RUN npm install

# Copy the rest of the application source code.
COPY . .

# Run our Prisma and TypeScript build commands.
RUN npx prisma generate
RUN npm run build

# --- STAGE 2: The Final "Runner" ---
# We start fresh with a slim Node.js image for the final product.
FROM node:18-alpine

WORKDIR /app

# We only copy the absolutely necessary files from the "builder" stage.
# This keeps our final image small and secure (no source code, no dev dependencies).
COPY --from=builder /app/package*.json ./
# We need to run a lean npm install for ONLY production dependencies.
RUN npm install --omit=dev
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/swagger.yaml ./swagger.yaml

# Expose the port the app will run on inside the container.
EXPOSE 3000

# The command to start the application when the container launches.
CMD ["npm", "start"]