#!/bin/bash
# Deploy blue/green do frontend.
#
# O container novo sobe FORA do trafego (porta ociosa) e so passa a receber
# requisicoes depois de responder no health check. Se ele falhar, o container
# antigo continua servindo e o deploy aborta — o site nunca cai.
#
# A cor ativa e definida por /etc/nginx/conf.d/upstreams.conf (unica fonte de
# verdade). blue = 3000, green = 3001.
#
# Chamado por .github/workflows/release.yml com IMAGE_TAG no ambiente.
set -euo pipefail

PROJECT_PATH="/var/www/linkchart-frontend-next"
COMPOSE_FILE="docker-compose.prod.yml"
UPSTREAMS="/etc/nginx/conf.d/upstreams.conf"
IMAGE="ghcr.io/bcordeirodev/linkchart-frontend"
: "${IMAGE_TAG:?IMAGE_TAG obrigatorio}"

cd "$PROJECT_PATH"

# ── Descobrir a cor ativa lendo o nginx ───────────────────────────────────────
if grep -qE '^\s*server\s+127\.0\.0\.1:3000;' "$UPSTREAMS"; then
    ACTIVE_COLOR="blue";  ACTIVE_PORT=3000
    TARGET_COLOR="green"; TARGET_PORT=3001
else
    ACTIVE_COLOR="green"; ACTIVE_PORT=3001
    TARGET_COLOR="blue";  TARGET_PORT=3000
fi
echo "Cor ativa: $ACTIVE_COLOR (:$ACTIVE_PORT) → subindo $TARGET_COLOR (:$TARGET_PORT)"

# ── Pull da imagem ja pronta (nada e compilado aqui) ──────────────────────────
echo "Baixando ${IMAGE}:${IMAGE_TAG}..."
docker pull "${IMAGE}:${IMAGE_TAG}"

# ── Limpar um container da cor alvo que tenha ficado orfao ────────────────────
docker rm -f "linkcharts-frontend-${TARGET_COLOR}" 2>/dev/null || true

# ── Subir a cor alvo, FORA do nginx (ainda sem trafego) ───────────────────────
echo "Subindo o container $TARGET_COLOR..."
IMAGE_TAG="$IMAGE_TAG" COLOR="$TARGET_COLOR" APP_PORT="$TARGET_PORT" \
    docker compose -p "linkcharts-frontend-${TARGET_COLOR}" -f "$COMPOSE_FILE" up -d

# ── Health check direto na porta da cor alvo ──────────────────────────────────
# Se falhar, aborta: remove a cor alvo e deixa a cor ativa servindo intacta.
echo "Health check em 127.0.0.1:${TARGET_PORT}..."
healthy=0
for attempt in $(seq 1 30); do
    if curl -fsS --max-time 5 "http://127.0.0.1:${TARGET_PORT}/api/health" >/dev/null 2>&1; then
        healthy=1
        echo "  saudavel na tentativa $attempt"
        break
    fi
    sleep 2
done

if [ "$healthy" -ne 1 ]; then
    echo "ERRO: $TARGET_COLOR nao ficou saudavel. Abortando — $ACTIVE_COLOR segue servindo."
    IMAGE_TAG="$IMAGE_TAG" COLOR="$TARGET_COLOR" APP_PORT="$TARGET_PORT" \
        docker compose -p "linkcharts-frontend-${TARGET_COLOR}" -f "$COMPOSE_FILE" logs --tail=50 || true
    docker rm -f "linkcharts-frontend-${TARGET_COLOR}" 2>/dev/null || true
    exit 1
fi

# ── Virar o trafego: reescreve o upstream e recarrega o nginx ─────────────────
# O range do sed limita a substituicao ao bloco `upstream frontend_app` — o
# `backend_app` (porta 8000) NAO pode ser tocado aqui.
# `nginx -s reload` e graceful: os workers antigos drenam as conexoes em curso.
echo "Apontando o nginx para $TARGET_COLOR (:$TARGET_PORT)..."
sed -i -E "/upstream frontend_app/,/}/ s#server 127\.0\.0\.1:[0-9]+;#server 127.0.0.1:${TARGET_PORT};#" "$UPSTREAMS"

if ! nginx -t 2>/dev/null; then
    echo "ERRO: config do nginx invalida. Revertendo o upstream."
    sed -i -E "/upstream frontend_app/,/}/ s#server 127\.0\.0\.1:[0-9]+;#server 127.0.0.1:${ACTIVE_PORT};#" "$UPSTREAMS"
    docker rm -f "linkcharts-frontend-${TARGET_COLOR}" 2>/dev/null || true
    exit 1
fi
nginx -s reload
echo "Trafego agora vai para $TARGET_COLOR"

# ── Grace period e desligamento da cor antiga ─────────────────────────────────
sleep 10
echo "Desligando $ACTIVE_COLOR..."
# As variaveis precisam ser passadas mesmo no `down`: o compose interpola o
# arquivo antes de qualquer subcomando, e elas sao obrigatorias (`:?`).
IMAGE_TAG="$IMAGE_TAG" COLOR="$ACTIVE_COLOR" APP_PORT="$ACTIVE_PORT" \
    docker compose -p "linkcharts-frontend-${ACTIVE_COLOR}" -f "$COMPOSE_FILE" down --remove-orphans 2>/dev/null || true
docker rm -f "linkcharts-frontend-${ACTIVE_COLOR}" 2>/dev/null || true

# ── Container legado (pre-blue/green) ─────────────────────────────────────────
# O deploy antigo criava `linkcharts-frontend-next-prod` sob outro nome de
# projeto. Ele nao segue o esquema de cores, entao os comandos acima o ignoram —
# e ele continuaria segurando a porta 3000, fazendo o PROXIMO deploy (alvo =
# blue :3000) falhar no bind. Removido aqui.
if docker ps -a --format '{{.Names}}' | grep -qx 'linkcharts-frontend-next-prod'; then
    echo "Removendo o container legado linkcharts-frontend-next-prod..."
    docker rm -f linkcharts-frontend-next-prod || true
fi

# ── Limpeza (mantem imagens recentes para rollback rapido) ────────────────────
docker image prune -f >/dev/null 2>&1 || true

echo ""
echo "Deploy concluido — $TARGET_COLOR ativa na porta $TARGET_PORT (tag: $IMAGE_TAG)"
docker ps --filter "name=linkcharts-frontend" --format "  {{.Names}}  {{.Status}}"
