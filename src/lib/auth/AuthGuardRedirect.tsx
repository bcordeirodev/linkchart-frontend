"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState, useMemo } from "react";

import {
  getSessionRedirectUrl,
  resetSessionRedirectUrl,
  setSessionRedirectUrl,
} from "@/lib/auth/sessionRedirectUrl";
import { FuseUtils } from "@/lib/utils";
// Tipo removido - usando tipo genérico
import { Loading } from "@/shared/components";
import { usePathname, useNavigate } from "@/shared/hooks";

import useUser from "./useUser";
import { useAuth } from "./AuthContext";

import type React from "react";

interface AuthGuardProps {
  auth: string[] | [] | null | undefined;
  children: React.ReactNode;
  loginRedirectUrl?: string;
  fallback?: React.ReactNode;
}

/**
 * Client-side route guard that gates a subtree behind an auth/role check.
 *
 * Behaviour:
 * - Waits for `useAuth().isLoading` to settle before deciding (prevents the
 *   "flash of redirect to /sign-in" during JWT verification on first paint).
 * - When the user lacks permission, persists the intended path via
 *   `sessionRedirectUrl` and navigates to `/sign-in` (or `/` for guest-only routes).
 * - Renders `<Loading />` (or the provided `fallback`) until access is resolved.
 *
 * Wrap protected pages or layouts with `<AuthGuardRedirect auth={[...]}>...`.
 */
function AuthGuardRedirect({
  auth,
  children,
  loginRedirectUrl = "/",
  fallback,
}: AuthGuardProps) {
  const { data: user, isGuest } = useUser();
  const { isLoading } = useAuth();
  const userRole = user?.role;
  const userRoleForPermission = userRole === null ? undefined : userRole;
  const navigate = useNavigate();

  const [accessGranted, setAccessGranted] = useState<boolean>(false);
  const pathname = usePathname();

  // Define ignored paths that shouldn't trigger redirects
  const ignoredPaths = useMemo(
    () => [
      "/",
      "/callback",
      "/sign-in",
      "/sign-out",
      "/logout",
      "/401",
      "/404",
      "/shorter",
    ],
    [],
  );

  // Function to handle redirection with improved logic
  const handleRedirection = useCallback(() => {
    const savedRedirectUrl = getSessionRedirectUrl();
    const targetUrl = savedRedirectUrl || loginRedirectUrl;

    // Enhanced redirection logic
    if (isGuest) {
      // Save current path for post-login redirect (if not already saved)
      if (!savedRedirectUrl && !ignoredPaths.includes(pathname)) {
        setSessionRedirectUrl(pathname);
      }

      navigate("/sign-in");
    } else {
      // User is authenticated, redirect to intended destination
      const finalUrl = targetUrl === "/sign-in" ? "/" : targetUrl;
      navigate(finalUrl);
      resetSessionRedirectUrl();
    }
  }, [isGuest, loginRedirectUrl, navigate, pathname, ignoredPaths]);

  // Enhanced permission checking and access control
  useEffect(() => {
    // Wait for auth to finish loading before making any redirect decisions.
    // Without this guard, the component acts on isGuest=true during the initial
    // render before the JWT is verified, causing spurious redirects to /sign-in.
    if (isLoading) return;

    const isOnlyGuestAllowed = Array.isArray(auth) && auth.length === 0;
    const userHasPermission = FuseUtils.hasPermission(
      auth === null ? undefined : auth,
      userRoleForPermission as never,
    );
    const isIgnoredPath = ignoredPaths.includes(pathname);

    // Grant access immediately for allowed scenarios
    if (
      !auth ||
      (auth && userHasPermission) ||
      (isOnlyGuestAllowed && isGuest)
    ) {
      // Clear any stored redirect URL since access is granted
      if (getSessionRedirectUrl()) {
        resetSessionRedirectUrl();
      }

      setAccessGranted(true);
      return;
    }

    // Handle permission violations
    if (!userHasPermission) {
      setAccessGranted(false);

      if (isGuest && !isIgnoredPath) {
        // Guest trying to access protected route - save current path
        setSessionRedirectUrl(pathname);
      } else if (!isGuest && !isIgnoredPath) {
        // Authenticated user without proper permissions
        if (isOnlyGuestAllowed) {
          // Route is guest-only but user is authenticated
          setSessionRedirectUrl("/");
        } else {
          // User lacks required permissions
          setSessionRedirectUrl("/401");
        }
      }

      // Trigger redirection after setting up redirect URL
      handleRedirection();
    }
  }, [
    auth,
    userRole,
    isGuest,
    isLoading,
    pathname,
    handleRedirection,
    ignoredPaths,
    userRoleForPermission,
  ]);

  if (!accessGranted) {
    if (fallback) return fallback;
    return (
      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Loading />
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {isGuest ? "Redirecting to sign in..." : "Checking permissions..."}
          </Typography>
        </Box>
      </Box>
    );
  }

  return children;
}

export default AuthGuardRedirect;
