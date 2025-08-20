import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { IUser } from '@/types/user';

/**
 * Creates a new user object with the specified data.
 *
 * @param data Partial user properties to override defaults.
 * @returns A complete IUser object populated with defaults.
 */
function UserModel(data?: PartialDeep<IUser>): IUser {
	// Ensure data is an object
	data = data || {};

	// Populate missing fields with defaults
	return _.defaults(data, {
		id: null,
		role: null,
		displayName: null,
		photoURL: '',
		email: '',
		shortcuts: [],
		settings: {},
		loginRedirectUrl: '/'
	}) as IUser;
}

export default UserModel;
