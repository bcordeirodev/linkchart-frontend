"use client";

import { FormControl, MenuItem, Select } from "@mui/material";

import { getShortUrlPrefix } from "@/lib/utils/shortUrl";

import { useSubdomains } from "../hooks/useSubdomains";

import type { SelectChangeEvent } from "@mui/material";

/** Sentinel `Select` value for "use the default domain" (`subdomain_id: null`). */
const DEFAULT_DOMAIN_VALUE = "__default__";

/**
 * Strips scheme and trailing slash so a URL reads as a bare host.
 *
 * @param url - absolute URL (or host) to display.
 * @returns the host, e.g. `acme.linkcharts.com.br`.
 */
function toHost(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

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
   * Visual variant. `"outlined"` (default) is the standalone bordered control.
   * `"embedded"` drops the border/underline and background so the select can
   * sit INSIDE another bordered container (e.g. as the domain addon of the
   * quick-create "short link" input group) and read as one component.
   */
  variant?: "outlined" | "embedded";
  /**
   * Accessible name for contexts with no visible label sitting above the
   * control (e.g. the quick-create row, which labels fields via placeholder
   * + aria-label rather than `<FormLabel>`).
   */
  "aria-label"?: string;
}

/**
 * Domain picker shown at link creation: the default host plus one option per
 * active subdomain the user holds, each labelled by the host it produces.
 * Because every option is a complete host, callers must not append a domain
 * suffix beside it. Follows the project's external-label
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
  variant = "outlined",
  "aria-label": ariaLabel,
}: SubdomainSelectProps) {
  const { subdomains, isLoading } = useSubdomains();
  const embedded = variant === "embedded";

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
    <FormControl
      size={size}
      fullWidth={fullWidth}
      variant={embedded ? "standard" : "outlined"}
    >
      <Select
        id={id}
        value={selectValue}
        onChange={handleChange}
        disabled={isLoading}
        variant={embedded ? "standard" : "outlined"}
        disableUnderline={embedded}
        inputProps={ariaLabel ? { "aria-label": ariaLabel } : undefined}
        sx={
          embedded
            ? {
                // Sem borda/fundo: o select é só o "addon" de domínio dentro
                // do input group; herda a tipografia mono do prefixo ao lado.
                "& .MuiSelect-select": {
                  py: 0,
                  pl: 0,
                  pr: "20px !important",
                  fontFamily: "monospace",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  minHeight: "unset",
                },
                "&:before, &:after": { display: "none" },
              }
            : undefined
        }
      >
        {/* Every option is the host it produces — the default one included.
            "Domínio padrão (linkcharts.com.br)" said the same thing at three
            times the width, and mixing it with bare labels like `acme` made the
            list read as two different kinds of thing. Hosts are also derived,
            never hardcoded, so dev and production each show their own. */}
        <MenuItem value={DEFAULT_DOMAIN_VALUE}>
          {toHost(getShortUrlPrefix())}
        </MenuItem>
        {subdomains.map((item) => (
          <MenuItem key={item.id} value={String(item.id)}>
            {toHost(item.fullUrl)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SubdomainSelect;
