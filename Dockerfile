FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json .npmrc ./
RUN npm ci --only=production && npm cache clean --force

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .npmrc ./
RUN npm ci
COPY . .
# IMPORTANTE: toda NEXT_PUBLIC_* lida pelo codigo precisa de um ARG AQUI.
# O Docker IGNORA silenciosamente qualquer --build-arg sem ARG correspondente —
# a variavel simplesmente compila vazia, sem erro nem aviso. Foi assim que os
# rotulos de conversao do Google Ads ficaram vazios em producao: estavam no
# .env.production (que o .dockerignore exclui) e nao tinham ARG aqui, entao o
# `send_to` do gtag saia como string vazia e NENHUMA conversao era registrada.
# Ao adicionar um `process.env.NEXT_PUBLIC_*` no codigo, adicione o ARG aqui e
# a build-arg em .github/workflows/release.yml.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_REDIRECT_URL
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_GOOGLE_ADS_ID
ARG NEXT_PUBLIC_ADSENSE_CLIENT
ARG NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
ARG NEXT_PUBLIC_SUBDOMAINS_ENABLED
ARG NEXT_PUBLIC_FARO_URL
ARG NEXT_PUBLIC_FARO_APP_NAME
ARG NEXT_PUBLIC_FARO_APP_VERSION
ARG NEXT_PUBLIC_FARO_ENVIRONMENT
ARG NEXT_PUBLIC_GADS_CONV_SHORTEN
ARG NEXT_PUBLIC_GADS_CONV_SIGNUP
ARG NEXT_PUBLIC_ADSENSE_SLOT_SHORTER_BELOW_FORM
ARG NEXT_PUBLIC_ADSENSE_SLOT_SHORTER_BETWEEN_SECTIONS
ARG NEXT_PUBLIC_ADSENSE_SLOT_ANALYTICS_ABOVE_CHARTS
ARG NEXT_PUBLIC_ADSENSE_SLOT_ANALYTICS_BELOW_CHARTS
# Intencionalmente NAO recebe valor no release.yml: vazio faz o ApiClient usar
# o proxy de rewrites do Next (ver src/lib/api/endpoints.ts). O ARG existe para
# manter o invariante "toda NEXT_PUBLIC_* lida pelo codigo tem ARG aqui".
ARG NEXT_PUBLIC_API_URL
ARG API_URL
ENV API_URL=$API_URL
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
