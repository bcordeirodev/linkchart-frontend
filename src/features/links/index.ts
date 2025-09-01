/**
 * 🔗 LINKS FEATURE EXPORTS
 * Barrel exports para o módulo de links
 */

// Components
export * from './components/LinksHeader';
export * from './components/LinksFilters';
export * from './components/LinkClicksRealTime';
export * from './components/LinkForm';
export * from './components/LinkFormFields';
export * from './components/URLInput';
export * from './components/URLShortenerForm';
export * from './components/ShortUrlResult';
export * from './components/CopyButton';
export * from './components/ShareActions';

// Analytics Components (NOVO)
export * from './components/analytics';

// Hooks
export * from './hooks/useLinks';
export * from './hooks/useLinkForm';
export * from './hooks/useURLShortener';
export * from './hooks/useLinksTableColumns';
export * from './hooks/useShareAPI';
// export * from './hooks/useLinkAnalytics'; // Original mantido para compatibilidade
export * from './hooks/useLinkAnalyticsOptimized'; // Novo hook otimizado

// Services
export * from './services/link.service';

// Types
export * from './types/link';
export * from './types/shorter';
export * from './types/analytics';
