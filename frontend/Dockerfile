# Start your build stage
FROM node:26.3.1-alpine AS builder

WORKDIR /app

COPY proto/ ./proto/

COPY frontend/package*.json ./frontend/

WORKDIR /app/frontend

RUN npm ci

COPY frontend/ .

ARG NG_ENV=production

RUN npm run build -- --configuration=$NG_ENV


FROM node:26.3.1-alpine

WORKDIR /app

COPY --from=builder /app/frontend/dist/frontend ./dist/frontend

EXPOSE 4000

CMD ["node", "dist/frontend/server/server.mjs"]
