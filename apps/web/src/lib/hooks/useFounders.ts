import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Founder {
  id: string;
  name: string;
  company: string;
  title?: string;
  sector: string;
  stage: string;
  fit_score: number;
  connections?: number;
  last_contact?: string;
  status: string;
  bio?: string;
  email?: string;
  linkedin_url?: string;
}

interface FounderFilters {
  search?: string;
  sector?: string;
  limit?: number;
  page?: number;
}

export function useFounders(filters: FounderFilters = {}) {
  return useQuery({
    queryKey: ["founders", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.sector) params.set("sector", filters.sector);
      if (filters.limit) params.set("limit", String(filters.limit));
      if (filters.page) params.set("page", String(filters.page));
      const { data } = await api.get(`/api/v1/founders/?${params}`);
      return data as { founders: Founder[]; total: number; page: number; pages: number };
    },
  });
}

export function useFounder(id: string) {
  return useQuery({
    queryKey: ["founders", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/founders/${id}`);
      return data as Founder;
    },
    enabled: !!id,
  });
}
