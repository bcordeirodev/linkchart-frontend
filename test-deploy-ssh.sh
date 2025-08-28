#!/bin/bash

# ===========================================
# TESTE DE DEPLOY VIA SSH
# Simula o que o GitHub Actions fará
# ===========================================

set -e

echo "🧪 Testando deploy via SSH..."
echo "=============================="

# Variáveis
SSH_HOST="134.209.33.182"
SSH_USER="deploy"
DEPLOY_PATH="/var/www/linkchart-frontend"

echo "📋 Configurações:"
echo "   Host: $SSH_HOST"
echo "   User: $SSH_USER"
echo "   Path: $DEPLOY_PATH"
echo ""

# Testar conexão SSH
echo "🔑 Testando conexão SSH..."
ssh -i ~/.ssh/id_rsa -o ConnectTimeout=10 $SSH_USER@$SSH_HOST "echo 'Conexão SSH OK'"
echo "✅ Conexão SSH funcionando"
echo ""

# Executar deploy
echo "🚀 Executando deploy..."
ssh -i ~/.ssh/id_rsa $SSH_USER@$SSH_HOST << EOF
set -e
echo "[$(date)] 🚀 Iniciando deploy via SSH..."

cd $DEPLOY_PATH

# Verificar repositório
echo "📋 Verificando repositório..."
git status --porcelain

# Fazer pull das últimas mudanças
echo "📥 Atualizando código..."
git fetch origin
git reset --hard origin/main

# Mostrar último commit
echo "📝 Último commit:"
git log -1 --oneline

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci --silent

# Build da aplicação
echo "🏗️ Fazendo build..."
npm run build

# Reiniciar serviço
echo "🔄 Reiniciando serviço..."
sudo systemctl restart linkchart-frontend

# Verificar status
echo "✅ Verificando status..."
sudo systemctl is-active linkchart-frontend

# Testar aplicação
echo "🧪 Testando aplicação..."
sleep 5
curl -f http://localhost/health > /dev/null && echo "Health check OK" || exit 1

echo "[$(date)] ✅ Deploy concluído com sucesso!"
EOF

echo ""
echo "✅ Teste de deploy concluído com sucesso!"
echo ""
echo "🌐 Aplicação disponível em: http://$SSH_HOST"
echo "🔍 Health check: http://$SSH_HOST/health"
