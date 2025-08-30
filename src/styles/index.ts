/**
 * 🛠️ UTILS EXPORTS (Backward Compatibility)
 * Exports temporários para manter compatibilidade
 */

// Analytics utils (migrated)
export * from '../features/analytics/utils/chartFormatters';

// Shared utils (migrated to lib)
export * from '../lib/utils/errorHandler';
export * from '../lib/utils/generateMetadata';
// Removed: export * from '../lib/utils/buildOptimization'; // Duplicated, using lib version
export * from '../lib/utils/setIn';

// UI utils (keep in utils for now)
export * from './animations';
