# 🐳 Docker - Link Chart Frontend

## 📋 Visão Geral

Este diretório contém os arquivos Docker para produção do Link Chart Frontend.

## 🏗️ Arquivos

### `Dockerfile.production`
- **Multi-stage build** otimizado para produção
- **Node.js 22 Alpine** para menor tamanho de imagem
- **Modo standalone** do Next.js para containers
- **Usuário não-root** para segurança
- **Health checks** integrados

### `docker-compose.production.yml`
- **Orquestração** de containers
- **Health monitoring** automático
- **Networking** isolado
- **Restart policies** configuradas

## 🚀 Uso

### Build da Imagem
```bash
docker build -f docker/Dockerfile.production -t linkchartapp-frontend:production .
```

### Executar com Docker Compose
```bash
cd docker
docker-compose -f docker-compose.production.yml up -d
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

## 📊 Performance

- **Build time**: ~84s
- **Image size**: ~245MB
- **Startup time**: ~536ms
- **Memory usage**: ~48MB

## 🔧 Configurações

- **Porta**: 3000
- **Health check**: /api/health
- **Restart**: unless-stopped
- **User**: nextjs (não-root)
