"use client";

import { useEffect, useRef, useState } from "react";

import { useSubdomains } from "./useSubdomains";

/** Mirrors the flag every other subdomains consumer reads directly. */
const SUBDOMAINS_ENABLED =
  process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED === "true";

/**
 * Manages the subdomain selected for a link that's about to be created.
 *
 * Defaults to the oldest active subdomain once the list loads, mirroring the
 * backend's own default when `subdomain_id` is omitted from the request
 * (`UserSubdomain::findByUserCached` — the oldest active row). The default is
 * applied exactly once per mount; afterwards only the caller's `setSubdomainId`
 * changes the value, so a background list refetch can't silently swap the
 * user's selection mid-edit.
 *
 * @returns `subdomains` (from `useSubdomains()`), `isLoading` (false whenever
 * the feature flag is off — there's no list to wait for), the current
 * `subdomainId` (`null` means "default domain"), `setSubdomainId`, `selected`
 * — the resolved `SubdomainItem` for `subdomainId`, or `null` — and
 * `subdomainIdField`, the `subdomain_id` entry to spread into a link-create
 * payload.
 */
export function useSubdomainSelection() {
  const { subdomains, isLoading: isLoadingSubdomains } = useSubdomains();
  const [subdomainId, setSubdomainId] = useState<number | null>(null);
  const didInitialize = useRef(false);

  // With the flag off, `useSubdomains()`'s query never runs, so its
  // `isLoading` reads `false` from the first render. Gating on the flag here
  // too keeps `isLoading` meaning exactly one thing for callers: "the list is
  // enabled but hasn't resolved yet" — never "the feature happens to be off".
  const isLoading = SUBDOMAINS_ENABLED && isLoadingSubdomains;

  useEffect(() => {
    if (didInitialize.current || isLoading) {
      return;
    }
    const oldest = subdomains[0];
    if (oldest) {
      setSubdomainId(oldest.id);
    }
    didInitialize.current = true;
  }, [subdomains, isLoading]);

  const selected = subdomains.find((item) => item.id === subdomainId) ?? null;

  /**
   * The `subdomain_id` field to spread into a link-create payload, or
   * `undefined` to omit it entirely — spreading `undefined` into an object
   * literal (`{ ...maybeUndefined }`) is a no-op, so the key is truly absent
   * from the request rather than present with a `null`/`undefined` value.
   *
   * The backend gives a *present* `subdomain_id: null` and an *omitted*
   * `subdomain_id` different meanings: present `null` forces the account's
   * default domain, while omitting the field makes it pick the user's oldest
   * active subdomain. Both "list still loading" and "feature flag off" must
   * omit the field for that reason — sending `null` in either case would
   * silently create the link on the default domain instead of the user's
   * subdomain, and `short_domain` can't be changed after the fact.
   */
  const subdomainIdField =
    !SUBDOMAINS_ENABLED || isLoading
      ? undefined
      : { subdomain_id: subdomainId };

  return {
    subdomains,
    isLoading,
    subdomainId,
    setSubdomainId,
    selected,
    subdomainIdField,
  };
}
