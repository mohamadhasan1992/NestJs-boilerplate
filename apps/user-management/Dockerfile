# Stage 1: Build
FROM node:18 AS builder
ARG NODE_ENV=local
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# Copy built application and install production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/proto ./dist/proto
RUN npm ci --only=production


CMD [ "node", "dist/apps/user-management/main" ]
