import type { Theme } from "@mui/material/styles";

import type { LinkResponse } from "@/types";

export type LinkStatus = "active" | "inactive" | "scheduled" | "expired";

/** Resolves palette paths like `success.main` to a concrete color (required for `alpha()`). */
export function resolvePaletteColor(theme: Theme, path: string): string {
  const [paletteKey, shade = "main"] = path.split(".");
  const palette = theme.palette[paletteKey as keyof typeof theme.palette];

  if (palette && typeof palette === "object" && shade in palette) {
    const value = (palette as Record<string, unknown>)[shade];
    if (typeof value === "string") {
      return value;
    }
  }

  return theme.palette.text.secondary;
}

export function getResolvedStatusColor(
  theme: Theme,
  status: LinkStatus,
): string {
  return resolvePaletteColor(theme, STATUS_MAP[status].color);
}

export const STATUS_MAP: Record<LinkStatus, { color: string }> = {
  active: { color: "success.main" },
  inactive: { color: "error.main" },
  scheduled: { color: "warning.main" },
  expired: { color: "error.main" },
};

// Backend returns dates as "d/m/Y H:i:s" — convert to ISO before parsing
function parseBackendDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  if (dateStr.includes("/")) {
    const [datePart, timePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split("/");
    const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart ?? "00:00:00"}`;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

export function getLinkStatus(link: LinkResponse): LinkStatus {
  const now = new Date();

  if (link.starts_in) {
    const startsIn = parseBackendDate(link.starts_in);
    if (startsIn && startsIn > now) return "scheduled";
  }

  if (link.is_expired) return "expired";

  return link.is_active ? "active" : "inactive";
}
