'use client';

import { Box, Typography, Chip, Stack } from '@mui/material';
import { CalendarToday, Shield, Verified } from '@mui/icons-material';
import EnhancedPaper from '@/components/ui/EnhancedPaper';
import { UserProfile } from '@/services/profile.service';

interface ProfileSidebarProps {
	user: UserProfile;
}

/**
 * Sidebar do perfil com informações adicionais
 * Status da conta e recursos disponíveis
 */
export function ProfileSidebar({ user }: ProfileSidebarProps) {
	return (
		<Stack spacing={3}>
			{/* Status da Conta */}
			<EnhancedPaper>
				<Box sx={{ p: 3 }}>
					<Typography
						variant="h6"
						gutterBottom
						sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
					>
						<Shield color="success" />
						Status da Conta
					</Typography>
					<Stack spacing={2}>
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
							<Verified color="success" />
							<Box>
								<Typography
									variant="body2"
									sx={{ fontWeight: 600 }}
								>
									Conta Verificada
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Acesso completo liberado
								</Typography>
							</Box>
						</Box>
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
							<CalendarToday color="info" />
							<Box>
								<Typography
									variant="body2"
									sx={{ fontWeight: 600 }}
								>
									Membro desde
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									{user.created_at
										? new Date(user.created_at).toLocaleDateString('pt-BR')
										: 'Data não disponível'}
								</Typography>
							</Box>
						</Box>
					</Stack>
				</Box>
			</EnhancedPaper>

			{/* Status do Sistema */}
			<EnhancedPaper>
				<Box sx={{ p: 3, textAlign: 'center' }}>
					<Typography
						variant="h6"
						gutterBottom
					>
						Sistema Ativo
					</Typography>
					<Chip
						label="✅ Online"
						color="success"
						sx={{ mb: 2, fontWeight: 600 }}
					/>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Acesso completo a todas as funcionalidades do sistema!
					</Typography>
				</Box>
			</EnhancedPaper>
		</Stack>
	);
}

export default ProfileSidebar;
