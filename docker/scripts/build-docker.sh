#!/bin/bash

# ===========================================
# SCRIPT DE BUILD DOCKER LOCAL
# Link Chart Frontend - Teste Local
# ===========================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
IMAGE_NAME="linkchartapp-frontend"
IMAGE_TAG="local"
FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_TAG}"

echo -e "${BLUE}🐳 Link Chart Frontend - Docker Build Script${NC}"
echo -e "${BLUE}=============================================${NC}"

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando. Por favor, inicie o Docker primeiro.${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Informações do Build:${NC}"
echo -e "   • Imagem: ${FULL_IMAGE_NAME}"
echo -e "   • Contexto: $(pwd)"
echo -e "   • Dockerfile: ./docker/production/Dockerfile"
echo ""

# Limpar imagens antigas (opcional)
echo -e "${YELLOW}🧹 Limpando imagens antigas...${NC}"
docker rmi ${FULL_IMAGE_NAME} 2>/dev/null || echo -e "${YELLOW}   Nenhuma imagem anterior encontrada${NC}"

# Build da imagem
echo -e "${YELLOW}🏗️  Iniciando build da imagem Docker...${NC}"
echo ""

# Validar projeto antes do build Docker
echo -e "${YELLOW}🔍 Validando estrutura do projeto...${NC}"
npm run validate || {
    echo -e "${RED}❌ Validação do projeto falhou!${NC}"
    exit 1
}

docker build \
  --tag ${FULL_IMAGE_NAME} \
  --file ./docker/production/Dockerfile \
  --build-arg NODE_ENV=production \
  --build-arg NEXT_TELEMETRY_DISABLED=1 \
  --progress=plain \
  .

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
    
    # Mostrar informações da imagem
    echo -e "${YELLOW}📊 Informações da imagem:${NC}"
    docker images ${FULL_IMAGE_NAME} --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
    
    echo ""
    echo -e "${YELLOW}🔍 Layers da imagem:${NC}"
    docker history ${FULL_IMAGE_NAME} --format "table {{.CreatedBy}}\t{{.Size}}" | head -10
    
    echo ""
    echo -e "${GREEN}🚀 Para testar a imagem localmente, execute:${NC}"
    echo -e "${BLUE}   docker run -p 3000:3000 --env-file .env.production ${FULL_IMAGE_NAME}${NC}"
    
    echo ""
    echo -e "${GREEN}🔍 Para inspecionar a imagem, execute:${NC}"
    echo -e "${BLUE}   docker run -it --entrypoint /bin/sh ${FULL_IMAGE_NAME}${NC}"
    
else
    echo ""
    echo -e "${RED}❌ Build falhou!${NC}"
    exit 1
fi
