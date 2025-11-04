/**
 * 🔗 LINKS FEATURE EXPORTS
 * Barrel exports para o módulo de links
 */

// Components
export * from './components/LinksHeader';
export * from './components/LinksFilters';
export * from './components/LinkClicksRealTime';
export * from './components/URLInput';
export * from './components/URLShortenerForm';
export * from './components/ShortUrlResult';
export * from './components/ShareActions';

// Forms Components (Shared)
export * from './components/forms';

// Create & Edit Components
export * from './components/create';
export * from './components/edit';

// Analytics Components
export * from './components/analytics';

// Hooks
export * from './hooks/useLinks';
export * from './hooks/useURLShortener';
export * from './hooks/useLinksTableColumns';
export * from './hooks/useShareAPI';
export * from './hooks/useLinkAnalytics'; // Novo hook otimizado

// Types
export * from './types/link';
export * from './types/shorter';
export * from './types/analytics';
export * from './types/forms';

// Utils
export * from './utils/dateUtils';
