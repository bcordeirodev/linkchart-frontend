/**
 * 📢 CONFIGURAÇÃO DE GOOGLE ADS
 *
 * Centralize todas as configurações de anúncios do Google AdSense
 *
 * IMPORTANTE: Substitua os slots pelos valores reais do seu Google AdSense
 */

export const GOOGLE_ADS_CONFIG = {
  // Client ID do Google AdSense
  clientId: "ca-pub-2823669657977165",

  // Slots de anúncios - SUBSTITUIR PELOS VALORES REAIS
  slots: {
    // Banner horizontal - 728x90 ou responsivo
    banner: "1234567890",

    // Rectangle médio - 300x250
    rectangle: "1234567891",

    // Leaderboard - 728x90
    leaderboard: "1234567892",

    // Sidebar vertical - 160x600
    sidebar: "1234567893",
  },

  // Configurações por ambiente
  environment: {
    development: {
      // Em desenvolvimento, sempre mostrar fallback
      showFallback: true,
      enableAds: false,
    },
    production: {
      // Em produção, mostrar anúncios reais
      showFallback: false,
      enableAds: true,
    },
  },
} as const;

/**
 * 🔧 HELPER PARA OBTER CONFIGURAÇÃO ATUAL
 */
export function getAdsConfig() {
  const isDevelopment = process.env.NODE_ENV === "development";
  const environment = isDevelopment ? "development" : "production";

  return {
    ...GOOGLE_ADS_CONFIG,
    currentEnvironment: environment,
    shouldShowFallback: GOOGLE_ADS_CONFIG.environment[environment].showFallback,
    areAdsEnabled: GOOGLE_ADS_CONFIG.environment[environment].enableAds,
  };
}

/**
 * 📋 INSTRUÇÕES PARA CONFIGURAR SLOTS REAIS:
 *
 * 1. Acesse https://www.google.com/adsense/
 * 2. Vá em "Anúncios" > "Por site"
 * 3. Crie unidades de anúncio para cada tipo:
 *    - Banner: 728x90 ou responsivo
 *    - Rectangle: 300x250
 *    - Leaderboard: 728x90
 *    - Sidebar: 160x600
 * 4. Copie os IDs dos slots e substitua os valores acima
 * 5. Teste em produção para verificar se os anúncios aparecem
 */
