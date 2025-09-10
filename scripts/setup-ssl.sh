#!/bin/bash
# 🔐 Script de configuração inicial SSL
# Link Chart - linkcharts.com.br

set -e

# ========================================
# 📋 CONFIGURAÇÕES
# ========================================
DOMAIN="linkcharts.com.br"
EMAIL="bcordeiro.dev@gmail.com"
PROJECT_DIR="/var/www/linkchart-frontend"
LOG_FILE="/var/log/ssl-setup.log"

# ========================================
# 🔧 FUNÇÕES AUXILIARES
# ========================================

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S'): $1" | tee -a $LOG_FILE
}

error_exit() {
    log "ERROR: $1"
    exit 1
}

check_requirements() {
    log "Verificando pré-requisitos..."
    
    # Verificar se é root
    if [ "$EUID" -ne 0 ]; then
        error_exit "Este script deve ser executado como root"
    fi
    
    # Verificar se o domínio está acessível
    if ! curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN | grep -q "200\|301\|302"; then
        log "AVISO: Domínio $DOMAIN pode não estar acessível via HTTP"
    fi
    
    # Verificar portas
    if ! ss -tlnp | grep -q ":80 "; then
        error_exit "Porta 80 não está aberta ou em uso"
    fi
    
    log "✅ Pré-requisitos verificados"
}

install_certbot() {
    log "Instalando Certbot..."
    
    # Atualizar sistema
    apt update
    
    # Instalar Certbot
    apt install -y certbot python3-certbot-nginx
    
    # Verificar instalação
    certbot --version || error_exit "Falha na instalação do Certbot"
    
    log "✅ Certbot instalado com sucesso"
}

backup_config() {
    log "Criando backup da configuração atual..."
    
    backup_dir="/var/backups/ssl-setup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p $backup_dir
    
    if [ -d "$PROJECT_DIR" ]; then
        cp -r $PROJECT_DIR/deploy/ $backup_dir/ 2>/dev/null || log "AVISO: Falha ao fazer backup do deploy"
    fi
    
    if [ -d "/etc/nginx" ]; then
        cp -r /etc/nginx/ $backup_dir/nginx-backup/ 2>/dev/null || log "AVISO: Falha ao fazer backup do nginx"
    fi
    
    log "✅ Backup criado em $backup_dir"
}

stop_containers() {
    log "Parando containers para liberação da porta 80..."
    
    cd $PROJECT_DIR
    
    if [ -f "deploy/docker-compose.prod.yml" ]; then
        docker compose -f deploy/docker-compose.prod.yml down || log "AVISO: Falha ao parar containers"
    fi
    
    # Aguardar liberação da porta
    sleep 5
    
    log "✅ Containers parados"
}

generate_certificate() {
    log "Gerando certificado SSL para $DOMAIN..."
    
    # Criar diretório webroot se não existir
    mkdir -p /var/www/html
    
    # Gerar certificado usando webroot
    if certbot certonly \
        --webroot \
        -w /var/www/html \
        -d $DOMAIN \
        -d www.$DOMAIN \
        --email $EMAIL \
        --agree-tos \
        --non-interactive \
        --expand; then
        
        log "✅ Certificado gerado com sucesso"
        
        # Verificar certificado
        if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
            log "✅ Certificado verificado em /etc/letsencrypt/live/$DOMAIN/"
            
            # Mostrar informações do certificado
            openssl x509 -in /etc/letsencrypt/live/$DOMAIN/cert.pem -noout -dates | tee -a $LOG_FILE
        else
            error_exit "Certificado não encontrado após geração"
        fi
    else
        error_exit "Falha na geração do certificado"
    fi
}

