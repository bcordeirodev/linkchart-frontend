#!/bin/bash

# ===========================================
# SCRIPT DE TESTE DOCKER LOCAL
# Link Chart Frontend - Teste da Imagem
# ===========================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
IMAGE_NAME="linkchartapp-frontend:local"
CONTAINER_NAME="linkchartapp-frontend-test"
PORT="3002"

echo -e "${BLUE}🧪 Link Chart Frontend - Docker Test Script${NC}"
echo -e "${BLUE}===========================================${NC}"

# Verificar se a imagem existe
if ! docker images ${IMAGE_NAME} --format "{{.Repository}}:{{.Tag}}" | grep -q "${IMAGE_NAME}"; then
    echo -e "${RED}❌ Imagem ${IMAGE_NAME} não encontrada.${NC}"
    echo -e "${YELLOW}   Execute primeiro: ./scripts/build-docker.sh${NC}"
    exit 1
fi

# Parar e remover container anterior se existir
echo -e "${YELLOW}🧹 Limpando containers anteriores...${NC}"
docker stop ${CONTAINER_NAME} 2>/dev/null || true
docker rm ${CONTAINER_NAME} 2>/dev/null || true

# Executar container
echo -e "${YELLOW}🚀 Iniciando container de teste...${NC}"
echo -e "   • Porta: ${PORT}"
echo -e "   • Container: ${CONTAINER_NAME}"
echo ""

docker run -d \
  --name ${CONTAINER_NAME} \
  -p ${PORT}:3000 \
  --env-file .env.production \
  # Health check (comentado para deploy mais rápido)
  # --health-cmd="wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1" \
  # --health-interval=30s \
  # --health-timeout=10s \
  # --health-retries=3 \
  # --health-start-period=40s \
  ${IMAGE_NAME}

# Aguardar container inicializar
echo -e "${YELLOW}⏳ Aguardando container inicializar...${NC}"
sleep 10

# Verificar se container está rodando
if docker ps | grep -q ${CONTAINER_NAME}; then
    echo -e "${GREEN}✅ Container iniciado com sucesso!${NC}"
    
    # Mostrar logs
    echo -e "${YELLOW}📋 Logs do container:${NC}"
    docker logs ${CONTAINER_NAME} --tail 20
    
    echo ""
    echo -e "${YELLOW}🔍 Status do container:${NC}"
    docker ps --filter name=${CONTAINER_NAME} --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    # Teste de health check
    echo ""
    echo -e "${YELLOW}🏥 Testando health check...${NC}"
    sleep 5
    
    if curl -f http://localhost:${PORT}/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Health check passou!${NC}"
    else
        echo -e "${RED}❌ Health check falhou!${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}🌐 Aplicação disponível em: http://localhost:${PORT}${NC}"
    echo -e "${BLUE}📊 Health check em: http://localhost:${PORT}/api/health${NC}"
    
    echo ""
    echo -e "${YELLOW}🛠️  Comandos úteis:${NC}"
    echo -e "${BLUE}   • Ver logs: docker logs -f ${CONTAINER_NAME}${NC}"
    echo -e "${BLUE}   • Parar: docker stop ${CONTAINER_NAME}${NC}"
    echo -e "${BLUE}   • Remover: docker rm ${CONTAINER_NAME}${NC}"
    echo -e "${BLUE}   • Executar shell: docker exec -it ${CONTAINER_NAME} /bin/sh${NC}"
    
else
    echo -e "${RED}❌ Container falhou ao iniciar!${NC}"
    echo -e "${YELLOW}📋 Logs do container:${NC}"
    docker logs ${CONTAINER_NAME}
    exit 1
fi
