/**
 * 🔄 SESSION REDIRECT URL - LINK CHART
 * Gerenciamento de URLs de redirecionamento pós-autenticação
 *
 * @description
 * Sistema melhorado para gerenciar URLs de redirecionamento após login,
 * com validação de segurança, expiração automática e tratamento de erros.
 *
 * @features
 * - ✅ Validação de URLs para segurança
 * - ✅ Expiração automática (30 minutos)
 * - ✅ Tratamento robusto de erros
 * - ✅ Suporte a SSR/SSG
 * - ✅ TypeScript completo
 * - ✅ Logging detalhado
 *
 * @since 2.0.0
 */

/**
 * Configurações do sistema de redirect
 */
const CONFIG = {
  /** Chave no sessionStorage */
  storageKey: "linkChartRedirectUrl",
  /** Tempo máximo de validade (30 minutos) */
  maxAge: 30 * 60 * 1000,
  /** Prefixo para logs */
  logPrefix: "[SessionRedirect]",
} as const;

/**
 * Dados armazenados no sessionStorage
 */
interface StoredRedirectData {
  /** URL de destino */
  url: string;
  /** Timestamp de criação */
  timestamp: number;
  /** Origem da requisição */
  origin?: string;
  /** Motivo do redirecionamento */
  reason?: "login" | "unauthorized" | "expired" | "custom";
}

/**
 * Verifica se sessionStorage está disponível
 */
const isSessionStorageAvailable = (): boolean => {
  try {
    if (typeof window === "undefined") {
      return false;
    }

    if (!("sessionStorage" in window)) {
      return false;
    }

    // Teste de escrita/leitura
    const testKey = "__test_storage__";
    window.sessionStorage.setItem(testKey, "test");
    window.sessionStorage.removeItem(testKey);
    return true;
  } catch {
    // SessionStorage não disponível
    return false;
  }
};

/**
 * Valida se uma URL é segura para redirecionamento
 */
const isValidRedirectUrl = (url: string): boolean => {
  try {
    // URLs vazias não são válidas
    if (!url || typeof url !== "string") {
      return false;
    }

    // URLs relativas são sempre válidas
    if (url.startsWith("/")) {
      return true;
    }

    // Verifica se é uma URL absoluta do mesmo domínio
    const urlObj = new URL(url, window.location.origin);
    const currentOrigin = window.location.origin;

    // Permite apenas URLs do mesmo domínio
    if (urlObj.origin !== currentOrigin) {
      return false;
    }

    // Bloqueia protocolos perigosos
    const dangerousProtocols = ["javascript:", "data:", "vbscript:"];

    if (
      dangerousProtocols.some((protocol) =>
        url.toLowerCase().startsWith(protocol),
      )
    ) {
      // Protocolo perigoso detectado
      return false;
    }

    return true;
  } catch {
    // Erro na validação da URL
    return false;
  }
};

/**
 * Obtém a URL de redirecionamento armazenada
 */
export const getSessionRedirectUrl = (): string | null => {
  if (!isSessionStorageAvailable()) {
    return null;
  }

  try {
    const storedData = window.sessionStorage.getItem(CONFIG.storageKey);

    if (!storedData) {
      return null;
    }

    const data: StoredRedirectData = JSON.parse(storedData);
    const now = Date.now();
    const age = now - data.timestamp;

    // Verifica se expirou
    if (age > CONFIG.maxAge) {
      // URL de redirect expirada
      resetSessionRedirectUrl();
      return null;
    }

    // Valida a URL antes de retornar
    if (!isValidRedirectUrl(data.url)) {
      resetSessionRedirectUrl();
      return null;
    }

    // URL de redirect recuperada

    return data.url;
  } catch (error) {
    console.error(
      `${CONFIG.logPrefix} Erro ao recuperar URL de redirect:`,
      error,
    );
    resetSessionRedirectUrl();
    return null;
  }
};

/**
 * Define a URL de redirecionamento
 */
export const setSessionRedirectUrl = (
  url: string,
  reason: StoredRedirectData["reason"] = "custom",
): boolean => {
  if (!isSessionStorageAvailable()) {
    return false;
  }

  // Valida a URL antes de armazenar
  if (!isValidRedirectUrl(url)) {
    return false;
  }

  try {
    const data: StoredRedirectData = {
      url,
      timestamp: Date.now(),
      origin: window.location.origin,
      reason,
    };

    window.sessionStorage.setItem(CONFIG.storageKey, JSON.stringify(data));

    // URL de redirect armazenada

    return true;
  } catch (error) {
    console.error(`${CONFIG.logPrefix} Erro ao armazenar URL de redirect:`, {
      url,
      error,
    });
    return false;
  }
};

/**
 * Remove a URL de redirecionamento
 */
export const resetSessionRedirectUrl = (): void => {
  if (!isSessionStorageAvailable()) {
    return;
  }

  try {
    const _hadUrl = window.sessionStorage.getItem(CONFIG.storageKey) !== null;
    window.sessionStorage.removeItem(CONFIG.storageKey);

    // URL de redirect removida se existia
  } catch (error) {
    console.error(
      `${CONFIG.logPrefix} Erro ao remover URL de redirect:`,
      error,
    );
  }
};

/**
 * Verifica se existe uma URL de redirecionamento válida
 */
export const hasValidRedirectUrl = (): boolean => {
  return getSessionRedirectUrl() !== null;
};

/**
 * Obtém informações detalhadas sobre o redirecionamento
 */
export const getRedirectInfo = (): StoredRedirectData | null => {
  if (!isSessionStorageAvailable()) {
    return null;
  }

  try {
    const storedData = window.sessionStorage.getItem(CONFIG.storageKey);

    if (!storedData) {
      return null;
    }

    const data: StoredRedirectData = JSON.parse(storedData);
    const now = Date.now();

    // Verifica se expirou
    if (now - data.timestamp > CONFIG.maxAge) {
      resetSessionRedirectUrl();
      return null;
    }

    return data;
  } catch (error) {
    console.error(
      `${CONFIG.logPrefix} Erro ao obter informações de redirect:`,
      error,
    );
    return null;
  }
};

/**
 * Limpa URLs de redirecionamento expiradas
 */
export const cleanupExpiredRedirects = (): void => {
  if (!isSessionStorageAvailable()) {
    return;
  }

  try {
    const info = getRedirectInfo();

    if (!info) {
      return;
    } // Já foi limpo ou não existe

    const now = Date.now();

    if (now - info.timestamp > CONFIG.maxAge) {
      resetSessionRedirectUrl();
      // URL de redirect expirada removida durante limpeza
    }
  } catch (error) {
    console.error(`${CONFIG.logPrefix} Erro na limpeza de redirects:`, error);
  }
};

// Executa limpeza automática quando o módulo é carregado
if (typeof window !== "undefined") {
  // Executa após um pequeno delay para não bloquear o carregamento
  setTimeout(cleanupExpiredRedirects, 100);
}
