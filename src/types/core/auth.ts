/**
 * @fileoverview Tipos relacionados à autenticação e usuários
 * @author Link Charts Team
 * @version 1.0.0
 */

import type { ID, ISODateString } from "./common";

/**
 * Dados básicos do usuário (compatível com perfil existente)
 */
export interface User {
  /** ID único do usuário */
  id: ID;
  /** Nome completo */
  name: string;
  /** Email do usuário */
  email: string;
  /** Nome de exibição (compatibilidade) */
  displayName?: string;
  /** Role único ou array (compatibilidade) */
  role?: string[] | string | null;
  /** Roles/papéis do usuário */
  roles?: string[];
  /** Permissões específicas */
  permissions?: string[];
  /** URL da foto do perfil */
  photoURL?: string;
  /** Configurações do usuário */
  settings?: Record<string, unknown>;
}

/**
 * Resposta completa do usuário da API
 */
export interface UserResponse {
  /** ID único do usuário */
  id: number;
  /** Nome completo */
  name: string;
  /** Email do usuário */
  email: string;
  /** Data de verificação do email */
  email_verified_at: string | null;
  /** Data de criação da conta */
  created_at: ISODateString;
  /** Data da última atualização */
  updated_at: ISODateString;
}

/**
 * Resposta de login da API.
 *
 * Backend (`AuthController::login`) emits `{ success, message, token, user }` only.
 * `expires_in` / `token_type` are not sent — do not re-add unless the backend changes.
 */
export interface LoginResponse {
  /** Token de acesso */
  token: string;
  /** Dados do usuário */
  user: UserResponse;
  /**
   * `true` apenas quando esta requisição criou uma conta nova (primeiro login
   * Auth0). Usado para disparar a conversão de cadastro uma única vez; ausente
   * ou `false` em logins recorrentes.
   */
  is_new?: boolean;
}

/**
 * Dados para requisição de login
 */
export interface LoginRequest {
  /** Email do usuário */
  email: string;
  /** Senha do usuário */
  password: string;
  /** Lembrar login */
  remember?: boolean;
}

/**
 * Dados para requisição de registro
 */
export interface RegisterRequest {
  /** Nome completo */
  name: string;
  /** Email do usuário */
  email: string;
  /** Senha */
  password: string;
  /** Confirmação da senha */
  password_confirmation: string;
}

/**
 * Dados para atualização de perfil
 */
export interface UpdateProfileRequest {
  /** Nome completo */
  name?: string;
  /** Email do usuário */
  email?: string;
  /** Senha atual (obrigatória para mudanças sensíveis) */
  current_password?: string;
  /** Nova senha */
  password?: string;
  /** Confirmação da nova senha */
  password_confirmation?: string;
}
