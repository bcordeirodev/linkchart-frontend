/**
 * Route-level loading UI for the subdomain-hosted bio page (`{sub}.{root}/`
 * → `/s/[sub]`). Identical skeleton to `/b/[handle]`'s — both routes render
 * the same `BioPublicPage` component from the same payload shape, so there
 * is nothing route-specific to differ here. Re-exported rather than
 * duplicated so the two stay in sync automatically.
 */
export { default } from "../../b/[handle]/loading";
