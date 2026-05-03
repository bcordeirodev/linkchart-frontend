import type { LinkResponse } from "@/types";

export type LinkStatus = "active" | "inactive" | "scheduled" | "expired";

export const STATUS_MAP: Record<LinkStatus, { color: string }> = {
  active: { color: "success.main" },
  inactive: { color: "error.main" },
  scheduled: { color: "warning.main" },
  expired: { color: "error.main" },
};

export function getLinkStatus(link: LinkResponse): LinkStatus {
  const now = new Date();

  if (link.starts_in && new Date(link.starts_in) > now) {
    return "scheduled";
  }

  if (link.expires_at && new Date(link.expires_at) < now) {
    return "expired";
  }

  return link.is_active ? "active" : "inactive";
}
