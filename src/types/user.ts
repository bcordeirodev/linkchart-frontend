/**
 * 👤 TIPOS DE USUÁRIO
 * Tipos para autenticação e gerenciamento de usuários
 * Re-exporta tipos de API e adiciona tipos específicos do frontend
 */

import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import { PartialDeep } from 'type-fest';
import { LoginResponse, UserResponse } from './api';

// ========================================
// 👤 USER TYPES (Re-exports from API)
// ========================================

export type { LoginResponse, UserResponse, RegisterRequest } from './api';

// ========================================
// 🔐 AUTH TYPES
// ========================================



/**
 * Frontend user object with UI-specific properties
 */
export interface IUser {
	id: string;
	role: string[] | string | null;
	displayName: string;
	photoURL?: string;
	email?: string;
	shortcuts?: string[];
	settings?: PartialDeep<FuseSettingsConfigType>;
	loginRedirectUrl?: string;
}



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
	user: IUser;
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
