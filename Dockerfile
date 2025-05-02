# Usa ultima versão lts do node versão leve
FROM node:22.15-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .

FROM node:22.15-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","src/server.js"]