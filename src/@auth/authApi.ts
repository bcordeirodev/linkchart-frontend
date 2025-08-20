import { IUser } from '@/types/user';
import UserModel from '@/models/UserModel';
import { PartialDeep } from 'type-fest';
import { api } from '@/lib/api';

/**
 * Get current authenticated user
 */
export async function authGetDbUser(userId: string): Promise<IUser> {
	return api.get<IUser>('/me');
}

/**
 * Get user by email (not implemented in real API)
 */
export async function authGetDbUserByEmail(email: string): Promise<IUser> {
	// Esta funcionalidade não está disponível na API real por questões de segurança
	throw new Error('Busca por email não disponível na API real');
}

/**
 * Update user profile
 */
export function authUpdateDbUser(user: PartialDeep<IUser>): Promise<IUser> {
	return api.put<IUser>('/profile', UserModel(user));
}

/**
 * Create user (use register endpoint)
 */
export async function authCreateDbUser(user: PartialDeep<IUser>): Promise<IUser> {
	return api.post<IUser>('/auth/register', UserModel(user));
}
