/**
 * Constantes relacionadas à API
 *
 * Centraliza todas as URLs e configurações da API,
 * seguindo o princípio DRY (Don't Repeat Yourself)
 */

// Configurações da API
export const API_CONFIG = {
	// URLs base por ambiente
	BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost',
	TEST_URL: import.meta.env.VITE_TEST_API_URL || 'http://localhost',

	// Timeouts
	TIMEOUT: 10000, // 10 segundos
	RETRY_ATTEMPTS: 3,

	// Headers padrão
	DEFAULT_HEADERS: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},

	// Endpoints
	ENDPOINTS: {
		// Analytics
		ANALYTICS: '/api/analytics',
		TEST_ANALYTICS: '/api/test-analytics/1',
		LINK_ANALYTICS: (id: string) => `/api/links/${id}/analytics`,
		TEST_LINK_ANALYTICS: (id: string) => `/api/test-link-analytics/${id}`,

		// Links
		LINKS: '/api/links',
		LINK: (id: string) => `/api/links/${id}`,
		CREATE_LINK: '/api/links',
		UPDATE_LINK: (id: string) => `/api/links/${id}`,
		DELETE_LINK: (id: string) => `/api/links/${id}`,

		// Auth
		AUTH: {
			LOGIN: '/api/auth/login',
			LOGOUT: '/api/auth/logout',
			REGISTER: '/api/auth/register',
			PROFILE: '/api/auth/profile',
			ME: '/api/auth/me',
			UPDATE_PROFILE: '/api/auth/profile',
		},

		// Rate Limiting
		RATE_LIMIT: '/api/rate-limit',
	},

	// Configurações de cache
	CACHE: {
		ANALYTICS_TTL: 5 * 60 * 1000, // 5 minutos
		LINKS_TTL: 2 * 60 * 1000, // 2 minutos
		USER_TTL: 10 * 60 * 1000, // 10 minutos
	},

	// Configurações de fallback
	FALLBACK: {
		ENABLED: true,
		RETRY_DELAY: 1000, // 1 segundo
		MAX_RETRIES: 2,
	},
};

// Função para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
	return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Função para construir URLs de teste
export const buildTestUrl = (endpoint: string): string => {
	return `${API_CONFIG.TEST_URL}${endpoint}`;
};

// Função para verificar se estamos em desenvolvimento
export const isDevelopment = (): boolean => {
	return import.meta.env.DEV;
};

// Função para verificar se estamos em produção
export const isProduction = (): boolean => {
	return import.meta.env.PROD;
};

// Função para obter timeout baseado no ambiente
export const getTimeout = (): number => {
	return isProduction() ? API_CONFIG.TIMEOUT * 2 : API_CONFIG.TIMEOUT;
};

// Exports para compatibilidade com código antigo
export const API_BASE_URL = API_CONFIG.BASE_URL;
console.log('🔧 API_BASE_URL configurada como:', API_BASE_URL);
export const API_ENDPOINTS = {
	AUTH: {
		LOGIN: API_CONFIG.ENDPOINTS.AUTH.LOGIN,
		REGISTER: API_CONFIG.ENDPOINTS.AUTH.REGISTER,
		LOGOUT: API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
		PROFILE: API_CONFIG.ENDPOINTS.AUTH.PROFILE,
		ME: API_CONFIG.ENDPOINTS.AUTH.ME,
		UPDATE_PROFILE: API_CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE,
	}
};

export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	UNPROCESSABLE_ENTITY: 422,
	INTERNAL_SERVER_ERROR: 500
} as const;

export const REQUEST_TIMEOUT = 30000; // 30 segundos