setup_permissions() {
    log "Configurando permissões SSL..."
    
    # Criar diretório SSL no projeto
    mkdir -p $PROJECT_DIR/ssl
    
    # Copiar certificados para o projeto (backup)
    if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
        cp -L /etc/letsencrypt/live/$DOMAIN/* $PROJECT_DIR/ssl/ 2>/dev/null || log "AVISO: Falha ao copiar certificados"
    fi
    
    # Configurar permissões
    chmod -R 755 /etc/letsencrypt/
    chmod -R 644 /etc/letsencrypt/live/$DOMAIN/
    chmod 600 /etc/letsencrypt/live/$DOMAIN/privkey.pem
    
    log "✅ Permissões configuradas"
}

start_containers() {
    log "Iniciando containers com SSL..."
    
    cd $PROJECT_DIR
    
    if [ -f "deploy/docker-compose.prod.yml" ]; then
        docker compose -f deploy/docker-compose.prod.yml up -d
        
        # Aguardar containers ficarem saudáveis
        log "Aguardando containers ficarem saudáveis..."
        sleep 15
        
        # Verificar status
        docker ps | grep linkcharts || log "AVISO: Container pode não estar rodando"
        
        log "✅ Containers iniciados"
    else
        log "AVISO: docker-compose.prod.yml não encontrado"
    fi
}

setup_auto_renewal() {
    log "Configurando renovação automática..."
    
    # Tornar script de renovação executável
    chmod +x $PROJECT_DIR/scripts/renew-ssl.sh
    
    # Adicionar ao crontab se não existir
    if ! crontab -l 2>/dev/null | grep -q "renew-ssl.sh"; then
        (crontab -l 2>/dev/null; echo "0 2 * * * $PROJECT_DIR/scripts/renew-ssl.sh") | crontab -
        log "✅ Cron job adicionado para renovação automática"
    else
        log "✅ Cron job já existe"
    fi
    
    # Testar renovação (dry-run)
    log "Testando renovação automática (dry-run)..."
    if certbot renew --dry-run; then
        log "✅ Teste de renovação bem-sucedido"
    else
        log "⚠️ Falha no teste de renovação. Verificar manualmente."
    fi
}

test_ssl() {
    log "Testando configuração SSL..."
    
    # Aguardar um pouco para o container estar pronto
    sleep 10
    
    # Testar HTTP (deve redirecionar)
    log "Testando redirecionamento HTTP → HTTPS..."
    http_response=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN || echo "000")
    if [ "$http_response" = "301" ] || [ "$http_response" = "302" ]; then
        log "✅ Redirecionamento HTTP funcionando (código: $http_response)"
    else
        log "⚠️ Redirecionamento HTTP pode não estar funcionando (código: $http_response)"
    fi
    
    # Testar HTTPS
    log "Testando conectividade HTTPS..."
    https_response=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/health || echo "000")
    if [ "$https_response" = "200" ]; then
        log "✅ HTTPS funcionando corretamente"
    else
        log "⚠️ HTTPS pode não estar funcionando (código: $https_response)"
    fi
    
    # Testar certificado SSL
    log "Verificando certificado SSL..."
    if openssl s_client -connect $DOMAIN:443 -servername $DOMAIN </dev/null 2>/dev/null | grep -q "Verify return code: 0"; then
        log "✅ Certificado SSL válido"
    else
        log "⚠️ Certificado SSL pode ter problemas"
    fi
}

# ========================================
# 🚀 PROCESSO PRINCIPAL
# ========================================

log "=== INICIANDO CONFIGURAÇÃO SSL PARA $DOMAIN ==="

check_requirements
install_certbot
backup_config
stop_containers
generate_certificate
setup_permissions
start_containers
setup_auto_renewal
test_ssl

log "=== CONFIGURAÇÃO SSL CONCLUÍDA ==="
log ""
log "📋 PRÓXIMOS PASSOS:"
log "1. Verificar se https://$DOMAIN está funcionando"
log "2. Testar redirecionamento HTTP → HTTPS"
log "3. Verificar certificado em https://www.ssllabs.com/ssltest/"
log "4. Monitorar logs em /var/log/ssl-*.log"
log ""
log "🔧 COMANDOS ÚTEIS:"
log "- Verificar certificados: sudo certbot certificates"
log "- Testar renovação: sudo certbot renew --dry-run"
log "- Ver logs do container: docker logs linkcharts-frontend-prod"
log "- Status do container: docker ps | grep linkcharts"
