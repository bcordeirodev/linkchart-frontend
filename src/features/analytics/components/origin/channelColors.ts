import { dataVizPalette } from "@/lib/theme/dataViz";

/** The 5 `dataVizPalette` tones, in priority order — indexed into by {@link CHANNEL_COLOR_MAP}. */
const DATA_VIZ_TONES = Object.values(dataVizPalette);

/**
 * Fixed channel → color mapping shared by every chart in the "Origem" tab
 * that breaks traffic down by channel (`ChannelsBreakdown`,
 * `ChannelEngagementChart`). Keeping one mapping instead of letting each
 * chart pick its own palette index is what makes "direct" read as the same
 * color in the channels bar and in the technical-details engagement chart.
 *
 * Migrated from the deprecated 8-tone `chartPalette` (indices
 * social=0/search=1/email=2/direct=3/referral=5/paid=6) to the redesign's
 * 5-tone `dataVizPalette`. The old indices are preserved verbatim and taken
 * modulo 5 against the smaller palette — `referral` (old index 5) and
 * `paid` (old index 6) therefore land back on the same tones as `social`
 * (index 0) and `search` (index 1) respectively. This is a straight palette
 * migration, not a semantic exception: channel identity isn't inherently
 * success/warning, so reusing a tone across two channels only means two
 * channels can render the same color in the same chart — acceptable here
 * since `HorizontalBreakdownBars` always labels each row with its name,
 * value and percentage, so color is never the sole differentiator.
 */
const CHANNEL_COLOR_MAP: Record<string, string> = {
  social: DATA_VIZ_TONES[0 % DATA_VIZ_TONES.length],
  search: DATA_VIZ_TONES[1 % DATA_VIZ_TONES.length],
  email: DATA_VIZ_TONES[2 % DATA_VIZ_TONES.length],
  direct: DATA_VIZ_TONES[3 % DATA_VIZ_TONES.length],
  referral: DATA_VIZ_TONES[5 % DATA_VIZ_TONES.length],
  paid: DATA_VIZ_TONES[6 % DATA_VIZ_TONES.length],
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
