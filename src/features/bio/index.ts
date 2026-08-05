/**
 * BIO FEATURE EXPORTS
 * Barrel exports for the link-in-bio editor module (`/bio` page).
 */

export { BioEditor } from "./components/BioEditor";

export { useBioPage, useUpsertBioPage } from "./hooks/useBioPage";
export {
  useAddBioItem,
  useUpdateBioItem,
  useRemoveBioItem,
  useReorderBioItems,
} from "./hooks/useBioItems";
export { useUploadBioAvatar, useRemoveBioAvatar } from "./hooks/useBioAvatar";
export { useBioPerformance } from "./hooks/useBioPerformance";

export {
  MAX_BIO_ITEMS,
  AVATAR_MAX_SIZE_BYTES,
  AVATAR_ACCEPTED_TYPES,
  AVATAR_ACCEPT_ATTR,
} from "./constants";
export {
  getPublicBioUrlPrefix,
  resolvePublicPageUrl,
} from "./utils/publicBioUrl";

export type {
  BioItem,
  BioItemDisplay,
  BioPage,
  BioTheme,
  BioPageUpsertInput,
  BioItemCreateInput,
  BioItemUpdateInput,
  BioPerformance,
  BioPerformanceItem,
  BioPerformancePeriod,
  HandleAvailabilityResult,
} from "./types";
