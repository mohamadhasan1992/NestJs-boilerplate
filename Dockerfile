# Stage 1: Build
FROM node:18 AS builder
ARG NODE_ENV=local
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --only=production
RUN npm install -g @nestjs/cli
# EXPOSE 3000
# CMD ["node", "app/main"]
