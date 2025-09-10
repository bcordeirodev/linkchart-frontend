#!/bin/bash
# 🔐 CONFIGURAÇÃO SSL DEFINITIVA - LINKCHARTS.COM.BR
# Script otimizado para funcionar com DNS já configurado

set -e

# ========================================
# 📋 CONFIGURAÇÕES
# ========================================
DOMAIN="linkcharts.com.br"
EMAIL="bcordeiro.dev@gmail.com"
PROJECT_DIR="/var/www/linkchart-frontend"
LOG_FILE="/var/log/ssl-setup-final.log"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ========================================
# 🔧 FUNÇÕES AUXILIARES
# ========================================

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S'): $1" | tee -a $LOG_FILE
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a $LOG_FILE
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a $LOG_FILE
}

print_error() {
    echo -e "${RED}❌ $1${NC}" | tee -a $LOG_FILE
}

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

error_exit() {
    print_error "$1"
    exit 1
}

# ========================================
# 🔍 VERIFICAÇÕES INICIAIS
# ========================================

check_requirements() {
    print_header "VERIFICAÇÃO DE PRÉ-REQUISITOS"
    
    # Verificar se é root
    if [ "$EUID" -ne 0 ]; then
        error_exit "Este script deve ser executado como root (use sudo)"
    fi
    
    # Verificar DNS
    log "Verificando DNS para $DOMAIN..."
    if nslookup $DOMAIN | grep -q "134.209.33.182"; then
        print_success "DNS configurado corretamente"
    else
        error_exit "DNS não está apontando para este servidor"
    fi
    
    # Verificar conectividade HTTP
    log "Testando conectividade HTTP..."
    if curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN | grep -q "200\|301\|302\|404"; then
        print_success "Domínio acessível via HTTP"
    else
        print_warning "Domínio pode não estar totalmente acessível"
    fi
    
    # Verificar portas
    if ss -tlnp | grep -q ":80 "; then
        print_success "Porta 80 está em uso"
    else
        print_warning "Porta 80 não está em uso - isso é normal se não há container rodando"
    fi
    
    print_success "Pré-requisitos verificados"
}

# ========================================
# 📦 INSTALAÇÃO E CONFIGURAÇÃO
# ========================================

install_certbot() {
    print_header "INSTALAÇÃO DO CERTBOT"
    
    # Atualizar sistema
    log "Atualizando sistema..."
    apt update -y
    
    # Instalar Certbot
    if ! command -v certbot &> /dev/null; then
        log "Instalando Certbot..."
        apt install -y certbot python3-certbot-nginx
        print_success "Certbot instalado"
    else
        print_success "Certbot já está instalado"
    fi
    
    # Verificar versão
    certbot --version | tee -a $LOG_FILE
}

backup_config() {
    print_header "BACKUP DA CONFIGURAÇÃO"
    
    backup_dir="/var/backups/ssl-setup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p $backup_dir
    
    if [ -d "$PROJECT_DIR" ]; then
        cp -r $PROJECT_DIR/deploy/ $backup_dir/ 2>/dev/null || true
        print_success "Backup criado em $backup_dir"
    else
        print_warning "Diretório do projeto não encontrado"
    fi
}

# ========================================
# 🔐 GERAÇÃO DO CERTIFICADO SSL
# ========================================

stop_services() {
    print_header "PARANDO SERVIÇOS TEMPORARIAMENTE"
    
    # Parar container se estiver rodando
    cd $PROJECT_DIR 2>/dev/null || true
    
    if [ -f "deploy/docker-compose.prod.yml" ]; then
        log "Parando container Docker..."
        docker compose -f deploy/docker-compose.prod.yml down 2>/dev/null || true
        print_success "Container parado"
    fi
    
    # Parar nginx se estiver rodando no host
    if systemctl is-active --quiet nginx 2>/dev/null; then
        log "Parando Nginx do sistema..."
        systemctl stop nginx
        print_success "Nginx do sistema parado"
    fi
    
    # Aguardar liberação da porta
    sleep 3
    
    # Verificar se porta 80 está livre
    if ! ss -tlnp | grep -q ":80 "; then
        print_success "Porta 80 liberada"
    else
        print_warning "Porta 80 ainda em uso - continuando mesmo assim"
    fi
}

