"""Intelligence routes — meeting briefs, entity extraction, memory search."""
from __future__ import annotations

import asyncio
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse

from src.agents.entity_extraction import EntityExtractionAgent
from src.agents.meeting_intelligence import MeetingIntelligenceAgent
from src.agents.memory_retrieval import MemoryRetrievalAgent
from src.agents.signal_monitoring import SignalMonitoringAgent
from src.core.logging import get_logger
from src.schemas.entities import (
    EntityExtractionRequest,
    EntityExtractionResponse,
    MeetingBriefRequest,
    MeetingBriefResponse,
    MemorySearchRequest,
    MemorySearchResponse,
)

logger = get_logger(__name__)
router = APIRouter(prefix="/intelligence", tags=["intelligence"])


@router.post("/meeting-brief", response_model=MeetingBriefResponse)
async def generate_meeting_brief(request: MeetingBriefRequest) -> MeetingBriefResponse:
    """Generate AI-powered meeting intelligence brief."""
    agent = MeetingIntelligenceAgent()
    try:
        brief, elapsed = await agent.generate_brief(
            founder_name=request.founder_name,
            company_name=request.company_name,
            context=request.context,
        )
        return MeetingBriefResponse(
            founder=brief.founder_background[:100],
            company=brief.company_overview[:100],
            stage=brief.investment_stage,
            sector=brief.sector,
            fit_score=brief.thesis_fit_score,
            summary=brief.company_overview,
            prior_interactions=brief.prior_interactions_summary,
            mutual_connections=brief.mutual_connections,
            portfolio_overlap=brief.portfolio_overlap,
            suggested_questions=[q.question for q in brief.diligence_questions],
            risks=[r.risk for r in brief.risk_signals],
            recent_signals=brief.recent_signals,
            thesis_alignment=brief.thesis_alignment_reasoning,
            confidence=brief.overall_confidence,
        )
    except Exception as exc:
        logger.error("meeting_brief_error", error=str(exc))
        raise HTTPException(status_code=500, detail="Failed to generate meeting brief")


@router.post("/extract-entities", response_model=EntityExtractionResponse)
async def extract_entities(request: EntityExtractionRequest) -> EntityExtractionResponse:
    """Extract venture entities from text."""
    agent = EntityExtractionAgent()
    result, elapsed = await agent.extract(
        text=request.text,
        source_type=request.source_type,
    )
    return EntityExtractionResponse(
        entities=[
            {
                "entity_type": e.entity_type,
                "name": e.name,
                "properties": e.properties,
                "confidence": e.confidence,
                "context": e.context,
            }
            for e in result.entities
        ],
        relationships=[
            {
                "source": r.source_entity,
                "target": r.target_entity,
                "type": r.relationship_type,
                "confidence": r.confidence,
            }
            for r in result.relationships
        ],
        source_type=result.source_type,
        processing_time_ms=elapsed,
    )


@router.post("/memory/search", response_model=MemorySearchResponse)
async def search_memory(request: MemorySearchRequest) -> MemorySearchResponse:
    """Semantic search across institutional memory."""
    import time
    agent = MemoryRetrievalAgent()
    results, elapsed = await agent.search(
        query=request.query,
        limit=request.limit,
        filters=request.filters,
    )
    from datetime import datetime
    return MemorySearchResponse(
        results=[
            {
                "id": r["id"],
                "doc_type": r["doc_type"],
                "title": r["title"],
                "excerpt": r["excerpt"],
                "entities": r.get("entities", []),
                "relevance_score": r.get("relevance_score", 0.8),
                "date": r.get("date") or datetime.now(),
                "source": r.get("source", "unknown"),
            }
            for r in results
        ],
        total=len(results),
        query=request.query,
        search_time_ms=elapsed,
    )
