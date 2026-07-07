"use client";

/**
 * Google Ads conversion tracking.
 *
 * Fires conversion events through the `gtag.js` loader that the root layout
 * already configures for the Google Ads account (`NEXT_PUBLIC_GOOGLE_ADS_ID`).
 * Consent Mode v2 (also set up in the root layout) governs whether each
 * conversion is cookie-based or modelled, so callers do NOT need to gate on
 * advertising consent — they just fire the product event.
 *
 * Each conversion action created in the Google Ads console yields a `send_to`
 * target shaped like `AW-XXXXXXXX/<label>`. We store only the `<label>` segment
 * per environment and combine it with the shared account id at call time, so
 * rotating labels never requires a code change.
 */

/** Product events wired to a Google Ads conversion action. */
export type AdConversion = "shorten" | "signup";

const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

/**
 * Conversion label segments keyed by product event. Each value is the part of
 * the Google Ads `send_to` target after `AW-XXXX/`, configured per environment.
 * An empty/undefined label disables that conversion (safe no-op).
 */
const CONVERSION_LABELS: Record<AdConversion, string | undefined> = {
  shorten: process.env.NEXT_PUBLIC_GADS_CONV_SHORTEN,
  signup: process.env.NEXT_PUBLIC_GADS_CONV_SIGNUP,
};

/**
 * Reports a Google Ads conversion for the given product event.
 *
 * No-ops safely when running on the server, when the account id or the event's
 * label is not configured, or before `gtag` has loaded — so it is always safe
 * to call from success handlers without extra guards.
 *
 * @param event - The product event that occurred (`"shorten"` | `"signup"`).
 */
export function trackAdConversion(event: AdConversion): void {
  if (typeof window === "undefined") return;

  const label = CONVERSION_LABELS[event];
  if (!ADS_ID || !label) return;

  const gtag = window.gtag;
  if (typeof gtag !== "function") return;

  gtag("event", "conversion", { send_to: `${ADS_ID}/${label}` });
}
