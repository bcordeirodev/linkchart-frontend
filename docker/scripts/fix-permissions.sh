#!/bin/bash

# ===========================================
# SCRIPT DE CORREÇÃO DE PERMISSÕES - FRONTEND
# ===========================================

set -e

echo "🔧 Fixing permissions for LinkChart Frontend"
echo "============================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the frontend directory."
    exit 1
fi

# Criar diretórios necessários
echo "📁 Creating necessary directories..."
mkdir -p .next/cache
mkdir -p .next/static
mkdir -p public/uploads
mkdir -p logs

# Configurar permissões para Next.js
echo "🔐 Setting up Next.js permissions..."

# Permissões para cache do Next.js
chmod -R 755 .next/ 2>/dev/null || true
chown -R nextjs:nodejs .next/ 2>/dev/null || true

# Permissões para arquivos estáticos
chmod -R 755 public/ 2>/dev/null || true
chown -R nextjs:nodejs public/ 2>/dev/null || true

# Permissões para logs
chmod -R 755 logs/ 2>/dev/null || true
chown -R nextjs:nodejs logs/ 2>/dev/null || true

# Permissões para node_modules (se existir)
if [ -d "node_modules" ]; then
    echo "📦 Setting node_modules permissions..."
    chmod -R 755 node_modules/ 2>/dev/null || true
    chown -R nextjs:nodejs node_modules/ 2>/dev/null || true
fi

# Permissões para arquivos de configuração
echo "⚙️  Setting config file permissions..."
chmod 644 package*.json 2>/dev/null || true
chmod 644 next.config.* 2>/dev/null || true
chmod 644 .env* 2>/dev/null || true

# Permissões para scripts
echo "📜 Setting script permissions..."
chmod +x docker/scripts/*.sh 2>/dev/null || true

# Verificação final
echo "✅ Verification:"
echo "   .next directory: $(ls -ld .next 2>/dev/null || echo 'Not found')"
echo "   public directory: $(ls -ld public 2>/dev/null || echo 'Not found')"
echo "   logs directory: $(ls -ld logs 2>/dev/null || echo 'Not found')"

# Teste de escrita
echo "🧪 Testing write permissions..."
if touch .next/test-write 2>/dev/null; then
    rm .next/test-write
    echo "✅ Write permissions OK"
else
    echo "⚠️  Warning: Write permissions may be insufficient"
fi

echo "🎉 Permissions setup completed!"
echo "============================================="
