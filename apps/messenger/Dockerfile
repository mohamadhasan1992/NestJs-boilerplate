# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./ 
RUN npm ci

# Copy all apps and build the entire project, including all services
COPY . .

# Build the project for production (this will create the dist/ folder)
RUN npm run build messenger

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# Copy only the built application and the proto files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/proto ./dist/proto
RUN npm ci --only=production

# Expose the port for the service
EXPOSE 2000

# Start the service (in this case, the gateway service)
CMD [ "node", "dist/apps/messenger/main" ]
