"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { usePublicSlugSuggestion } from "@/features/links/hooks/usePublicSlugSuggestion";
import { useSlugAvailability } from "@/features/links/hooks/useSlugAvailability";
import { resolveAlternativeSlug } from "@/features/links/utils/slugAvailabilityCheck";

/**
 * What the short link's name is doing right now.
 *
 * - `idle` — no URL yet, nothing to say.
 * - `resolving` — deriving a name from the destination page.
 * - `suggested` — the field holds a name we derived and already verified free.
 * - `checking` / `available` / `taken` — verdicts on a name the user typed.
 * - `autoCode` — the user deliberately emptied the field; the backend will mint
 *   a random code at create time.
 * - `unavailable` — no name could be derived from this page.
 */
export type SlugFieldState =
  | "idle"
  | "resolving"
  | "suggested"
  | "checking"
  | "available"
  | "taken"
  | "autoCode"
  | "unavailable";

interface UseSlugSuggestionFieldArgs {
  /** The destination URL as currently typed. */
  url: string;
  /** Current value of the name field. */
  value: string;
  /** Writes a new value into the name field. */
  onChange: (next: string) => void;
}

interface UseSlugSuggestionField {
  /** Single state the UI renders from. */
  state: SlugFieldState;
  /** True while the field holds a name we put there, not one the user typed. */
  isAuto: boolean;
  /** Call from the input's own `onChange` — hands ownership to the user. */
  markEdited: () => void;
  /** Asks for a different name built on the same base. */
  requestAnother: () => void;
  /** True while {@link requestAnother} is resolving. */
  isRequestingAnother: boolean;
  /** Whether asking for another name makes sense right now. */
  canRequestAnother: boolean;
  /** og:title of the destination page, when the server could read it. */
  ogTitle: string | null;
  /** Resets to the pristine "field is ours" state (after a successful create). */
  reset: () => void;
}

/**
 * Owns the name field of the quick-create box: who wrote the value, when it is
 * replaced, and what the field should say about it.
 *
 * The rule that drives everything: **the field belongs to us until the user
 * edits it.** While it is ours we keep it in sync with the destination — paste
 * a different URL and the name is re-derived, because a name derived from a
 * page the user has navigated away from is simply wrong. The moment the user
 * types, it becomes theirs and no suggestion overwrites it again.
 *
 * This replaces the previous "suggest only while the field is empty" gate,
 * which had a hole: accepting a suggestion filled the field, which switched the
 * suggestion off, so changing the URL afterwards silently kept the name derived
 * from the *old* destination.
 *
 * A name we derived is not re-checked for availability — the server only ever
 * suggests a free one. Only what the user types goes through
 * {@link useSlugAvailability}.
 *
 * @param args.url - destination URL as typed.
 * @param args.value - current name field value.
 * @param args.onChange - writes a value into the name field.
 * @returns state for the UI plus the actions the field needs.
 */
export function useSlugSuggestionField({
  url,
  value,
  onChange,
}: UseSlugSuggestionFieldArgs): UseSlugSuggestionField {
  // `edited` is the ownership flag, not a "has been focused" flag: tabbing
  // through the field must not stop suggestions.
  const [edited, setEdited] = useState(false);
  // The exact value we last wrote. Compared against the live value so an edit
  // that happens to be undone still counts as ours.
  const [autoSlug, setAutoSlug] = useState<string | null>(null);
  const [isRequestingAnother, setIsRequestingAnother] = useState(false);

  const {
    slug: suggested,
    ogTitle,
    status: suggestionStatus,
  } = usePublicSlugSuggestion(url || null);

  const trimmed = value.trim();
  const isAuto = !edited && !!trimmed && trimmed === autoSlug;

  // Only a user-typed name needs verifying; ours arrived pre-verified.
  const availability = useSlugAvailability(isAuto ? "" : trimmed);

  // The server suggestion we have already written in. The server answers with
  // the same name for the same URL — that is what makes suggestions stable —
  // so without this the sync below would keep re-applying it and stomp on any
  // alternative the user asked for a beat later.
  const appliedSuggestionRef = useRef<string | null>(null);

  // Keep the field in step with the destination while it is still ours.
  useEffect(() => {
    if (edited || isRequestingAnother) {
      return;
    }

    if (suggestionStatus === "ready" && suggested) {
      if (appliedSuggestionRef.current === suggested) {
        return;
      }
      appliedSuggestionRef.current = suggested;
      setAutoSlug(suggested);
      onChange(suggested);
      return;
    }

    // Resolving or nothing to resolve: clear our own value rather than leave a
    // name derived from the previous URL sitting under the new one.
    appliedSuggestionRef.current = null;
    if (trimmed) {
      setAutoSlug(null);
      onChange("");
    }
  }, [
    edited,
    isRequestingAnother,
    suggestionStatus,
    suggested,
    trimmed,
    onChange,
  ]);

  const markEdited = useCallback(() => {
    setEdited(true);
  }, []);

  const reset = useCallback(() => {
    setEdited(false);
    setAutoSlug(null);
    setIsRequestingAnother(false);
    appliedSuggestionRef.current = null;
  }, []);

  // Guards a resolved alternative from landing after the component unmounted or
  // after the user took the field over mid-request.
  const anotherRequestId = useRef(0);
  useEffect(
    () => () => {
      anotherRequestId.current += 1;
    },
    [],
  );

  const requestAnother = useCallback(() => {
    const base = trimmed || suggested;
    if (!base) {
      return;
    }

    anotherRequestId.current += 1;
    const requestId = anotherRequestId.current;
    setIsRequestingAnother(true);

    void resolveAlternativeSlug(base)
      .then((next) => {
        if (requestId !== anotherRequestId.current) {
          return;
        }
        if (next) {
          setEdited(false);
          setAutoSlug(next);
          onChange(next);
        }
      })
      .finally(() => {
        if (requestId === anotherRequestId.current) {
          setIsRequestingAnother(false);
        }
      });
  }, [trimmed, suggested, onChange]);

  const state: SlugFieldState = (() => {
    if (isRequestingAnother) {
      return "resolving";
    }
    if (!edited && suggestionStatus === "resolving") {
      return "resolving";
    }
    if (!trimmed) {
      if (edited) {
        return "autoCode";
      }
      return suggestionStatus === "unavailable" ? "unavailable" : "idle";
    }
    if (isAuto) {
      return "suggested";
    }
    if (availability === "checking") {
      return "checking";
    }
    if (availability === "taken") {
      return "taken";
    }
    if (availability === "available") {
      return "available";
    }
    return "idle";
  })();

  return {
    state,
    isAuto,
    markEdited,
    requestAnother,
    isRequestingAnother,
    canRequestAnother: !!trimmed && (isAuto || state === "available"),
    ogTitle,
    reset,
  };
}
