#!/bin/bash

# ===========================================
# ENTRYPOINT SCRIPT - PRODUÇÃO FRONTEND
# ===========================================

set -e

echo "🚀 Starting LinkChart Frontend - Production Mode"
echo "================================================"

# Verificar variáveis de ambiente obrigatórias
required_vars=(
    "NODE_ENV"
    "NEXT_PUBLIC_API_URL"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: Required environment variable $var is not set"
        exit 1
    fi
done

echo "✅ Environment variables validated"

# Verificar se o build existe
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found. Make sure the build was successful."
    exit 1
fi

echo "✅ Build files validated"

# Verificar conectividade com backend
echo "🔍 Testing backend connectivity..."
if curl -f --connect-timeout 10 --max-time 30 "${NEXT_PUBLIC_API_URL}/health" > /dev/null 2>&1; then
    echo "✅ Backend is reachable"
else
    echo "⚠️  Warning: Backend not reachable at ${NEXT_PUBLIC_API_URL}"
    echo "   Application will start anyway, but API calls may fail"
fi

# Configurar permissões
echo "🔧 Setting up permissions..."
chown -R nextjs:nodejs /app/.next/cache 2>/dev/null || true
chmod -R 755 /app/.next/cache 2>/dev/null || true

echo "✅ Permissions configured"

# Informações do sistema
echo "📊 System Information:"
echo "   Node.js version: $(node --version)"
echo "   Environment: ${NODE_ENV}"
echo "   API URL: ${NEXT_PUBLIC_API_URL}"
echo "   Port: ${PORT:-3000}"
echo "   Memory limit: $(cat /sys/fs/cgroup/memory/memory.limit_in_bytes 2>/dev/null || echo 'Not available')"

echo "🎯 Starting Next.js server..."
echo "================================================"

# Executar aplicação
exec "$@"
