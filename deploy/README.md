# 🚀 DEPLOY GUIDE - LINK CHART FRONTEND

Documentação completa para deploy do Link Chart Frontend em produção.

## 📋 Informações do Ambiente

### 🌐 **Produção**
- **Servidor**: 134.209.33.182
- **Diretório**: `/var/www/linkchart-frontend`
- **Porta**: 3000
- **URL**: http://134.209.33.182:3000
- **Health Check**: http://134.209.33.182:3000/health

### 🔧 **Tecnologias**
- **Frontend**: React + Vite + TypeScript
- **Container**: Docker + Nginx
- **CI/CD**: GitHub Actions
- **Servidor**: Ubuntu + Docker

---

## 📁 ESTRUTURA DE ARQUIVOS

```
deploy/
├── README.md                     # Esta documentação
├── Dockerfile.prod               # Dockerfile otimizado para produção
├── docker-compose.prod.yml       # Compose para produção
├── docker-compose.local.yml      # Compose para testes locais
├── docker/
│   └── nginx/
│       ├── nginx.prod.conf       # Configuração principal do Nginx
│       └── default.prod.conf     # Virtual host do Nginx
├── scripts/
│   ├── deploy-local.sh           # Script para deploy local
│   └── setup-production.sh       # Script de setup inicial do servidor
├── workflows/
│   └── deploy-production.yml     # Workflow do GitHub Actions
└── docs/
    └── GITHUB_SECRETS_SETUP.md   # Guia de configuração dos secrets
```

---

## 🚀 DEPLOY AUTOMÁTICO (RECOMENDADO)

### ✅ **Pré-requisitos**
1. Servidor configurado (ver seção "Setup Inicial")
2. GitHub Secrets configurados (ver `docs/GITHUB_SECRETS_SETUP.md`)
3. SSH key configurada

### 🎯 **Como Funciona**
1. **Push para `main`** → Trigger automático
2. **Quality Checks** → TypeScript, Build, Security
3. **Deploy** → SSH para servidor, build e restart
4. **Validation** → Health checks automáticos

### 📋 **Comandos de Monitoramento**
```bash
# Ver status dos containers
docker compose -f deploy/docker-compose.prod.yml ps

# Ver logs em tempo real
docker compose -f deploy/docker-compose.prod.yml logs -f

# Reiniciar aplicação
docker compose -f deploy/docker-compose.prod.yml restart

# Parar aplicação
docker compose -f deploy/docker-compose.prod.yml down
```

---

## 🔧 SETUP INICIAL DO SERVIDOR

### 1️⃣ **Setup Automático (Recomendado)**
```bash
# Conectar ao servidor
ssh root@134.209.33.182

# Executar script de setup
curl -fsSL https://raw.githubusercontent.com/bcordeirodev/linkchart-frontend/main/deploy/scripts/setup-production.sh -o setup.sh
chmod +x setup.sh
./setup.sh
```

### 2️⃣ **Setup Manual**
```bash
# 1. Conectar ao servidor
ssh root@134.209.33.182

# 2. Atualizar sistema
apt update && apt upgrade -y

# 3. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker $USER

# 4. Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 5. Criar estrutura
mkdir -p /var/www/linkchart-frontend
cd /var/www/linkchart-frontend
git clone https://github.com/bcordeirodev/linkchart-frontend.git .

# 6. Configurar ambiente
# (Editar .env.production conforme necessário)

# 7. Primeiro deploy
docker compose -f deploy/docker-compose.prod.yml up -d --build
```

---

## 🧪 TESTES LOCAIS

### 🏠 **Deploy Local**
```bash
# Executar script de deploy local
./deploy/scripts/deploy-local.sh

# Ou manualmente:
docker compose -f deploy/docker-compose.local.yml up -d --build

# Acessar aplicação
open http://localhost:3000
```

### 🔍 **Validação**
```bash
# Health check
curl -f http://localhost:3000/health

# Página principal
curl -f http://localhost:3000/

# Ver logs
docker compose -f deploy/docker-compose.local.yml logs -f
```

---

## 🐳 DOCKER

### 📦 **Imagens**
- **Base**: `nginx:1.25-alpine`
- **Build**: `node:20-alpine`
- **Final**: Nginx servindo arquivos estáticos

### 🔧 **Configuração**
- **Porta**: 3000 (host) → 80 (container)
- **Volumes**: Logs, SSL certificates
- **Network**: `linkcharts-network`
- **Health Check**: Automático a cada 30s