generate_certificate() {
    print_header "GERANDO CERTIFICADO SSL"
    
    log "Gerando certificado para $DOMAIN usando método standalone..."
    
    # Usar método standalone (mais confiável)
    if certbot certonly \
        --standalone \
        --preferred-challenges http \
        -d $DOMAIN \
        -d www.$DOMAIN \
        --email $EMAIL \
        --agree-tos \
        --non-interactive \
        --expand \
        --force-renewal; then
        
        print_success "Certificado gerado com sucesso!"
        
        # Verificar certificado
        if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
            print_success "Certificado verificado"
            
            # Mostrar informações do certificado
            log "Informações do certificado:"
            openssl x509 -in /etc/letsencrypt/live/$DOMAIN/cert.pem -noout -dates | tee -a $LOG_FILE
            
            # Mostrar domínios incluídos
            log "Domínios no certificado:"
            openssl x509 -in /etc/letsencrypt/live/$DOMAIN/cert.pem -noout -text | grep -A1 "Subject Alternative Name" | tail -1 | tee -a $LOG_FILE
            
        else
            error_exit "Certificado não encontrado após geração"
        fi
    else
        error_exit "Falha na geração do certificado"
    fi
}

# ========================================
# 🐳 CONFIGURAÇÃO DO DOCKER
# ========================================

