/**
 * Profile/Auth API Types
 */

export interface LoginResponse {
	token: string;
	user: UserResponse;
	expires_in: number;
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
}

export interface UserResponse {
	id: string;
	name: string;
	email: string;
	email_verified_at?: string;
	created_at: string;
	updated_at: string;
	roles?: string[];
	permissions?: string[];
}
