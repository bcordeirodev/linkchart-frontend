# 🚀 SETUP DE PRODUÇÃO - LINK CHART FRONTEND

Guia completo para configurar o ambiente de produção no servidor `134.209.33.182`.

## 📋 Informações do Servidor

- **IP**: 134.209.33.182
- **Diretório**: `/var/www/linkchart-frontend`
- **Porta**: 3000
- **URL Final**: http://134.209.33.182:3000

## 🔧 COMANDOS PARA EXECUTAR NO SERVIDOR

### 1. Conectar ao Servidor
```bash
# Conectar via SSH
ssh root@134.209.33.182
# ou
ssh user@134.209.33.182
```

### 2. Preparar Ambiente
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker se não estiver instalado
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose (versão mais recente)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Instalar Git se necessário
sudo apt install git -y
```

### 3. Criar Estrutura de Diretórios
```bash
# Criar diretório principal
sudo mkdir -p /var/www/linkchart-frontend
sudo chown -R $USER:$USER /var/www/linkchart-frontend
cd /var/www/linkchart-frontend

# Criar diretórios para logs e backups
mkdir -p logs/nginx
mkdir -p backups
mkdir -p ssl
```

### 4. Clonar Repositório
```bash
# Clonar o repositório
git clone https://github.com/bcordeirodev/linkchart-frontend.git .

# Verificar se está na branch main
git branch
git status
```

### 5. Configurar Variáveis de Ambiente
```bash
# Verificar se .env.production está correto
cat .env.production

# Deve conter:
# VITE_BASE_URL=http://134.209.33.182:3000
# VITE_API_URL=http://134.209.33.182:8000
# etc...
```

### 6. Build e Deploy Inicial
```bash
# Fazer build da imagem
docker build -f Dockerfile.prod -t linkcharts-frontend:latest .

# Iniciar aplicação
docker compose -f docker-compose.prod.yml up -d

# Verificar status
docker compose -f docker-compose.prod.yml ps
```

### 7. Testes de Funcionamento
```bash
# Testar health check
curl -f http://localhost:3000/health

# Testar página principal
curl -I http://localhost:3000/

# Testar do exterior (substitua pelo IP real)
curl -f http://134.209.33.182:3000/health
```

## 🔒 CONFIGURAÇÃO DE SECRETS NO GITHUB

Para que o workflow funcione, você precisa configurar os seguintes secrets no GitHub:

### 1. Acessar Configurações do Repositório
```
https://github.com/bcordeirodev/linkchart-frontend/settings/secrets/actions
```

### 2. Adicionar Secrets Necessários

#### PRODUCTION_HOST
```
Valor: 134.209.33.182
```

#### PRODUCTION_USER
```
Valor: root
# ou o usuário que você usa para SSH
```

#### PRODUCTION_SSH_KEY
```
# Gerar chave SSH no servidor (se não existir)
ssh-keygen -t rsa -b 4096 -C "deploy@linkcharts"

# Copiar a chave PRIVADA (todo o conteúdo)
cat ~/.ssh/id_rsa

# Cole todo o conteúdo da chave privada no secret
```

### 3. Configurar SSH Key no Servidor
```bash
# No servidor, adicionar a chave pública ao authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

## 🚀 CONFIGURAÇÃO DO WORKFLOW

### 1. Testar Deploy Manual
```bash
# No servidor, criar script de teste
cat > /var/www/linkchart-frontend/test-deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Testando deploy..."
cd /var/www/linkchart-frontend

# Pull das mudanças
git pull origin main

# Rebuild da imagem
docker build -f Dockerfile.prod -t linkcharts-frontend:latest .

# Restart dos containers
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d

# Health check
sleep 30
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Deploy bem-sucedido!"
    echo "🌐 Aplicação disponível em: http://134.209.33.182:3000"
else
    echo "❌ Deploy falhou!"
    exit 1
fi
EOF

chmod +x test-deploy.sh
```

### 2. Executar Teste
```bash
./test-deploy.sh
```

## 🔥 CONFIGURAÇÃO DE FIREWALL

### 1. Verificar Portas Abertas
```bash
# Verificar se a porta 3000 está aberta
sudo ufw status
sudo netstat -tlnp | grep :3000
```

