import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import { PartialDeep } from 'type-fest';

export interface IAuthResponse {
	token: string;
	user: IUserDB;
}

/**
 * The type definition for a user object.
 */
export type IUser = {
	id: string;
	role: string[] | string | null;
	displayName: string;
	photoURL?: string;
	email?: string;
	shortcuts?: string[];
	settings?: PartialDeep<FuseSettingsConfigType>;
	loginRedirectUrl?: string;
};

/**
 * The recovered user from database.
 */
export interface IUserDB {
	id: string;
	name: string;
	email: string;
	email_verified_at: string | null;
	created_at: string;
	updated_at: string;
}
