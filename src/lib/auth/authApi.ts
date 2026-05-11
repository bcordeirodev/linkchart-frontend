import UserModel from "@/features/profile/types";
import { api } from "@/lib/api/client";

import type { User } from "@/types";
import type { PartialDeep } from "type-fest";

/**
 * Returns the currently authenticated user.
 *
 * @param _userId - kept for signature compatibility; ignored (the JWT identifies the user).
 * @returns the authenticated `User`.
 * @endpoint `GET /me`
 */
export async function authGetDbUser(_userId: string): Promise<User> {
  return api.get<User>("/me");
}

/**
 * Stub kept for legacy callers — looking up users by email is intentionally
 * unsupported by the backend for privacy reasons.
 *
 * @throws always.
 */
export async function authGetDbUserByEmail(_email: string): Promise<User> {
  // Esta funcionalidade não está disponível na API real por questões de segurança
  throw new Error("Busca por email não disponível na API real");
}

/**
 * Registers a new user via the legacy auth API surface.
 *
 * @param user - partial user fields (normalised through `UserModel`).
 * @returns the created `User`.
 * @endpoint `POST /auth/register`
 */
export async function authCreateDbUser(user: PartialDeep<User>): Promise<User> {
  return api.post<User>("/auth/register", UserModel(user));
}

/**
 * Patches the authenticated user's profile via the legacy auth API surface.
 *
 * @param user - partial user fields (normalised through `UserModel`).
 * @returns the updated `User`.
 * @endpoint `PUT /profile`
 */
export function authUpdateDbUser(user: PartialDeep<User>): Promise<User> {
  return api.put<User>("/profile", UserModel(user));
}
