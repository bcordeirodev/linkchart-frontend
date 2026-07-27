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

import { getPublicBioUrlPrefix } from "../utils/publicBioUrl";

import type { SelectChangeEvent } from "@mui/material";

/** Sentinel `Select` value for "publish at the default `/@{handle}` address" (`subdomainId: null`). */
const DEFAULT_VALUE = "__default__";

/** Strips scheme and trailing slash so a URL reads as a bare host. */
function toHost(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export interface BioAddressSelectProps {
  /** Selected subdomain id, or `null` for the default `/@{handle}` address. */
  value: number | null;
  /** Called with the newly selected id, or `null` for the default address. */
  onChange: (id: number | null) => void;
  /** Current handle draft, used to render the default option's full address. */
  handle: string;
}

/**
 * Address picker for where the bio page is published: the default
 * `linkcharts.com.br/@{handle}` plus one option per active subdomain the
 * user holds (each becomes the page's root, no `/@{handle}` suffix — see
 * `BioPageService::computeUrl()`).
 *
 * Deliberately its own component rather than a reuse of
 * `@/features/subdomains/components/SubdomainSelect`: that control's option
 * labels assume a slug gets appended after the domain (the link-creation
 * case), whereas here a subdomain replaces the address entirely — the two
 * read the same list (`useSubdomains`, imported read-only) but can't share
 * label logic.
 *
 * Renders nothing when the subdomains feature flag is off (mirrors
 * `SubdomainSelect`'s own gate). When the flag is on but the user holds no
 * active subdomain, shows a discreet, disabled-reading line with the
 * default address plus a link to `/subdomains` instead of a dropdown with
 * nothing to pick — a disabled `Select` here would only add visual weight
 * for a choice that doesn't exist yet.
 */
export function BioAddressSelect({
  value,
  onChange,
  handle,
}: BioAddressSelectProps) {
  const { t } = useTranslation("bio");
  const { subdomains, isLoading } = useSubdomains();

  if (process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED !== "true") {
    return null;
  }

  const defaultLabel = `${getPublicBioUrlPrefix()}${
    handle.trim() || t("form.handle.placeholder")
  }`;

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
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontFamily: "monospace" }}
        >
          {defaultLabel}
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

  const selectValue = value === null ? DEFAULT_VALUE : String(value);

  const handleChange = (event: SelectChangeEvent) => {
    const raw = event.target.value;
    onChange(raw === DEFAULT_VALUE ? null : Number(raw));
  };

  return (
    <Box>
      <FormLabel
        htmlFor="bio-address-select"
        sx={{ display: "block", mb: 0.75 }}
      >
        {t("form.address.label")}
      </FormLabel>
      <FormControl fullWidth size="small">
        <Select
          id="bio-address-select"
          value={selectValue}
          onChange={handleChange}
        >
          <MenuItem value={DEFAULT_VALUE}>{defaultLabel}</MenuItem>
          {subdomains.map((item) => (
            <MenuItem key={item.id} value={String(item.id)}>
              {toHost(item.fullUrl)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 0.75 }}
      >
        {t("form.address.hint")}
      </Typography>
    </Box>
  );
}

export default BioAddressSelect;
