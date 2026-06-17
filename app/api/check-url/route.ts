import { NextRequest, NextResponse } from "next/server";

const SAFE_BROWSING_URL =
  "https://safebrowsing.googleapis.com/v4/threatMatches:find";

const THREAT_LABELS: Record<string, string> = {
  MALWARE: "malware",
  SOCIAL_ENGINEERING: "phishing",
  UNWANTED_SOFTWARE: "software indesejado",
  POTENTIALLY_HARMFUL_APPLICATION: "aplicação prejudicial",
};

const THREAT_TYPES = [
  "MALWARE",
  "SOCIAL_ENGINEERING",
  "UNWANTED_SOFTWARE",
  "POTENTIALLY_HARMFUL_APPLICATION",
];

/** Maximum accepted URL length; longer inputs are rejected before any work. */
const MAX_URL_LENGTH = 2048;

/** Sliding window size for the per-IP rate limiter, in milliseconds. */
const RATE_LIMIT_WINDOW_MS = 60_000;

/** Maximum number of requests allowed per IP within {@link RATE_LIMIT_WINDOW_MS}. */
const RATE_LIMIT_MAX = 20;

/**
 * In-memory fixed-window request counters keyed by client IP.
 *
 * @remarks
 * This is best-effort throttling scoped to a single server instance — it does
 * not coordinate across replicas and resets on process restart. It exists to
 * blunt trivial abuse of the upstream Google Safe Browsing quota, not as a
 * hard security boundary. Stale entries are pruned lazily on each request.
 */
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Resolves the best-effort client IP from proxy headers.
 *
 * Reads the first hop of `x-forwarded-for` (set by the Next.js proxy / Nginx),
 * falling back to `x-real-ip` and finally a sentinel so unknown clients still
 * share a single bucket rather than bypassing the limiter.
 *
 * @param request - the incoming request
 * @returns a string IP usable as a rate-limit bucket key
 */
function resolveClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Applies a fixed-window per-IP rate limit.
 *
 * @param ip - client IP bucket key
 * @returns `true` when the request is within the allowance, `false` when it
 *   should be rejected with HTTP 429
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Lazily prune expired buckets so the Map does not grow unbounded.
  for (const [key, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(key);
    }
  }

  const existing = rateLimitBuckets.get(ip);
  if (!existing || existing.resetAt <= now) {
    rateLimitBuckets.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return false;
  }

  existing.count += 1;
  return true;
}

/**
 * Validates that a string is a well-formed absolute http(s) URL within the
 * allowed length budget.
 *
 * @param url - the candidate URL
 * @returns `true` when the URL is parseable and uses the http/https scheme
 */
function isValidHttpUrl(url: string): boolean {
  if (url.length === 0 || url.length > MAX_URL_LENGTH) {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Checks a candidate URL against Google Safe Browsing.
 *
 * Validates the payload (parseable http(s) URL under {@link MAX_URL_LENGTH})
 * and enforces a per-IP rate limit before calling Google. Fails open on any
 * upstream error or missing API key so that link creation is never blocked by
 * a Safe Browsing outage.
 *
 * @param request - the incoming POST request with a JSON `{ url }` body
 * @returns `{ isSafe, threats }` on success, or a `400`/`429` error response
 */
export async function POST(request: NextRequest) {
  try {
    const ip = resolveClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url.trim() : null;

    if (!url || !isValidHttpUrl(url)) {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;

    if (!apiKey) {
      // Fail open: sem chave configurada, não bloqueia
      return NextResponse.json({ isSafe: true, threats: [] });
    }

    const response = await fetch(`${SAFE_BROWSING_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: { clientId: "link-charts", clientVersion: "1.0.0" },
        threatInfo: {
          threatTypes: THREAT_TYPES,
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(
        "[check-url] Safe Browsing API error:",
        response.status,
        await response.text(),
      );
      return NextResponse.json({ isSafe: true, threats: [] }); // fail open
    }

    const data = await response.json();
    const matches: Array<{ threatType: string }> = data.matches ?? [];

    if (matches.length === 0) {
      return NextResponse.json({ isSafe: true, threats: [] });
    }

    const threats = [
      ...new Set(
        matches.map(
          (m) => THREAT_LABELS[m.threatType] ?? m.threatType.toLowerCase(),
        ),
      ),
    ];

    return NextResponse.json({ isSafe: false, threats });
  } catch (error) {
    console.error("[check-url] Exception:", error);
    return NextResponse.json({ isSafe: true, threats: [] }); // fail open
  }
}
