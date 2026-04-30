import { Calendar, Shield, BadgeCheck, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ICON_SM, ICON_MD } from '@/lib/theme/iconDefaults';
import { Box, Stack, Typography } from '@mui/material';

import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';

import type { UserProfile } from '@/services';

interface ProfileSidebarProps {
	user: UserProfile;
}

/**
 * Sidebar do perfil com informações adicionais
 * Status da conta e recursos disponíveis
 */
export function ProfileSidebar({ user }: ProfileSidebarProps) {
	const { t } = useTranslation('profile');
	return (
		<Stack spacing={3}>
			{/* Status da Conta */}
			<EnhancedPaper>
				<Box sx={{ p: 3 }}>
					<Typography
						variant='h6'
						gutterBottom
						sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
					>
						<Shield {...ICON_MD} />
						{t('sidebar.accountStatus')}
					</Typography>
					<Stack spacing={2}>
						{user.email_verified_at ? (
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 2,
									p: 2,
									borderRadius: 2,
									bgcolor: 'success.50'
								}}
							>
								<BadgeCheck {...ICON_MD} />
								<Box>
									<Typography
										variant='body2'
										sx={{ fontWeight: 600 }}
									>
										{t('sidebar.verified')}
									</Typography>
									<Typography
										variant='caption'
										color='text.secondary'
									>
										{t('sidebar.verifiedDesc')}
									</Typography>
								</Box>
							</Box>
						) : (
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 2,
									p: 2,
									borderRadius: 2,
									bgcolor: 'warning.50'
								}}
							>
								<AlertCircle {...ICON_MD} />
								<Box>
									<Typography
										variant='body2'
										sx={{ fontWeight: 600 }}
									>
										{t('sidebar.pendingVerification')}
									</Typography>
									<Typography
										variant='caption'
										color='text.secondary'
									>
										{t('sidebar.pendingVerificationDesc')}
									</Typography>
								</Box>
							</Box>
						)}
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 2,
								p: 2,
								borderRadius: 2,
								bgcolor: 'info.50'
							}}
						>
							<Calendar {...ICON_SM} />
							<Box>
								<Typography
									variant='body2'
									sx={{ fontWeight: 600 }}
								>
									{t('sidebar.memberSince')}
								</Typography>
								<Typography
									variant='caption'
									color='text.secondary'
								>
									{user.created_at
										? new Date(user.created_at).toLocaleDateString('pt-BR')
										: t('sidebar.dateUnavailable')}
								</Typography>
							</Box>
						</Box>
					</Stack>
				</Box>
			</EnhancedPaper>
		</Stack>
	);
}

export default ProfileSidebar;
