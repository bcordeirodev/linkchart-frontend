/**
 * Componente de navegação principal com design moderno
 */

import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Menu,
	MenuItem,
	Avatar,
	Box,
	useTheme,
	Chip,
	Divider,
	ListItemIcon,
	ListItemText,
	Tooltip
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/lib/auth/AuthContext';
import { AppIcon } from '@/shared/ui/icons';

interface NavbarProps {
	onMobileMenuToggle?: () => void;
	isMobile?: boolean;
}

export function Navbar({ onMobileMenuToggle }: NavbarProps) {
	const theme = useTheme();
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [scrolled, setScrolled] = useState(false);
	const isMenuOpen = Boolean(anchorEl);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = async () => {
		handleMenuClose();
		await logout();
		navigate('/sign-in');
	};

	// Estilos dinâmicos da AppBar
	const appBarSx = {
		background: scrolled
			? `linear-gradient(135deg,
                ${alpha(theme.palette.background.paper, 0.95)} 0%,
                ${alpha(theme.palette.background.default, 0.9)} 100%)`
			: `linear-gradient(135deg,
                ${alpha(theme.palette.background.paper, 0.8)} 0%,
                ${alpha(theme.palette.background.default, 0.7)} 100%)`,
		backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(10px) saturate(150%)',
		borderBottom: `1px solid ${alpha(theme.palette.divider, scrolled ? 0.2 : 0.1)}`,
		boxShadow: scrolled
			? `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`
			: `0 4px 16px ${alpha(theme.palette.common.black, 0.08)}`,
		borderRadius: `0px !important`,
		transition: theme.transitions.create(['all'], {
			duration: theme.transitions.duration.standard,
			easing: theme.transitions.easing.easeInOut
		}),
		'&::before': {
			content: '""',
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			height: '1px',
			background: `linear-gradient(90deg,
                transparent 0%,
                ${alpha(theme.palette.primary.main, 0.3)} 20%,
                ${alpha(theme.palette.primary.main, 0.6)} 50%,
                ${alpha(theme.palette.primary.main, 0.3)} 80%,
                transparent 100%
            )`,
			opacity: scrolled ? 1 : 0.7,
			transition: theme.transitions.create(['opacity'], {
				duration: theme.transitions.duration.standard
			})
		}
	};

	return (
		<AppBar
			position='fixed'
			elevation={0}
			sx={appBarSx}
		>
			<Toolbar
				sx={{
					px: { xs: 2, sm: 3, md: 4 },
					py: 1,
					minHeight: { xs: 64, md: 72 },
					justifyContent: 'space-between'
				}}
			>
				{/* Logo Section */}
				<Box
					onClick={() => navigate('/links')}
					sx={{
						display: 'flex',
						alignItems: 'center',
						cursor: 'pointer',
						transition: theme.transitions.create(['transform'], {
							duration: theme.transitions.duration.short
						}),
						'&:hover': {
							transform: 'scale(1.05)'
						}
					}}
				>
					{/* Logo Icon */}
					<Box
						sx={{
							width: 40,
							height: 40,
							borderRadius: 2,
							background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							mr: 2,
							boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
							position: 'relative',
							overflow: 'hidden',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								background:
									'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
								transform: 'translateX(-100%)',
								transition: theme.transitions.create(['transform'], {
									duration: theme.transitions.duration.standard
								})
							},
							'&:hover::before': {
								transform: 'translateX(100%)'
							}
						}}
					>
						<AppIcon
							intent='analytics'
							size={20}
							color='white'
						/>
					</Box>

					{/* Logo Text */}
					<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
						<Typography
							variant='h6'
							component='div'
							sx={{
								fontWeight: 800,
								background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
								backgroundClip: 'text',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								fontSize: '1.25rem',
								letterSpacing: '-0.025em'
							}}
						>
							Link Chart
						</Typography>
						<Typography
							variant='caption'
							sx={{
								color: theme.palette.text.secondary,
								fontSize: '0.75rem',
								fontWeight: 500,
								letterSpacing: '0.05em',
								textTransform: 'uppercase'
							}}
						>
							Analytics Platform
						</Typography>
					</Box>
				</Box>

				{/* Right Section */}
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					{/* User Menu */}
					{user ? (
						<Tooltip
							title={`${user.displayName} - Click for menu`}
							arrow
						>
							<IconButton
								size='large'
								edge='end'
								aria-label='account menu'
								onClick={handleProfileMenuOpen}
								sx={{
									background: alpha(theme.palette.background.paper, 0.8),
									backdropFilter: 'blur(10px)',
									borderRadius: 2,
									'&:hover': {
										background: alpha(theme.palette.background.paper, 0.9),
										transform: 'scale(1.05)'
									}
								}}
							>
								<Avatar
									sx={{
										width: 36,
										height: 36,
										background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
										fontSize: '0.875rem',
										fontWeight: 700,
										boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
									}}
								>
									{user.displayName?.charAt(0).toUpperCase() ?? 'U'}
								</Avatar>
							</IconButton>
						</Tooltip>
					) : null}
				</Box>

				{/* Enhanced User Menu Dropdown */}
				<Menu
					anchorEl={anchorEl}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right'
					}}
					keepMounted
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right'
					}}
					open={isMenuOpen}
					onClose={handleMenuClose}
					PaperProps={{
						sx: {
							mt: 1.5,
							minWidth: 280,
							borderRadius: 3,
							background: `linear-gradient(135deg,
                                ${alpha(theme.palette.background.paper, 0.95)} 0%,
                                ${alpha(theme.palette.background.default, 0.9)} 100%)`,
							backdropFilter: 'blur(20px)',
							border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
							boxShadow: `0 12px 32px ${alpha(theme.palette.common.black, 0.15)}`,
							overflow: 'visible',
							'&::before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0
							}
						}
					}}
				>
					{/* User Info Header */}
					<Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<Avatar
								sx={{
									width: 48,
									height: 48,
									background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
								}}
							>
								{user?.displayName?.charAt(0).toUpperCase() ?? 'U'}
							</Avatar>
							<Box>
								<Typography
									variant='subtitle1'
									fontWeight={600}
								>
									{user?.displayName ?? 'User'}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
								>
									{user?.email}
								</Typography>
								<Chip
									label='Pro User'
									size='small'
									color='primary'
									sx={{ mt: 0.5, fontSize: '0.7rem' }}
								/>
							</Box>
						</Box>
					</Box>

					{/* Menu Items */}
					<MenuItem
						onClick={() => {
							handleMenuClose();
							navigate('/profile');
						}}
						sx={{
							py: 1.5,
							px: 3,
							'&:hover': {
								background: alpha(theme.palette.primary.main, 0.08)
							}
						}}
					>
						<ListItemIcon>
							<AppIcon
								intent='profile'
								size={20}
							/>
						</ListItemIcon>
						<ListItemText
							primary='Profile Settings'
							secondary='Manage your account'
						/>
					</MenuItem>

					<Divider sx={{ my: 1 }} />

					<MenuItem
						onClick={handleLogout}
						sx={{
							py: 1.5,
							px: 3,
							color: theme.palette.error.main,
							'&:hover': {
								background: alpha(theme.palette.error.main, 0.08)
							}
						}}
					>
						<ListItemIcon>
							<AppIcon
								intent='logout'
								size={20}
								color={theme.palette.error.main}
							/>
						</ListItemIcon>
						<ListItemText
							primary='Sign Out'
							secondary='See you later!'
						/>
					</MenuItem>
				</Menu>
			</Toolbar>
		</AppBar>
	);
}

export default Navbar;
