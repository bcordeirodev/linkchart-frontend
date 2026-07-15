/**
 * Mirrors the backend default for `config('app.max_subdomains_per_user')`
 * (`MAX_SUBDOMAINS_PER_USER` env var, default `3`). There is no endpoint that
 * exposes the configured limit to the client, so this constant drives the
 * "N de M" count and the pre-emptive `limitReached` gate in `useSubdomains()`.
 * If the backend limit is ever changed in production, update this value too —
 * a mismatch only degrades the UX (the claim button hides a step late, or a
 * legitimate claim is blocked client-side one step early); the backend's own
 * 422 `SUBDOMAIN_LIMIT_REACHED` remains the source of truth for enforcement.
 */
export const MAX_SUBDOMAINS_PER_USER = 3;
