import { chartPalette } from "@/lib/theme/colors";

/**
 * Fixed channel → color mapping shared by every chart in the "Origem" tab
 * that breaks traffic down by channel (`ChannelsBreakdown`,
 * `ChannelEngagementChart`). Keeping one mapping instead of letting each
 * chart pick its own palette index is what makes "direct" read as the same
 * color in the channels bar and in the technical-details engagement chart.
 *
 * Indices intentionally skip around `chartPalette` (rather than assigning
 * 0..N in channel order) to match the coloring this data already had before
 * the redesign — social=0/search=1/email=2/direct=3/referral=5/paid=6 — so a
 * returning user doesn't see "direct" change color between sessions.
 */
const CHANNEL_COLOR_MAP: Record<string, string> = {
  social: chartPalette[0],
  search: chartPalette[1],
  email: chartPalette[2],
  direct: chartPalette[3],
  referral: chartPalette[5],
  paid: chartPalette[6],
};

/**
 * Resolves the fill color for a traffic channel row (`direct`, `social`,
 * `search`, `referral`, `email`, `paid`). Unrecognised channels (`other` and
 * anything the backend adds later) fall back to `fallback`.
 *
 * @param channel - Raw channel key as returned by the traffic-sources API.
 * @param fallback - Color used when `channel` isn't in the fixed map.
 */
export function getChannelColor(channel: string, fallback: string): string {
  return CHANNEL_COLOR_MAP[channel] ?? fallback;
}
