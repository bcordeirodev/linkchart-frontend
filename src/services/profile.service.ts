import { API_ENDPOINTS } from "../lib/api/endpoints";

import { BaseService } from "./base.service";

/**
 * Profile-shaped view of the authenticated user.
 *
 * Mirrors `auth/me` minus auth-specific fields; consumed by `/profile` UI.
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Editable subset of profile fields accepted by the update endpoint.
 */
export interface UpdateProfileRequest extends Record<string, unknown> {
  name?: string;
  email?: string;
}

/**
 * Successful response from the profile update endpoint.
 */
export interface UpdateProfileResponse {
  message: string;
  user: UserProfile;
}

/**
 * Shape returned by GET /api/profile/stats.
 */
export interface ProfileStats {
  total_links: number;
  total_clicks: number;
  links_this_month: number;
  clicks_this_month: number;
}

/**
 * Body accepted by `DELETE /api/account`.
 *
 * Local accounts (with a password) must send `password`; Auth0 accounts
 * (`password === null`) must send `confirmation` equal to the account email.
 * Exactly one of the two is required, depending on `usesOAuthLogin`.
 */
export interface DeleteAccountRequest extends Record<string, unknown> {
  password?: string;
  confirmation?: string;
}

/**
 * REST client for `/api/me` and `/api/profile` (profile read/update).
 *
 * Wraps `BaseService` and inherits envelope unwrap + JWT injection from `ApiClient`.
 * Distinct from `AuthService` to keep the profile UI decoupled from sign-in flows.
 */
export default class ProfileService extends BaseService {
  constructor() {
    super("ProfileService");
  }

  /**
   * Returns the profile payload for the authenticated user.
   *
   * @returns `{user}` envelope wrapping a `UserProfile`.
   * @endpoint `GET /api/me`
   */
  async getCurrentUser(): Promise<{ user: UserProfile }> {
    return this.get<{ user: UserProfile }>(API_ENDPOINTS.AUTH.ME, {
      context: "get_current_user",
    });
  }

  /**
   * Patches the profile fields of the authenticated user.
   *
   * @param data - partial profile fields to overwrite.
   * @returns `{message, user}` envelope.
   * @endpoint `PUT /api/profile`
   */
  async updateProfile(
    data: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> {
    this.validateRequired(data, []); // No required fields, but validate object

    return this.put<UpdateProfileResponse>(
      API_ENDPOINTS.AUTH.UPDATE_PROFILE,
      data,
      {
        context: "update_profile",
      },
    );
  }

  /**
   * Returns total link and click counts for the authenticated user.
   *
   * @returns `ProfileStats` with total_links and total_clicks.
   * @endpoint `GET /api/profile/stats`
   */
  async getStats(): Promise<ProfileStats> {
    return this.get<ProfileStats>(API_ENDPOINTS.AUTH.PROFILE_STATS, {
      context: "get_profile_stats",
    });
  }

  /**
   * Permanently deletes the authenticated user's account and all owned data
   * (links, clicks, subdomains).
   *
   * @param payload - `{password}` for local accounts, `{confirmation}` (must
   * equal the account email) for Auth0 accounts.
   * @throws {ApiError} with `code` `INVALID_PASSWORD` or `INVALID_CONFIRMATION`
   * (HTTP 422) when the confirmation does not match.
   * @endpoint `DELETE /api/account` — no response body on success (204).
   */
  async deleteAccount(payload: DeleteAccountRequest): Promise<void> {
    return this.delete<void>(API_ENDPOINTS.AUTH.ACCOUNT, payload, {
      context: "delete_account",
    });
  }
}

// Instância singleton do serviço
const profileService = new ProfileService();

// Exports das funções para compatibilidade com código existente
export const getCurrentUser =
  profileService.getCurrentUser.bind(profileService);
export const updateProfile = profileService.updateProfile.bind(profileService);
export const getStats = profileService.getStats.bind(profileService);

// Export da instância do serviço
export { profileService };
