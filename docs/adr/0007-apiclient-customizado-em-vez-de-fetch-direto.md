# 0007 — ApiClient customizado em vez de fetch direto

- Status: Accepted
- Data: 2026-05-10
- Autores: equipe Link Charts

## Contexto

Toda chamada à API Laravel precisa: (1) injetar `Authorization: Bearer <token>` quando há sessão; (2) desempacotar o envelope `{data, meta?, message?}` retornado pelo middleware `NormalizeApiResponse` do backend; (3) normalizar erros para `{error: {code, message, details?}}`; (4) rotear via `/api/*` (proxy do `next.config.ts`) sem que o componente saiba do `API_URL`.

Hoje todos os services estendem uma classe `BaseService` que delega para um cliente HTTP. A pergunta é: esse cliente é `fetch` puro? Axios? Customizado?

## Decisão

Construímos uma classe `ApiClient` em `src/lib/api/client.ts`. Ela usa `fetch` nativo internamente. A única responsabilidade de cada service é mapear endpoints → métodos do cliente. Componentes nunca importam `fetch` diretamente nem fazem `await fetch(...)`.

## Alternativas consideradas

- **`fetch` puro nos componentes** — Cada componente reimplementaria token, envelope, erro. Bug repete N vezes.
- **Axios** — Dependência a mais sem benefício claro com `fetch` nativo do Next 15. Interceptors são úteis, mas conseguimos efeito equivalente no `ApiClient`.
- **Code-gen a partir do OpenAPI do backend** — Backend não publica OpenAPI hoje; investir nessa dependência sai do escopo.

## Consequências

### Positivas

- Auth header injetado uma vez (no cliente).
- Envelope unwrapping centralizado.
- Substituível: trocar `fetch` por `axios` (ou outro) sem mexer nos services nem nos componentes.
- Tipagem forte via Generics nos métodos do `BaseService`.

### Negativas

- Camada extra a entender quando o dev é novo no projeto.
- Type safety depende de Generics bem usados nos services — descuido vira `unknown`/`any`.
- Logs centrais de request: temos que confiar no `ApiClient` ou redirecionar para outro lugar (DevTools de Network ainda funciona como fallback).
