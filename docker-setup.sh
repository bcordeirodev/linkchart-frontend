#!/bin/bash

# ==========================================
# SETUP DOCKER PARA FRONTEND + BACKEND
# ==========================================

echo "🚀 Link Chart - Setup Docker Environment"
echo "========================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
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

# Verificar se Docker está rodando
if ! docker info >/dev/null 2>&1; then
    log_error "Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

log_success "Docker está rodando!"

# Verificar se o backend está rodando
log_info "Verificando se o backend está rodando..."
if docker ps | grep -q "linkchartapi-dev"; then
    log_success "Container do backend encontrado!"
    BACKEND_RUNNING=true
else
    log_warning "Container do backend não encontrado."
    BACKEND_RUNNING=false
fi

# Oferecer opções
echo ""
echo "Escolha uma opção:"
echo "1) Rodar apenas o frontend (conectando ao backend existente)"
echo "2) Rodar frontend + backend completo"
echo "3) Setup inicial do ambiente completo"
echo "4) Verificar status dos containers"
echo "5) Parar todos os containers"

read -p "Digite sua escolha (1-5): " choice

case $choice in
    1)
        if [ "$BACKEND_RUNNING" = false ]; then
            log_error "Backend não está rodando. Inicie o backend primeiro ou escolha a opção 2."
            exit 1
        fi
        log_info "Iniciando apenas o frontend..."
        # Usar configuração local que conecta ao container do backend
        cp .env.local .env
        npm run dev
        ;;
        
    2)
        log_info "Iniciando frontend + backend completo..."
        docker compose up -d
        log_success "Ambiente iniciado!"
        echo ""
        log_info "🌐 Frontend: http://localhost:3000"
        log_info "🔗 Backend API: http://localhost:8000"
        log_info "📊 Backend Health: http://localhost:8000/health"
        ;;
        
    3)
        log_info "Fazendo setup inicial completo..."
        
        # Parar containers existentes
        log_info "Parando containers existentes..."
        docker compose down -v
        
        # Build das imagens
        log_info "Fazendo build das imagens..."
        docker compose build --no-cache
        
        # Iniciar containers
        log_info "Iniciando containers..."
        docker compose up -d
        
        # Aguardar containers ficarem prontos
        log_info "Aguardando containers ficarem prontos..."
        sleep 30
        
        # Verificar saúde dos containers
        log_info "Verificando saúde dos containers..."
        if curl -f http://localhost:8000/health >/dev/null 2>&1; then
            log_success "Backend está saudável!"
        else
            log_warning "Backend pode não estar completamente pronto ainda."
        fi
        
        if curl -f http://localhost:3000 >/dev/null 2>&1; then
            log_success "Frontend está acessível!"
        else
            log_warning "Frontend pode não estar completamente pronto ainda."
        fi
        
        log_success "Setup inicial concluído!"
        echo ""
        log_info "🌐 Frontend: http://localhost:3000"
        log_info "🔗 Backend API: http://localhost:8000"
        log_info "📊 Backend Health: http://localhost:8000/health"
        ;;
        
    4)
        log_info "Status dos containers:"
        echo ""
        docker ps --filter="name=linkchart" --format="table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        echo ""
        
        # Verificar conectividade
        log_info "Testando conectividade..."
        if curl -f http://localhost:8000/health >/dev/null 2>&1; then
            log_success "Backend: ✅ Acessível"
        else
            log_error "Backend: ❌ Não acessível"
        fi
        
        if curl -f http://localhost:3000 >/dev/null 2>&1; then
            log_success "Frontend: ✅ Acessível"
        else
            log_error "Frontend: ❌ Não acessível"
        fi
        ;;
        
    5)
        log_info "Parando todos os containers..."
        docker compose down
        log_success "Containers parados!"
        ;;
        
    *)
        log_error "Opção inválida!"
        exit 1
        ;;
esac

echo ""
log_info "✨ Operação concluída!"
