import { resolveSeededLinkId } from "./helpers/auth-cookies";

/**
 * Resolves the seeded link id ONCE, before test discovery, and exposes it as
 * `E2E_LINK_ID`. Test discovery runs in the main process and again in every
 * worker; resolving per-collection (a network login) risks divergent results
 * and Playwright's "test title changed" error. Setting it here — where the env
 * propagates to all workers — keeps the per-link route list identical everywhere.
 */
export default function globalSetup(): void {
  if (!process.env.E2E_LINK_ID) {
    const linkId = resolveSeededLinkId();
    if (linkId) process.env.E2E_LINK_ID = linkId;
  }
}