### 📊 **Recursos**
- **CPU**: 0.5-1.0 cores
- **RAM**: 256-512MB
- **Storage**: ~100MB (imagem final)

---

## 🔐 CONFIGURAÇÃO DE SECRETS

### 📋 **GitHub Secrets Necessários**
```
PRODUCTION_HOST = 134.209.33.182
PRODUCTION_USER = root
PRODUCTION_SSH_KEY = [chave SSH privada]
```

### 🔑 **Configuração SSH**
1. Gerar chave SSH no servidor
2. Adicionar chave pública ao `authorized_keys`
3. Copiar chave privada para GitHub Secrets
4. Testar conexão SSH

**Ver detalhes em**: `deploy/docs/GITHUB_SECRETS_SETUP.md`

---

## 🚨 TROUBLESHOOTING

### ❌ **Container não inicia**
```bash
# Ver logs detalhados
docker compose -f deploy/docker-compose.prod.yml logs

# Verificar imagem
docker images | grep linkcharts

# Rebuild forçado
docker compose -f deploy/docker-compose.prod.yml build --no-cache
```

### ❌ **Health check falha**
```bash
# Testar health check manualmente
curl -f http://localhost:3000/health

# Ver configuração do Nginx
docker exec linkcharts-frontend-prod cat /etc/nginx/conf.d/default.conf

# Ver logs do Nginx
docker exec linkcharts-frontend-prod tail -f /var/log/nginx/error.log
```

### ❌ **Deploy falha**
```bash
# Verificar SSH
ssh -o StrictHostKeyChecking=no root@134.209.33.182 'whoami'

# Verificar código no servidor
ssh root@134.209.33.182 'cd /var/www/linkchart-frontend && git status'

# Ver logs do workflow no GitHub Actions
```

### ❌ **Aplicação não carrega**
```bash
# Verificar se container está rodando
docker ps | grep linkcharts

# Verificar porta
netstat -tulpn | grep :3000

# Verificar firewall
ufw status | grep 3000
```

---

## 📊 MONITORAMENTO

### 🔍 **Health Checks**
- **Container**: Interno via curl
- **GitHub Actions**: Externo via curl
- **Cron**: A cada 5 minutos (automático)

### 📋 **Logs**
- **Aplicação**: `docker compose logs`
- **Nginx**: `/var/log/nginx/`
- **Sistema**: `journalctl -u docker`

### 📈 **Métricas**
- **Status**: `/health` endpoint
- **Nginx**: `/nginx_status` (apenas local)
- **Docker**: `docker stats`

---

## 🔄 BACKUP E ROLLBACK

### 💾 **Backup Automático**
- **Frequência**: Diário às 2h
- **Localização**: `/var/www/linkchart-frontend/backups/`
- **Retenção**: 5 backups mais recentes

### ↩️ **Rollback Manual**
```bash
# Ver backups disponíveis
ls -la /var/www/linkchart-frontend/backups/

# Rollback para commit específico
cd /var/www/linkchart-frontend
git reset --hard COMMIT_HASH
docker compose -f deploy/docker-compose.prod.yml up -d --build

# Rollback via backup
cd backups
tar -xzf code-YYYYMMDD_HHMMSS.tar.gz -C ..
docker compose -f deploy/docker-compose.prod.yml up -d --build
```

---

## 🎯 PRÓXIMOS PASSOS

### 🚀 **Melhorias Planejadas**
- [ ] HTTPS com Let's Encrypt
- [ ] CDN para assets estáticos
- [ ] Monitoramento com Prometheus
- [ ] Logs centralizados
- [ ] Deploy blue-green

### 🔧 **Otimizações**
- [ ] Cache Redis
- [ ] Compressão Brotli
- [ ] Service Worker
- [ ] Lazy loading
- [ ] Bundle splitting

---

## 📞 SUPORTE

### 🆘 **Em caso de problemas**
1. Verificar logs: `docker compose logs -f`
2. Testar health check: `curl http://localhost:3000/health`
3. Verificar GitHub Actions
4. Consultar esta documentação

### 📧 **Contato**
- **GitHub**: Issues no repositório
- **Logs**: Sempre incluir logs relevantes
- **Contexto**: Descrever o que estava tentando fazer

---

**✨ Deploy automatizado e monitorado 24/7!**
