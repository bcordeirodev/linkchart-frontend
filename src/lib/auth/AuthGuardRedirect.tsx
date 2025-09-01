import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { FuseUtils } from '@/lib/utils';
import { getSessionRedirectUrl, resetSessionRedirectUrl, setSessionRedirectUrl } from '@/lib/auth/sessionRedirectUrl';
// Tipo removido - usando tipo genérico
import { usePathname } from '@/shared/hooks';
import { Loading } from '@/shared/components';
import { useNavigate } from '@/shared/hooks';
import useUser from './useUser';

type AuthGuardProps = {
	auth: string[] | [] | null | undefined;
	children: React.ReactNode;
	loginRedirectUrl?: string;
};

function AuthGuardRedirect({ auth, children, loginRedirectUrl = '/' }: AuthGuardProps) {
	const { data: user, isGuest } = useUser();
	const userRole = user?.role;
	const userRoleForPermission = userRole === null ? undefined : userRole;
	const navigate = useNavigate();

	const [accessGranted, setAccessGranted] = useState<boolean>(false);
	const pathname = usePathname();

	// Define ignored paths that shouldn't trigger redirects
	const ignoredPaths = useMemo(
		() => ['/', '/callback', '/sign-in', '/sign-out', '/logout', '/401', '/404', '/shorter'],
		[]
	);

	// Function to handle redirection with improved logic
	const handleRedirection = useCallback(() => {
		const savedRedirectUrl = getSessionRedirectUrl();
		const targetUrl = savedRedirectUrl || loginRedirectUrl;

		// Enhanced redirection logic
		if (isGuest) {
			// Save current path for post-login redirect (if not already saved)
			if (!savedRedirectUrl && !ignoredPaths.includes(pathname)) {
				setSessionRedirectUrl(pathname);
			}

			navigate('/sign-in');
		} else {
			// User is authenticated, redirect to intended destination
			const finalUrl = targetUrl === '/sign-in' ? '/' : targetUrl;
			navigate(finalUrl);
			resetSessionRedirectUrl();
		}
	}, [isGuest, loginRedirectUrl, navigate, pathname, ignoredPaths]);

	// Enhanced permission checking and access control
	useEffect(() => {
		const isOnlyGuestAllowed = Array.isArray(auth) && auth.length === 0;
		const userHasPermission = FuseUtils.hasPermission(
			auth === null ? undefined : auth,
			userRoleForPermission as never
		) as boolean;
		const isIgnoredPath = ignoredPaths.includes(pathname);

		// Grant access immediately for allowed scenarios
		if (!auth || (auth && userHasPermission) || (isOnlyGuestAllowed && isGuest)) {
			// Clear any stored redirect URL since access is granted
			if (getSessionRedirectUrl()) {
				resetSessionRedirectUrl();
			}

			setAccessGranted(true);
			return;
		}

		// Handle permission violations
		if (!userHasPermission) {
			setAccessGranted(false);

			if (isGuest && !isIgnoredPath) {
				// Guest trying to access protected route - save current path
				setSessionRedirectUrl(pathname);
			} else if (!isGuest && !isIgnoredPath) {
				// Authenticated user without proper permissions
				if (isOnlyGuestAllowed) {
					// Route is guest-only but user is authenticated
					setSessionRedirectUrl('/');
				} else {
					// User lacks required permissions
					setSessionRedirectUrl('/401');
				}
			}

			// Trigger redirection after setting up redirect URL
			handleRedirection();
		}
	}, [auth, userRole, isGuest, pathname, handleRedirection, ignoredPaths]);

	// Enhanced loading state with context information
	if (!accessGranted) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center p-4">
				<Loading />
				<div className="mt-4 text-center">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{isGuest ? 'Redirecting to sign in...' : 'Checking permissions...'}
					</p>
				</div>
			</div>
		);
	}

	return children;
}

export default AuthGuardRedirect;
