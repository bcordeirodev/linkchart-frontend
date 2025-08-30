/**
 * Navbar horizontal compacto para Link Charts
 * Substitui o menu lateral por um header mais prático
 */

import { memo, useState } from 'react';
import {
    Typography,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Box,
    useTheme,
    Tooltip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Logo from './Logo';
import UserMenu from './UserMenu';

// Styled Components
import {
    StyledAppBar,
    StyledToolbar,
    NavButton,
    MobileMenuButton,
    PrimaryActionButton,
    MobileActionButton,
    DesktopNavigation,
    MobileNavigation,
    ActionsContainer,
    LogoContainer,
    StyledMenuPaper
} from '../styles/Navbar.styled';



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
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const theme = useTheme();

    const handleMoreMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMoreMenuAnchor(event.currentTarget);
    };

    const handleMoreMenuClose = () => {
        setMoreMenuAnchor(null);
    };

    const handleNavigation = (url: string) => {
        navigate(url);
        handleMoreMenuClose();
    };

    const isActiveRoute = (url: string) => {
        return pathname === url || pathname.startsWith(url + '/');
    };

    return (
        <StyledAppBar position="fixed">
            <StyledToolbar>
                {/* Logo */}
                <LogoContainer>
                    <Logo />
                </LogoContainer>

                {/* Navegação Principal - Desktop */}
                <DesktopNavigation>
                    {navigationItems.map((item) => (
                        <NavButton
                            key={item.id}
                            isActive={isActiveRoute(item.url)}
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
                </DesktopNavigation>

                {/* Navegação Mobile - Menu Hambúrguer */}
                <MobileNavigation>
                    <Tooltip title="Menu">
                        <MobileMenuButton
                            onClick={handleMoreMenuOpen}
                            size="small"
                        >
                            <FuseSvgIcon size={20}>
                                heroicons-outline:bars-3
                            </FuseSvgIcon>
                        </MobileMenuButton>
                    </Tooltip>

                    <Menu
                        anchorEl={moreMenuAnchor}
                        open={Boolean(moreMenuAnchor)}
                        onClose={handleMoreMenuClose}
                        onClick={handleMoreMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        PaperProps={StyledMenuPaper}
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
                </MobileNavigation>

                {/* Actions à direita */}
                <ActionsContainer>
                    {/* Quick Action - Criar Link */}
                    <Tooltip title="Criar novo link encurtado">
                        <PrimaryActionButton
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
                            }}
                        >
                            Criar Link
                        </PrimaryActionButton>
                    </Tooltip>

                    {/* Quick Action Mobile */}
                    <Tooltip title="Criar novo link">
                        <MobileActionButton
                            onClick={() => handleNavigation('/link/create')}
                            size="medium"
                            sx={{
                                display: { xs: 'flex', sm: 'none' },
                            }}
                        >
                            <FuseSvgIcon size={20}>
                                heroicons-outline:plus
                            </FuseSvgIcon>
                        </MobileActionButton>
                    </Tooltip>

                    {/* User Menu */}
                    <UserMenu />
                </ActionsContainer>
            </StyledToolbar>
        </StyledAppBar>
    );
}

export default memo(HorizontalNavbar);
