#!/bin/bash

# ===========================================
# SCRIPT PARA CONFIGURAR SECRETS NO GITHUB
# ===========================================

echo "🔐 Configuração de Secrets para GitHub Actions"
echo "=============================================="
echo ""

# Verificar se gh CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) não está instalado."
    echo "   Instale com: sudo apt install gh"
    echo "   Ou visite: https://cli.github.com/"
    exit 1
fi

# Verificar se está logado
if ! gh auth status &> /dev/null; then
    echo "🔑 Fazendo login no GitHub..."
    gh auth login
fi

# Obter informações
REPO_NAME=$(basename $(git remote get-url origin) .git)
REPO_OWNER=$(git remote get-url origin | sed -n 's/.*github.com[:/]\([^/]*\)\/.*/\1/p')
FULL_REPO="$REPO_OWNER/$REPO_NAME"

echo "📋 Repositório: $FULL_REPO"
echo ""

# Configurar secrets
echo "🔧 Configurando secrets..."

# SSH_PRIVATE_KEY
if [ -f ~/.ssh/id_rsa ]; then
    echo "📤 Configurando SSH_PRIVATE_KEY..."
    gh secret set SSH_PRIVATE_KEY --body "$(cat ~/.ssh/id_rsa)" --repo "$FULL_REPO"
    echo "✅ SSH_PRIVATE_KEY configurado"
else
    echo "❌ Chave SSH não encontrada em ~/.ssh/id_rsa"
    echo "   Gere uma chave com: ssh-keygen -t rsa -b 4096"
fi

# SSH_HOST
echo "📤 Configurando SSH_HOST..."
gh secret set SSH_HOST --body "134.209.33.182" --repo "$FULL_REPO"
echo "✅ SSH_HOST configurado"

# SSH_USER
echo "📤 Configurando SSH_USER..."
gh secret set SSH_USER --body "deploy" --repo "$FULL_REPO"
echo "✅ SSH_USER configurado"

# DEPLOY_PATH
echo "📤 Configurando DEPLOY_PATH..."
gh secret set DEPLOY_PATH --body "/var/www/linkchart-frontend" --repo "$FULL_REPO"
echo "✅ DEPLOY_PATH configurado"

echo ""
echo "✅ Todos os secrets foram configurados com sucesso!"
echo ""
echo "📋 Secrets configurados:"
echo "   - SSH_PRIVATE_KEY: ✅"
echo "   - SSH_HOST: 134.209.33.182"
echo "   - SSH_USER: deploy"
echo "   - DEPLOY_PATH: /var/www/linkchart-frontend"
echo ""
echo "🚀 Agora você pode fazer push para main e o deploy será automático!"
echo ""
echo "Para verificar os secrets:"
echo "   gh secret list --repo $FULL_REPO"
