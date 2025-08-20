'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Alert, CircularProgress, Typography } from '@mui/material';
import { useAppDispatch } from '@/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import useUser from '@auth/useUser';
import { getCurrentUser, UserProfile } from '@/services/profile.service';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';

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
				const response = await getCurrentUser();
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
		);
	}

	if (!user) {
		return <Alert severity="error">Erro ao carregar dados do usuário. Tente fazer login novamente.</Alert>;
	}

	return (
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
	);
}

export default ProfilePage;
