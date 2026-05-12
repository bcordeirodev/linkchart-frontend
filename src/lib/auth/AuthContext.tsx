"use client";
import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

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

  const { user: auth0User, isLoading: auth0Loading } = useUser();

  const convertUserDBToUser = (userDB: UserResponse): User => ({
    id: String(userDB.id),
    name: userDB.name || userDB.email,
    email: userDB.email,
    displayName: userDB.name,
    role: ["user"],
    settings: {
      layout: { style: "layout1", config: {} },
      direction: "ltr",
    },
  });

  const clearSession = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  /** Fetches a fresh Auth0 access token and exchanges it for a backend JWT. */
  const exchangeAuth0Token = useCallback(async (): Promise<void> => {
    const tokenResponse = await fetch("/auth/access-token");
    if (!tokenResponse.ok) {
      throw new Error("Failed to fetch Auth0 access token");
    }
    const { token: accessToken } = (await tokenResponse.json()) as { token: string };

    const loginResponse: LoginResponse = await authService.auth0Exchange(accessToken);
    const converted = convertUserDBToUser(loginResponse.user);
    setUser(converted);
    localStorage.setItem("token", loginResponse.token);
    localStorage.setItem("user", JSON.stringify(converted));
  }, []);

  useEffect(() => {
    if (auth0Loading) return;

    const initializeAuth = async () => {
      try {
        if (!auth0User) {
          // No Auth0 session — ensure local state is clean.
          clearSession();
          return;
        }

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          // Hydrate from cache immediately so the UI doesn't flash.
          try {
            setUser(JSON.parse(storedUser) as User);
          } catch {
            clearSession();
            await exchangeAuth0Token();
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
                await exchangeAuth0Token();
              } catch {
                clearSession();
              }
            }
            // Network errors: keep cached user (graceful degradation).
          }
        } else {
          // Auth0 session active but no backend JWT — exchange now.
          try {
            await exchangeAuth0Token();
          } catch {
            clearSession();
          }
        }
      } catch (error) {
        console.error("Auth init error:", error);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [auth0User, auth0Loading, clearSession, exchangeAuth0Token]);

  const login = (): void => {
    window.location.href = "/auth/login";
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.signOut();
    } catch {
      // Best-effort backend JWT invalidation.
    }
    clearSession();
    window.location.href = "/auth/logout";
  };

  const refreshUser = async (): Promise<void> => {
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
  };

  const updateUser = async (updates: Partial<User>): Promise<User | undefined> => {
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
      throw new Error("Falha ao atualizar perfil");
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || auth0Loading,
    login,
    logout,
    updateUser,
    refreshUser,
  };

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
