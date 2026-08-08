import { API_CONFIG } from "@/lib/api/endpoints";

import { BaseService } from "@/services/base.service";

import type {
  AdminEngagement,
  AdminHealth,
  AdminOverview,
  AdminRange,
  AdminUsersPage,
  AdminUsersParams,
} from "@/features/admin/types";

/**
 * Monta a query string dos endpoints do admin a partir dos params camelCase.
 *
 * @param params - pares chave/valor já no nome esperado pela API (snake_case).
 * @returns query string sem o `?` inicial (vazia quando não há params).
 */
function buildAdminQuery(
  params: Record<string, string | number | undefined>,
): string {
  const qs = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      qs.set(key, String(value));
    }
  }

  return qs.toString();
}

/**
 * Anexa a query string ao endpoint, omitindo o `?` quando vazia.
 */
function withQuery(endpoint: string, qs: string): string {
  return qs ? `${endpoint}?${qs}` : endpoint;
}

/**
 * REST client dos endpoints read-only `/api/admin/*` (painel do dono do
 * produto). Todo endpoint exige `users.is_admin` no backend — um 403 aqui
 * significa conta sem privilégio, e a página trata redirecionando.
 */
export default class AdminService extends BaseService {
  constructor() {
    super("AdminService");
  }

  /**
   * Totais da base, comparação com o período anterior e séries diárias.
   *
   * @param range - janela 7d/30d/90d.
   * @endpoint `GET /api/admin/overview`
   */
  async getOverview(range: AdminRange): Promise<AdminOverview> {
    const endpoint = withQuery(
      API_CONFIG.ENDPOINTS.ADMIN.OVERVIEW,
      buildAdminQuery({ range }),
    );

    return this.get<AdminOverview>(endpoint, { context: "admin_overview" });
  }

  /**
   * Lista paginada/buscável de usuários com contagens agregadas.
   *
   * @param params - paginação, busca e ordenação server-side.
   * @endpoint `GET /api/admin/users`
   */
  async getUsers(params: AdminUsersParams): Promise<AdminUsersPage> {
    const endpoint = withQuery(
      API_CONFIG.ENDPOINTS.ADMIN.USERS,
      buildAdminQuery({
        page: params.page,
        per_page: params.perPage,
        q: params.q,
        sort: params.sort,
        order: params.order,
      }),
    );

    return this.get<AdminUsersPage>(endpoint, { context: "admin_users" });
  }

  /**
   * Ativação, retorno pós-cadastro, distribuição de links e WAU/MAU.
   *
   * @param range - janela 7d/30d/90d.
   * @endpoint `GET /api/admin/engagement`
   */
  async getEngagement(range: AdminRange): Promise<AdminEngagement> {
    const endpoint = withQuery(
      API_CONFIG.ENDPOINTS.ADMIN.ENGAGEMENT,
      buildAdminQuery({ range }),
    );

    return this.get<AdminEngagement>(endpoint, { context: "admin_engagement" });
  }

  /**
   * Fila, jobs falhados, saúde dos links e qualidade do tráfego.
   *
   * @endpoint `GET /api/admin/health`
   */
  async getHealth(): Promise<AdminHealth> {
    return this.get<AdminHealth>(API_CONFIG.ENDPOINTS.ADMIN.HEALTH, {
      context: "admin_health",
    });
  }
}

/** Instância singleton, no padrão dos demais services. */
export const adminService = new AdminService();
