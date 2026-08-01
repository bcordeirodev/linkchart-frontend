"use client";

/**
 * First-touch attribution capture.
 *
 * Records how the visitor ORIGINALLY arrived (gclid/utm params, external
 * referrer, landing path) in a first-party cookie on their very first visit,
 * before any SPA navigation strips the query string. The stored payload is
 * later attached to the Auth0 exchange so the backend can persist it on the
 * account it creates (`users.signup_attribution`) — closing the July/2026 gap
 * where 8 of 15 signups had no known origin.
 *
 * Design notes:
 *   - First touch only: once the cookie exists it is never overwritten, so a
 *     later ad click does not steal credit from the original channel.
 *   - A visit with no params and no external referrer still captures the
 *     landing path + timestamp: "direct" is an answer, "unknown" is not.
 *   - No PII: only campaign params, referrer URL, path and a timestamp.
 */

/** Shape of the persisted first-touch payload (all fields optional). */
export interface FirstTouchAttribution {
  gclid?: string;
  gbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  landing_path?: string;
  captured_at?: string;
}

const COOKIE_NAME = "lc_first_touch";
const COOKIE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60; // 90 days ≈ Ads click-through window

/** Query params worth persisting, in the order they are checked. */
const TRACKED_PARAMS = [
  "gclid",
  "gbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
] as const;

/**
 * Reads the raw value of the first-touch cookie, or `null` when absent.
 *
 * @returns The decoded cookie value, or `null` when the cookie is not set or
 *          the code is running on the server.
 */
function readCookieValue(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_NAME}=`));

  return match ? decodeURIComponent(match.slice(COOKIE_NAME.length + 1)) : null;
}

/**
 * Captures the current visit as the first touch, if none was recorded yet.
 *
 * Idempotent and safe to call on every page load: it no-ops on the server,
 * when the cookie already exists, or when `document.cookie` is unavailable.
 * Failures are swallowed — attribution must never break the app.
 */
export function captureFirstTouch(): void {
  if (typeof window === "undefined") return;

  try {
    if (readCookieValue() !== null) return;

    const params = new URLSearchParams(window.location.search);
    const payload: FirstTouchAttribution = {
      landing_path: window.location.pathname + window.location.search,
      captured_at: new Date().toISOString(),
    };

    for (const key of TRACKED_PARAMS) {
      const value = params.get(key);
      if (value) payload[key] = value;
    }

    // Only an EXTERNAL referrer says anything about the origin.
    const referrer = document.referrer;
    if (referrer && !referrer.startsWith(window.location.origin)) {
      payload.referrer = referrer;
    }

    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie =
      `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(payload))}` +
      `; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  } catch {
    // Attribution is best-effort by design.
  }
}

/**
 * Returns the stored first-touch payload, or `undefined` when none exists or
 * it cannot be parsed. Values are truncated defensively so an oversized cookie
 * can never trip the backend's validation limits.
 *
 * @returns The parsed {@link FirstTouchAttribution}, or `undefined`.
 */
export function readFirstTouch(): FirstTouchAttribution | undefined {
  try {
    const raw = readCookieValue();
    if (!raw) return undefined;

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const result: FirstTouchAttribution = {};

    const copy = (key: keyof FirstTouchAttribution, max: number): void => {
      const value = parsed[key];
      if (typeof value === "string" && value !== "") {
        result[key] = value.slice(0, max);
      }
    };

    copy("gclid", 500);
    copy("gbraid", 500);
    copy("utm_source", 255);
    copy("utm_medium", 255);
    copy("utm_campaign", 255);
    copy("referrer", 1000);
    copy("landing_path", 500);
    copy("captured_at", 40);

    return Object.keys(result).length > 0 ? result : undefined;
  } catch {
    return undefined;
  }
}
