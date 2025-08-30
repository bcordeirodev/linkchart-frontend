import { useMemo } from 'react';
import { User } from '@/features/profile/types/user';
import { useAuth } from './AuthContext';
import _ from 'lodash';
import setIn from '@/lib/utils/setIn';

type useUser = {
	data: User | null;
	isGuest: boolean;
	updateUser: (updates: Partial<User>) => Promise<User | undefined>;
	updateUserSettings: (newSettings: User['settings']) => Promise<User['settings'] | undefined>;
	signOut: () => void;
	refreshUser: () => Promise<void>;
};

function useUser(): useUser {
	const { user, logout, updateUser: authUpdateUser, refreshUser: authRefreshUser } = useAuth();
	const isGuest = useMemo(() => !user?.role || user?.role?.length === 0, [user]);

	/**
	 * Update user
	 * Uses current auth provider's updateUser method
	 */
	async function handleUpdateUser(_data: Partial<User>) {
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
	async function handleUpdateUserSettings(newSettings: User['settings']) {
		if (!user) return undefined;

		const newUser = {
			...user,
			settings: newSettings
		};

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

	/**
	 * Refresh user data from API
	 */
	async function handleRefreshUser() {
		await authRefreshUser();
	}

	return {
		data: user,
		isGuest,
		signOut: handleSignOut,
		updateUser: handleUpdateUser,
		updateUserSettings: handleUpdateUserSettings,
		refreshUser: handleRefreshUser
	};
}

export default useUser;
