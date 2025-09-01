#!/bin/bash

# 🚀 SCRIPT DE CONFIGURAÇÃO DE PRODUÇÃO
# Para ser executado no servidor 134.209.33.182

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de log
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Banner
echo -e "${BLUE}"
echo "🚀 ============================================"
echo "   LINK CHART - SETUP DE PRODUÇÃO"
echo "   Servidor: 134.209.33.182"
echo "   Diretório: /var/www/linkchart-frontend"
echo "============================================${NC}"
echo

# Verificar se está rodando como root ou com sudo
if [[ $EUID -eq 0 ]]; then
   log_warning "Executando como root. Algumas operações serão ajustadas."
   SUDO=""
else
   log_info "Executando como usuário normal. Usando sudo quando necessário."
   SUDO="sudo"
fi

# 1. Atualizar sistema
log_info "📦 Atualizando sistema..."
$SUDO apt update && $SUDO apt upgrade -y

# 2. Instalar dependências
log_info "🔧 Instalando dependências..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    log_info "Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    $SUDO sh get-docker.sh
    $SUDO usermod -aG docker $USER
    rm get-docker.sh
    log_success "Docker instalado"
else
    log_success "Docker já está instalado"
fi

# Verificar se Docker Compose está instalado
if ! docker compose version &> /dev/null; then
    log_info "Instalando Docker Compose..."
    $SUDO curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    $SUDO chmod +x /usr/local/bin/docker-compose
    log_success "Docker Compose instalado"
else
    log_success "Docker Compose já está instalado"
fi

# Instalar Git se necessário
if ! command -v git &> /dev/null; then
    log_info "Instalando Git..."
    $SUDO apt install git -y
    log_success "Git instalado"
else
    log_success "Git já está instalado"
fi

# Instalar curl se necessário
if ! command -v curl &> /dev/null; then
    log_info "Instalando curl..."
    $SUDO apt install curl -y
    log_success "curl instalado"
else
    log_success "curl já está instalado"
fi

# 3. Criar estrutura de diretórios
log_info "📁 Criando estrutura de diretórios..."
$SUDO mkdir -p /var/www/linkchart-frontend
$SUDO chown -R $USER:$USER /var/www/linkchart-frontend
cd /var/www/linkchart-frontend

# Criar diretórios necessários
mkdir -p logs/nginx
mkdir -p backups
mkdir -p ssl
chmod 755 logs/nginx

log_success "Estrutura de diretórios criada"

# 4. Clonar ou atualizar repositório
if [ -d ".git" ]; then
    log_info "📥 Atualizando repositório existente..."
    git pull origin main
else
    log_info "📥 Clonando repositório..."
    git clone https://github.com/bcordeirodev/linkchart-frontend.git .
fi

log_success "Repositório configurado"

# 5. Verificar arquivo .env.production
log_info "🔧 Verificando configurações de ambiente..."
if [ -f ".env.production" ]; then
    log_success "Arquivo .env.production encontrado"
    echo "Conteúdo atual:"
    cat .env.production
else
    log_warning "Arquivo .env.production não encontrado. Criando um básico..."
    cat > .env.production << EOF
# Base URL - Frontend IP Access
VITE_BASE_URL=http://134.209.33.182:3000

# Endpoint URL - Backend API (quando disponível)
VITE_API_URL=http://134.209.33.182:8000
VITE_API_BASE_URL=http://134.209.33.182:8000

# Auth BASE URL
VITE_AUTH_URL=http://134.209.33.182:3000
VITE_NEXTAUTH_URL=http://134.209.33.182:3000

# Environment
VITE_NODE_ENV=production

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUGGING=false
EOF
    log_success "Arquivo .env.production criado"
fi

# 6. Build da aplicação
log_info "🏗️  Fazendo build da aplicação..."
docker build -f Dockerfile.prod -t linkcharts-frontend:latest .

if [ $? -eq 0 ]; then
    log_success "Build concluído com sucesso"
else
    log_error "Falha no build da aplicação"
    exit 1
fi

