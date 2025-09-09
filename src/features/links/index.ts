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

// Create Module
export * from './create';

// Edit Module
export * from './edit';

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

// Utils
export * from './utils/dateUtils';
