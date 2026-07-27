# Deploy — frontend

**O guia canônico de deploy vive na raiz do workspace: [`../../docs/DEPLOY.md`](../../docs/DEPLOY.md)** (blue/green, CI vs. Release, rollback, regras de migration e diagnóstico). Este arquivo é só um stub — não duplicar conteúdo aqui.

Essencial específico do frontend:

- **Deploy é por tag `v*`** — merge em `main` só roda o CI (`.github/workflows/ci.yml`); `git tag v1.x.y && git push origin v1.x.y` dispara `.github/workflows/release.yml` (build no runner → GHCR → cutover blue/green 3000 ↔ 3001 via `scripts/deploy.sh`).
- **Toda `NEXT_PUBLIC_*` lida pelo código precisa de `ARG` no `Dockerfile`** e da `build-arg` correspondente no `release.yml` — o Docker ignora em silêncio `--build-arg` sem `ARG`, e a variável compila vazia só em produção. Guard: `scripts/check-build-args.sh` (roda no CI).
- Rollback: `gh workflow run "Release (frontend)" -f ref=v1.x.y` (tag anterior), zero downtime.
