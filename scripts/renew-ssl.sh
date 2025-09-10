#!/bin/bash
# 🔐 Script de renovação automática de certificados SSL
# Link Chart - linkcharts.com.br

set -e

# ========================================
# 📋 CONFIGURAÇÕES
# ========================================
LOG_FILE="/var/log/ssl-renewal.log"
PROJECT_DIR="/var/www/linkchart-frontend"
COMPOSE_FILE="deploy/docker-compose.prod.yml"
CONTAINER_NAME="linkcharts-frontend-prod"

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

check_certificate() {
    local domain=$1
    local days_until_expiry=$(openssl x509 -in /etc/letsencrypt/live/$domain/cert.pem -noout -dates | grep notAfter | cut -d= -f2 | xargs -I {} date -d {} +%s)
    local current_time=$(date +%s)
    local days_left=$(( ($days_until_expiry - $current_time) / 86400 ))
    
    log "Certificado para $domain expira em $days_left dias"
    echo $days_left
}

# ========================================
# 🚀 PROCESSO PRINCIPAL
# ========================================

log "=== INICIANDO PROCESSO DE RENOVAÇÃO SSL ==="

# Verificar se estamos no diretório correto
if [ ! -f "$PROJECT_DIR/$COMPOSE_FILE" ]; then
    error_exit "Arquivo docker-compose não encontrado: $PROJECT_DIR/$COMPOSE_FILE"
fi

cd $PROJECT_DIR

# Verificar status do certificado atual
if [ -f "/etc/letsencrypt/live/linkcharts.com.br/cert.pem" ]; then
    days_left=$(check_certificate "linkcharts.com.br")
    
    if [ $days_left -gt 30 ]; then
        log "Certificado ainda válido por $days_left dias. Renovação não necessária."
        exit 0
    fi
else
    log "Certificado não encontrado. Prosseguindo com renovação..."
fi

# Fazer backup da configuração atual
log "Criando backup da configuração atual..."
backup_dir="/var/backups/ssl-$(date +%Y%m%d-%H%M%S)"
mkdir -p $backup_dir
cp -r deploy/ $backup_dir/ || log "AVISO: Falha ao criar backup"

# Tentar renovar certificados
log "Tentando renovar certificados SSL..."
if certbot renew --quiet --no-self-upgrade; then
    log "✅ Certificados renovados com sucesso"
    
    # Verificar se os certificados foram realmente renovados
    new_days_left=$(check_certificate "linkcharts.com.br")
    if [ $new_days_left -gt $days_left ]; then
        log "✅ Certificado renovado com sucesso. Nova validade: $new_days_left dias"
    else
        log "⚠️ Certificado pode não ter sido renovado. Verificar manualmente."
    fi
    
    # Reiniciar container para aplicar novos certificados
    log "Reiniciando container para aplicar novos certificados..."
    
    # Verificar se o container está rodando
    if docker ps | grep -q $CONTAINER_NAME; then
        log "Container encontrado. Reiniciando..."
        docker compose -f $COMPOSE_FILE restart frontend
        
        # Aguardar container ficar saudável
        log "Aguardando container ficar saudável..."
        sleep 10
        
        # Verificar health check
        for i in {1..6}; do
            if docker ps | grep -q "$CONTAINER_NAME.*healthy"; then
                log "✅ Container reiniciado e saudável"
                break
            elif [ $i -eq 6 ]; then
                log "⚠️ Container pode não estar saudável. Verificar manualmente."
            else
                log "Aguardando health check... ($i/6)"
                sleep 10
            fi
        done
        
    else
        log "⚠️ Container não está rodando. Iniciando..."
        docker compose -f $COMPOSE_FILE up -d frontend
    fi
    
    # Testar conectividade HTTPS
    log "Testando conectividade HTTPS..."
    if curl -s -o /dev/null -w "%{http_code}" https://linkcharts.com.br/health | grep -q "200"; then
        log "✅ Teste de conectividade HTTPS bem-sucedido"
    else
        log "⚠️ Falha no teste de conectividade HTTPS. Verificar manualmente."
    fi
    
    log "✅ Processo de renovação SSL concluído com sucesso"
    
else
    error_exit "❌ Falha na renovação dos certificados SSL"
fi

# Limpeza de logs antigos (manter apenas 30 dias)
find /var/log -name "ssl-renewal.log*" -mtime +30 -delete 2>/dev/null || true

log "=== PROCESSO DE RENOVAÇÃO SSL FINALIZADO ==="
