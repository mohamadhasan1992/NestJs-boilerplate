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
COPY apps/user-management/src/i18n /app/dist/user-management/i18n
COPY /proto /app/dist/proto


RUN npm install -g @nestjs/cli
RUN npm install --only=production
CMD [ "node", "dist/apps/user-management/main" ]