# 7. Configurar firewall (se UFW estiver instalado)
if command -v ufw &> /dev/null; then
    log_info "🔥 Configurando firewall..."
    $SUDO ufw allow 3000/tcp
    log_success "Porta 3000 liberada no firewall"
fi

# 8. Iniciar aplicação
log_info "🚀 Iniciando aplicação..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true
docker compose -f docker-compose.prod.yml up -d

if [ $? -eq 0 ]; then
    log_success "Aplicação iniciada com sucesso"
else
    log_error "Falha ao iniciar aplicação"
    exit 1
fi

# 9. Aguardar inicialização
log_info "⏳ Aguardando inicialização..."
sleep 30

# 10. Testes de funcionamento
log_info "🧪 Executando testes..."

# Teste local
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    log_success "Health check local: OK"
else
    log_error "Health check local: FALHOU"
fi

# Teste página principal
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    log_success "Página principal: OK"
else
    log_error "Página principal: FALHOU"
fi

# 11. Criar scripts de monitoramento
log_info "📊 Criando scripts de monitoramento..."

# Script de monitoramento
cat > monitor.sh << 'EOF'
#!/bin/bash
URL="http://localhost:3000/health"
LOGFILE="/var/www/linkchart-frontend/logs/monitor.log"

if curl -f $URL > /dev/null 2>&1; then
    echo "$(date): ✅ Aplicação funcionando" >> $LOGFILE
else
    echo "$(date): ❌ Aplicação com problemas" >> $LOGFILE
    # Restart automático
    cd /var/www/linkchart-frontend
    docker compose -f docker-compose.prod.yml restart
fi
EOF

chmod +x monitor.sh

# Script de backup
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/www/linkchart-frontend/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup do código
tar -czf $BACKUP_DIR/code-$DATE.tar.gz --exclude=node_modules --exclude=dist --exclude=logs .

# Backup dos logs
if [ -d "logs" ]; then
    cp -r logs/ $BACKUP_DIR/logs-$DATE/
fi

# Manter apenas os 5 backups mais recentes
find $BACKUP_DIR -name "code-*.tar.gz" | sort -r | tail -n +6 | xargs rm -f
find $BACKUP_DIR -name "logs-*" -type d | sort -r | tail -n +6 | xargs rm -rf

echo "$(date): Backup criado: $DATE"
EOF

chmod +x backup.sh

log_success "Scripts de monitoramento criados"

# 12. Configurar crontab para monitoramento
log_info "⏰ Configurando monitoramento automático..."
(crontab -l 2>/dev/null; echo "*/5 * * * * /var/www/linkchart-frontend/monitor.sh") | crontab -
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/linkchart-frontend/backup.sh") | crontab -
log_success "Crontab configurado (monitoramento a cada 5min, backup diário às 2h)"

# 13. Mostrar status final
log_info "📊 Status final da aplicação:"
docker compose -f docker-compose.prod.yml ps

echo
log_success "🎉 SETUP DE PRODUÇÃO CONCLUÍDO!"
echo
echo -e "${BLUE}📋 INFORMAÇÕES DA APLICAÇÃO:${NC}"
echo "🌐 URL Externa: http://134.209.33.182:3000"
echo "🏥 Health Check: http://134.209.33.182:3000/health"
echo "📊 Status: docker compose -f docker-compose.prod.yml ps"
echo "📋 Logs: docker compose -f docker-compose.prod.yml logs -f"
echo
echo -e "${BLUE}🔧 PRÓXIMOS PASSOS:${NC}"
echo "1. Configurar secrets no GitHub:"
echo "   - PRODUCTION_HOST: 134.209.33.182"
echo "   - PRODUCTION_USER: $USER"
echo "   - PRODUCTION_SSH_KEY: (chave privada SSH)"
echo
echo "2. Testar acesso externo:"
echo "   curl -f http://134.209.33.182:3000/health"
echo
echo "3. Configurar deploy automático via GitHub Actions"
echo
log_success "✨ Aplicação rodando em http://134.209.33.182:3000"
