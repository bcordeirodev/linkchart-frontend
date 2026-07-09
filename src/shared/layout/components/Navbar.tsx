"use client";
/**
 * Componente de navegação principal — POV sóbrio (SP2)
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
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Drawer,
  List,
  ListItemButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "@/shared/hooks";
import { Menu as MenuIcon } from "lucide-react";

import { useTranslation } from "react-i18next";

import { useAuth } from "@/lib/auth/AuthContext";
import { darkNeutral, lightNeutral } from "@/lib/theme/colors";
import { motionTokens, radiusTokens } from "@/lib/theme/designSystem";
import { useResponsive } from "@/lib/theme";
import { AppIcon } from "@/shared/ui/icons";
import { AppLogo } from "@/shared/ui/base";
import { LanguageSelector } from "@/lib/i18n/components/LanguageSelector";

interface NavbarProps {
  onMobileMenuToggle?: () => void;
  isMobile?: boolean;
}

export function Navbar({
  onMobileMenuToggle: _onMobileMenuToggle,
}: NavbarProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { t } = useTranslation("common");
  const { isMobile } = useResponsive();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const isDark = theme.palette.mode === "dark";

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: isDark ? darkNeutral.surface : lightNeutral.surface,
          backgroundImage: "none",
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
          color: theme.palette.text.primary,
          transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            py: 1,
            minHeight: { xs: 64, md: 72 },
            justifyContent: "space-between",
          }}
        >
          {/* Logo Section */}
          <Box
            component="button"
            type="button"
            onClick={() => navigate("/links")}
            aria-label={t("nav.logoAriaLabel")}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: 1.5,
              p: 0,
              border: "none",
              background: "none",
              font: "inherit",
              color: "inherit",
              textAlign: "left",
            }}
          >
            <AppLogo size={36} showText={false} />
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontSize: "1.125rem",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.2,
                }}
              >
                Link Charts
              </Typography>
              <Typography
                variant="caption"
                suppressHydrationWarning
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {t("appTagline")}
              </Typography>
            </Box>
          </Box>

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {user ? (
              <>
                <LanguageSelector />
                {isMobile ? (
                  // On phones the Drawer is the single nav surface (identity +
                  // links + sign out live there), so the avatar-menu is dropped
                  // to avoid a duplicate navigation surface.
                  <IconButton
                    aria-label={t("nav.openNavAriaLabel", "open navigation")}
                    onClick={() => setDrawerOpen(true)}
                    edge="end"
                    sx={{ width: 44, height: 44 }}
                  >
                    <MenuIcon size={20} strokeWidth={1.5} />
                  </IconButton>
                ) : (
                  <Tooltip
                    title={t("nav.menuTooltip", { name: user.displayName })}
                    arrow
                  >
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label={t("nav.accountMenuAriaLabel")}
                      onClick={handleProfileMenuOpen}
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: `${radiusTokens.md}px`,
                        transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <Avatar
                        src={user.photoURL}
                        alt={user.displayName ?? ""}
                        aria-label={t("nav.avatarAriaLabel", {
                          name: user.displayName,
                        })}
                        sx={{
                          width: 36,
                          height: 36,
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          fontSize: "0.875rem",
                          fontWeight: 600,
                        }}
                      >
                        {user.displayName?.charAt(0).toUpperCase() ?? "U"}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                )}
              </>
            ) : null}
          </Box>

          {/* User Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 280,
                borderRadius: `${radiusTokens.md}px`,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[4],
                overflow: "visible",
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  borderTop: `1px solid ${theme.palette.divider}`,
                  borderLeft: `1px solid ${theme.palette.divider}`,
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
          >
            {/* User Info Header */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={user?.photoURL}
                  alt={user?.displayName ?? ""}
                  aria-label={t("nav.avatarAriaLabel", {
                    name: user?.displayName,
                  })}
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  {user?.displayName?.charAt(0).toUpperCase() ?? "U"}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {user?.displayName ?? "User"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Menu Items */}
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/profile");
              }}
              sx={{
                py: 1.5,
                px: 3,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <AppIcon intent="profile" size={20} />
              </ListItemIcon>
              <ListItemText
                primary={t("nav.profile")}
                secondary={t("nav.profileDesc")}
              />
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1.5,
                px: 3,
                color: theme.palette.error.main,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <AppIcon
                  intent="logout"
                  size={20}
                  color={theme.palette.error.main}
                />
              </ListItemIcon>
              <ListItemText
                primary={t("nav.signOut")}
                secondary={t("nav.signOutDesc")}
              />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <AppLogo
            size={28}
            textSx={{ fontSize: "1rem", color: theme.palette.text.primary }}
          />
        </Box>

        {user ? (
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Avatar
              src={user.photoURL}
              alt={user.displayName ?? ""}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              {user.displayName?.charAt(0).toUpperCase() ?? "U"}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={600} noWrap>
                {user.displayName ?? "User"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ display: "block" }}
              >
                {user.email}
              </Typography>
            </Box>
          </Box>
        ) : null}

        <List sx={{ py: 1 }}>
          <ListItemButton
            onClick={() => {
              navigate("/links");
              setDrawerOpen(false);
            }}
            sx={{ px: 3, py: 1.5, borderRadius: `${radiusTokens.sm}px`, mx: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AppIcon intent="link" size={20} />
            </ListItemIcon>
            <ListItemText primary={t("nav.myLinks")} />
          </ListItemButton>

          <ListItemButton
            onClick={() => {
              navigate("/profile");
              setDrawerOpen(false);
            }}
            sx={{ px: 3, py: 1.5, borderRadius: `${radiusTokens.sm}px`, mx: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AppIcon intent="profile" size={20} />
            </ListItemIcon>
            <ListItemText primary={t("nav.profile")} />
          </ListItemButton>

          <Divider sx={{ my: 1 }} />

          <ListItemButton
            onClick={() => {
              setDrawerOpen(false);
              void logout();
            }}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: `${radiusTokens.sm}px`,
              mx: 1,
              color: "error.main",
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AppIcon intent="logout" size={20} color="currentColor" />
            </ListItemIcon>
            <ListItemText primary={t("nav.signOut")} />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
