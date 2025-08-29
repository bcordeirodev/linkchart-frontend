'use client';

import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/utilities/PageBreadcrumb';

interface LinksHeaderProps {
	onCreateNew?: () => void;
}

/**
 * Cabeçalho da página de links
 * Inclui título e botão de criação
 */
export function LinksHeader({ onCreateNew }: LinksHeaderProps) {
	const navigate = useNavigate();

	const handleCreateNew = () => {
		if (onCreateNew) {
			onCreateNew();
		} else {
			navigate('/link/create');
		}
	};

	return (
		<Box sx={{ mb: 4 }}>
			{/* <PageBreadcrumb /> */}
			<Box
				sx={{
					background: (theme) =>
						`linear-gradient(135deg, ${theme.palette.secondary.main}14 0%, ${theme.palette.secondary.main}0A 100%)`,
					borderRadius: 3,
					p: 4,
					border: (theme) => `1px solid ${theme.palette.secondary.main}1A`,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					position: 'relative',
					overflow: 'hidden'
				}}
			>
				{/* Elemento decorativo */}
				<Box
					sx={{
						position: 'absolute',
						top: -30,
						left: -30,
						width: 150,
						height: 150,
						background: (theme) =>
							`linear-gradient(135deg, ${theme.palette.secondary.main}1A 0%, ${theme.palette.secondary.main}0D 100%)`,
						borderRadius: '50%',
						opacity: 0.6
					}}
				/>

				<Box sx={{ position: 'relative', zIndex: 1 }}>
					<Typography
						variant="h3"
						sx={{
							fontWeight: 700,
							background: (theme) =>
								`linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
							backgroundClip: 'text',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							mb: 1
						}}
					>
						Gerenciar Links
					</Typography>
					<Typography
						variant="body1"
						color="text.secondary"
						sx={{ opacity: 0.8 }}
					>
						Crie, edite e monitore seus links encurtados
					</Typography>
				</Box>

				<Button
					variant="contained"
					size="large"
					startIcon={<Add />}
					onClick={handleCreateNew}
					sx={{
						borderRadius: 3,
						textTransform: 'none',
						fontWeight: 600,
						px: 4,
						py: 1.5,
						background: (theme) =>
							`linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
						boxShadow: (theme) => `0 4px 15px ${theme.palette.secondary.main}4D`,
						transition: 'all 0.3s ease-in-out',
						position: 'relative',
						zIndex: 1,
						'&:hover': {
							transform: 'translateY(-2px)',
							boxShadow: (theme) => `0 6px 20px ${theme.palette.secondary.main}66`,
							background: (theme) =>
								`linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`
						}
					}}
				>
					Criar Novo Link
				</Button>
			</Box>
		</Box>
	);
}

export default LinksHeader;
