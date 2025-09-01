# 🖥️ COMANDOS PARA EXECUTAR NO SERVIDOR

Execute estes comandos **no servidor 134.209.33.182** para configurar o ambiente de produção.

## 🔐 1. CONECTAR AO SERVIDOR

```bash
ssh root@134.209.33.182
# ou
ssh user@134.209.33.182
```

## 🚀 2. SETUP AUTOMÁTICO (RECOMENDADO)

```bash
# Baixar e executar script de setup
curl -fsSL https://raw.githubusercontent.com/bcordeirodev/linkchart-frontend/main/scripts/setup-production.sh -o setup.sh
chmod +x setup.sh
./setup.sh
```

## 🔧 3. SETUP MANUAL (SE PREFERIR)

### 3.1. Preparar Sistema
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Instalar Git
sudo apt install git curl -y
```

### 3.2. Configurar Aplicação
```bash
# Criar diretório
sudo mkdir -p /var/www/linkchart-frontend
sudo chown -R $USER:$USER /var/www/linkchart-frontend
cd /var/www/linkchart-frontend

# Clonar repositório
git clone https://github.com/bcordeirodev/linkchart-frontend.git .

# Criar estrutura
mkdir -p logs/nginx backups ssl
```

### 3.3. Deploy
```bash
# Build e iniciar
docker build -f Dockerfile.prod -t linkcharts-frontend:latest .
docker compose -f docker-compose.prod.yml up -d

# Verificar status
docker compose -f docker-compose.prod.yml ps
```

## 🧪 4. TESTES

```bash
# Health check local
curl -f http://localhost:3000/health

# Página principal
curl -I http://localhost:3000/

# Teste externo (de outro terminal)
curl -f http://134.209.33.182:3000/health
```

## 🔥 5. CONFIGURAR FIREWALL

```bash
# Permitir porta 3000
sudo ufw allow 3000/tcp
sudo ufw status
```

## 📊 6. MONITORAMENTO

```bash
# Ver logs em tempo real
docker compose -f docker-compose.prod.yml logs -f

# Status dos containers
docker compose -f docker-compose.prod.yml ps

# Uso de recursos
docker stats

# Logs do Nginx
tail -f logs/nginx/frontend_access.log
```

## 🔄 7. COMANDOS DE MANUTENÇÃO

```bash
# Restart da aplicação
docker compose -f docker-compose.prod.yml restart

# Parar aplicação
docker compose -f docker-compose.prod.yml down

# Atualizar código e redeploy
git pull origin main
docker build -f Dockerfile.prod -t linkcharts-frontend:latest .
docker compose -f docker-compose.prod.yml up -d

# Limpeza de espaço
docker system prune -f
```

## 🔑 8. CONFIGURAR SSH PARA GITHUB ACTIONS

```bash
# Gerar chave SSH (se não existir)
ssh-keygen -t rsa -b 4096 -C "deploy@linkcharts"

# Mostrar chave PRIVADA (copiar para GitHub Secret)
cat ~/.ssh/id_rsa

# Mostrar chave PÚBLICA (já deve estar em authorized_keys)
cat ~/.ssh/id_rsa.pub

# Garantir permissões corretas
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

## ⚠️ 9. TROUBLESHOOTING

### Aplicação não responde:
```bash
# Verificar se está rodando
docker compose -f docker-compose.prod.yml ps

# Ver logs de erro
docker compose -f docker-compose.prod.yml logs

# Restart forçado
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d
```

### Porta não acessível externamente:
```bash
# Verificar se está ouvindo
sudo netstat -tlnp | grep :3000

# Verificar firewall
sudo ufw status

# Verificar iptables
sudo iptables -L
```

### Problemas de permissão:
```bash
# Corrigir proprietário
sudo chown -R $USER:$USER /var/www/linkchart-frontend

# Corrigir permissões de logs
chmod 755 logs/nginx
```

## ✅ 10. VERIFICAÇÃO FINAL

Após executar tudo, você deve conseguir:

- ✅ `curl -f http://localhost:3000/health` → retorna "healthy"
- ✅ `curl -f http://134.209.33.182:3000/health` → retorna "healthy" 
- ✅ Acessar http://134.209.33.182:3000 no navegador
- ✅ Ver containers rodando com `docker compose ps`

## 📞 COMANDOS DE EMERGÊNCIA

```bash
# Parar tudo
docker compose -f docker-compose.prod.yml down

# Backup rápido
tar -czf emergency-backup-$(date +%Y%m%d_%H%M%S).tar.gz /var/www/linkchart-frontend

# Rollback para versão anterior
git log --oneline -5
git checkout <hash-do-commit-anterior>
docker build -f Dockerfile.prod -t linkcharts-frontend:latest .
docker compose -f docker-compose.prod.yml up -d
```

---

**🎯 OBJETIVO**: Ter a aplicação rodando em `http://134.209.33.182:3000`

**📧 SUPORTE**: Se algo der errado, verifique os logs e status dos containers primeiro!
