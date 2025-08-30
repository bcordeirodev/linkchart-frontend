import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { User } from '@/features/profile/types/user';

/**
 * Creates a new user object with the specified data.
 *
 * @param data Partial user properties to override defaults.
 * @returns A complete User object populated with defaults.
 */
function UserModel(data?: PartialDeep<User>): User {
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
	}) as User;
}

export default UserModel;
