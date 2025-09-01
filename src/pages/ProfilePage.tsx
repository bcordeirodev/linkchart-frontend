import { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Alert, CircularProgress, Typography } from '@mui/material';
import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import useUser from '../lib/auth/useUser';
import { profileService, UserProfile } from '@/lib/services';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { ProfileSidebar } from '@/features/profile/components/ProfileSidebar';
import MainLayout from '@/shared/layout/MainLayout';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';

/**
 * Página de perfil do usuário refatorada
 * Componentizada para melhor organização
 */
function ProfilePage() {
	const dispatch = useAppDispatch();
	const { data: authUser } = useUser();
	const [user, setUser] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Função estável para carregar dados do perfil
	const loadUserProfile = useCallback(async () => {
		if (authUser && !user) {
			try {
				const response = await profileService.getCurrentUser();
				setUser(response.user);
			} catch (_error) {
				dispatch(
					showMessage({
						message: 'Erro ao carregar dados do perfil',
						variant: 'error'
					})
				);
			} finally {
				setIsLoading(false);
			}
		} else if (!authUser) {
			setIsLoading(false);
		}
	}, [authUser, user, dispatch]);

	// Carregar dados do perfil
	useEffect(() => {
		loadUserProfile();
	}, [loadUserProfile]);

	// Handler para atualização do usuário
	const handleUserUpdate = useCallback((updatedUser: UserProfile) => {
		setUser(updatedUser);
	}, []);

	// Estados de loading
	if (isLoading) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							minHeight: 400
						}}
					>
						<CircularProgress size={60} />
						<Typography
							variant="h6"
							sx={{ mt: 2 }}
						>
							Carregando perfil...
						</Typography>
					</Box>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	if (!user) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<Alert severity="error">Erro ao carregar dados do usuário. Tente fazer login novamente.</Alert>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
					<ProfileHeader />

					<Grid
						container
						spacing={4}
					>
						<Grid
							item
							xs={12}
							md={8}
						>
							<ProfileForm
								user={user}
								onUserUpdate={handleUserUpdate}
							/>
						</Grid>

						<Grid
							item
							xs={12}
							md={4}
						>
							<ProfileSidebar user={user} />
						</Grid>
					</Grid>
				</Box>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default ProfilePage;
