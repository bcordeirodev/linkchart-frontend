import { api } from "../lib/api/client";
import { API_ENDPOINTS } from "../lib/api/endpoints";

import { BaseService } from "./base.service";

import type {
  LoginResponse,
  OnboardingFlags,
  OnboardingKey,
  UserResponse,
} from "@/types";

interface LoginRequest extends Record<string, unknown> {
  email: string;
  password: string;
}

interface RegisterRequest extends Record<string, unknown> {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * REST client for `/api/auth/*` and adjacent identity endpoints.
 *
 * Wraps `BaseService` and inherits envelope unwrap + JWT injection from `ApiClient`.
 * Login is sent as `application/x-www-form-urlencoded` to keep the request
 * "simple" (no preflight) when the proxy is not used.
 */
export default class AuthService extends BaseService {
  constructor() {
    super("AuthService");
  }

  /**
   * Authenticates with email + password and returns a fresh JWT.
   *
   * @param body - `{ email, password }` payload.
   * @returns the `LoginResponse` envelope including `token` and `user`.
   * @endpoint `POST /api/auth/login`
   *
   * @remarks
   * Sent as `x-www-form-urlencoded` via `api.postForm` to avoid the CORS preflight.
   */
  async signIn(body: LoginRequest): Promise<LoginResponse> {
    this.validateRequired(body, ["email", "password"]);

    // Enviar como x-www-form-urlencoded para evitar preflight OPTIONS
    return api.postForm<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      email: String(body.email),
      password: String(body.password),
    });
  }

  /**
   * Exchanges an Auth0 access token for a backend-issued JWT.
   *
   * Called once after Auth0 completes the OAuth flow (callback). The backend
   * validates the token via Auth0's /userinfo endpoint and returns the same
   * response shape as `signIn()`.
   *
   * `emailHint` and `nameHint` are forwarded as optional fallback fields.
   * The backend uses them when Auth0's /userinfo omits the `email` claim,
   * which can happen for Facebook/social logins depending on the access-token
   * scopes. They come from the Auth0 session's ID-token claims (`auth0User`)
   * and are therefore trustworthy.
   *
   * @param accessToken - Auth0 access token from GET /auth/access-token.
   * @param emailHint  - Email from the Auth0 session user object (fallback).
   * @param nameHint   - Name from the Auth0 session user object (fallback).
   * @returns the `LoginResponse` envelope including `token` and `user`.
   * @endpoint `POST /api/auth/auth0-exchange`
   */
  async auth0Exchange(
    accessToken: string,
    emailHint?: string,
    nameHint?: string,
  ): Promise<LoginResponse> {
    this.validateRequired({ accessToken }, ["accessToken"]);

    return this.post<LoginResponse>(
      API_ENDPOINTS.AUTH.AUTH0_EXCHANGE,
      {
        access_token: accessToken,
        ...(emailHint ? { email_hint: emailHint } : {}),
        ...(nameHint ? { name_hint: nameHint } : {}),
      },
      { context: "auth0_exchange" },
    );
  }

  /**
   * Creates a new account and returns the resulting JWT envelope.
   *
   * @param body - `{ name, email, password, password_confirmation }`.
   * @returns the `LoginResponse` envelope (auto-login on signup).
   * @endpoint `POST /api/auth/register`
   */
  async signUp(body: RegisterRequest): Promise<LoginResponse> {
    this.validateRequired(body, [
      "name",
      "email",
      "password",
      "password_confirmation",
    ]);

    return this.post<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, body, {
      context: "sign_up",
    });
  }

  /**
   * Returns the currently authenticated user.
   *
   * @returns the `UserResponse` for the session cookie.
   * @endpoint `GET /api/me`
   *
   * @remarks
   * Unlike most endpoints, `/me` does not return the resource at the top level —
   * it answers `{ success, user }` (then wrapped in `{ data }` by
   * `NormalizeApiResponse`, which `ApiClient` unwraps). This method used to be
   * typed as if it returned the user directly, so callers got the **envelope**:
   * `user.id` was `undefined`, `String(undefined)` became the literal string
   * `"undefined"`, and `name`/`email` were dropped entirely by `JSON.stringify`
   * when cached. Unwrap here so callers get a real `UserResponse`.
   */
  async getMe(): Promise<UserResponse> {
    const response = await this.get<{ success?: boolean; user: UserResponse }>(
      API_ENDPOINTS.AUTH.ME,
      { context: "get_me" },
    );

    return response.user;
  }

  /**
   * Records that the user dismissed an onboarding flag (e.g. the links tour).
   *
   * @param key - one of the keys the backend allowlists (`User::ONBOARDING_KEYS`);
   *              an unknown key is rejected with 422.
   * @returns the user's full onboarding map after the write.
   * @endpoint `POST /api/onboarding/seen`
   *
   * @remarks
   * The flag lives on the account rather than in `localStorage`, so a dismissed
   * tour stays dismissed on a new browser, a new device or a private window.
   * Idempotent — re-sending a key already seen is a no-op on the backend.
   */
  async markOnboardingSeen(key: OnboardingKey): Promise<OnboardingFlags> {
    const response = await this.post<{ onboarding: OnboardingFlags }>(
      API_ENDPOINTS.AUTH.ONBOARDING_SEEN,
      { key },
      { context: "mark_onboarding_seen" },
    );

    return response.onboarding;
  }

  /**
   * Invalidates the current JWT on the backend.
   *
   * @returns confirmation message; falls back to a success message on error.
   * @endpoint `POST /api/logout`
   */
  async signOut(): Promise<{ message: string }> {
    return this.post<{ message: string }>(
      API_ENDPOINTS.AUTH.LOGOUT,
      {},
      {
        fallback: { message: "Logout realizado com sucesso" },
        context: "sign_out",
      },
    );
  }

  /**
   * Patches the profile fields of the authenticated user.
   *
   * @param updates - partial user fields to overwrite.
   * @returns the updated `UserResponse`.
   * @endpoint `PUT /api/profile`
   */
  async updateProfile(updates: Partial<UserResponse>): Promise<UserResponse> {
    return this.put<UserResponse>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, updates, {
      context: "update_profile",
    });
  }

  /**
   * Confirms an email-verification token sent by the backend.
   *
   * @param token - opaque token from the verification email link.
   * @returns `{success, message, type?, user?}` envelope reflecting the outcome.
   * @endpoint `POST /api/auth/verify-email`
   */
  async verifyEmail(token: string): Promise<{
    success: boolean;
    message: string;
    type?: string;
    user?: UserResponse;
  }> {
    this.validateRequired({ token }, ["token"]);

    return this.post(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      { token },
      {
        context: "verify_email",
      },
    );
  }

  /**
   * Triggers the password-reset email flow.
   *
   * @param email - account email to send the reset link to.
   * @returns `{success, message, type?}` envelope.
   * @endpoint `POST /api/auth/forgot-password`
   */
  async forgotPassword(email: string): Promise<{
    success: boolean;
    message: string;
    type?: string;
  }> {
    this.validateRequired({ email }, ["email"]);

    return this.post(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email },
      {
        context: "forgot_password",
      },
    );
  }

  /**
   * Resets the password using a token issued by `forgotPassword`.
   *
   * @param data - `{token, password, password_confirmation}`.
   * @returns `{success, message, type?, user?}` envelope.
   * @endpoint `POST /api/auth/reset-password`
   */
  async resetPassword(data: {
    token: string;
    password: string;
    password_confirmation: string;
  }): Promise<{
    success: boolean;
    message: string;
    type?: string;
    user?: UserResponse;
  }> {
    this.validateRequired(data, ["token", "password", "password_confirmation"]);

    return this.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data, {
      context: "reset_password",
    });
  }

  /**
   * Reads the current email-verification state for the logged-in user.
   *
   * @returns flags `{email_verified, can_resend, last_sent?}` plus the bound email.
   * @endpoint `GET /api/email-verification-status`
   */
  async getEmailVerificationStatus(): Promise<{
    success: boolean;
    email_verified: boolean;
    email: string;
    can_resend: boolean;
    last_sent?: string;
  }> {
    return this.get(API_ENDPOINTS.AUTH.EMAIL_VERIFICATION_STATUS, {
      context: "email_verification_status",
    });
  }

  /**
   * Re-sends the verification email if the cool-down has elapsed.
   *
   * @returns `{success, message, email?, expires_at?}` envelope.
   * @endpoint `POST /api/resend-verification-email`
   */
  async resendVerificationEmail(): Promise<{
    success: boolean;
    message: string;
    email?: string;
    expires_at?: string;
  }> {
    return this.post(
      API_ENDPOINTS.AUTH.RESEND_VERIFICATION_EMAIL,
      {},
      {
        context: "resend_verification_email",
      },
    );
  }

  /**
   * Changes the password for the authenticated user.
   *
   * @param data - `{current_password, new_password, new_password_confirmation}`.
   * @returns `{message}` confirmation envelope.
   * @endpoint `PUT /api/change-password`
   */
  async changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<{ message: string }> {
    this.validateRequired(data, [
      "current_password",
      "new_password",
      "new_password_confirmation",
    ]);

    return this.put<{ message: string }>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      data,
      {
        context: "change_password",
      },
    );
  }
}

// Instância singleton do serviço
const authService = new AuthService();

// Exports das funções para compatibilidade com código existente
export const signIn = authService.signIn.bind(authService);
export const signUp = authService.signUp.bind(authService);
export const getMe = authService.getMe.bind(authService);
export const signOut = authService.signOut.bind(authService);
export const updateProfile = authService.updateProfile.bind(authService);
export const changePassword = authService.changePassword.bind(authService);

// Export da instância do serviço
export { authService };
