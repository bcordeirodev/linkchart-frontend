/**
 * 🎣 HOOKS EXPORTS (Backward Compatibility)
 * Re-exports para manter compatibilidade
 */

// Shared hooks
export * from '../shared/hooks/useDebounce';
export * from '../shared/hooks/useClipboard';
// Hooks removidos - useTimeout e usePrevious não estão mais disponíveis
export * from '../shared/hooks/useThemeMediaQuery';
export * from '../shared/hooks/useNavigate';
export * from '../shared/hooks/usePathname';

// Feature hooks
export * from '../features/analytics/hooks/useAnalytics';
export * from '../features/analytics/hooks/useLinkAnalytics';
export * from '../features/analytics/hooks/useLinkPerformance';
export * from '../features/links/hooks/useLinks';
export * from '../features/links/hooks/useURLShortener';
export * from '../features/links/hooks/useLinksTableColumns';
export * from '../features/links/hooks/useShareAPI';
export * from '../features/redirect/hooks/useRedirectWithDelay';
