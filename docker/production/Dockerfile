# ===========================================
# DOCKERFILE OTIMIZADO PARA PRODUÇÃO
# Link Chart - Frontend Next.js 15
# ===========================================

# Usar imagem oficial do Node.js 22 Alpine (menor e mais segura)
FROM node:22-alpine AS base

# Instalar dependências necessárias para Alpine
RUN apk add --no-cache libc6-compat

# Definir diretório de trabalho
WORKDIR /app

# ===========================================
# STAGE 1: DEPENDENCIES
# ===========================================
FROM base AS deps

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

    # Instalar todas as dependências (incluindo devDependencies para build)
    # Usar npm install como fallback se npm ci falhar
    RUN npm ci --prefer-offline --no-audit --legacy-peer-deps --ignore-scripts --include=dev || \
        npm install --prefer-offline --no-audit --legacy-peer-deps --ignore-scripts --include=dev

# ===========================================
# STAGE 2: BUILD
# ===========================================
FROM base AS builder

WORKDIR /app

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar arquivos de configuração primeiro
COPY tsconfig.json next.config.mjs postcss.config.js tailwind.config.ts ./

# Copiar código fonte
COPY . .

# Definir variáveis de ambiente para build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV STANDALONE=true
ENV TAILWIND_MODE=build
ENV TAILWIND_DISABLE_OXIDE=1

# Executar build do Next.js
RUN npm run build

# ===========================================
# STAGE 3: RUNNER (PRODUÇÃO)
# ===========================================
FROM base AS runner

WORKDIR /app

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copiar arquivos públicos
COPY --from=builder /app/public ./public

# Copiar arquivos de build (standalone)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "server.js"]

# ===========================================
# LABELS PARA METADADOS
# ===========================================
LABEL maintainer="Link Chart Team"
LABEL version="1.0.0"
LABEL description="Link Chart Frontend - Next.js 15 Application"
LABEL org.opencontainers.image.source="https://github.com/your-username/link-chart"
