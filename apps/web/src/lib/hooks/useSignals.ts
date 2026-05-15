import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Signal {
  id: string;
  signal_type: string;
  company_name: string;
  title: string;
  description: string;
  sector: string;
  relevance_score: number;
  urgency: "low" | "medium" | "high";
  detected_at: string;
  metadata: Record<string, unknown>;
}

interface SignalFilters {
  signal_type?: string;
  urgency?: string;
  limit?: number;
}

export function useSignals(filters: SignalFilters = {}) {
  return useQuery({
    queryKey: ["signals", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.signal_type) params.set("signal_type", filters.signal_type);
      if (filters.urgency) params.set("urgency", filters.urgency);
      if (filters.limit) params.set("limit", String(filters.limit));
      const { data } = await api.get(`/api/v1/signals/?${params}`);
      return data as { signals: Signal[]; total: number };
    },
  });
}

export function useSignalsSummary() {
  return useQuery({
    queryKey: ["signals", "summary"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/signals/summary");
      return data as {
        total_this_week: number;
        high_priority: number;
        by_type: Record<string, number>;
        funding_total: number;
      };
    },
  });
}
