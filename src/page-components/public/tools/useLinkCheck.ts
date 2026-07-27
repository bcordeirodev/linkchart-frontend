"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * State machine of the suspicious-link checker.
 *
 * - `idle` — nothing checked yet.
 * - `invalid` — the typed URL failed client-side validation (or the API
 *   answered 400).
 * - `checking` — a request is in flight.
 * - `result` — the API answered; see {@link LinkCheckState.verdict}.
 * - `network-error` — the request failed or the API answered 5xx.
 * - `rate-limited` — the API answered 429 (20 checks/min per IP).
 */
export type LinkCheckStatus =
  | "idle"
  | "invalid"
  | "checking"
  | "result"
  | "network-error"
  | "rate-limited";

/** Human verdict derived from the Safe Browsing response. */
export type LinkVerdict = "safe" | "suspicious" | "dangerous";

/** Snapshot returned by {@link useLinkCheck}. */
export interface LinkCheckState {
  /** Current phase of the state machine. */
  status: LinkCheckStatus;
  /** Verdict, only meaningful while `status === "result"`. */
  verdict: LinkVerdict | null;
  /** Threat labels returned by the API (pt-BR labels such as "phishing"). */
  threats: string[];
  /** The normalized URL that was submitted, for display next to the verdict. */
  checkedUrl: string | null;
}

/** Maximum accepted URL length — mirrors the `/api/check-url` route budget. */
const MAX_URL_LENGTH = 2048;

/**
 * Threat labels (as emitted by `/api/check-url`) that make a link outright
 * dangerous. Everything else flagged by Safe Browsing (unwanted software,
 * harmful applications) reads as "suspicious".
 */
const DANGEROUS_THREATS = new Set(["malware", "phishing"]);

/**
 * Normalizes the visitor's input into an absolute http(s) URL, prepending
 * `https://` when no scheme was typed.
 *
 * @param raw - trimmed input
 * @returns the candidate absolute URL string
 */
function normalizeCandidate(raw: string): string {
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

/**
 * Client-side validation mirroring the `/api/check-url` rules (parseable
 * http(s) URL within the length budget) plus a plausible hostname, so obvious
 * typos never hit the rate-limited endpoint.
 *
 * @param candidate - absolute URL candidate
 * @returns `true` when the URL is worth sending to the API
 */
function isCheckableUrl(candidate: string): boolean {
  if (candidate.length === 0 || candidate.length > MAX_URL_LENGTH) {
    return false;
  }
  try {
    const parsed = new URL(candidate);
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      parsed.hostname.includes(".")
    );
  } catch {
    return false;
  }
}

/**
 * Maps the `/api/check-url` payload to a human verdict.
 *
 * @param isSafe - `isSafe` flag from the API
 * @param threats - threat labels from the API
 * @returns `safe`, `dangerous` (malware/phishing) or `suspicious` (any other
 *   flagged category)
 */
function deriveVerdict(isSafe: boolean, threats: string[]): LinkVerdict {
  if (isSafe) {
    return "safe";
  }
  return threats.some((threat) => DANGEROUS_THREATS.has(threat))
    ? "dangerous"
    : "suspicious";
}

/** Return shape of {@link useLinkCheck}. */
export interface UseLinkCheckResult {
  /** Current snapshot of the check. */
  state: LinkCheckState;
  /** Validates and submits `rawUrl` to `POST /api/check-url`. */
  check: (rawUrl: string) => Promise<void>;
  /** Returns to `idle`, clearing any verdict or error. */
  reset: () => void;
}

/**
 * Explicit (button-triggered) safety check against the internal
 * `POST /api/check-url` route — the same Google Safe Browsing proxy used at
 * link creation.
 *
 * Unlike `useUrlSafetyCheck` (which debounces on every keystroke for forms),
 * this hook only fires when {@link UseLinkCheckResult.check} is called, so the
 * public tool stays friendly to the route's 20 req/min per-IP rate limit.
 * In-flight requests are aborted when a new check starts or on unmount.
 *
 * @returns see {@link UseLinkCheckResult}
 */
export function useLinkCheck(): UseLinkCheckResult {
  const [state, setState] = useState<LinkCheckState>({
    status: "idle",
    verdict: null,
    threats: [],
    checkedUrl: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ status: "idle", verdict: null, threats: [], checkedUrl: null });
  }, []);

  const check = useCallback(async (rawUrl: string) => {
    const trimmed = rawUrl.trim();
    const candidate = trimmed ? normalizeCandidate(trimmed) : "";

    if (!isCheckableUrl(candidate)) {
      setState({
        status: "invalid",
        verdict: null,
        threats: [],
        checkedUrl: null,
      });
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({
      status: "checking",
      verdict: null,
      threats: [],
      checkedUrl: candidate,
    });

    try {
      const response = await fetch("/api/check-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: candidate }),
        signal: controller.signal,
      });

      if (response.status === 429) {
        setState({
          status: "rate-limited",
          verdict: null,
          threats: [],
          checkedUrl: candidate,
        });
        return;
      }
      if (response.status === 400) {
        setState({
          status: "invalid",
          verdict: null,
          threats: [],
          checkedUrl: null,
        });
        return;
      }
      if (!response.ok) {
        setState({
          status: "network-error",
          verdict: null,
          threats: [],
          checkedUrl: candidate,
        });
        return;
      }

      const data: { isSafe?: boolean; threats?: string[] } =
        await response.json();
      const threats = Array.isArray(data.threats) ? data.threats : [];
      const isSafe = data.isSafe === true;

      setState({
        status: "result",
        verdict: deriveVerdict(isSafe, threats),
        threats,
        checkedUrl: candidate,
      });
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setState({
          status: "network-error",
          verdict: null,
          threats: [],
          checkedUrl: candidate,
        });
      }
    }
  }, []);

  return { state, check, reset };
}
