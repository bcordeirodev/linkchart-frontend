# ==============================================
# MAKEFILE - FRONTEND DOCKER DEVELOPMENT
# ==============================================

.PHONY: help up down build restart logs shell install test clean status frontend-only

# Variáveis
DOCKER_COMPOSE = docker compose
FRONTEND_CONTAINER = linkchartfrontend-dev
BACKEND_CONTAINER = linkchartapi-backend

help: ## Mostrar ajuda
	@echo "📋 Comandos disponíveis para Frontend:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Iniciar frontend + backend completo
	@echo "🚀 Iniciando ambiente completo (Frontend + Backend)..."
	$(DOCKER_COMPOSE) up -d
	@echo "✅ Ambiente iniciado!"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🔗 Backend API: http://localhost:8000"

down: ## Parar todos os containers
	@echo "🛑 Parando containers..."
	$(DOCKER_COMPOSE) down
	@echo "✅ Containers parados!"

build: ## Build das imagens Docker
	@echo "🔨 Fazendo build das imagens..."
	$(DOCKER_COMPOSE) build --no-cache
	@echo "✅ Build concluído!"

restart: ## Reiniciar containers
	@echo "🔄 Reiniciando containers..."
	$(DOCKER_COMPOSE) restart
	@echo "✅ Containers reiniciados!"

logs: ## Ver logs dos containers
	@echo "📋 Logs dos containers:"
	$(DOCKER_COMPOSE) logs -f

logs-frontend: ## Ver logs apenas do frontend
	@echo "📋 Logs do Frontend:"
	$(DOCKER_COMPOSE) logs -f frontend

logs-backend: ## Ver logs apenas do backend
	@echo "📋 Logs do Backend:"
	$(DOCKER_COMPOSE) logs -f backend

shell: ## Acessar shell do container frontend
	@echo "🖥️ Acessando shell do frontend..."
	docker exec -it $(FRONTEND_CONTAINER) sh

shell-backend: ## Acessar shell do container backend
	@echo "🖥️ Acessando shell do backend..."
	docker exec -it $(BACKEND_CONTAINER) bash

install: ## Instalar dependências no frontend
	@echo "📦 Instalando dependências..."
	docker exec $(FRONTEND_CONTAINER) npm install
	@echo "✅ Dependências instaladas!"

install-clean: ## Limpar e reinstalar dependências
	@echo "🧹 Limpando e reinstalando dependências..."
	docker exec $(FRONTEND_CONTAINER) rm -rf node_modules package-lock.json
	docker exec $(FRONTEND_CONTAINER) npm install
	@echo "✅ Dependências reinstaladas!"

test: ## Executar testes
	@echo "🧪 Executando testes..."
	docker exec $(FRONTEND_CONTAINER) npm test
	@echo "✅ Testes concluídos!"

lint: ## Executar linter
	@echo "🔍 Executando linter..."
	docker exec $(FRONTEND_CONTAINER) npm run lint
	@echo "✅ Linter concluído!"

lint-fix: ## Corrigir problemas do linter
	@echo "🔧 Corrigindo problemas do linter..."
	docker exec $(FRONTEND_CONTAINER) npm run lint:fix
	@echo "✅ Linter corrigido!"

format: ## Formatar código
	@echo "💅 Formatando código..."
	docker exec $(FRONTEND_CONTAINER) npm run format
	@echo "✅ Código formatado!"

build-frontend: ## Build do frontend dentro do container
	@echo "🏗️ Fazendo build do frontend..."
	docker exec $(FRONTEND_CONTAINER) npm run build
	@echo "✅ Build do frontend concluído!"

clean: ## Limpar containers e volumes
	@echo "🧹 Limpando containers e volumes..."
	$(DOCKER_COMPOSE) down -v --remove-orphans
	docker system prune -f
	@echo "✅ Limpeza concluída!"

status: ## Verificar status dos containers
	@echo "📊 Status dos containers:"
	docker ps --filter="name=linkchart" --format="table {{.Names}}\t{{.Status}}\t{{.Ports}}"

frontend-only: ## Iniciar apenas o frontend (requer backend já rodando)
	@echo "🎯 Iniciando apenas frontend..."
	$(DOCKER_COMPOSE) up -d frontend
	@echo "✅ Frontend iniciado!"
	@echo "🌐 Frontend: http://localhost:3000"

backend-check: ## Verificar se backend está acessível
	@echo "🔍 Verificando conectividade com backend..."
	@curl -f http://localhost:8000/health || echo "❌ Backend não acessível"
	@echo "✅ Verificação concluída!"

dev-setup: ## Setup completo para desenvolvimento
	@echo "🛠️ Configurando ambiente de desenvolvimento..."
	$(DOCKER_COMPOSE) down -v
	$(DOCKER_COMPOSE) build
	$(DOCKER_COMPOSE) up -d
	@echo "⏳ Aguardando containers..."
	@sleep 15
	@echo "✅ Ambiente pronto para desenvolvimento!"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🔗 Backend API: http://localhost:8000"

.DEFAULT_GOAL := help
