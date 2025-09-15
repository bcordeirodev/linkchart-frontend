/**
 * 📢 GOOGLE ADS - EXPORTAÇÕES CENTRALIZADAS
 *
 * Módulo completo para gerenciamento de anúncios do Google AdSense
 */

// Componentes
export { GoogleAd } from './components/GoogleAd';
export { GoogleAdsSpace } from './components/GoogleAdsSpace';

// Hooks
export { useGoogleAds, AD_SLOTS } from './hooks/useGoogleAds';
export type { AdSlotType } from './hooks/useGoogleAds';

// Configurações
export { GOOGLE_ADS_CONFIG, getAdsConfig } from './config/adsConfig';
