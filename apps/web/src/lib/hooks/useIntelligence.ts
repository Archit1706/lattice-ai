import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface MeetingBrief {
  founder: string;
  company: string;
  stage: string;
  sector: string;
  fit_score: number;
  summary: string;
  prior_interactions: string[];
  mutual_connections: string[];
  portfolio_overlap: string[];
  suggested_questions: string[];
  risks: string[];
  recent_signals: string[];
  thesis_alignment: string;
  confidence: number;
}

export function useMeetingBrief() {
  return useMutation({
    mutationFn: async (payload: {
      founder_name: string;
      company_name: string;
      context?: string;
    }) => {
      const { data } = await api.post("/api/v1/intelligence/meeting-brief", payload);
      return data as MeetingBrief;
    },
  });
}

export interface MemoryResult {
  id: string;
  doc_type: string;
  title: string;
  excerpt: string;
  entities: string[];
  relevance_score: number;
  date: string;
  source: string;
}

export function useMemorySearch() {
  return useMutation({
    mutationFn: async (payload: { query: string; limit?: number }) => {
      const { data } = await api.post("/api/v1/intelligence/memory/search", {
        query: payload.query,
        limit: payload.limit ?? 10,
      });
      return data as { results: MemoryResult[]; total: number; search_time_ms: number };
    },
  });
}

export interface ExtractedEntity {
  entity_type: string;
  name: string;
  properties: Record<string, unknown>;
  confidence: number;
  context?: string;
}

export function useEntityExtraction() {
  return useMutation({
    mutationFn: async (payload: { text: string; source_type?: string }) => {
      const { data } = await api.post("/api/v1/intelligence/extract-entities", {
        text: payload.text,
        source_type: payload.source_type ?? "document",
      });
      return data as {
        entities: ExtractedEntity[];
        relationships: unknown[];
        processing_time_ms: number;
      };
    },
  });
}
