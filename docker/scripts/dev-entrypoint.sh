#!/bin/bash

# ===========================================
# ENTRYPOINT SCRIPT - DESENVOLVIMENTO FRONTEND
# ===========================================

set -e

echo "🛠️  Starting LinkChart Frontend - Development Mode"
echo "=================================================="

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Verificar se .env.local existe
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found, copying from .env.development"
    cp .env.development .env.local 2>/dev/null || true
fi

# Limpar cache se necessário
if [ "$CLEAR_CACHE" = "true" ]; then
    echo "🧹 Clearing Next.js cache..."
    rm -rf .next/cache
fi

# Verificar conectividade com backend
echo "🔍 Testing backend connectivity..."
BACKEND_URL="${NEXT_PUBLIC_API_URL:-http://localhost}"
if curl -f --connect-timeout 5 --max-time 15 "${BACKEND_URL}/health" > /dev/null 2>&1; then
    echo "✅ Backend is reachable at ${BACKEND_URL}"
else
    echo "⚠️  Warning: Backend not reachable at ${BACKEND_URL}"
    echo "   Make sure your backend is running"
fi

# Informações do sistema
echo "📊 Development Information:"
echo "   Node.js version: $(node --version)"
echo "   NPM version: $(npm --version)"
echo "   Environment: ${NODE_ENV:-development}"
echo "   API URL: ${NEXT_PUBLIC_API_URL:-http://localhost}"
echo "   Port: ${PORT:-3000}"

echo "🎯 Starting Next.js development server..."
echo "=================================================="

# Executar aplicação
exec "$@"
