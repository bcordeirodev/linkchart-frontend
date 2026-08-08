import { categoricalBreakdownColor } from "../audience/HorizontalBreakdownBars";

/**
 * Fixed channel → color mapping shared by every chart in the "Origem" tab
 * that breaks traffic down by channel (`ChannelsBreakdown`,
 * `ChannelEngagementChart`). Keeping one mapping instead of letting each
 * chart pick its own palette index is what makes "direct" read as the same
 * color in the channels bar and in the technical-details engagement chart.
 *
 * Migrated from the deprecated 8-tone `chartPalette` (indices
 * social=0/search=1/email=2/direct=3/referral=5/paid=6) to the redesign's
 * 5-tone `dataVizPalette`, and again (refinamento visual 2026-08-08, §3.1)
 * from `dataVizPalette` — a *sequential* ramp of blues meant for a single
 * series' intensity — to `dataVizCategorical`, whose 5 tones are actually
 * distinguishable hues (blue/teal/violet/amber/slate), resolved here through
 * the same {@link categoricalBreakdownColor} helper every other categorical
 * breakdown in the module uses (single source of truth for "which color is
 * index N"). The channel → index mapping itself is unchanged, so every
 * channel keeps the exact tone it had before, just resolved against the new
 * palette. The old indices are preserved verbatim and taken modulo 5 against
 * the 5-tone palette — `referral` (old index 5) and `paid` (old index 6)
 * therefore land on the same tones as `social` (index 0) and `search` (index
 * 1) respectively. This is a straight palette migration, not a semantic
 * exception: channel identity isn't inherently success/warning, so reusing a
 * tone across two channels only means two channels can render the same
 * color in the same chart — acceptable here since `HorizontalBreakdownBars`
 * always labels each row with its name, value and percentage, so color is
 * never the sole differentiator.
 */
const CHANNEL_COLOR_MAP: Record<string, string> = {
  social: categoricalBreakdownColor(0),
  search: categoricalBreakdownColor(1),
  email: categoricalBreakdownColor(2),
  direct: categoricalBreakdownColor(3),
  referral: categoricalBreakdownColor(5),
  paid: categoricalBreakdownColor(6),
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
