"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useUrlSafetyCheck } from "./useUrlSafetyCheck";

import type { UrlSafetyStatus } from "./useUrlSafetyCheck";

/**
 * Single state a link-creation surface can render its submit affordance
 * from, in priority order: an in-flight create always wins, then a queued
 * submit waiting on gates to settle, then a hard block, then "still
 * checking", then "nothing in the way".
 */
export type LinkCreationFlowState =
  | "idle"
  | "checking"
  | "blocked"
  | "queued"
  | "submitting";

export interface UseLinkCreationOrchestrationOptions<TPayload, TResponse> {
  /**
   * Which creation path this surface uses. Purely a typed label — both
   * strategies plug in their own {@link create}; the hook never chooses an
   * endpoint itself. `"authenticated"` callers MUST source `create` from
   * `useCreateLink().mutateAsync` (never `linkService.save` directly), so the
   * links-list cache invalidation that hook performs on success still runs.
   */
  strategy: "public" | "authenticated";
  /**
   * Candidate destination URL. Feeds the centralized Safe Browsing check.
   * Unused (may be omitted) when {@link externalSafety} is supplied.
   */
  url?: string;
  /**
   * Pass when the Safe Browsing status is already computed elsewhere in the
   * tree (the create/edit form's `LinkFormFields` runs its own debounced
   * `useUrlSafetyCheck` and bubbles the result up via `onSafetyStatusChange`
   * for both the create and edit surfaces). When set, the hook trusts this
   * value instead of running a second, redundant debounced check against the
   * same URL.
   */
  externalSafety?: { status: UrlSafetyStatus; threats: string[] };
  /**
   * Performs the actual creation call for a validated payload. Rejects with
   * whatever `ApiError`/error shape the underlying service throws.
   */
  create: (payload: TPayload) => Promise<TResponse>;
  /**
   * When true, a submit attempted while {@link isSettling} is true is queued
   * and automatically replayed once the gates clear, instead of being
   * dropped. Off by default: the caller's submit control is expected to stay
   * disabled while settling, so a resubmit is on the user.
   */
  queueWhileSettling?: boolean;
  /**
   * Extra hard-block condition beyond an unsafe URL (e.g. a custom slug
   * already known to be taken). Always blocks; never queues.
   */
  isExtraBlocked?: boolean;
  /**
   * Extra "still resolving, don't submit yet" condition beyond the safety
   * check itself (e.g. a slug suggestion the empty-name submit depends on
   * hasn't resolved). Evaluated at the moment {@link guardedSubmit} runs and
   * again on every render while a submit is queued.
   */
  isExtraSettling?: boolean;
  /** Runs after a successful create. Navigation/toast/reset is the caller's call. */
  onSuccess?: (response: TResponse, payload: TPayload) => void | Promise<void>;
  /**
   * Runs when `create` rejects. Field-error mapping (422 → form field) is the
   * caller's responsibility here, since the mapping from backend field names
   * to a given form's own field names is not uniform across surfaces (e.g.
   * the public shortener's RHF fields are camelCase while the backend
   * payload — and the authenticated forms' fields — are snake_case).
   */
  onError?: (error: unknown) => void;
}

export interface UseLinkCreationOrchestrationResult<TPayload> {
  /** Echoes the `strategy` option — informational, see its TSDoc. */
  strategy: "public" | "authenticated";
  /** Raw status from the centralized (or externally supplied) safety check. */
  safetyStatus: UrlSafetyStatus;
  threats: string[];
  isUnsafe: boolean;
  isChecking: boolean;
  /** `isUnsafe || isExtraBlocked` — a hard stop; `guardedSubmit` never queues past this. */
  isBlocked: boolean;
  /** `isChecking || isExtraSettling` — worth waiting out before submitting. */
  isSettling: boolean;
  /** True while `create` is awaited (mirrors the async window of the create call). */
  isSubmitting: boolean;
  /** True while a submit is parked, waiting for `isSettling` to clear. */
  submitQueued: boolean;
  /** Convenience single-value summary of the above, in priority order. */
  flowState: LinkCreationFlowState;
  /**
   * The only way to trigger a create. Applies the Safe Browsing (and any
   * extra) gate unconditionally — a surface cannot reach `create` without
   * going through this check, so the gate cannot be forgotten by a caller.
   */
  guardedSubmit: (payload: TPayload) => void;
}

