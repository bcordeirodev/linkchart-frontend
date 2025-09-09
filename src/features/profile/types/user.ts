/**
 * 👤 TIPOS DE USUÁRIO
 * Tipos para autenticação e gerenciamento de usuários
 * Re-exporta tipos de API e adiciona tipos específicos do frontend
 */
import { UserResponse } from './api';

// ========================================
// 👤 USER TYPES (Re-exports from API)
// ========================================

export type { LoginResponse, UserResponse, RegisterRequest } from './api';

// ========================================
// 🎯 USER-SPECIFIC TYPES
// ========================================

export interface UserProfile extends UserResponse {
	avatar?: string;
	bio?: string;
	timezone?: string;
	language?: string;
	preferences?: UserPreferences;
}

export interface UserPreferences {
	theme: 'light' | 'dark' | 'auto';
	notifications: {
		email: boolean;
		push: boolean;
		marketing: boolean;
	};
	privacy: {
		profile_public: boolean;
		show_stats: boolean;
	};
	dashboard: {
		default_timeframe: string;
		show_help_tips: boolean;
	};
}

export interface UserSession {
	user: import('@/types').User;
	token: string;
	expires_at: string;
	last_activity: string;
	device_info?: {
		browser: string;
		os: string;
		device: string;
		ip_address: string;
	};
}

export interface UserActivity {
	id: string;
	user_id: number;
	action: string;
	description: string;
	metadata?: Record<string, unknown>;
	ip_address?: string;
	user_agent?: string;
	created_at: string;
}
