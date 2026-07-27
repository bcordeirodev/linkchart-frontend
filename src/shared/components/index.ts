/**
 * 🧩 SHARED COMPONENTS INDEX - LINK CHART
 * Componentes compartilhados centralizados
 *
 * @description
 * Re-exports para compatibilidade. Componentes agora organizados em shared/ui/
 *
 * @since 2.0.0
 * @updated 04/11/2025 - Refatoração de estrutura
 */

// Re-export from shared/ui for backward compatibility
export { default as Loading } from "../ui/feedback/Loading";
export { default as Message } from "../ui/feedback/Message";
export { default as Link } from "../ui/navigation/Link";
export { default as SvgIcon } from "../ui/icons/SvgIcon";

// Legacy compatibility exports
export { default as FuseLoading } from "../ui/feedback/Loading";
export { default as FuseSvgIcon } from "../ui/icons/SvgIcon";
export { default as FuseMessage } from "../ui/feedback/Message";

// Routing components
export { HomeLanding } from "./routing/HomeLanding";

// CTA components
export { SignUpCtaCard } from "./cta/SignUpCtaCard";