/**
 * Centralizes the submit orchestration shared by every link-creation
 * surface: the Safe Browsing gate, the optional "queue while settling and
 * replay" behavior, the in-flight/queued state, and the success/error
 * hand-off. Extracted so the Safe Browsing rule — never submit while a URL
 * is unsafe or still being checked — lives in exactly one place instead of
 * being re-implemented (and risking drift) in each of the public shortener,
 * the list page's quick-create, and the full create form.
 *
 * @remarks
 * Always calls `useUrlSafetyCheck` (rules-of-hooks requires an unconditional
 * call), but idles it with an empty URL when {@link externalSafety} is
 * supplied, so no redundant network check ever fires.
 *
 * @param options - see {@link UseLinkCreationOrchestrationOptions}.
 * @returns gate state plus {@link UseLinkCreationOrchestrationResult.guardedSubmit},
 *   the single entry point a form's `handleSubmit` should call.
 */
export function useLinkCreationOrchestration<TPayload, TResponse>({
  strategy,
  url,
  externalSafety,
  create,
  queueWhileSettling = false,
  isExtraBlocked = false,
  isExtraSettling = false,
  onSuccess,
  onError,
}: UseLinkCreationOrchestrationOptions<
  TPayload,
  TResponse
>): UseLinkCreationOrchestrationResult<TPayload> {
  const internalSafety = useUrlSafetyCheck(externalSafety ? "" : url ?? "");
  const { status: safetyStatus, threats } = externalSafety ?? internalSafety;

  const isUnsafe = safetyStatus === "unsafe";
  const isChecking = safetyStatus === "checking";
  const isBlocked = isUnsafe || isExtraBlocked;
  const isSettling = isChecking || isExtraSettling;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitQueued, setSubmitQueued] = useState(false);
  const pendingRef = useRef<TPayload | null>(null);

  const runCreate = useCallback(
    async (payload: TPayload) => {
      setIsSubmitting(true);
      try {
        const response = await create(payload);
        await onSuccess?.(response, payload);
      } catch (error) {
        onError?.(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [create, onSuccess, onError],
  );

  const guardedSubmit = useCallback(
    (payload: TPayload) => {
      // The gate: nothing reaches `create` without passing through here.
      if (isBlocked) {
        return;
      }
      if (isSettling) {
        if (queueWhileSettling) {
          pendingRef.current = payload;
          setSubmitQueued(true);
        }
        return;
      }
      void runCreate(payload);
    },
    [isBlocked, isSettling, queueWhileSettling, runCreate],
  );

  // Flush a queued submit once the gates settle: fire on anything but
  // "checking"/extra-settling (so "safe" and "error" both fire — a failed
  // safety check fails open, matching the disabled-button behavior every
  // surface already had). Drop on an unsafe verdict or a cleared URL.
  useEffect(() => {
    if (!submitQueued) {
      return;
    }
    if (isUnsafe || safetyStatus === "idle") {
      pendingRef.current = null;
      setSubmitQueued(false);
      return;
    }
    if (!isSettling) {
      const payload = pendingRef.current;
      pendingRef.current = null;
      setSubmitQueued(false);
      if (payload) {
        void runCreate(payload);
      }
    }
  }, [safetyStatus, isUnsafe, isSettling, submitQueued, runCreate]);

  const flowState: LinkCreationFlowState = isSubmitting
    ? "submitting"
    : submitQueued
      ? "queued"
      : isBlocked
        ? "blocked"
        : isSettling
          ? "checking"
          : "idle";

  return {
    strategy,
    safetyStatus,
    threats,
    isUnsafe,
    isChecking,
    isBlocked,
    isSettling,
    isSubmitting,
    submitQueued,
    flowState,
    guardedSubmit,
  };
}

export default useLinkCreationOrchestration;
