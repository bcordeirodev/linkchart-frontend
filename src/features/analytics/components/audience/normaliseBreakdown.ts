/**
 * Normalises a backend breakdown field that may be either a phase-aware object
 * (`{ data, phase_available }`) or a legacy flat array.
 *
 * Returns `{ data, phaseAvailable }` in both cases, where `phaseAvailable`
 * defaults to `true` for legacy arrays (no disclaimer shown when old shape).
 */
export function normaliseBreakdown<T>(
  raw: { data: T[]; phase_available: boolean } | T[],
): { data: T[]; phaseAvailable: boolean } {
  if (Array.isArray(raw)) {
    return { data: raw, phaseAvailable: true };
  }
  return { data: raw.data, phaseAvailable: raw.phase_available };
}
