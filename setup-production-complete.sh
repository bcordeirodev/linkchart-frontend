#!/bin/bash

# ===========================================
# SCRIPT COMPLETO DE CONFIGURAÇÃO DE PRODUÇÃO
# Link Chart Frontend - DigitalOcean Setup
# ===========================================

set -e

echo "🚀 Iniciando configuração completa do servidor de produção..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# ===========================================
# 1. ATUALIZAÇÃO DO SISTEMA
# ===========================================
log "📦 Atualizando sistema..."
apt update && apt upgrade -y

# ===========================================
# 2. INSTALAÇÃO DE DEPENDÊNCIAS
# ===========================================
log "🔧 Instalando dependências essenciais..."
apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    htop \
    nano \
    vim \
    ufw \
    fail2ban \
    logrotate

# ===========================================
# 3. INSTALAÇÃO DO DOCKER
# ===========================================
log "🐳 Instalando Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Iniciar e habilitar Docker
systemctl start docker
systemctl enable docker

# ===========================================
# 4. INSTALAÇÃO DO NODE.JS
# ===========================================
log "🟢 Instalando Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# ===========================================
# 5. CONFIGURAÇÃO DE FIREWALL
# ===========================================
log "🔥 Configurando firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw --force enable

# ===========================================
# 6. CRIAÇÃO DA ESTRUTURA DE DIRETÓRIOS
# ===========================================
log "📁 Criando estrutura de diretórios..."
mkdir -p /var/www/linkchart-frontend
mkdir -p /var/www/linkchart-frontend/releases
mkdir -p /var/www/linkchart-frontend/shared
mkdir -p /var/www/linkchart-frontend/shared/logs
mkdir -p /var/www/linkchart-frontend/shared/uploads
mkdir -p /var/log/linkchart
mkdir -p /etc/linkchart

# ===========================================
# 7. CONFIGURAÇÃO DE USUÁRIO DE DEPLOY
# ===========================================
log "👤 Configurando usuário de deploy..."
useradd -m -s /bin/bash deploy || true
usermod -aG docker deploy
mkdir -p /home/deploy/.ssh
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh

# Configurar permissões para /var/www/linkchart-frontend
chown -R deploy:deploy /var/www/linkchart-frontend
chmod -R 755 /var/www/linkchart-frontend

# ===========================================
# 8. CONFIGURAÇÃO DO NGINX
# ===========================================
log "🌐 Instalando e configurando Nginx..."
apt install -y nginx

# Criar configuração do Nginx
cat > /etc/nginx/sites-available/linkchart-frontend << 'EOF'
server {
    listen 80;
    server_name linkchartapp.com www.linkchartapp.com;
    
    # Logs
    access_log /var/log/linkchart/nginx-access.log;
    error_log /var/log/linkchart/nginx-error.log;
    
    # Proxy para aplicação Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:3000/api/health;
        access_log off;
    }
    
    # Static files (se necessário)
    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

# Habilitar site
ln -sf /etc/nginx/sites-available/linkchart-frontend /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
nginx -t

# ===========================================
# 9. CONFIGURAÇÃO DE LOGS
# ===========================================
log "📝 Configurando rotação de logs..."
cat > /etc/logrotate.d/linkchart << 'EOF'
/var/log/linkchart/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 deploy deploy
    postrotate
        systemctl reload nginx > /dev/null 2>&1 || true
    endscript
}
EOF

# ===========================================
# 10. CONFIGURAÇÃO DO SYSTEMD SERVICE
# ===========================================
log "⚙️ Criando serviço systemd..."
cat > /etc/systemd/system/linkchart-frontend.service << 'EOF'
[Unit]
Description=Link Chart Frontend
After=network.target

[Service]
Type=simple
User=deploy
Group=deploy
WorkingDirectory=/var/www/linkchart-frontend/current
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

# Logs
StandardOutput=append:/var/log/linkchart/app.log
StandardError=append:/var/log/linkchart/app-error.log

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/var/www/linkchart-frontend

[Install]
WantedBy=multi-user.target
EOF

# ===========================================
# 11. CONFIGURAÇÃO DE MONITORAMENTO
# ===========================================
log "📊 Configurando monitoramento básico..."
cat > /usr/local/bin/linkchart-health-check.sh << 'EOF'
#!/bin/bash
# Health check script

HEALTH_URL="http://localhost:3000/api/health"
LOG_FILE="/var/log/linkchart/health-check.log"

# Fazer requisição de health check
response=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL 2>/dev/null)

if [ "$response" = "200" ]; then
    echo "$(date): Health check OK" >> $LOG_FILE
else
    echo "$(date): Health check FAILED (HTTP $response)" >> $LOG_FILE
    # Tentar reiniciar o serviço
    systemctl restart linkchart-frontend
    echo "$(date): Service restarted" >> $LOG_FILE