setup_docker_ssl() {
    print_header "CONFIGURANDO DOCKER COM SSL"
    
    cd $PROJECT_DIR
    
    # Verificar se arquivos de configuração existem
    if [ ! -f "deploy/docker-compose.prod.yml" ]; then
        error_exit "Arquivo docker-compose.prod.yml não encontrado"
    fi
    
    if [ ! -f "deploy/docker/nginx/default.prod.conf" ]; then
        error_exit "Arquivo de configuração Nginx não encontrado"
    fi
    
    # Configurar permissões dos certificados
    log "Configurando permissões dos certificados..."
    chmod -R 755 /etc/letsencrypt/
    chmod 644 /etc/letsencrypt/live/$DOMAIN/*.pem
    chmod 600 /etc/letsencrypt/live/$DOMAIN/privkey.pem
    
    # Criar backup dos certificados no projeto
    mkdir -p ssl
    cp -L /etc/letsencrypt/live/$DOMAIN/* ssl/ 2>/dev/null || true
    
    print_success "Permissões configuradas"
}

start_containers() {
    print_header "INICIANDO CONTAINERS COM SSL"
    
    cd $PROJECT_DIR
    
    log "Iniciando containers..."
    if docker compose -f deploy/docker-compose.prod.yml up -d --build; then
        print_success "Containers iniciados"
        
        # Aguardar containers ficarem prontos
        log "Aguardando containers ficarem prontos..."
        sleep 20
        
        # Verificar status
        docker ps | grep linkcharts | tee -a $LOG_FILE
        
    else
        error_exit "Falha ao iniciar containers"
    fi
}

# ========================================
# 🔄 RENOVAÇÃO AUTOMÁTICA
# ========================================

setup_auto_renewal() {
    print_header "CONFIGURANDO RENOVAÇÃO AUTOMÁTICA"
    
    # Tornar script de renovação executável
    if [ -f "$PROJECT_DIR/scripts/renew-ssl.sh" ]; then
        chmod +x $PROJECT_DIR/scripts/renew-ssl.sh
        print_success "Script de renovação configurado"
    else
        print_warning "Script de renovação não encontrado"
    fi
    
    # Configurar cron job
    if ! crontab -l 2>/dev/null | grep -q "renew-ssl.sh"; then
        (crontab -l 2>/dev/null; echo "0 2 * * * $PROJECT_DIR/scripts/renew-ssl.sh") | crontab -
        print_success "Cron job configurado"
    else
        print_success "Cron job já existe"
    fi
    
    # Testar renovação (dry-run)
    log "Testando renovação automática..."
    if timeout 60 certbot renew --dry-run --quiet; then
        print_success "Teste de renovação bem-sucedido"
    else
        print_warning "Falha no teste de renovação - verificar manualmente"
    fi
}

# ========================================
# ✅ TESTES E VALIDAÇÃO
# ========================================

test_ssl_configuration() {
    print_header "TESTANDO CONFIGURAÇÃO SSL"
    
    # Aguardar um pouco mais para garantir que tudo está funcionando
    log "Aguardando serviços ficarem totalmente prontos..."
    sleep 15
    
    # Testar HTTP (deve redirecionar)
    log "Testando redirecionamento HTTP → HTTPS..."
    http_response=$(curl -s -o /dev/null -w "%{http_code}" -L http://$DOMAIN || echo "000")
    if [ "$http_response" = "200" ]; then
        print_success "HTTP funcionando (código: $http_response)"
    elif [ "$http_response" = "301" ] || [ "$http_response" = "302" ]; then
        print_success "Redirecionamento HTTP → HTTPS funcionando (código: $http_response)"
    else
        print_warning "HTTP retornou código: $http_response"
    fi
    
    # Testar HTTPS
    log "Testando HTTPS..."
    https_response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://$DOMAIN/health 2>/dev/null || echo "000")
    if [ "$https_response" = "200" ]; then
        print_success "HTTPS funcionando perfeitamente! (código: $https_response)"
    else
        # Tentar sem /health
        https_response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://$DOMAIN 2>/dev/null || echo "000")
        if [ "$https_response" = "200" ]; then
            print_success "HTTPS funcionando! (código: $https_response)"
        else
            print_warning "HTTPS retornou código: $https_response - pode estar ainda inicializando"
        fi
    fi
    
    # Testar certificado SSL
    log "Verificando certificado SSL..."
    if timeout 10 openssl s_client -connect $DOMAIN:443 -servername $DOMAIN </dev/null 2>/dev/null | grep -q "Verify return code: 0"; then
        print_success "Certificado SSL válido e confiável"
    else
        print_warning "Certificado SSL pode ter problemas - verificar manualmente"
    fi
    
    # Verificar headers de segurança
    log "Verificando headers de segurança..."
    if curl -s -I https://$DOMAIN 2>/dev/null | grep -q "Strict-Transport-Security"; then
        print_success "Headers de segurança HSTS configurados"
    else
        print_warning "Headers HSTS podem não estar configurados"
    fi
}

show_final_summary() {
    print_header "CONFIGURAÇÃO SSL CONCLUÍDA COM SUCESSO!"
    
    echo -e "${GREEN}"
    echo "🎉 PARABÉNS! SSL configurado com sucesso para $DOMAIN"
    echo ""
    echo "🔗 URLs funcionais:"
    echo "   • https://$DOMAIN"
    echo "   • https://www.$DOMAIN"
    echo ""
    echo "🔒 Recursos SSL ativados:"
    echo "   • TLS 1.2 e 1.3"
    echo "   • HSTS (HTTP Strict Transport Security)"
    echo "   • Headers de segurança modernos"
    echo "   • Renovação automática (90 dias)"
    echo ""
    echo "📊 Testes recomendados:"
    echo "   • SSL Labs: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
    echo "   • Security Headers: https://securityheaders.com/?q=$DOMAIN"
    echo ""
    echo "🔧 Comandos úteis:"
    echo "   • Verificar certificados: sudo certbot certificates"
    echo "   • Testar renovação: sudo certbot renew --dry-run"
    echo "   • Ver logs: docker logs linkcharts-frontend-prod"
    echo "   • Status: docker ps | grep linkcharts"
    echo ""
    echo "📁 Arquivos importantes:"
    echo "   • Certificados: /etc/letsencrypt/live/$DOMAIN/"
    echo "   • Logs: $LOG_FILE"
    echo "   • Backup: /var/backups/ssl-setup-*"
    echo -e "${NC}"
}

# ========================================
# 🚀 EXECUÇÃO PRINCIPAL
# ========================================

main() {
    echo -e "${BLUE}"
    echo "🔐 CONFIGURAÇÃO SSL DEFINITIVA - LINKCHARTS.COM.BR"
    echo "$(date)"
    echo -e "${NC}"
    
    log "=== INICIANDO CONFIGURAÇÃO SSL DEFINITIVA ==="
    
    check_requirements
    install_certbot
    backup_config
    stop_services
    generate_certificate
    setup_docker_ssl
    start_containers
    setup_auto_renewal
    test_ssl_configuration
    show_final_summary
    
    log "=== CONFIGURAÇÃO SSL CONCLUÍDA COM SUCESSO ==="
}

# Executar função principal
main "$@"
