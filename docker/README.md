# 🐳 Docker Configuration - LinkChart Frontend

Este diretório contém todas as configurações Docker para o frontend do LinkChart, seguindo o mesmo padrão organizacional do back-end.

## 📁 Estrutura de Arquivos

```
docker/
├── README.md                           # Este arquivo
├── Dockerfile.production               # Dockerfile otimizado para produção
├── docker-compose.production.yml      # Compose para produção
├── nginx/                             # Configurações do Nginx
│   ├── nginx.conf                     # Configuração principal
│   ├── prod.conf                      # Configuração de produção
│   └── dev.conf                       # Configuração de desenvolvimento
└── scripts/                           # Scripts de automação
    ├── prod-entrypoint.sh             # Entrypoint de produção
    ├── dev-entrypoint.sh              # Entrypoint de desenvolvimento
    └── fix-permissions.sh             # Correção de permissões
```

## 🚀 Como Usar

### Produção

```bash
# Build da imagem
docker build -f docker/Dockerfile.production -t linkchartapp-frontend:latest .

# Executar com compose
docker-compose -f docker/docker-compose.production.yml up -d

# Verificar logs
docker-compose -f docker/docker-compose.production.yml logs -f frontend
```

### Desenvolvimento

```bash
# Executar entrypoint de desenvolvimento
./docker/scripts/dev-entrypoint.sh

# Corrigir permissões se necessário
./docker/scripts/fix-permissions.sh
```

## 🔧 Configurações

### Variáveis de Ambiente

- `NODE_ENV=production`
- `NEXT_PUBLIC_API_URL=http://138.197.121.81`
- `PORT=3000`
- `HOSTNAME=0.0.0.0`

### Portas

- **3000**: Next.js Application
- **80**: Nginx Reverse Proxy
- **443**: HTTPS (quando configurado)

## 📊 Monitoramento

### Health Checks

- **Frontend**: `http://localhost:3000/health`
- **Nginx**: `http://localhost/health`

### Logs

```bash
# Logs do frontend
docker logs linkchartapp-frontend

# Logs do nginx
docker logs linkchartapp-nginx

# Logs via compose
docker-compose -f docker/docker-compose.production.yml logs -f
```

## 🔐 Segurança

### Headers Configurados

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### CORS

- Produção: Restrito ao domínio configurado
- Desenvolvimento: Liberado para localhost

## 🎯 Performance

### Otimizações Implementadas

- **Gzip compression** habilitada
- **Static file caching** configurado
- **Bundle splitting** otimizado
- **Image optimization** ativada
- **Rate limiting** configurado

### Recursos

- **CPU**: 0.5 cores (limite), 0.25 cores (reserva)
- **Memory**: 1GB (limite), 512MB (reserva)

## 🔄 Deploy Automático

O deploy é realizado via GitHub Actions:

1. **Build** da aplicação
2. **Docker build** e push para registry
3. **Deploy** no servidor DigitalOcean
4. **Health check** automático
5. **Rollback** em caso de falha

## 🛠️ Troubleshooting

### Problemas Comuns

1. **Permissões**: Execute `./docker/scripts/fix-permissions.sh`
2. **Cache**: Limpe com `docker system prune -f`
3. **Conectividade**: Verifique se o backend está acessível

### Comandos Úteis

```bash
# Verificar status
docker-compose -f docker/docker-compose.production.yml ps

# Reiniciar serviços
docker-compose -f docker/docker-compose.production.yml restart

# Atualizar imagem
docker-compose -f docker/docker-compose.production.yml pull
docker-compose -f docker/docker-compose.production.yml up -d

# Backup da configuração
tar -czf frontend-config-backup.tar.gz docker/
```

## 📞 Suporte

Para problemas relacionados ao Docker:

1. Verifique os logs dos containers
2. Confirme as variáveis de ambiente
3. Teste a conectividade com o backend
4. Execute os scripts de correção de permissões
