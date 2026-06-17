import type { TFunction } from "i18next";

/**
 * Calls a typed i18next `t` with a runtime-built (non-literal) key.
 *
 * Typed i18n resources only accept literal keys, so dynamic keys such as
 * `audience.chMobile.${k}` don't type-check at the call site. This helper
 * isolates the single sanctioned cast so call sites stay free of scattered
 * `as any` / `eslint-disable` noise (the previous pattern). Always pass a
 * `defaultValue` in `options` so a missing key degrades gracefully.
 *
 * @param t - any namespace's translator (e.g. from `useTranslation("analytics")`).
 * @param key - the runtime-built translation key.
 * @param options - i18next interpolation/options; include `defaultValue`.
 * @returns the translated string.
 */
export function tDynamic(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: TFunction<any>,
  key: string,
  options?: Record<string, unknown>,
): string {
  return (t as unknown as (k: string, o?: Record<string, unknown>) => string)(
    key,
    options,
  );
}
