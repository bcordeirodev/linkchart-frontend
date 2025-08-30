/**
 * 🛠️ LIB EXPORTS
 * Barrel exports para bibliotecas e configurações
 */

// API
export * from './api/client';
export * from './api/endpoints';
export * from './api/base.service';

// Auth
export * from './auth/AuthContext';
export * from './auth/AuthGuardRedirect';
export * from './auth/authRoles';
export * from './auth/auth.service';

// Theme
export * from './theme';

// I18n
export * from './i18n';

// Store
export * from './store/store';

// Utils
export * from './utils/errorHandler';
export * from './utils/generateMetadata';
export * from './utils/buildOptimization';
export * from './utils/setIn';
export * from './utils/logs.service';
