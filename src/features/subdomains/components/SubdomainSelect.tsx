"use client";

import { FormControl, MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useSubdomains } from "../hooks/useSubdomains";

import type { SelectChangeEvent } from "@mui/material";

/** Sentinel `Select` value for "use the default domain" (`subdomain_id: null`). */
const DEFAULT_DOMAIN_VALUE = "__default__";

export interface SubdomainSelectProps {
  /** Selected subdomain id, or `null` for the default domain. */
  value: number | null;
  /** Called with the newly selected id, or `null` for the default domain. */
  onChange: (id: number | null) => void;
  size?: "small" | "medium";
  /** DOM id, so a caller-rendered `<FormLabel htmlFor>` can target this control. */
  id?: string;
  fullWidth?: boolean;
  /**
   * Accessible name for contexts with no visible label sitting above the
   * control (e.g. the quick-create row, which labels fields via placeholder
   * + aria-label rather than `<FormLabel>`).
   */
  "aria-label"?: string;
}

/**
 * Domain picker shown at link creation: "Default domain" plus one option per
 * active subdomain the user holds. Follows the project's external-label
 * convention — this component renders only the control, no `<FormLabel>`;
 * callers that want a visible label render one above it (see
 * `LinkFormFields.tsx`).
 *
 * Renders nothing when the subdomains feature flag is off, or once loaded,
 * when the user has no active subdomains — there is no real choice to make
 * in that case, so the field would only add noise.
 */
export function SubdomainSelect({
  value,
  onChange,
  size = "medium",
  id,
  fullWidth = true,
  "aria-label": ariaLabel,
}: SubdomainSelectProps) {
  const { t } = useTranslation("links");
  const { subdomains, isLoading } = useSubdomains();

  if (process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED !== "true") {
    return null;
  }
  if (!isLoading && subdomains.length === 0) {
    return null;
  }

  const selectValue = value === null ? DEFAULT_DOMAIN_VALUE : String(value);

  const handleChange = (event: SelectChangeEvent) => {
    const raw = event.target.value;
    onChange(raw === DEFAULT_DOMAIN_VALUE ? null : Number(raw));
  };

  return (
    <FormControl size={size} fullWidth={fullWidth}>
      <Select
        id={id}
        value={selectValue}
        onChange={handleChange}
        disabled={isLoading}
        inputProps={ariaLabel ? { "aria-label": ariaLabel } : undefined}
      >
        <MenuItem value={DEFAULT_DOMAIN_VALUE}>
          {t("form.subdomainSelect.defaultOption")}
        </MenuItem>
        {subdomains.map((item) => (
          <MenuItem key={item.id} value={String(item.id)}>
            {item.subdomain}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SubdomainSelect;
