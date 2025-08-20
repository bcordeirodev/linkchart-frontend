# 🚀 Guia de Deploy - Link Chart

Este guia fornece instruções completas para fazer deploy do Link Chart em produção.

## 📋 Pré-requisitos

### Servidor
- **Sistema Operacional**: Ubuntu 20.04+ ou CentOS 8+
- **RAM**: Mínimo 2GB (recomendado 4GB+)
- **CPU**: 2 cores (recomendado 4 cores+)
- **Armazenamento**: 20GB+ livre

### Software
- **Node.js**: 18.x ou superior
- **Nginx**: Para proxy reverso
- **PM2**: Para gerenciamento de processos
- **SSL**: Certificado válido (Let's Encrypt)

## 🔧 Configuração do Ambiente

### 1. Instalar Dependências do Sistema

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nodejs npm nginx certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install -y nodejs npm nginx certbot python3-certbot-nginx
```

### 2. Configurar Node.js

```bash
# Instalar Node.js 18.x via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar versão
node --version
npm --version
```

### 3. Configurar PM2

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Configurar PM2 para iniciar com o sistema
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

## 🏗️ Deploy do Frontend

### 1. Preparar o Projeto

```bash
# Clonar o repositório
git clone <seu-repositorio>
cd link-chart/front-end

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
nano .env
```

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `.env` com as configurações de produção:

```env
# Configurações da API
NEXT_PUBLIC_API_URL=https://api.seudominio.com
NEXT_PUBLIC_TEST_API_URL=https://api.seudominio.com

# Configurações de Autenticação
NEXTAUTH_URL=https://seudominio.com
NEXTAUTH_SECRET=sua-chave-secreta-muito-segura

# Configurações de Produção
NODE_ENV=production

# Configurações de Monitoramento (opcional)
SENTRY_DSN=sua-dsn-do-sentry
```

### 3. Build de Produção

```bash
# Usar o script automatizado
./scripts/build-production.sh

# Ou build manual
NODE_ENV=production npm run build
```

### 4. Configurar PM2

Criar arquivo `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'link-chart-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/caminho/para/link-chart/front-end',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### 5. Iniciar Aplicação

```bash
# Criar diretório de logs
mkdir -p logs

# Iniciar com PM2
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save

# Verificar status
pm2 status
pm2 logs
```

## 🌐 Configuração do Nginx

### 1. Configurar Site

Criar arquivo `/etc/nginx/sites-available/link-chart`:

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;
    
    # Redirecionar para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seudominio.com www.seudominio.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
    
    # Proxy para Next.js
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
    }
    
    # Cache para assets estáticos
    location /_next/static/ {
        alias /caminho/para/link-chart/front-end/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Cache para imagens
    location ~* \.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

### 2. Ativar Site

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/link-chart /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

### 3. Configurar SSL

```bash
# Obter certificado SSL
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Configurar renovação automática
sudo crontab -e
# Adicionar linha: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔒 Configurações de Segurança

### 1. Firewall

```bash
# Configurar UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. Fail2ban

```bash
# Instalar Fail2ban
sudo apt install fail2ban

# Configurar
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Atualizações Automáticas

```bash
# Configurar atualizações de segurança
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 📊 Monitoramento

### 1. PM2 Monitoring

```bash
# Interface web do PM2
pm2 web

# Monitoramento em tempo real
pm2 monit
```

### 2. Logs

```bash
# Ver logs da aplicação
pm2 logs link-chart-frontend

# Ver logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 3. Métricas do Sistema

```bash
# Instalar htop para monitoramento
sudo apt install htop

# Verificar uso de recursos
htop
df -h
free -h
```

## 🔄 Deploy Contínuo

### 1. Script de Deploy

Criar `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Iniciando deploy..."

# Pull das mudanças
git pull origin main

# Instalar dependências
npm install

# Build de produção
NODE_ENV=production npm run build

# Reiniciar aplicação
pm2 restart link-chart-frontend

echo "✅ Deploy concluído!"
```

### 2. Webhook para Deploy Automático

Configurar webhook no GitHub/GitLab para executar o script automaticamente.

## 🚨 Troubleshooting

### Problemas Comuns

1. **Aplicação não inicia**
   ```bash
   pm2 logs link-chart-frontend
   pm2 restart link-chart-frontend
   ```

2. **Erro 502 Bad Gateway**
   - Verificar se a aplicação está rodando: `pm2 status`
   - Verificar logs do Nginx: `sudo tail -f /var/log/nginx/error.log`

3. **SSL não funciona**
   ```bash
   sudo certbot --nginx -d seudominio.com
   sudo systemctl reload nginx
   ```

4. **Performance lenta**
   - Verificar uso de recursos: `htop`
   - Verificar logs de erro
   - Considerar aumentar recursos do servidor

### Comandos Úteis

```bash
# Reiniciar tudo
pm2 restart all
sudo systemctl restart nginx

# Ver status
pm2 status
sudo systemctl status nginx

# Limpar cache
pm2 flush
sudo rm -rf /var/cache/nginx/*
```

## 📈 Otimizações

### 1. Performance

- Configurar CDN (Cloudflare, AWS CloudFront)
- Otimizar imagens
- Implementar lazy loading
- Usar cache de API

### 2. Segurança

- Implementar rate limiting
- Configurar WAF
- Monitorar logs de segurança
- Backup regular dos dados

### 3. Escalabilidade

- Usar load balancer
- Implementar cache Redis
- Configurar múltiplas instâncias
- Monitorar métricas de performance

## 📞 Suporte

Para suporte técnico:
- Verificar logs: `pm2 logs`
- Consultar documentação do Next.js
- Abrir issue no repositório do projeto

---

**🎉 Parabéns! Seu Link Chart está em produção!**
