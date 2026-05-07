export const queryKeys = {
  links: {
    all: () => ["links"] as const,
    list: () => ["links", "list"] as const,
    detail: (id: string) => ["links", "detail", id] as const,
    meta: (ids: string[]) => ["links", "meta", [...ids].sort()] as const,
  },
  analytics: {
    temporal: (id: string) => ["analytics", id, "temporal"] as const,
    geographic: (id: string) => ["analytics", id, "geographic"] as const,
    audience: (id: string) => ["analytics", id, "audience"] as const,
    insights: (id: string) => ["analytics", id, "insights"] as const,
    public: (slug: string) => ["analytics", "public", slug] as const,
    publicLink: (slug: string) => ["link", "public", slug] as const,
  },
};
