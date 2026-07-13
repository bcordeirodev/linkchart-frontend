#!/bin/bash
# Guard: toda NEXT_PUBLIC_* lida pelo codigo precisa de um ARG no Dockerfile.
#
# Por que isto existe: o Docker IGNORA silenciosamente um --build-arg que nao
# tenha ARG correspondente no Dockerfile. A variavel compila como string vazia,
# sem erro e sem aviso. Foi assim que NEXT_PUBLIC_GADS_CONV_SHORTEN/SIGNUP
# ficaram vazias em producao por semanas: o gtag disparava com send_to vazio e
# NENHUMA conversao do Google Ads era registrada, enquanto a campanha gastava.
#
# O bug e invisivel em dev (o `next build` no host le o .env.production
# normalmente). So quebra dentro do Docker, que e exatamente o que vai para
# producao. Este script fecha essa lacuna.
set -euo pipefail

cd "$(dirname "$0")/.."

# Variaveis lidas pelo codigo (fonte de verdade)
IN_CODE=$(grep -rhoE "process\.env\.NEXT_PUBLIC_[A-Z_0-9]+" src app middleware.ts next.config.ts 2>/dev/null \
    | sed 's/process\.env\.//' | sort -u)

# Variaveis declaradas no Dockerfile
IN_DOCKERFILE=$(grep -oE "^ARG NEXT_PUBLIC_[A-Z_0-9]+" Dockerfile | sed 's/^ARG //' | sort -u)

MISSING=$(comm -23 <(echo "$IN_CODE") <(echo "$IN_DOCKERFILE"))

if [ -n "$MISSING" ]; then
    echo "ERRO: variaveis NEXT_PUBLIC_* lidas pelo codigo mas SEM 'ARG' no Dockerfile."
    echo ""
    echo "O Docker vai ignorar a --build-arg em silencio e elas compilarao VAZIAS"
    echo "em producao — sem erro, sem aviso, e funcionando normalmente em dev."
    echo ""
    echo "Faltando:"
    echo "$MISSING" | sed 's/^/  - /'
    echo ""
    echo "Corrija adicionando, para cada uma:"
    echo "  1. 'ARG <VAR>' no Dockerfile (stage builder, antes do npm run build)"
    echo "  2. '<VAR>=\${{ vars.<VAR> }}' em build-args no .github/workflows/release.yml"
    exit 1
fi

echo "OK: todas as $(echo "$IN_CODE" | wc -l | tr -d ' ') variaveis NEXT_PUBLIC_* lidas pelo codigo tem ARG no Dockerfile."
