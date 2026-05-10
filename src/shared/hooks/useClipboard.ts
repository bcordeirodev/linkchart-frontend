"use client";
import { useState, useCallback } from "react";

interface UseClipboardOptions {
  timeout?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<void>;
  reset: () => void;
}

/**
 * Hook wrapper around `navigator.clipboard.writeText` with a self-resetting flag.
 *
 * @param options - `{timeout?, onSuccess?, onError?}`. `timeout` controls how long
 *                  `copied` stays `true` after a successful copy (default 2000 ms).
 * @returns `{copied, copy, reset}` — `copy` writes to the clipboard, `copied`
 *          flips to `true` for `timeout` ms, and `reset` clears it manually.
 *
 * @remarks
 * Used by `LinkActionsInline` and similar UI to swap the icon between
 * "copy" and "copied" without managing local timers in each component.
 */
export default function useClipboard(
  options: UseClipboardOptions = {},
): UseClipboardReturn {
  const { timeout = 2000, onSuccess, onError } = options;
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        onSuccess?.();

        // Reset estado após timeout
        setTimeout(() => setCopied(false), timeout);
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Erro ao copiar");
        onError?.(err);
        console.error("Erro ao copiar para clipboard:", err);
      }
    },
    [timeout, onSuccess, onError],
  );

  const reset = useCallback(() => {
    setCopied(false);
  }, []);

  return {
    copied,
    copy,
    reset,
  };
}
