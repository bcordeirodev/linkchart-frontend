"use client";

import NextLink from "next/link";
import {
  Box,
  FormControl,
  FormLabel,
  Link as MuiLink,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { useSubdomains } from "@/features/subdomains/hooks/useSubdomains";

import type { SelectChangeEvent } from "@mui/material";

/** Sentinel `Select` value for "nothing picked yet" (`subdomainId: null`, still invalid on submit). */
const UNSET_VALUE = "";

/** Strips scheme and trailing slash so a URL reads as a bare host. */
function toHost(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export interface BioAddressSelectProps {
  /** Selected subdomain id, or `null` when nothing has been picked yet. */
  value: number | null;
  /** Called with the newly selected id. Never called with `null` — there is no "unpick" option once one is chosen. */
  onChange: (id: number | null) => void;
  /** Validation message from `bioPageFormSchema`'s `subdomainId` rule, or `undefined` when valid/untouched. */
  error?: string;
}

/**
 * Required address picker for where the bio page is published: one option
 * per active subdomain the user holds, each becoming the page's root (no
 * `/@{handle}` suffix — see `BioPageService::computeUrl()`). Subdomain-first:
 * the backend rejects `subdomain_id: null` unconditionally on `PUT /api/bio`,
 * so unlike the link-creation domain picker there is no "default domain"
 * option here — a bio page cannot exist without an associated subdomain.
 *
 * Deliberately its own component rather than a reuse of
 * `@/features/subdomains/components/SubdomainSelect`: that control still
 * offers the default-domain option (link creation doesn't require a
 * subdomain) and is itself gated behind `NEXT_PUBLIC_SUBDOMAINS_ENABLED`.
 * This component intentionally does NOT check that flag — a bio page's
 * dependency on a subdomain is a hard backend rule, not a feature-flagged
 * nicety, so hiding the (required) control here would leave the form
 * impossible to submit with no visible explanation. Both components read
 * the same list (`useSubdomains`, imported read-only) but can't share label
 * logic.
 *
 * When the user holds no active subdomain yet, shows a prompt to create one
 * (linking to `/subdomains`) instead of a dropdown with nothing to pick —
 * the caller (`BioSubdomainGate`) normally intercepts this case before the
 * form ever renders, so in practice this branch only shows for an existing
 * (legacy, pre-subdomain-first) page whose owner has since released their
 * only subdomain.
 */
export function BioAddressSelect({
  value,
  onChange,
  error,
}: BioAddressSelectProps) {
  const { t } = useTranslation("bio");
  const { subdomains, isLoading } = useSubdomains();

  if (isLoading) {
    return (
      <Box>
        <FormLabel sx={{ display: "block", mb: 0.75 }}>
          {t("form.address.label")}
        </FormLabel>
        <Skeleton variant="rounded" height={40} />
      </Box>
    );
  }

  if (subdomains.length === 0) {
    return (
      <Box>
        <FormLabel sx={{ display: "block", mb: 0.75 }}>
          {t("form.address.label")}
        </FormLabel>
        <Typography variant="body2" color="text.secondary">
          {t("form.address.emptyHint")}
        </Typography>
        <MuiLink
          component={NextLink}
          href="/subdomains"
          variant="caption"
          sx={{ display: "inline-block", mt: 0.5 }}
        >
          {t("form.address.createCta")}
        </MuiLink>
      </Box>
    );
  }

  const selectValue = value === null ? UNSET_VALUE : String(value);

  const handleChange = (event: SelectChangeEvent) => {
    const raw = event.target.value;
    if (raw) onChange(Number(raw));
  };

  return (
    <Box>
      <FormLabel
        htmlFor="bio-address-select"
        sx={{ display: "block", mb: 0.75 }}
      >
        {t("form.address.label")}
      </FormLabel>
      <FormControl fullWidth size="small" error={!!error}>
        <Select
          id="bio-address-select"
          value={selectValue}
          onChange={handleChange}
          displayEmpty
          renderValue={(selected) =>
            selected ? (
              toHost(
                subdomains.find((item) => String(item.id) === selected)
                  ?.fullUrl ?? "",
              )
            ) : (
              <Box component="span" sx={{ color: "text.disabled" }}>
                {t("form.address.placeholder")}
              </Box>
            )
          }
        >
          {subdomains.map((item) => (
            <MenuItem key={item.id} value={String(item.id)}>
              {toHost(item.fullUrl)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography
        variant="caption"
        color={error ? "error" : "text.secondary"}
        sx={{ display: "block", mt: 0.75 }}
      >
        {error ?? t("form.address.hint")}
      </Typography>
    </Box>
  );
}

export default BioAddressSelect;
