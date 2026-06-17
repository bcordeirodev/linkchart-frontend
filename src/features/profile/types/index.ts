/**
 * Profile/Auth types
 *
 * Consolidated module containing:
 *  - API request/response shapes (Login/Register/UserResponse)
 *  - Frontend-specific user types (UserProfile, UserPreferences, UserSession, UserActivity)
 *  - The UserModel factory used to populate a User with sensible defaults
 */
import { defaults } from "lodash";

import type { User } from "@/types";
import type { PartialDeep } from "type-fest";

// ========================================
// 🌐 API TYPES
// ========================================

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  roles?: string[];
  permissions?: string[];
}

// ========================================
// 🎯 USER-SPECIFIC TYPES
// ========================================

export interface UserProfile extends UserResponse {
  avatar?: string;
  bio?: string;
  timezone?: string;
  language?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profile_public: boolean;
    show_stats: boolean;
  };
  dashboard: {
    default_timeframe: string;
    show_help_tips: boolean;
  };
}

export interface UserSession {
  user: User;
  token: string;
  expires_at: string;
  last_activity: string;
  device_info?: {
    browser: string;
    os: string;
    device: string;
    ip_address: string;
  };
}

export interface UserActivity {
  id: string;
  user_id: number;
  action: string;
  description: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ========================================
// 🏗️ USER MODEL FACTORY
// ========================================

/**
 * Creates a new user object with the specified data.
 *
 * @param data Partial user properties to override defaults.
 * @returns A complete User object populated with defaults.
 */
function UserModel(data?: PartialDeep<User>): User {
  // Ensure data is an object
  data = data || {};

  // Populate missing fields with defaults
  return defaults(data, {
    id: null,
    role: null,
    displayName: null,
    photoURL: "",
    email: "",
    shortcuts: [],
    settings: {},
    loginRedirectUrl: "/",
  }) as User;
}

export default UserModel;
