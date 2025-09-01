# 🚀 DEPLOY GUIDE - LINK CHART FRONTEND

Guia completo para deploy em produção do Link Chart Frontend com Docker e GitHub Actions.

## 📋 Índice

- [🏗️ Arquitetura](#️-arquitetura)
- [🔧 Configuração](#-configuração)
- [🐳 Docker](#-docker)
- [🚀 Deploy Automático](#-deploy-automático)
- [🧪 Testes Locais](#-testes-locais)
- [🔍 Monitoramento](#-monitoramento)
- [🛠️ Troubleshooting](#️-troubleshooting)

## 🏗️ Arquitetura

### Stack de Produção
- **Frontend**: React + TypeScript + Vite
- **Servidor Web**: Nginx (otimizado para SPA)
- **Container**: Docker multi-stage build
- **Orquestração**: Docker Compose
- **CI/CD**: GitHub Actions
- **Proxy Reverso**: Traefik (opcional)

### Estrutura de Arquivos
```
front-end/
├── 🐳 Dockerfile.prod              # Build de produção
├── 🐳 docker-compose.prod.yml      # Orquestração
├── 📁 docker/nginx/                # Configurações Nginx
├── 🚀 .github/workflows/           # CI/CD GitHub Actions
├── 📜 scripts/deploy-local.sh      # Deploy local para testes
└── 🔐 .env.production              # Variáveis de ambiente
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

Arquivo `.env.production`:
```bash
# URLs de Produção
VITE_BASE_URL=https://linkcharts.com
VITE_API_URL=https://api.linkcharts.com
VITE_API_BASE_URL=https://api.linkcharts.com

# Configurações de Auth
VITE_AUTH_URL=https://linkcharts.com
VITE_AUTH_SECRET=seu_secret_aqui

# Providers OAuth
VITE_GOOGLE_CLIENT_ID=seu_google_client_id
VITE_GOOGLE_CLIENT_SECRET=seu_google_secret

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUGGING=false
```

### 2. Secrets do GitHub

Configure os seguintes secrets no repositório GitHub:

```bash
# Acesso ao servidor
PRODUCTION_HOST=seu.servidor.com
PRODUCTION_USER=usuario_deploy
PRODUCTION_SSH_KEY=sua_chave_ssh_privada

# Container Registry (opcional)
GHCR_TOKEN=seu_token_github
```

## 🐳 Docker

### Build Local
```bash
# Build da imagem
docker build -f Dockerfile.prod -t linkcharts-frontend:latest .

# Executar localmente
docker run -p 80:80 linkcharts-frontend:latest
```

### Docker Compose
```bash
# Produção completa
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Parar serviços
docker-compose -f docker-compose.prod.yml down
```

## 🚀 Deploy Automático

### Trigger do Deploy
O deploy é executado automaticamente quando:
- ✅ Push para branch `main`
- ✅ Pull Request merged para `main`
- ✅ Dispatch manual via GitHub Actions

### Pipeline de Deploy

1. **🧪 Quality Checks**
   - TypeScript validation
   - ESLint checks
   - Format validation
   - Build test
   - Security audit

2. **🐳 Docker Build**
   - Multi-platform build (amd64/arm64)
   - Push para GitHub Container Registry
   - Vulnerability scan com Trivy

3. **🚀 Production Deploy**
   - SSH para servidor de produção
   - Backup automático
   - Deploy com zero-downtime
   - Health checks
   - Rollback automático em caso de falha

### Monitoramento do Deploy
```bash
# Via GitHub Actions
https://github.com/seu-usuario/seu-repo/actions

# Logs do servidor
tail -f /opt/linkcharts/frontend/logs/nginx/access.log
```

## 🧪 Testes Locais

### Script de Deploy Local
```bash
# Executar deploy local
./scripts/deploy-local.sh

# Verificar aplicação
curl http://localhost/health
```

### Testes Manuais
```bash
# 1. Health Check
curl -f http://localhost/health

# 2. Página Principal
curl -f http://localhost/

# 3. Assets Estáticos
curl -f http://localhost/favicon.ico

# 4. API Proxy (se configurado)
curl -f http://localhost/api/health
```

## 🔍 Monitoramento

### Health Checks
- **Endpoint**: `/health`
- **Intervalo**: 30s
- **Timeout**: 10s
- **Retries**: 3

### Logs
```bash
# Nginx Access Logs
tail -f logs/nginx/access.log

# Nginx Error Logs
tail -f logs/nginx/error.log

# Container Logs
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Métricas
- **Status Nginx**: `/nginx_status` (apenas rede interna)
- **Docker Stats**: `docker stats`
- **Resource Usage**: `docker-compose -f docker-compose.prod.yml top`

## 🛠️ Troubleshooting

### Problemas Comuns

#### 1. Build Falha
```bash
# Verificar logs de build
docker build -f Dockerfile.prod -t test . --no-cache

# Verificar dependências
npm audit
npm run type-check
```

#### 2. Container Não Inicia
```bash
# Verificar logs
docker-compose -f docker-compose.prod.yml logs frontend

# Verificar configuração
docker-compose -f docker-compose.prod.yml config
```

#### 3. Health Check Falha
```bash
# Testar manualmente
docker exec -it linkcharts-frontend-prod curl localhost/health

# Verificar Nginx
docker exec -it linkcharts-frontend-prod nginx -t
```

#### 4. Deploy SSH Falha
```bash
# Testar conexão SSH
ssh -o StrictHostKeyChecking=no user@server "echo 'SSH OK'"

# Verificar permissões
ls -la ~/.ssh/
```

### Comandos de Emergência

#### Rollback Manual
```bash
# Parar containers atuais
docker-compose -f docker-compose.prod.yml down

# Restaurar backup
sudo cp -r /opt/linkcharts/backups/YYYYMMDD_HHMMSS/* /opt/linkcharts/frontend/

# Reiniciar
docker-compose -f docker-compose.prod.yml up -d
```

#### Limpeza Completa
```bash
# Parar tudo
docker-compose -f docker-compose.prod.yml down --volumes --remove-orphans

# Limpar imagens
docker system prune -af

# Limpar volumes
docker volume prune -f
```

## 📊 Performance

### Otimizações Implementadas
- ✅ **Multi-stage build** - Imagem final otimizada
- ✅ **Nginx tuning** - Configuração para alta performance
- ✅ **Gzip compression** - Compressão de assets
- ✅ **Static caching** - Cache longo para assets
- ✅ **Health checks** - Monitoramento contínuo
- ✅ **Resource limits** - Controle de recursos

### Métricas Esperadas
- **Build time**: ~3-5 minutos
- **Image size**: ~50-80MB (final)
- **Startup time**: ~15-30 segundos
- **Memory usage**: ~256MB
- **CPU usage**: ~0.5 cores

## 🔐 Segurança

### Medidas Implementadas
- ✅ **Non-root user** no container
- ✅ **Security headers** no Nginx
- ✅ **Rate limiting** para APIs
- ✅ **Vulnerability scanning** com Trivy
- ✅ **SSH key authentication**
- ✅ **Secrets management** via GitHub

### Checklist de Segurança
- [ ] SSH keys rotacionadas regularmente
- [ ] Secrets do GitHub atualizados
- [ ] Certificados SSL válidos
- [ ] Firewall configurado
- [ ] Logs de acesso monitorados

## 📞 Suporte

### Contatos
- **DevOps**: devops@linkcharts.com
- **Desenvolvimento**: dev@linkcharts.com
- **Emergência**: +55 11 99999-9999

### Links Úteis
- [📊 Monitoring Dashboard](https://monitor.linkcharts.com)
- [🐳 Container Registry](https://ghcr.io/linkcharts)
- [🚀 GitHub Actions](https://github.com/linkcharts/frontend/actions)
- [📝 Documentation](https://docs.linkcharts.com)

---

**🎉 Deploy configurado e pronto para produção!**
