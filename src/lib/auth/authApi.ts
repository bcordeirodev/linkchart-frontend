import { User } from '@/features/profile/types/user';
import UserModel from '@/features/profile/types/UserModel';
import { PartialDeep } from 'type-fest';
import { api } from '@/lib/api/client';

/**
 * Get current authenticated user
 */
export async function authGetDbUser(userId: string): Promise<User> {
	return api.get<User>('/me');
}

/**
 * Get user by email (not implemented in real API)
 */
export async function authGetDbUserByEmail(email: string): Promise<User> {
	// Esta funcionalidade não está disponível na API real por questões de segurança
	throw new Error('Busca por email não disponível na API real');
}

/**
 * Update user profile
 */
export function authUpdateDbUser(user: PartialDeep<User>): Promise<User> {
	return api.put<User>('/profile', UserModel(user));
}

/**
 * Create user (use register endpoint)
 */
export async function authCreateDbUser(user: PartialDeep<User>): Promise<User> {
	return api.post<User>('/auth/register', UserModel(user));
}
