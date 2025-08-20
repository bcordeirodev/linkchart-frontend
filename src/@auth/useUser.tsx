import { useSession, signOut } from 'next-auth/react';
import { useMemo } from 'react';
import { IUser } from '@/types/user';
import { authUpdateDbUser } from '@auth/authApi';
import _ from 'lodash';
import setIn from '@/utils/setIn';

type useUser = {
	data: IUser | null;
	isGuest: boolean;
	updateUser: (updates: Partial<IUser>) => Promise<IUser | undefined>;
	updateUserSettings: (newSettings: IUser['settings']) => Promise<IUser['settings'] | undefined>;
	signOut: typeof signOut;
};

function useUser(): useUser {
	const { data, update } = useSession();
	const user = useMemo(() => data?.db, [data]);
	const isGuest = useMemo(() => !user?.role || user?.role?.length === 0, [user]);

	/**
	 * Update user
	 * Uses current auth provider's updateUser method
	 */
	async function handleUpdateUser(_data: Partial<IUser>) {
		try {
			const updatedUser = await authUpdateDbUser(_data);

			// Update AuthJs session data
			setTimeout(() => {
				update();
			}, 300);

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
	async function handleSignOut() {
		return signOut();
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
