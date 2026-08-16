# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package metadata and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application source code
COPY . .

# Expose port 8080 (or process.env.PORT)
EXPOSE 8080

# Environment defaults
ENV PORT=8080
ENV NODE_ENV=production

# Start Express server
CMD ["node", "server.js"]
