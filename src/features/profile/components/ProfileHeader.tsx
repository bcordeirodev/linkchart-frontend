import { Box, Typography } from '@mui/material';
import PageBreadcrumb from '@/shared/ui/navigation/PageBreadcrumb';

/**
 * Cabeçalho da página de perfil
 * Inclui breadcrumb e título da seção
 */
export function ProfileHeader() {
	return (
		<Box sx={{ mb: 5 }}>
			{/* <PageBreadcrumb /> */}
			<Box
				sx={{
					background: (theme) =>
						theme.palette.mode === 'dark'
							? `linear-gradient(135deg, ${theme.palette.secondary.main}20 0%, ${theme.palette.secondary.main}10 100%)`
							: `linear-gradient(135deg, ${theme.palette.secondary.main}14 0%, ${theme.palette.secondary.main}0A 100%)`,
					borderRadius: 3,
					p: 4,
					border: (theme) =>
						`1px solid ${theme.palette.secondary.main}${theme.palette.mode === 'dark' ? '40' : '1A'}`,
					position: 'relative',
					overflow: 'hidden'
				}}
			>
				{/* Elemento decorativo */}
				<Box
					sx={{
						position: 'absolute',
						top: -30,
						right: -30,
						width: 150,
						height: 150,
						background: (theme) =>
							theme.palette.mode === 'dark'
								? `radial-gradient(circle, ${theme.palette.secondary.main}30 0%, transparent 70%)`
								: `linear-gradient(135deg, ${theme.palette.secondary.main}1A 0%, ${theme.palette.secondary.main}0D 100%)`,
						borderRadius: '50%',
						opacity: 0.6
					}}
				/>

				<Box sx={{ position: 'relative', zIndex: 1 }}>
					<Typography
						variant="h3"
						component="h1"
						sx={{
							fontWeight: 700,
							background: (theme) =>
								`linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
							backgroundClip: 'text',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							mb: 2
						}}
					>
						👤 Meu Perfil
					</Typography>
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{
							fontWeight: 400,
							opacity: 0.8
						}}
					>
						Gerencie suas informações pessoais e configurações de conta
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}

export default ProfileHeader;
