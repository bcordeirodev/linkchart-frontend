import { BaseService } from './base.service';
import { API_ENDPOINTS } from '@/constants/api';

/**
 * Serviço para gerenciamento de perfil de usuário
 *
 * Herda do BaseService para:
 * - Tratamento de erro padronizado
 * - Logging centralizado
 * - Type safety
 * - Fallbacks automáticos
 */

export interface UserProfile {
	id: number;
	name: string;
	email: string;
	email_verified_at?: string;
	created_at: string;
	updated_at: string;
}

export interface UpdateProfileRequest {
	name?: string;
	email?: string;
}

export interface UpdateProfileResponse {
	message: string;
	user: UserProfile;
}

/**
 * Classe de serviço para perfil usando BaseService
 */
class ProfileService extends BaseService {
	constructor() {
		super('ProfileService');
	}

	/**
	 * Busca informações do usuário atual
	 */
	async getCurrentUser(): Promise<{ user: UserProfile }> {
		return this.get<{ user: UserProfile }>(API_ENDPOINTS.AUTH.ME, {
			context: 'get_current_user'
		});
	}

	/**
	 * Atualiza informações do perfil do usuário
	 */
	async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
		this.validateRequired(data, []); // No required fields, but validate object

		return this.put<UpdateProfileResponse>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data, {
			context: 'update_profile'
		});
	}
}

// Instância singleton do serviço
const profileService = new ProfileService();

// Exports das funções para compatibilidade com código existente
export const getCurrentUser = profileService.getCurrentUser.bind(profileService);
export const updateProfile = profileService.updateProfile.bind(profileService);

// Export da instância do serviço
export { profileService };
