"use client";

import { useEffect, useRef, useState } from "react";

import { useSubdomains } from "./useSubdomains";

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
 * @returns `subdomains` (from `useSubdomains()`), `isLoading`, the current
 * `subdomainId` (`null` means "default domain"), `setSubdomainId`, and
 * `selected` — the resolved `SubdomainItem` for `subdomainId`, or `null`.
 */
export function useSubdomainSelection() {
  const { subdomains, isLoading } = useSubdomains();
  const [subdomainId, setSubdomainId] = useState<number | null>(null);
  const didInitialize = useRef(false);

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

  return { subdomains, isLoading, subdomainId, setSubdomainId, selected };
}
