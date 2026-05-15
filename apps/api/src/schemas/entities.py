import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class FounderBase(BaseModel):
    name: str
    email: str | None = None
    linkedin_url: str | None = None
    bio: str | None = None
    sector_focus: list[str] = Field(default_factory=list)


class FounderCreate(FounderBase):
    pass


class FounderResponse(FounderBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    thesis_fit_score: float | None = None
    relationship_strength: str | None = None
    last_contacted_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class CompanyBase(BaseModel):
    name: str
    website: str | None = None
    description: str | None = None
    sector: str | None = None
    stage: str | None = None
    round_size: float | None = None
    valuation: float | None = None
    location: str | None = None


class CompanyCreate(CompanyBase):
    pass


class CompanyResponse(CompanyBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    ai_fit_score: float | None = None
    pipeline_stage: str | None = None
    total_raised: float | None = None
    employee_count: int | None = None
    created_at: datetime
    updated_at: datetime


class SignalResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID | None = None
    signal_type: str
    title: str
    description: str | None = None
    source: str | None = None
    relevance_score: float | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    detected_at: datetime


class MeetingBriefRequest(BaseModel):
    founder_name: str
    company_name: str
    context: str | None = None
    meeting_type: str = "initial"


class MeetingBriefResponse(BaseModel):
    founder: str
    company: str
    stage: str
    sector: str
    fit_score: float
    summary: str
    prior_interactions: list[str]
    mutual_connections: list[str]
    portfolio_overlap: list[str]
    suggested_questions: list[str]
    risks: list[str]
    recent_signals: list[str]
    thesis_alignment: str
    confidence: float


class EntityExtractionRequest(BaseModel):
    text: str
    source_type: str = "document"
    source_id: str | None = None


class ExtractedEntity(BaseModel):
    entity_type: str
    name: str
    properties: dict[str, Any] = Field(default_factory=dict)
    confidence: float
    context: str | None = None


class EntityExtractionResponse(BaseModel):
    entities: list[ExtractedEntity]
    relationships: list[dict[str, Any]]
    source_type: str
    processing_time_ms: float


class MemorySearchRequest(BaseModel):
    query: str
    limit: int = Field(default=10, ge=1, le=50)
    filters: dict[str, Any] = Field(default_factory=dict)


class MemorySearchResult(BaseModel):
    id: str
    doc_type: str
    title: str
    excerpt: str
    entities: list[str]
    relevance_score: float
    date: datetime
    source: str


class MemorySearchResponse(BaseModel):
    results: list[MemorySearchResult]
    total: int
    query: str
    search_time_ms: float


class GraphNode(BaseModel):
    id: str
    label: str
    node_type: str
    properties: dict[str, Any] = Field(default_factory=dict)


class GraphEdge(BaseModel):
    source: str
    target: str
    relationship: str
    weight: float = 1.0
    properties: dict[str, Any] = Field(default_factory=dict)


class GraphResponse(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]
    node_count: int
    edge_count: int


class PaginatedResponse(BaseModel):
    items: list[Any]
    total: int
    page: int
    page_size: int
    pages: int
