# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app



# Install dependencies
RUN npm install -g @nestjs/cli
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# Copy built application and install production dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/env ./env
RUN npm ci --only=production

# Expose the port
EXPOSE 3000

CMD [ "node", "dist/main" ]