fi
EOF

chmod +x /usr/local/bin/linkchart-health-check.sh

# Adicionar ao crontab
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/linkchart-health-check.sh") | crontab -

# ===========================================
# 12. CONFIGURAÇÃO DE BACKUP
# ===========================================
log "💾 Configurando backup automático..."
cat > /usr/local/bin/linkchart-backup.sh << 'EOF'
#!/bin/bash
# Backup script

BACKUP_DIR="/var/backups/linkchart"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup da aplicação
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C /var/www/linkchart-frontend .

# Manter apenas os últimos 7 backups
find $BACKUP_DIR -name "app_*.tar.gz" -mtime +7 -delete

echo "$(date): Backup completed - app_$DATE.tar.gz" >> /var/log/linkchart/backup.log
EOF

chmod +x /usr/local/bin/linkchart-backup.sh

# Backup diário às 2h
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/linkchart-backup.sh") | crontab -

# ===========================================
# 13. CONFIGURAÇÃO DE DEPLOY AUTOMÁTICO
# ===========================================
log "🚀 Configurando deploy automático..."
cat > /usr/local/bin/linkchart-deploy.sh << 'EOF'
#!/bin/bash
# Deploy script

set -e

DEPLOY_DIR="/var/www/linkchart-frontend"
REPO_URL="https://github.com/bcordeirodev/linkchart-frontend.git"
BRANCH="main"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a /var/log/linkchart/deploy.log
}

cd $DEPLOY_DIR

# Se não existe repositório, clonar
if [ ! -d ".git" ]; then
    log "Cloning repository..."
    git clone $REPO_URL .
fi

# Fazer pull das últimas mudanças
log "Pulling latest changes..."
git fetch origin
git reset --hard origin/$BRANCH

# Instalar dependências
log "Installing dependencies..."
npm ci --production

# Build da aplicação
log "Building application..."
npm run build

# Reiniciar serviço
log "Restarting service..."
systemctl restart linkchart-frontend

log "Deploy completed successfully!"
EOF

chmod +x /usr/local/bin/linkchart-deploy.sh
chown deploy:deploy /usr/local/bin/linkchart-deploy.sh

# ===========================================
# 14. CONFIGURAÇÕES FINAIS
# ===========================================
log "🔧 Aplicando configurações finais..."

# Recarregar systemd
systemctl daemon-reload

# Iniciar serviços
systemctl start nginx
systemctl enable nginx

# Criar logs iniciais
touch /var/log/linkchart/app.log
touch /var/log/linkchart/app-error.log
touch /var/log/linkchart/deploy.log
touch /var/log/linkchart/backup.log
touch /var/log/linkchart/health-check.log
chown -R deploy:deploy /var/log/linkchart

# ===========================================
# 15. INFORMAÇÕES FINAIS
# ===========================================
log "✅ Configuração completa!"
echo ""
echo "🎉 SERVIDOR CONFIGURADO COM SUCESSO!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Executar deploy: /usr/local/bin/linkchart-deploy.sh"
echo "2. Verificar status: systemctl status linkchart-frontend"
echo "3. Ver logs: tail -f /var/log/linkchart/app.log"
echo "4. Testar aplicação: curl http://localhost:3000/api/health"
echo ""
echo "📁 ESTRUTURA CRIADA:"
echo "├── /var/www/linkchart-frontend/ (aplicação)"
echo "├── /var/log/linkchart/ (logs)"
echo "├── /etc/nginx/sites-available/linkchart-frontend (nginx config)"
echo "└── /etc/systemd/system/linkchart-frontend.service (service)"
echo ""
echo "🔧 SERVIÇOS CONFIGURADOS:"
echo "├── Nginx (proxy reverso)"
echo "├── Systemd service (auto-restart)"
echo "├── Health check (a cada 5min)"
echo "├── Backup automático (diário)"
echo "├── Firewall (UFW)"
echo "└── Log rotation"
echo ""
echo "🌐 ACESSO:"
echo "├── HTTP: http://linkchartapp.com"
echo "├── Health: http://linkchartapp.com/health"
echo "└── Logs: /var/log/linkchart/"

# Mostrar status dos serviços
echo ""
log "📊 Status dos serviços:"
systemctl is-active docker && echo "✅ Docker: Active" || echo "❌ Docker: Inactive"
systemctl is-active nginx && echo "✅ Nginx: Active" || echo "❌ Nginx: Inactive"
ufw status | grep -q "Status: active" && echo "✅ UFW: Active" || echo "❌ UFW: Inactive"

echo ""
log "🎯 Configuração finalizada! Execute o deploy quando estiver pronto."
