# 🐳 Docker - Link Chart Frontend

## 📁 Estrutura Organizada

```
docker/
├── production/           # Configurações de produção
│   ├── Dockerfile       # Dockerfile otimizado para produção
│   └── docker-compose.yml
├── development/          # Configurações de desenvolvimento
│   ├── Dockerfile       # Dockerfile para desenvolvimento
│   └── docker-compose.yml
├── scripts/             # Scripts de automação
│   ├── build-docker.sh  # Build da imagem Docker
│   ├── test-docker.sh   # Teste da imagem
│   ├── cleanup.js       # Limpeza do projeto
│   ├── validate-structure.js # Validação da estrutura
│   └── fix-client-components.js # Correção de client components
└── README.md            # Este arquivo
```

## 🚀 Comandos Disponíveis

### Desenvolvimento
```bash
# Ambiente de desenvolvimento com hot reload
npm run docker:dev

# Build da imagem de desenvolvimento
docker build -f docker/development/Dockerfile -t linkchartapp-frontend:dev .
```

### Produção
```bash
# Build da imagem de produção
npm run docker:build

# Deploy com Docker Compose
npm run docker:prod

# Build manual
docker build -f docker/production/Dockerfile -t linkchartapp-frontend:prod .
```

### Scripts de Automação
```bash
# Validação da estrutura
npm run validate

# Limpeza automática
npm run cleanup

# Correção de client components
npm run fix:client

# Workflow completo
npm run docker:all
```

## 🔧 Configurações

### Desenvolvimento
- **Hot Reload**: Ativado com volumes montados
- **Porta**: 3000
- **Modo**: Development com debugging
- **Volumes**: Código fonte montado para edição em tempo real

### Produção
- **Multi-stage Build**: Otimizado para tamanho
- **Standalone Mode**: Next.js standalone para containers
- **Security**: Usuário não-root
- **Health Checks**: Monitoramento automático
- **Porta**: 3000

## 📊 Performance

### Desenvolvimento
- **Build time**: ~30s
- **Hot reload**: <1s
- **Memory**: ~200MB

### Produção
- **Build time**: ~84s
- **Image size**: ~245MB
- **Startup time**: ~536ms
- **Memory usage**: ~48MB

## 🎯 Casos de Uso

### Desenvolvimento Local
```bash
# Iniciar ambiente de desenvolvimento
npm run docker:dev

# Acessar aplicação
open http://localhost:3000

# Ver logs
docker-compose -f docker/development/docker-compose.yml logs -f
```

### CI/CD Pipeline
```bash
# Build automático no GitHub Actions
# Usa docker/production/Dockerfile
# Validação automática antes do build
```

### Deploy Manual
```bash
# Build da imagem
npm run docker:build

# Deploy
npm run docker:prod

# Verificar status
docker ps
curl http://localhost:3000/api/health
```

## 🔍 Troubleshooting

### Problemas Comuns
1. **Porta já em uso**: Mude a porta no docker-compose
2. **Permissões**: Execute `chmod +x docker/scripts/*.sh`
3. **Dependências**: Execute `npm run cleanup` antes do build
4. **Cache**: Use `docker system prune` para limpar cache

### Logs e Debug
```bash
# Logs do container
docker logs link-chart-frontend

# Executar shell no container
docker exec -it link-chart-frontend /bin/sh

# Verificar health check
curl http://localhost:3000/api/health
```

---

**Status**: ✅ **ESTRUTURA ORGANIZADA E OTIMIZADA**
