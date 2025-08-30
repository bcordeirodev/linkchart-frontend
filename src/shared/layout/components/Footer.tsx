/**
 * Footer principal para Link Charts
 * Versão limpa e minimalista
 */

import { memo } from 'react';
import { Box, Typography, Link, Divider, IconButton, Tooltip, Chip, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import LinkIcon from '@mui/icons-material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useThemeMediaQuery } from '@/lib/theme';

const StyledFooter = styled(Box)(({ theme }) => ({
	background: `linear-gradient(135deg, 
		${alpha(theme.palette.background.paper, 0.95)} 0%,
		${alpha(theme.palette.background.paper, 0.98)} 100%
	)`,
	backdropFilter: 'blur(20px)',
	borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
	padding: theme.spacing(3, 4),
	marginTop: 'auto',
	position: 'relative',
	'&::before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: '1px',
		background: `linear-gradient(90deg, 
			transparent 0%,
			${alpha(theme.palette.primary.main, 0.1)} 20%,
			${alpha(theme.palette.primary.main, 0.2)} 50%,
			${alpha(theme.palette.primary.main, 0.1)} 80%,
			transparent 100%
		)`
	},
	[theme.breakpoints.down('md')]: {
		padding: theme.spacing(2.5, 3)
	},
	[theme.breakpoints.down('sm')]: {
		padding: theme.spacing(2)
	}
}));

/**
 * Footer principal para Link Charts
 */
function Footer() {
	const currentYear = new Date().getFullYear();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('md'));

	return (
		<StyledFooter>
			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', sm: 'row' },
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 2
				}}
			>
				{/* Logo e branding */}
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<LinkIcon
						color="primary"
						fontSize="small"
					/>
					<Typography
						variant="body2"
						sx={{ fontWeight: 600 }}
					>
						Link Charts
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						- Encurtador inteligente
					</Typography>
				</Box>

				{/* Status do Sistema */}
				{!isMobile && (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
						<Chip
							label="✨ MVP Gratuito"
							size="small"
							variant="filled"
							color="success"
							sx={{
								fontWeight: 600,
								fontSize: '0.75rem',
								borderRadius: 2,
								px: 0.5,
								background: (theme) => `linear-gradient(135deg, 
									${theme.palette.success.light} 0%, 
									${theme.palette.success.main} 100%
								)`,
								boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.success.main, 0.2)}`
							}}
						/>
						<Chip
							label="🟢 Sistema Online"
							size="small"
							variant="filled"
							color="primary"
							sx={{
								fontWeight: 600,
								fontSize: '0.75rem',
								borderRadius: 2,
								px: 0.5,
								background: (theme) => `linear-gradient(135deg, 
									${theme.palette.primary.light} 0%, 
									${theme.palette.primary.main} 100%
								)`,
								boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`
							}}
						/>
					</Box>
				)}

				{/* Links e copyright */}
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Link
						href="/shorter"
						color="text.secondary"
						underline="hover"
						variant="caption"
					>
						Encurtar
					</Link>

					<Divider
						orientation="vertical"
						flexItem
					/>

					<Link
						href="/analytics"
						color="text.secondary"
						underline="hover"
						variant="caption"
					>
						Analytics
					</Link>

					<Divider
						orientation="vertical"
						flexItem
					/>

					<Typography
						variant="caption"
						color="text.secondary"
					>
						© {currentYear}
					</Typography>

					<Tooltip title="Projeto Open Source">
						<IconButton
							size="small"
							color="inherit"
							href="#"
							onClick={(e) => e.preventDefault()}
						>
							<GitHubIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</Box>
			</Box>
		</StyledFooter>
	);
}

export default memo(Footer);
