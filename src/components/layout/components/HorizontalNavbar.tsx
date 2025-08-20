/**
 * Navbar horizontal compacto para Link Charts
 * Substitui o menu lateral por um header mais prático
 */

'use client';

import { memo, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Box,
    useTheme,
    alpha,
    Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter, usePathname } from 'next/navigation';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Logo from './Logo';
import UserMenu from './UserMenu';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.background.paper, 0.98),
    backdropFilter: 'blur(24px)',
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: `
		0 1px 3px ${alpha(theme.palette.common.black, 0.04)},
		0 4px 12px ${alpha(theme.palette.common.black, 0.02)}
	`,
    color: theme.palette.text.primary,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
			${alpha(theme.palette.primary.main, 0.3)} 50%,
			${alpha(theme.palette.primary.main, 0.1)} 80%,
			transparent 100%
		)`
    }
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    minHeight: '72px !important',
    [theme.breakpoints.down('md')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        minHeight: '64px !important'
    },
    [theme.breakpoints.down('sm')]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    }
}));

const NavButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(1.5),
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    padding: theme.spacing(1.5, 3),
    minWidth: 'auto',
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&.active': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main,
        boxShadow: `inset 0 1px 3px ${alpha(theme.palette.primary.main, 0.1)}`,
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '2px',
            backgroundColor: theme.palette.primary.main,
            borderRadius: '1px'
        },
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.15)
        }
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.06),
        transform: 'translateY(-1px)',
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`
    }
}));

/**
 * Items de navegação principal
 */
const navigationItems = [
    { id: 'analytics', title: 'Analytics', icon: 'heroicons-outline:chart-bar', url: '/analytics' },
    { id: 'links', title: 'Links', icon: 'heroicons-outline:link', url: '/link' }
];

/**
 * Header horizontal com navegação principal
 */
function HorizontalNavbar() {
    const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();

    const handleMoreMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMoreMenuAnchor(event.currentTarget);
    };

    const handleMoreMenuClose = () => {
        setMoreMenuAnchor(null);
    };

    const handleNavigation = (url: string) => {
        router.push(url);
        handleMoreMenuClose();
    };

    const isActiveRoute = (url: string) => {
        return pathname === url || pathname.startsWith(url + '/');
    };

    return (
        <StyledAppBar position="fixed">
            <StyledToolbar>
                {/* Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                    <Logo />
                </Box>

                {/* Navegação Principal - Desktop */}
                <Box sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    gap: 1,
                    flex: 1
                }}>
                    {navigationItems.map((item) => (
                        <NavButton
                            key={item.id}
                            className={isActiveRoute(item.url) ? 'active' : ''}
                            onClick={() => handleNavigation(item.url)}
                            startIcon={
                                <FuseSvgIcon size={18}>
                                    {item.icon}
                                </FuseSvgIcon>
                            }
                        >
                            {item.title}
                        </NavButton>
                    ))}
                </Box>

                {/* Navegação Mobile - Menu Hambúrguer */}
                <Box sx={{
                    display: { xs: 'flex', md: 'none' },
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'flex-end',
                    mr: 2
                }}>
                    <Tooltip title="Menu">
                        <IconButton
                            onClick={handleMoreMenuOpen}
                            size="small"
                            sx={{
                                p: 1,
                                color: 'text.primary'
                            }}
                        >
                            <FuseSvgIcon size={20}>
                                heroicons-outline:bars-3
                            </FuseSvgIcon>
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={moreMenuAnchor}
                        open={Boolean(moreMenuAnchor)}
                        onClose={handleMoreMenuClose}
                        onClick={handleMoreMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                minWidth: 200,
                                boxShadow: theme.shadows[8]
                            }
                        }}
                    >
                        {navigationItems.map((item) => (
                            <MenuItem
                                key={item.id}
                                onClick={() => handleNavigation(item.url)}
                                selected={isActiveRoute(item.url)}
                            >
                                <ListItemIcon>
                                    <FuseSvgIcon size={20}>
                                        {item.icon}
                                    </FuseSvgIcon>
                                </ListItemIcon>
                                <ListItemText>{item.title}</ListItemText>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>

                {/* Actions à direita */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    ml: 'auto'
                }}>
                    {/* Quick Action - Criar Link */}
                    <Tooltip title="Criar novo link encurtado">
                        <Button
                            variant="contained"
                            size="medium"
                            onClick={() => handleNavigation('/link/create')}
                            startIcon={
                                <FuseSvgIcon size={18}>
                                    heroicons-outline:plus
                                </FuseSvgIcon>
                            }
                            sx={{
                                display: { xs: 'none', sm: 'flex' },
                                borderRadius: 2.5,
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                px: 3,
                                py: 1.25,
                                background: `linear-gradient(135deg, 
									${theme.palette.primary.main} 0%, 
									${theme.palette.primary.dark} 100%
								)`,
                                boxShadow: `
									0 2px 8px ${alpha(theme.palette.primary.main, 0.3)},
									0 1px 3px ${alpha(theme.palette.common.black, 0.1)}
								`,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `
										0 4px 16px ${alpha(theme.palette.primary.main, 0.4)},
										0 2px 8px ${alpha(theme.palette.common.black, 0.15)}
									`
                                },
                                '&:active': {
                                    transform: 'translateY(-1px)'
                                }
                            }}
                        >
                            Criar Link
                        </Button>
                    </Tooltip>

                    {/* Quick Action Mobile */}
                    <Tooltip title="Criar novo link">
                        <IconButton
                            onClick={() => handleNavigation('/link/create')}
                            size="medium"
                            sx={{
                                display: { xs: 'flex', sm: 'none' },
                                width: 44,
                                height: 44,
                                background: `linear-gradient(135deg, 
									${theme.palette.primary.main} 0%, 
									${theme.palette.primary.dark} 100%
								)`,
                                color: theme.palette.primary.contrastText,
                                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`
                                }
                            }}
                        >
                            <FuseSvgIcon size={20}>
                                heroicons-outline:plus
                            </FuseSvgIcon>
                        </IconButton>
                    </Tooltip>

                    {/* User Menu */}
                    <UserMenu />
                </Box>
            </StyledToolbar>
        </StyledAppBar>
    );
}

export default memo(HorizontalNavbar);
