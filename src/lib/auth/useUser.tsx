"use client";
import { isEqual } from "lodash";
import { useMemo } from "react";

import { useAuth } from "./AuthContext";

import type { User } from "@/types";
// Removed: setIn não utilizado

interface useUser {
  data: User | null;
  isGuest: boolean;
  updateUser: (updates: Partial<User>) => Promise<User | undefined>;
  updateUserSettings: (
    newSettings: User["settings"],
  ) => Promise<User["settings"] | undefined>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

/**
 * Convenience hook that adapts `useAuth` to the legacy `useUser` shape used
 * by settings/profile components.
 *
 * @returns `{data, isGuest, signOut, updateUser, updateUserSettings, refreshUser}`.
 *
 * @remarks
 * - `isGuest` is derived from `user.role` being empty/missing.
 * - `updateUserSettings` is a no-op when the new settings object is structurally
 *   equal to the current one (lodash `isEqual` short-circuit).
 */
function useUser(): useUser {
  const {
    user,
    logout,
    updateUser: authUpdateUser,
    refreshUser: authRefreshUser,
  } = useAuth();
  const isGuest = useMemo(
    () => !user?.role || user?.role?.length === 0,
    [user],
  );

  /**
   * Update user
   * Uses current auth provider's updateUser method
   */
  async function handleUpdateUser(_data: Partial<User>) {
    try {
      const updatedUser = await authUpdateUser(_data);
      return updatedUser;
    } catch {
      throw new Error("Failed to update user");
    }
  }

  async function handleUpdateUserSettings(newSettings: User["settings"]) {
    if (!user) {
      return undefined;
    }

    const newUser = {
      ...user,
      settings: newSettings,
    };

    if (isEqual(user, newUser)) {
      return undefined;
    }

    const updatedUser = await handleUpdateUser(newUser);

    return updatedUser?.settings;
  }

  function handleSignOut() {
    logout();
  }

  async function handleRefreshUser() {
    await authRefreshUser();
  }

  return {
    data: user,
    isGuest,
    signOut: handleSignOut,
    updateUser: handleUpdateUser,
    updateUserSettings: handleUpdateUserSettings,
    refreshUser: handleRefreshUser,
  };
}

export default useUser;
