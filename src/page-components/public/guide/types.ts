/**
 * i18n namespace prefixes (under the `public` i18next namespace) for the
 * `/guia/*` pages that share {@link GuideHero} and {@link GuideFaq}.
 *
 * Typed as a literal union (not `string`) so `t(\`${i18nKey}.hero.title\`)`
 * distributes into a union of real translation keys instead of a generic
 * `${string}.hero.title` pattern, which i18next's strict key typing rejects.
 */
export type GuideI18nKey =
  | "guiaVerCliques"
  | "guiaInstagram"
  | "guiaBots"
  | "guiaWhatsapp"
  | "guiaAlternativaBitly";
