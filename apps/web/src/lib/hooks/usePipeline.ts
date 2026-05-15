import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Deal {
  id: string;
  company: string;
  founder: string;
  sector: string;
  stage: string;
  round_size: number;
  fit_score: number;
  last_contact: string;
  assignee: string;
  notes: string;
}

export interface PipelineStats {
  total_value: number;
  avg_fit_score: number;
  total_deals: number;
  by_stage: Record<string, number>;
}

interface PipelineFilters {
  stage?: string;
  assignee?: string;
  limit?: number;
}

export function usePipeline(filters: PipelineFilters = {}) {
  return useQuery({
    queryKey: ["pipeline", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.stage) params.set("stage", filters.stage);
      if (filters.assignee) params.set("assignee", filters.assignee);
      if (filters.limit) params.set("limit", String(filters.limit));
      const { data } = await api.get(`/api/v1/pipeline/?${params}`);
      return data as { deals: Deal[]; total: number };
    },
  });
}

export function usePipelineStats() {
  return useQuery({
    queryKey: ["pipeline", "stats"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/pipeline/stats");
      return data as PipelineStats;
    },
  });
}

export function usePipelineStages() {
  return useQuery({
    queryKey: ["pipeline", "stages"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/pipeline/stages");
      return data as Array<{ stage: string; label: string; count: number; total_value: number }>;
    },
  });
}
