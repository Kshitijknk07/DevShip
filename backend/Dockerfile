# Stage 1: Build
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run
FROM node:18-slim

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

RUN npm install --only=production

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

CMD ["node", "dist/server.js"]