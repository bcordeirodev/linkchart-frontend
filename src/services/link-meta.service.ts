import { API_CONFIG } from "../lib/api/endpoints";
import { BaseService } from "./base.service";
import type { BatchMetaResponse } from "@/types";

class LinkMetaService extends BaseService {
  constructor() {
    super("LinkMetaService");
  }

  async batchMeta(ids: string[], days = 7): Promise<BatchMetaResponse> {
    return this.post<BatchMetaResponse>(
      API_CONFIG.ENDPOINTS.LINKS_BATCH_META,
      { ids: ids.map(Number), days },
      { fallback: {}, context: "batch_meta" },
    );
  }
}

export const linkMetaService = new LinkMetaService();
