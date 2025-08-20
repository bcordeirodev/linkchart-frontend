#!/bin/bash

# Script de Build para Produção
# Otimiza o build do Next.js para produção

set -e

echo "🚀 Iniciando build de produção..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: package.json não encontrado. Execute este script na raiz do projeto front-end."
    exit 1
fi

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf .next
rm -rf out

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Verificar variáveis de ambiente
echo "🔧 Verificando configurações de ambiente..."
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado. Copiando .env.example..."
    cp .env.example .env
    echo "📝 Configure as variáveis de ambiente no arquivo .env antes de fazer deploy."
fi

# Build de produção
echo "🔨 Executando build de produção..."
NODE_ENV=production npm run build

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    
    # Estatísticas do build
    echo "📊 Estatísticas do build:"
    du -sh .next
    
    # Verificar se há warnings
    if grep -q "Warning" .next/build-manifest.json 2>/dev/null; then
        echo "⚠️  Build concluído com warnings. Verifique os logs acima."
    else
        echo "🎉 Build limpo sem warnings!"
    fi
    
    # Sugestões para deploy
    echo ""
    echo "🚀 Próximos passos para deploy:"
    echo "1. Configure as variáveis de ambiente em produção"
    echo "2. Configure o servidor web (nginx, Apache, etc.)"
    echo "3. Configure SSL/TLS"
    echo "4. Configure monitoramento (Sentry, etc.)"
    echo "5. Configure CDN se necessário"
    
else
    echo "❌ Build falhou!"
    exit 1
fi

echo "✨ Script concluído!"
