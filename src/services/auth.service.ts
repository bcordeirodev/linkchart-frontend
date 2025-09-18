import { LoginResponse, UserResponse } from '@/types';
import { API_ENDPOINTS } from '../lib/api/endpoints';
import { BaseService } from './base.service';
import { api } from '../lib/api/client';

interface LoginRequest extends Record<string, unknown> {
	email: string;
	password: string;
}

interface RegisterRequest extends Record<string, unknown> {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
}

/**
 * Serviço de autenticação
 *
 * Herda do BaseService para:
 * - Tratamento de erro padronizado
 * - Logging centralizado
 * - Type safety
 * - Fallbacks automáticos
 */

// Tipos centralizados importados de @/types

/**
 * Classe de serviço para autenticação usando BaseService
 */
export default class AuthService extends BaseService {
	constructor() {
		super('AuthService');
	}

	/**
	 * Realiza login do usuário
	 */
	async signIn(body: LoginRequest): Promise<LoginResponse> {
		this.validateRequired(body, ['email', 'password']);

		// Enviar como x-www-form-urlencoded para evitar preflight OPTIONS
		return api.postForm<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
			email: String(body.email),
			password: String(body.password)
		});
	}

	/**
	 * Registra um novo usuário
	 */
	async signUp(body: RegisterRequest): Promise<LoginResponse> {
		this.validateRequired(body, ['name', 'email', 'password', 'password_confirmation']);

		return this.post<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, body, {
			context: 'sign_up'
		});
	}

	/**
	 * Busca dados do usuário autenticado
	 */
	async getMe(): Promise<UserResponse> {
		return this.get<UserResponse>(API_ENDPOINTS.AUTH.ME, {
			context: 'get_me'
		});
	}

	/**
	 * Realiza logout do usuário
	 */
	async signOut(): Promise<{ message: string }> {
		return this.post<{ message: string }>(
			API_ENDPOINTS.AUTH.LOGOUT,
			{},
			{
				fallback: { message: 'Logout realizado com sucesso' },
				context: 'sign_out'
			}
		);
	}

	/**
	 * Atualiza perfil do usuário
	 */
	async updateProfile(updates: Partial<UserResponse>): Promise<UserResponse> {
		return this.put<UserResponse>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, updates, {
			context: 'update_profile'
		});
	}

	/**
	 * Verificar email usando token
	 */
	async verifyEmail(token: string): Promise<{
		success: boolean;
		message: string;
		type?: string;
		user?: UserResponse;
	}> {
		this.validateRequired({ token }, ['token']);

		return this.post(
			API_ENDPOINTS.AUTH.VERIFY_EMAIL,
			{ token },
			{
				context: 'verify_email'
			}
		);
	}

	/**
	 * Solicitar recuperação de senha
	 */
	async forgotPassword(email: string): Promise<{
		success: boolean;
		message: string;
		type?: string;
	}> {
		this.validateRequired({ email }, ['email']);

		return this.post(
			API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
			{ email },
			{
				context: 'forgot_password'
			}
		);
	}

	/**
	 * Redefinir senha usando token
	 */
	async resetPassword(data: { token: string; password: string; password_confirmation: string }): Promise<{
		success: boolean;
		message: string;
		type?: string;
		user?: UserResponse;
	}> {
		this.validateRequired(data, ['token', 'password', 'password_confirmation']);

		return this.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data, {
			context: 'reset_password'
		});
	}

	/**
	 * Verificar status de verificação do email
	 */
	async getEmailVerificationStatus(): Promise<{
		success: boolean;
		email_verified: boolean;
		email: string;
		can_resend: boolean;
		last_sent?: string;
	}> {
		return this.get(API_ENDPOINTS.AUTH.EMAIL_VERIFICATION_STATUS, {
			context: 'email_verification_status'
		});
	}

	/**
	 * Reenviar email de verificação
	 */
	async resendVerificationEmail(): Promise<{
		success: boolean;
		message: string;
		email?: string;
		expires_at?: string;
	}> {
		return this.post(
			API_ENDPOINTS.AUTH.RESEND_VERIFICATION_EMAIL,
			{},
			{
				context: 'resend_verification_email'
			}
		);
	}

	/**
	 * Altera senha do usuário
	 */
	async changePassword(data: {
		current_password: string;
		new_password: string;
		new_password_confirmation: string;
	}): Promise<{ message: string }> {
		this.validateRequired(data, ['current_password', 'new_password', 'new_password_confirmation']);

		return this.put<{ message: string }>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data, {
			context: 'change_password'
		});
	}
}

// Instância singleton do serviço
const authService = new AuthService();

// Exports das funções para compatibilidade com código existente
export const signIn = authService.signIn.bind(authService);
export const signUp = authService.signUp.bind(authService);
export const getMe = authService.getMe.bind(authService);
export const signOut = authService.signOut.bind(authService);
export const updateProfile = authService.updateProfile.bind(authService);
export const changePassword = authService.changePassword.bind(authService);

// Export da instância do serviço
export { authService };

// export function update(id: string, body: IWordUpdate) {
// 	return apiService.patch<IWordResponse>(`word/${id}`, body);
// }

// export function all() {
// 	return apiService.get<{ data: IWordResponse[] }>('word');
// }

// export function findOne(id: string) {
// 	return apiService.get<{ data: IWordResponse }>(`word/${id}`);
// }

// export function remove(id: number) {
// 	return apiService.get(`word/${id}`);
// }
