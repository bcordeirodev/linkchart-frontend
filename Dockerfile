# ==========================================
# DOCKERFILE PARA FRONTEND NEXT.JS
# ==========================================

FROM node:22-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat git

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY .npmrc* ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# ==========================================
# ESTÁGIO DE DESENVOLVIMENTO
# ==========================================
FROM base AS development

# Instalar todas as dependências (incluindo dev)
RUN npm ci

# Copiar código fonte
COPY . .

# Expor porta do Next.js
EXPOSE 3000

# Comando padrão para desenvolvimento
CMD ["npm", "run", "dev"]

# ==========================================
# ESTÁGIO DE BUILD
# ==========================================
FROM base AS builder

# Instalar dependências de desenvolvimento
RUN npm ci

# Copiar código fonte
COPY . .

# Definir variáveis de ambiente para build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Fazer build da aplicação
RUN npm run build

# ==========================================
# ESTÁGIO DE PRODUÇÃO
# ==========================================
FROM base AS production

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copiar arquivos necessários do build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Trocar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Configurar variáveis de ambiente
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para produção
CMD ["node", "server.js"]
