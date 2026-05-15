import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Memo {
  id: string;
  title: string;
  company_id?: string;
  company_name?: string;
  content?: string;
  memo_type?: string;
  conviction_score?: number;
  author?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface MemoFilters {
  search?: string;
  memo_type?: string;
  limit?: number;
}

export function useMemos(filters: MemoFilters = {}) {
  return useQuery({
    queryKey: ["memos", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.memo_type) params.set("memo_type", filters.memo_type);
      if (filters.limit) params.set("limit", String(filters.limit));
      const { data } = await api.get(`/api/v1/memos/?${params}`);
      return data as { memos: Memo[]; total: number };
    },
  });
}

export function useMemo(id: string) {
  return useQuery({
    queryKey: ["memos", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/memos/${id}`);
      return data as Memo;
    },
    enabled: !!id,
  });
}

export function useCreateMemo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      company_id?: string;
      content?: string;
      memo_type?: string;
      tags?: string[];
    }) => {
      const { data } = await api.post("/api/v1/memos/", payload);
      return data as Memo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memos"] });
    },
  });
}
