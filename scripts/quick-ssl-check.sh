#!/bin/bash
# 🔍 VERIFICAÇÃO RÁPIDA DE SSL - LINKCHARTS.COM.BR
# Script otimizado para verificar status do SSL

DOMAIN="linkcharts.com.br"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}🔍 $1${NC}"
    echo "----------------------------------------"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header "VERIFICAÇÃO RÁPIDA SSL - $DOMAIN"

# 1. DNS
echo "🌐 DNS:"
if nslookup $DOMAIN | grep -q "134.209.33.182"; then
    print_success "DNS configurado corretamente"
else
    print_error "DNS não está apontando para este servidor"
fi

# 2. Certificado
echo -e "\n🔒 Certificado:"
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    print_success "Certificado encontrado"
    
    # Verificar validade
    expiry=$(openssl x509 -in /etc/letsencrypt/live/$DOMAIN/cert.pem -noout -dates | grep notAfter | cut -d= -f2)
    expiry_timestamp=$(date -d "$expiry" +%s)
    current_timestamp=$(date +%s)
    days_left=$(( ($expiry_timestamp - $current_timestamp) / 86400 ))
    
    if [ $days_left -gt 30 ]; then
        print_success "Válido por mais $days_left dias"
    elif [ $days_left -gt 7 ]; then
        print_warning "Expira em $days_left dias"
    else
        print_error "Expira em $days_left dias - RENOVAR!"
    fi
else
    print_error "Certificado não encontrado"
fi

# 3. Container
echo -e "\n🐳 Container:"
if docker ps | grep -q "linkcharts-frontend"; then
    container_name=$(docker ps | grep "linkcharts-frontend" | awk '{print $NF}')
    print_success "Container rodando: $container_name"
    
    # Health status
    health=$(docker inspect --format='{{.State.Health.Status}}' $container_name 2>/dev/null || echo "unknown")
    case $health in
        "healthy") print_success "Status: Saudável" ;;
        "unhealthy") print_error "Status: Não saudável" ;;
        "starting") print_warning "Status: Iniciando" ;;
        *) print_warning "Status: $health" ;;
    esac
else
    print_error "Container não está rodando"
fi

# 4. Portas
echo -e "\n🔌 Portas:"
if ss -tlnp | grep -q ":80 "; then
    print_success "Porta 80 ativa"
else
    print_error "Porta 80 não está ativa"
fi

if ss -tlnp | grep -q ":443 "; then
    print_success "Porta 443 ativa"
else
    print_error "Porta 443 não está ativa"
fi

# 5. Conectividade
echo -e "\n🌐 Conectividade:"

# HTTP
http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://$DOMAIN 2>/dev/null || echo "000")
case $http_code in
    "200") print_success "HTTP funcionando (200)" ;;
    "301"|"302") print_success "HTTP redirecionando ($http_code)" ;;
    "000") print_error "HTTP não acessível" ;;
    *) print_warning "HTTP retornou: $http_code" ;;
esac

# HTTPS
https_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 https://$DOMAIN 2>/dev/null || echo "000")
case $https_code in
    "200") print_success "HTTPS funcionando (200)" ;;
    "000") print_error "HTTPS não acessível" ;;
    *) print_warning "HTTPS retornou: $https_code" ;;
esac

# 6. Certificado SSL online
echo -e "\n🛡️ Validação SSL:"
if timeout 5 openssl s_client -connect $DOMAIN:443 -servername $DOMAIN </dev/null 2>/dev/null | grep -q "Verify return code: 0"; then
    print_success "Certificado SSL válido"
else
    print_error "Problema com certificado SSL"
fi

# 7. Headers de segurança
echo -e "\n🔐 Headers de Segurança:"
if curl -s -I https://$DOMAIN 2>/dev/null | grep -q "Strict-Transport-Security"; then
    print_success "HSTS configurado"
else
    print_warning "HSTS não encontrado"
fi

# 8. Cron job
echo -e "\n⏰ Renovação Automática:"
if crontab -l 2>/dev/null | grep -q "renew-ssl"; then
    print_success "Cron job configurado"
else
    print_warning "Cron job não encontrado"
fi

# Resumo final
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}📊 RESUMO${NC}"
echo -e "${BLUE}========================================${NC}"

if [ "$https_code" = "200" ] && [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo -e "${GREEN}🎉 SSL FUNCIONANDO PERFEITAMENTE!${NC}"
    echo -e "${GREEN}✅ Acesse: https://$DOMAIN${NC}"
else
    echo -e "${YELLOW}⚠️  SSL PRECISA DE ATENÇÃO${NC}"
    echo -e "${YELLOW}🔧 Execute: sudo ./scripts/setup-ssl-final.sh${NC}"
fi

echo -e "\n🔗 Testes online recomendados:"
echo "   • SSL Labs: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
echo "   • Security Headers: https://securityheaders.com/?q=$DOMAIN"

echo -e "\n🔧 Comandos úteis:"
echo "   • sudo certbot certificates"
echo "   • sudo certbot renew --dry-run"
echo "   • docker logs linkcharts-frontend-prod"
echo "   • docker ps | grep linkcharts"
