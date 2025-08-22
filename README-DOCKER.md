# 🐳 Docker Setup - Link Chart Frontend

## 📋 Visão Geral

O front-end do Link Chart está configurado para funcionar tanto localmente quanto em containers Docker, com comunicação perfeita com o backend containerizado.

## 🏗️ Arquitetura

### Modo 1: Frontend Local + Backend Container
```
┌─────────────────┐    HTTP     ┌─────────────────┐
│  Frontend       │ ────────── │  Backend        │
│  localhost:3000 │             │  localhost:8000 │
│  (npm run dev)  │             │  (Docker)       │
└─────────────────┘             └─────────────────┘
```

### Modo 2: Frontend + Backend em Containers
```
┌─────────────────┐    Docker   ┌─────────────────┐
│  Frontend       │ ────────── │  Backend        │
│  container:3000 │   Network   │  container:8000 │
│  (Docker)       │             │  (Docker)       │
└─────────────────┘             └─────────────────┘
```

## 🚀 Como Usar

### Opção 1: Setup Automático (Recomendado)
```bash
# No diretório front-end
./docker-setup.sh
```

### Opção 2: Comandos Manuais
```bash
# Ver opções disponíveis
make help

# Iniciar ambiente completo
make up

# Iniciar apenas frontend (backend deve estar rodando)
make frontend-only

# Verificar status
make status

# Ver logs
make logs
```

### Opção 3: Frontend Local + Backend Container
```bash
# 1. Certifique-se que o backend está rodando
cd ../back-end
make up

# 2. Configure o ambiente local
cd ../front-end
cp .env.local .env

# 3. Instale dependências e execute
npm install
npm run dev
```

## 📁 Arquivos de Configuração

### `.env` - Configuração Principal
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api  # Backend container
NEXT_PUBLIC_BASE_URL=http://localhost:3000     # Frontend
NEXTAUTH_URL=http://localhost:3000
```

### `.env.local` - Desenvolvimento Local
- Frontend roda localmente (npm run dev)
- Conecta ao backend em container

### `.env.docker` - Container Completo
- Frontend e backend em containers
- Comunicação via rede Docker

### `.env.production` - Produção
- Configurações para deploy em produção

## 🐳 Docker Compose

### Serviços Incluídos:
- **frontend**: Next.js em desenvolvimento
- **backend**: Laravel API
- **database**: PostgreSQL
- **redis**: Cache e sessões

### Comandos Docker Compose:
```bash
# Iniciar tudo
docker compose up -d

# Parar tudo
docker compose down

# Rebuild
docker compose build --no-cache

# Logs
docker compose logs -f frontend
```

## 🔧 Configurações Importantes

### Comunicação Container → Container
Quando frontend e backend estão em containers:
```bash
NEXT_PUBLIC_API_URL=http://backend:8000/api
```

### Comunicação Local → Container
Quando frontend local conecta ao backend container:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Next.js Rewrites
O `next.config.mjs` inclui rewrites automáticos:
```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
    },
  ];
}
```

## 🧪 Testando a Configuração

### 1. Verificar Backend
```bash
curl http://localhost:8000/health
```

### 2. Verificar Frontend
```bash
curl http://localhost:3000
```

### 3. Verificar Comunicação
```bash
# No browser: http://localhost:3000
# DevTools → Network → Ver chamadas para /api/*
```

## 🐛 Troubleshooting

### Frontend não conecta ao Backend
1. Verificar se backend está rodando: `docker ps`
2. Verificar variável de ambiente: `echo $NEXT_PUBLIC_API_URL`
3. Verificar logs: `make logs-frontend`

### Erro de CORS
- O backend já está configurado para aceitar requisições do frontend
- Verificar configuração no backend: `config/cors.php`

### Container não inicia
```bash
# Limpar tudo e reconstruir
make clean
make build
make up
```

### Mudanças não aparecem
```bash
# Se usando volumes, reiniciar container
docker compose restart frontend

# Se problema persistir, rebuild
docker compose build frontend --no-cache
```

## 📊 Monitoramento

### Logs em tempo real:
```bash
# Todos os containers
make logs

# Apenas frontend
make logs-frontend

# Apenas backend
make logs-backend
```

### Status dos containers:
```bash
make status
```

### Saúde da aplicação:
```bash
make backend-check
```

## 🔄 Workflows de Desenvolvimento

### Desenvolvimento Rápido:
1. Backend sempre em container (dados persistentes)
2. Frontend local (hot reload mais rápido)
3. Use `.env.local`

### Teste Completo:
1. Ambos em containers
2. Use `docker-compose.yml`
3. Teste como será em produção

### Debug:
1. Use `make shell` para acessar containers
2. Logs detalhados com `make logs`
3. Verificar variáveis de ambiente nos containers

## 📝 Comandos Úteis

```bash
# Makefile commands
make help                 # Ver todos os comandos
make dev-setup           # Setup completo para desenvolvimento
make frontend-only       # Apenas frontend
make shell              # Acessar shell do container
make install            # Instalar dependências
make lint               # Executar linter
make format             # Formatar código

# Docker direto
docker exec -it linkchartfrontend-dev sh
docker logs linkchartfrontend-dev -f
docker compose exec frontend npm run build
```

## 🚀 Deploy

Para produção, use as configurações em `.env.production` e:
```bash
docker compose -f docker-compose.prod.yml up -d
```

---

**🎯 OBJETIVO**: Ambiente de desenvolvimento flexível que funciona localmente e em containers, mantendo compatibilidade total com o backend Docker!
