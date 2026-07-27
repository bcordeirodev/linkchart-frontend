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
export { useHandleAvailability } from "./hooks/useHandleAvailability";

export { MAX_BIO_ITEMS } from "./constants";
export { getPublicBioUrl, getPublicBioUrlPrefix } from "./utils/publicBioUrl";

export type {
  BioItem,
  BioPage,
  BioTheme,
  BioPageUpsertInput,
  BioItemCreateInput,
  BioItemUpdateInput,
  HandleAvailabilityResult,
} from "./types";
