import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface PortfolioCompany {
  id: string;
  name: string;
  sector: string;
  stage: string;
  status: "active" | "exited" | "written_off";
  investment_date: string;
  amount_invested: number;
  current_valuation: number;
  ownership_pct: number;
  moic: number;
  founders: string[];
}

export interface PortfolioStats {
  total_invested: number;
  total_value: number;
  portfolio_moic: number;
  irr: number;
  active_count: number;
  exited_count: number;
}

export function usePortfolioCompanies() {
  return useQuery({
    queryKey: ["portfolio", "companies"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/portfolio/companies");
      return data as { companies: PortfolioCompany[]; total: number };
    },
  });
}

export function usePortfolioStats() {
  return useQuery({
    queryKey: ["portfolio", "stats"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/portfolio/stats");
      return data as PortfolioStats;
    },
  });
}

export function usePortfolioPerformance() {
  return useQuery({
    queryKey: ["portfolio", "performance"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/portfolio/performance");
      return data as Array<{ month: string; value: number; invested: number }>;
    },
  });
}
