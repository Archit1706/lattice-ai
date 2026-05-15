import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  properties: Record<string, unknown>;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  node_count: number;
  edge_count: number;
}

export function useGraph(limit = 100) {
  return useQuery({
    queryKey: ["graph", limit],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/graph/?limit=${limit}`);
      return data as GraphData;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useEntitySubgraph(entityId: string, depth = 2) {
  return useQuery({
    queryKey: ["graph", "entity", entityId, depth],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/graph/entity/${entityId}?depth=${depth}`);
      return data as GraphData;
    },
    enabled: !!entityId,
  });
}

export function useRelationshipPath(sourceId: string, targetId: string) {
  return useQuery({
    queryKey: ["graph", "path", sourceId, targetId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/graph/path/${sourceId}/${targetId}`);
      return data as { path: Array<{ id: string; name: string; type: string }>; hops: number };
    },
    enabled: !!(sourceId && targetId),
  });
}