### 2. Abrir Porta 3000 (se necessário)
```bash
# Permitir porta 3000
sudo ufw allow 3000/tcp

# Verificar regras
sudo ufw status numbered
```

## 📊 MONITORAMENTO

### 1. Comandos Úteis
```bash
# Status dos containers
docker compose -f docker-compose.prod.yml ps

# Logs da aplicação
docker compose -f docker-compose.prod.yml logs -f

# Logs do Nginx
tail -f logs/nginx/frontend_access.log
tail -f logs/nginx/frontend_error.log

# Uso de recursos
docker stats

# Espaço em disco
df -h
```

### 2. Health Checks Automáticos
```bash
# Criar script de monitoramento
cat > /var/www/linkchart-frontend/monitor.sh << 'EOF'
#!/bin/bash
URL="http://localhost:3000/health"
LOGFILE="/var/www/linkchart-frontend/logs/monitor.log"

if curl -f $URL > /dev/null 2>&1; then
    echo "$(date): ✅ Aplicação funcionando" >> $LOGFILE
else
    echo "$(date): ❌ Aplicação com problemas" >> $LOGFILE
    # Restart automático
    cd /var/www/linkchart-frontend
    docker compose -f docker-compose.prod.yml restart
fi
EOF

chmod +x monitor.sh

# Adicionar ao crontab (verificar a cada 5 minutos)
(crontab -l 2>/dev/null; echo "*/5 * * * * /var/www/linkchart-frontend/monitor.sh") | crontab -
```

## 🔄 PROCESSO DE DEPLOY AUTOMÁTICO

Após configurar tudo, o deploy funcionará assim:

### 1. Trigger
- Push para branch `main`
- Ou dispatch manual no GitHub Actions

### 2. Pipeline
1. **Quality Checks**: TypeScript, ESLint, Build test
2. **Docker Build**: Build da imagem e push para registry
3. **Deploy**: SSH para servidor e atualização

### 3. Verificação
- Health check automático
- Rollback se falhar
- Notificação de sucesso/falha

## ⚠️ TROUBLESHOOTING

### Problema: Container não inicia
```bash
# Verificar logs
docker compose -f docker-compose.prod.yml logs

# Verificar imagem
docker images | grep linkcharts

# Rebuild forçado
docker compose -f docker-compose.prod.yml down
docker system prune -f
docker build -f Dockerfile.prod -t linkcharts-frontend:latest . --no-cache
docker compose -f docker-compose.prod.yml up -d
```

### Problema: Porta 3000 não acessível
```bash
# Verificar se está ouvindo
sudo netstat -tlnp | grep :3000

# Verificar firewall
sudo ufw status
sudo iptables -L

# Verificar Docker
docker port linkcharts-frontend-prod
```

### Problema: SSH não funciona
```bash
# Testar conexão
ssh -vvv user@134.209.33.182

# Verificar chaves
ls -la ~/.ssh/
cat ~/.ssh/authorized_keys
```

## 📞 COMANDOS DE EMERGÊNCIA

### Parar Aplicação
```bash
cd /var/www/linkchart-frontend
docker compose -f docker-compose.prod.yml down
```

### Backup Rápido
```bash
# Backup do código
tar -czf backup-$(date +%Y%m%d_%H%M%S).tar.gz /var/www/linkchart-frontend

# Backup dos logs
cp -r logs/ backups/logs-$(date +%Y%m%d_%H%M%S)/
```

### Rollback
```bash
cd /var/www/linkchart-frontend
git log --oneline -10  # Ver commits recentes
git checkout <commit_anterior>
./test-deploy.sh
```

---

## ✅ CHECKLIST FINAL

- [ ] Servidor conectado via SSH
- [ ] Docker e Docker Compose instalados
- [ ] Diretório `/var/www/linkchart-frontend` criado
- [ ] Repositório clonado
- [ ] `.env.production` configurado
- [ ] Build inicial funcionando
- [ ] Porta 3000 acessível externamente
- [ ] Secrets configurados no GitHub
- [ ] SSH key configurada
- [ ] Teste de deploy manual executado
- [ ] Monitoramento configurado

**🎉 Após completar este checklist, a aplicação estará rodando em `http://134.209.33.182:3000`!**
