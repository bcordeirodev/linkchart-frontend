import { BaseService } from './base.service';
import { API_ENDPOINTS } from '@/constants/api';
import { IAuthResponse, IUserDB } from '@/types/user';

/**
 * Serviço de autenticação
 *
 * Herda do BaseService para:
 * - Tratamento de erro padronizado
 * - Logging centralizado
 * - Type safety
 * - Fallbacks automáticos
 */

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
}

/**
 * Classe de serviço para autenticação usando BaseService
 */
class AuthService extends BaseService {
	constructor() {
		super('AuthService');
	}

	/**
	 * Realiza login do usuário
	 */
	async signIn(body: LoginRequest): Promise<IAuthResponse> {
		this.validateRequired(body, ['email', 'password']);

		return this.post<IAuthResponse>(API_ENDPOINTS.AUTH.LOGIN, body, {
			context: 'sign_in'
		});
	}

	/**
	 * Registra um novo usuário
	 */
	async signUp(body: RegisterRequest): Promise<IAuthResponse> {
		this.validateRequired(body, ['name', 'email', 'password', 'password_confirmation']);

		return this.post<IAuthResponse>(API_ENDPOINTS.AUTH.REGISTER, body, {
			context: 'sign_up'
		});
	}

	/**
	 * Busca dados do usuário autenticado
	 */
	async getMe(): Promise<IUserDB> {
		return this.get<IUserDB>(API_ENDPOINTS.AUTH.ME, {
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
	async updateProfile(updates: Partial<IUserDB>): Promise<IUserDB> {
		return this.put<IUserDB>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, updates, {
			context: 'update_profile'
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
