// Lattice — Shared TypeScript Types

export type EntityType = "founder" | "company" | "investor" | "lp" | "fund" | "sector";
export type DealStage = "sourcing" | "initial_review" | "diligence" | "partner_meeting" | "term_sheet" | "closed" | "passed";
export type SignalType = "funding" | "hiring" | "news" | "market" | "product" | "regulatory";
export type Urgency = "low" | "medium" | "high" | "critical";
export type RelationshipStrength = "dormant" | "weak" | "moderate" | "strong" | "very_strong";

export interface Founder {
  id: string;
  name: string;
  email?: string;
  linkedinUrl?: string;
  bio?: string;
  sectorFocus: string[];
  thesisFitScore?: number;
  relationshipStrength?: RelationshipStrength;
  lastContactedAt?: string;
  companies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  website?: string;
  description?: string;
  sector?: string;
  stage?: DealStage;
  roundSize?: number;
  valuation?: number;
  totalRaised?: number;
  employeeCount?: number;
  foundingYear?: number;
  location?: string;
  aiFitScore?: number;
  pipelineStage?: DealStage;
  founders: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Signal {
  id: string;
  companyId?: string;
  companyName?: string;
  signalType: SignalType;
  title: string;
  description?: string;
  source?: string;
  sourceUrl?: string;
  relevanceScore?: number;
  urgency: Urgency;
  metadata: Record<string, unknown>;
  detectedAt: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: EntityType;
  properties: Record<string, unknown>;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  weight: number;
  properties?: Record<string, unknown>;
}

export interface VentureGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeCount: number;
  edgeCount: number;
}

export interface MeetingBrief {
  founder: string;
  company: string;
  stage: string;
  sector: string;
  fitScore: number;
  summary: string;
  priorInteractions: string[];
  mutualConnections: string[];
  portfolioOverlap: string[];
  suggestedQuestions: string[];
  risks: string[];
  recentSignals: string[];
  thesisAlignment: string;
  confidence: number;
}

export interface MemoryDocument {
  id: string;
  docType: "meeting" | "memo" | "email" | "note" | "transcript";
  title: string;
  excerpt: string;
  entities: string[];
  relevanceScore: number;
  date: string;
  source: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

export interface APIError {
  detail: string;
  type?: string;
  field?: string;
}
