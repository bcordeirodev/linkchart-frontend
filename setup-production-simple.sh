#!/bin/bash

# ===========================================
# SCRIPT SIMPLIFICADO DE CONFIGURAÇÃO
# Link Chart Frontend - DigitalOcean Setup
# ===========================================

set -e

echo "🚀 Configurando servidor de produção..."

# ===========================================
# 1. ESTRUTURA DE DIRETÓRIOS
# ===========================================
echo "📁 Criando estrutura de diretórios..."
mkdir -p /var/www/linkchart-frontend
mkdir -p /var/log/linkchart
chown -R deploy:deploy /var/www/linkchart-frontend 2>/dev/null || true
chmod -R 755 /var/www/linkchart-frontend

# ===========================================
# 2. CONFIGURAÇÃO CORRETA DO NGINX
# ===========================================
echo "🌐 Configurando Nginx..."
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
    
    # Static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
EOF

# Habilitar site
ln -sf /etc/nginx/sites-available/linkchart-frontend /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
nginx -t

# ===========================================
# 3. SERVIÇO SYSTEMD
# ===========================================
echo "⚙️ Criando serviço systemd..."
cat > /etc/systemd/system/linkchart-frontend.service << 'EOF'
[Unit]
Description=Link Chart Frontend
After=network.target

[Service]
Type=simple
User=deploy
Group=deploy
WorkingDirectory=/var/www/linkchart-frontend
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

[Install]
WantedBy=multi-user.target
EOF

# ===========================================
# 4. SCRIPT DE DEPLOY
# ===========================================
echo "🚀 Criando script de deploy..."
cat > /usr/local/bin/linkchart-deploy.sh << 'EOF'
#!/bin/bash
set -e

DEPLOY_DIR="/var/www/linkchart-frontend"
REPO_URL="https://github.com/bcordeirodev/linkchart-frontend.git"
BRANCH="main"

echo "[$(date)] Iniciando deploy..."

# Criar diretório se não existir
mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR

# Se não existe repositório, clonar
if [ ! -d ".git" ]; then
    echo "Clonando repositório..."
    git clone $REPO_URL .
fi

# Fazer pull das últimas mudanças
echo "Atualizando código..."
git fetch origin
git reset --hard origin/$BRANCH

# Instalar dependências
echo "Instalando dependências..."
npm ci --production

# Build da aplicação
echo "Fazendo build..."
npm run build

# Reiniciar serviço
echo "Reiniciando serviço..."
systemctl restart linkchart-frontend

echo "[$(date)] Deploy concluído com sucesso!"
EOF

chmod +x /usr/local/bin/linkchart-deploy.sh

# ===========================================
# 5. CONFIGURAÇÕES FINAIS
# ===========================================
echo "🔧 Finalizando configuração..."

# Recarregar systemd
systemctl daemon-reload

# Criar logs
mkdir -p /var/log/linkchart
touch /var/log/linkchart/app.log
touch /var/log/linkchart/app-error.log
touch /var/log/linkchart/nginx-access.log
touch /var/log/linkchart/nginx-error.log
chown -R deploy:deploy /var/log/linkchart 2>/dev/null || true

# Reiniciar Nginx
systemctl restart nginx

echo "✅ Configuração concluída!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Executar deploy: /usr/local/bin/linkchart-deploy.sh"
echo "2. Verificar status: systemctl status linkchart-frontend"
echo "3. Ver logs: tail -f /var/log/linkchart/app.log"
echo ""
echo "🌐 TESTE:"
echo "curl http://localhost/health"
