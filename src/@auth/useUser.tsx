import { useMemo } from 'react';
import { IUser } from '@/types/user';
import { useAuth } from './AuthContext';
import _ from 'lodash';
import setIn from '@/utils/setIn';

type useUser = {
	data: IUser | null;
	isGuest: boolean;
	updateUser: (updates: Partial<IUser>) => Promise<IUser | undefined>;
	updateUserSettings: (newSettings: IUser['settings']) => Promise<IUser['settings'] | undefined>;
	signOut: () => void;
};

function useUser(): useUser {
	const { user, logout, updateUser: authUpdateUser } = useAuth();
	const isGuest = useMemo(() => !user?.role || user?.role?.length === 0, [user]);

	/**
	 * Update user
	 * Uses current auth provider's updateUser method
	 */
	async function handleUpdateUser(_data: Partial<IUser>) {
		try {
			const updatedUser = await authUpdateUser(_data);
			return updatedUser;
		} catch (error) {
			throw new Error('Failed to update user');
		}
	}

	/**
	 * Update user settings
	 * Uses current auth provider's updateUser method
	 */
	async function handleUpdateUserSettings(newSettings: IUser['settings']) {
		if (!user) return undefined;

		const newUser = setIn(user, 'settings', newSettings) as IUser;

		if (_.isEqual(user, newUser)) {
			return undefined;
		}

		const updatedUser = await handleUpdateUser(newUser);

		return updatedUser?.settings;
	}

	/**
	 * Sign out
	 */
	function handleSignOut() {
		logout();
	}

	return {
		data: user,
		isGuest,
		signOut: handleSignOut,
		updateUser: handleUpdateUser,
		updateUserSettings: handleUpdateUserSettings
	};
}

export default useUser;
