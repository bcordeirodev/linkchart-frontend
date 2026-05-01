"use client";
/**
 * 📊 PUBLIC ANALYTICS MODULE
 * Módulo completo para analytics públicos
 */

// Types
export type * from "./types";

// Hooks
export { usePublicAnalytics } from "./hooks/usePublicAnalytics";

// Components
export * from "./components";

// Next.js App Router adapter (accepts slug as prop instead of useParams)
export { PublicAnalyticsPageContent } from "./PublicAnalyticsPageContent";
