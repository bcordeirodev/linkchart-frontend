/**
 * Not-found UI for the subdomain-hosted bio page (`{sub}.{root}/` →
 * `/s/[sub]`) — covers a malformed subdomain label and a subdomain the
 * backend doesn't know about. Identical to `/b/[handle]`'s (same copy,
 * same dark-palette default — an unresolved subdomain has no `theme` to
 * read either). Re-exported rather than duplicated so the two stay in sync
 * automatically.
 */
export { default, metadata } from "../../b/[handle]/not-found";
