#!/bin/bash

# 🚀 SCRIPT DE DEPLOY LOCAL - LINK CHART FRONTEND
# Script para testar o deploy Docker localmente

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
echo "🚀 =================================="
echo "   LINK CHART - DEPLOY LOCAL"
echo "   Frontend Production Build"
echo "==================================${NC}"
echo

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    log_error "Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Verificar se docker compose está disponível
if ! docker compose version &> /dev/null; then
    log_error "docker compose não encontrado. Por favor, instale o Docker Compose."
    exit 1
fi

log_info "Iniciando deploy local..."

# 1. Limpeza de containers e imagens antigas
log_info "🧹 Limpando containers e imagens antigas..."
docker compose -f docker-compose.local.yml down --remove-orphans 2>/dev/null || true
docker system prune -f

# 2. Verificar arquivo .env.production
if [ ! -f ".env.production" ]; then
    log_warning "Arquivo .env.production não encontrado. Criando um básico..."
    cat > .env.production << EOF
VITE_BASE_URL=http://localhost
VITE_API_URL=http://localhost:8000
VITE_API_BASE_URL=http://localhost:8000
VITE_NODE_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUGGING=false
EOF
    log_success "Arquivo .env.production criado"
fi

# 3. Criar diretórios necessários
log_info "📁 Criando diretórios necessários..."
mkdir -p logs/nginx
mkdir -p ssl
chmod 755 logs/nginx

# 4. Build da imagem Docker
log_info "🏗️  Fazendo build da imagem Docker..."
docker build -f Dockerfile.prod -t linkcharts-frontend:local .

if [ $? -eq 0 ]; then
    log_success "Build da imagem concluído com sucesso"
else
    log_error "Falha no build da imagem Docker"
    exit 1
fi

# 5. Iniciar containers
log_info "🚀 Iniciando containers..."
docker compose -f docker-compose.local.yml up -d

if [ $? -eq 0 ]; then
    log_success "Containers iniciados com sucesso"
else
    log_error "Falha ao iniciar containers"
    exit 1
fi

# 6. Aguardar inicialização
log_info "⏳ Aguardando inicialização dos serviços..."
sleep 15

# 7. Health check
log_info "🏥 Verificando saúde da aplicação..."
max_attempts=12
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_success "Health check passou! Aplicação está funcionando."
        break
    else
        if [ $attempt -eq $max_attempts ]; then
            log_error "Health check falhou após $max_attempts tentativas"
            log_info "Mostrando logs dos containers..."
            docker compose -f docker-compose.local.yml logs --tail=50
            exit 1
        fi
        log_warning "Tentativa $attempt/$max_attempts falhou, tentando novamente em 5s..."
        sleep 5
        ((attempt++))
    fi
done

# 8. Testes básicos
log_info "🧪 Executando testes básicos..."

# Testar página principal
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    log_success "Página principal acessível"
else
    log_error "Página principal não acessível"
fi

# Testar assets estáticos
if curl -f http://localhost:3000/favicon.ico > /dev/null 2>&1; then
    log_success "Assets estáticos acessíveis"
else
    log_warning "Alguns assets podem não estar acessíveis"
fi

# 9. Informações finais
echo
log_success "🎉 Deploy local concluído com sucesso!"
echo
echo -e "${BLUE}📋 INFORMAÇÕES DO DEPLOY:${NC}"
echo "🌐 URL da aplicação: http://localhost:3000"
echo "🏥 Health check: http://localhost:3000/health"
echo "📊 Status Nginx: http://localhost:3000/nginx_status (apenas local)"
echo
echo -e "${BLUE}🐳 COMANDOS ÚTEIS:${NC}"
echo "📋 Ver logs: docker compose -f docker-compose.local.yml logs -f"
echo "🛑 Parar: docker compose -f docker-compose.local.yml down"
echo "🔄 Reiniciar: docker compose -f docker-compose.local.yml restart"
echo "🧹 Limpeza completa: docker compose -f docker-compose.local.yml down --volumes --remove-orphans"
echo

# 10. Mostrar status dos containers
log_info "📊 Status dos containers:"
docker compose -f docker-compose.local.yml ps

echo
log_success "✨ Deploy local finalizado! A aplicação está rodando em http://localhost:3000"
