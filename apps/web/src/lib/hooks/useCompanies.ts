import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Company {
  id: string;
  name: string;
  website?: string;
  description?: string;
  sector?: string;
  stage?: string;
  round_size?: number;
  valuation?: number;
  total_raised?: number;
  employee_count?: number;
  founding_year?: number;
  location?: string;
  ai_fit_score?: number;
  pipeline_stage?: string;
  founders: string[];
}

interface CompanyFilters {
  search?: string;
  sector?: string;
  stage?: string;
  limit?: number;
  page?: number;
}

export function useCompanies(filters: CompanyFilters = {}) {
  return useQuery({
    queryKey: ["companies", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.sector) params.set("sector", filters.sector);
      if (filters.stage) params.set("stage", filters.stage);
      if (filters.limit) params.set("limit", String(filters.limit));
      if (filters.page) params.set("page", String(filters.page));
      const { data } = await api.get(`/api/v1/companies/?${params}`);
      return data as { companies: Company[]; total: number; page: number; pages: number };
    },
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ["companies", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/companies/${id}`);
      return data as Company;
    },
    enabled: !!id,
  });
}

export function useCompanySectors() {
  return useQuery({
    queryKey: ["companies", "sectors"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/companies/sectors");
      return data as string[];
    },
  });
}
