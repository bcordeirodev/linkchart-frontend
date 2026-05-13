"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getAccessToken, useUser } from "@auth0/nextjs-auth0/client";

import { authService } from "@/services";

import type { LoginResponse, User, UserResponse } from "@/types";
import type { ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Redirects to Auth0 Universal Login (/auth/login). */
  login: () => void;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<User | undefined>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Converts a backend `UserResponse` DTO to the frontend `User` shape.
 *
 * Extracted to module scope so it is not recreated on every render and
 * can be referenced inside `useCallback` without causing stale-closure issues.
 */
function convertUserDBToUser(userDB: UserResponse): User {
  return {
    id: String(userDB.id),
    name: userDB.name || userDB.email,
    email: userDB.email,
    displayName: userDB.name,
    role: ["user"],
    settings: {
      layout: { style: "layout1", config: {} },
      direction: "ltr",
    },
  };
}

/**
 * Top-level auth provider mounted near the root of the App Router tree.
 *
 * Uses the Auth0 `useUser()` hook (from `Auth0Provider` ancestor) to detect
 * the Auth0 session. When an Auth0 session is active but no backend JWT
 * exists in localStorage, it calls `POST /api/auth/auth0-exchange` to obtain
 * one. `ApiClient` continues to inject `localStorage.token` as the bearer
 * token on every API call — no change required downstream.
 *
 * @remarks
 * - `login()` redirects to `/auth/login` (Auth0 Universal Login).
 * - `logout()` clears localStorage and redirects to `/auth/logout`.
 * - On network errors during JWT validation, the cached localStorage user
 *   is kept (graceful degradation); only 401 clears the session.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    user: auth0User,
    isLoading: auth0Loading,
    error: auth0Error,
  } = useUser();

  const clearSession = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  /** Fetches a fresh Auth0 access token and exchanges it for a backend JWT. */
  const exchangeAuth0Token = useCallback(
    async (pictureUrl?: string | null): Promise<void> => {
      const accessToken = await getAccessToken();

      const loginResponse: LoginResponse =
        await authService.auth0Exchange(accessToken);
      const converted = convertUserDBToUser(loginResponse.user);
      if (pictureUrl) converted.photoURL = pictureUrl;
      setUser(converted);
      localStorage.setItem("token", loginResponse.token);
      localStorage.setItem("user", JSON.stringify(converted));
    },
    [],
  );

  useEffect(() => {
    if (auth0Loading) return;

    let cancelled = false;

    if (auth0Error) {
      console.error("Auth0 session error:", auth0Error);
      // Don't clear local session — Auth0 transport error shouldn't kill a valid backend JWT.
      if (!cancelled) setIsLoading(false);
      return;
    }

    const initializeAuth = async () => {
      try {
        if (!auth0User) {
          // No Auth0 session — ensure local state is clean.
          if (!cancelled) clearSession();
          return;
        }

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        const picture = auth0User.picture ?? undefined;

        if (token && storedUser) {
          // Hydrate from cache immediately so the UI doesn't flash.
          try {
            const cached = JSON.parse(storedUser) as User;
            // Keep the profile picture fresh from the Auth0 session.
            if (picture) cached.photoURL = picture;
            if (!cancelled) setUser(cached);
          } catch (parseErr) {
            console.error("[AuthContext] Cached user parse failed:", parseErr);
            if (!cancelled) clearSession();
            await exchangeAuth0Token(picture);
            return;
          }

          // Validate the backend JWT.
          try {
            await authService.getMe();
          } catch (error) {
            const isAuthError =
              error &&
              typeof error === "object" &&
              "status" in error &&
              (error as { status: number }).status === 401;

            if (isAuthError) {
              // Backend JWT expired — re-exchange with Auth0.
              try {
                await exchangeAuth0Token(picture);
              } catch (exchangeErr) {
                console.error(
                  "[AuthContext] Token re-exchange failed:",
                  exchangeErr,
                );
                if (!cancelled) clearSession();
              }
            }
            // Network errors: keep cached user (graceful degradation).
          }
        } else {
          // Auth0 session active but no backend JWT — exchange now.
          try {
            await exchangeAuth0Token(picture);
          } catch (exchangeErr) {
            console.error("[AuthContext] Token exchange failed:", exchangeErr);
            if (!cancelled) clearSession();
          }
        }
      } catch (error) {
        console.error("Auth init error:", error);
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    initializeAuth();
    return () => {
      cancelled = true;
    };
  }, [auth0User, auth0Loading, auth0Error, clearSession, exchangeAuth0Token]);

  const login = useCallback((): void => {
    window.location.href = "/auth/login";
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.signOut();
    } catch {
      // Best-effort backend JWT invalidation.
    }
    // Do NOT call clearSession() here. Setting user=null before the page
    // navigates away causes AuthGuardRedirect (still mounted on /links) to
    // detect isGuest=true and push to /sign-in, creating a visible flash.
    // localStorage is cleared by initializeAuth() on the next page load once
    // the Auth0 session cookies have been wiped by the sign-out route.
    window.location.href = "/api/auth/sign-out";
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const userDB = await authService.getMe();
      const converted = convertUserDBToUser(userDB);
      setUser(converted);
      localStorage.setItem("user", JSON.stringify(converted));
    } catch (error) {
      const isAuthError =
        error &&
        typeof error === "object" &&
        "status" in error &&
        (error as { status: number }).status === 401;

      if (isAuthError) {
        clearSession();
      }
    }
  }, [clearSession]);

  const updateUser = useCallback(
    async (updates: Partial<User>): Promise<User | undefined> => {
      if (!user) return undefined;

      try {
        const updatedUserDB = await authService.updateProfile({
          name: updates.displayName || user.displayName,
          email: updates.email || user.email,
        });
        const updatedUser = convertUserDBToUser(updatedUserDB);
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      } catch (error) {
        console.error("Failed to update user:", error);
        throw error;
      }
    },
    [user],
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading: isLoading || auth0Loading,
      login,
      logout,
      updateUser,
      refreshUser,
    }),
    [user, isLoading, auth0Loading, login, logout, updateUser, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Reads the current auth context.
 *
 * @returns `{user, isAuthenticated, isLoading, login, logout, updateUser, refreshUser}`.
 * @throws if called outside an `<AuthProvider>` subtree.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
