"use client";

import { useCallback, useMemo, useState } from "react";

/** The five UTM parameters, in canonical order. */
export const UTM_FIELD_KEYS = [
  "source",
  "medium",
  "campaign",
  "term",
  "content",
] as const;

/** One of the five UTM parameter keys (without the `utm_` prefix). */
export type UtmFieldKey = (typeof UTM_FIELD_KEYS)[number];

/** Current values of the five UTM fields (raw, as typed by the visitor). */
export type UtmFields = Record<UtmFieldKey, string>;

/** A colorizable fragment of the assembled URL, for the live preview. */
export interface UtmSegment {
  /** Fragment text as displayed (query values are shown decoded). */
  text: string;
  /**
   * Visual role: `base` (origin + path), `sep` (`?`, `&`, `=`, `#`),
   * `utmKey` (a `utm_*` parameter name), `key` (a pre-existing parameter
   * name) or `value` (any parameter value).
   */
  kind: "base" | "sep" | "utmKey" | "key" | "value";
}

/** i18n keys (under `tools:utm.presets`) available for preset chip labels. */
export type UtmPresetLabelKey =
  | "instagramBio"
  | "instagramStories"
  | "whatsapp"
  | "email"
  | "youtube";

/** A source/medium pair applied by a preset chip. */
export interface UtmPreset {
  /** i18n key (under `tools:utm.presets`) for the chip label. */
  labelKey: UtmPresetLabelKey;
  /** Value applied to `utm_source`. */
  source: string;
  /** Value applied to `utm_medium`. */
  medium: string;
}

/** Common Brazilian channel presets, ordered by likelihood of use. */
export const UTM_PRESETS: UtmPreset[] = [
  { labelKey: "instagramBio", source: "instagram", medium: "bio" },
  { labelKey: "instagramStories", source: "instagram", medium: "stories" },
  { labelKey: "whatsapp", source: "whatsapp", medium: "mensagem" },
  { labelKey: "email", source: "newsletter", medium: "email" },
  { labelKey: "youtube", source: "youtube", medium: "video" },
];

/** Return shape of {@link useUtmBuilder}. */
export interface UtmBuilderResult {
  /** Raw destination-URL input (as typed). */
  url: string;
  /** Raw values of the five UTM fields. */
  fields: UtmFields;
  /** Replaces the destination-URL input. */
  setUrl: (value: string) => void;
  /** Replaces a single UTM field value. */
  setField: (key: UtmFieldKey, value: string) => void;
  /** Applies a preset's source/medium pair, keeping the other fields. */
  applyPreset: (preset: UtmPreset) => void;
  /** Fully assembled URL (encoded, ready to copy), or `null` while the base URL is invalid. */
  builtUrl: string | null;
  /** Display fragments of the assembled URL, or `null` while the base URL is invalid. */
  segments: UtmSegment[] | null;
  /** `true` while the destination-URL input is empty. */
  isEmpty: boolean;
}

/**
 * Normalizes the visitor's input into an absolute http(s) URL candidate.
 *
 * Prepends `https://` when no scheme was typed (people paste
 * `meusite.com.br/pagina` constantly), so the builder stays forgiving.
 *
 * @param raw - the destination-URL input, already trimmed
 * @returns the candidate absolute URL string
 */
function normalizeCandidate(raw: string): string {
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

/**
 * Parses the candidate string into a `URL`, accepting only http(s) URLs with
 * a plausible hostname (must contain a dot, so `https://abc` is rejected).
 *
 * @param candidate - absolute URL candidate from {@link normalizeCandidate}
 * @returns the parsed `URL`, or `null` when invalid
 */
function parseBaseUrl(candidate: string): URL | null {
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    if (!parsed.hostname.includes(".")) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Builds the display segments for the assembled URL: base, then each query
 * pair (`?`/`&` + key + `=` + decoded value), then the hash. `utm_*` keys get
 * their own kind so the preview can highlight what the tool added.
 *
 * @param assembled - the `URL` with UTM parameters already applied
 * @returns ordered fragments for the live preview
 */
function buildSegments(assembled: URL): UtmSegment[] {
  const segments: UtmSegment[] = [
    { text: `${assembled.origin}${assembled.pathname}`, kind: "base" },
  ];

  let first = true;
  assembled.searchParams.forEach((value, key) => {
    segments.push({ text: first ? "?" : "&", kind: "sep" });
    segments.push({
      text: key,
      kind: key.startsWith("utm_") ? "utmKey" : "key",
    });
    segments.push({ text: "=", kind: "sep" });
    segments.push({ text: value, kind: "value" });
    first = false;
  });

  if (assembled.hash) {
    segments.push({ text: assembled.hash, kind: "sep" });
  }

  return segments;
}

/**
 * Client-side state + assembly logic for the UTM generator.
 *
 * Keeps the destination URL and the five UTM fields, and derives the final
 * URL live on every keystroke — 100% in the browser, no backend involved.
 * Existing query parameters on the destination URL are preserved; non-empty
 * UTM fields are applied with `searchParams.set` (so they override previous
 * `utm_*` values instead of duplicating them).
 *
 * @returns see {@link UtmBuilderResult}
 */
export function useUtmBuilder(): UtmBuilderResult {
  const [url, setUrl] = useState("");
  const [fields, setFields] = useState<UtmFields>({
    source: "",
    medium: "",
    campaign: "",
    term: "",
    content: "",
  });

  const setField = useCallback((key: UtmFieldKey, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyPreset = useCallback((preset: UtmPreset) => {
    setFields((prev) => ({
      ...prev,
      source: preset.source,
      medium: preset.medium,
    }));
  }, []);

  const trimmedUrl = url.trim();

  const { builtUrl, segments } = useMemo(() => {
    if (!trimmedUrl) {
      return { builtUrl: null, segments: null };
    }
    const parsed = parseBaseUrl(normalizeCandidate(trimmedUrl));
    if (!parsed) {
      return { builtUrl: null, segments: null };
    }

    for (const key of UTM_FIELD_KEYS) {
      const value = fields[key].trim();
      if (value) {
        parsed.searchParams.set(`utm_${key}`, value);
      }
    }

    return { builtUrl: parsed.toString(), segments: buildSegments(parsed) };
  }, [trimmedUrl, fields]);

  return {
    url,
    fields,
    setUrl,
    setField,
    applyPreset,
    builtUrl,
    segments,
    isEmpty: trimmedUrl.length === 0,
  };
}
