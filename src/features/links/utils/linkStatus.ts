import type { LinkResponse } from "@/types";

export type LinkStatus = "active" | "inactive" | "scheduled" | "expired";

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
