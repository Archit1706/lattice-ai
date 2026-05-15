"""Entity Extraction Agent — extracts structured venture entities from unstructured text."""
from __future__ import annotations

import time
from typing import Any

import instructor
from anthropic import AsyncAnthropic
from pydantic import BaseModel, Field

from src.core.config import get_settings
from src.core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()


class ExtractedEntityItem(BaseModel):
    entity_type: str = Field(
        description="Type: founder, company, investor, lp, fund, sector, technology, market_theme"
    )
    name: str = Field(description="Canonical name of the entity")
    properties: dict[str, Any] = Field(
        default_factory=dict,
        description="Relevant properties: role, sector, stage, location, founding_year, etc.",
    )
    confidence: float = Field(ge=0.0, le=1.0, description="Extraction confidence 0-1")
    context: str | None = Field(None, description="Surrounding context that led to extraction")


class ExtractedRelationship(BaseModel):
    source_entity: str = Field(description="Name of source entity")
    target_entity: str = Field(description="Name of target entity")
    relationship_type: str = Field(
        description="Type: founded, invested_in, works_at, advisor_to, co_investor, lp_in"
    )
    confidence: float = Field(ge=0.0, le=1.0)
    properties: dict[str, Any] = Field(default_factory=dict)


class ExtractionResult(BaseModel):
    entities: list[ExtractedEntityItem] = Field(default_factory=list)
    relationships: list[ExtractedRelationship] = Field(default_factory=list)
    summary: str = Field(description="Brief summary of key extracted information")
    source_type: str


class EntityExtractionAgent:
    """Extracts structured venture entities from raw text using LLM + structured outputs."""

    def __init__(self) -> None:
        self._client = instructor.from_anthropic(
            AsyncAnthropic(api_key=settings.anthropic_api_key)
        )

    async def extract(
        self,
        text: str,
        source_type: str = "document",
    ) -> tuple[ExtractionResult, float]:
        """Extract entities and relationships from text.

        Returns (result, processing_time_ms).
        """
        start = time.perf_counter()

        system_prompt = """You are an expert venture capital analyst AI that extracts structured information from documents.

Extract all venture-relevant entities including:
- Founders (name, role, background)
- Companies (name, sector, stage, funding info)
- Investors/VCs (firm name, focus areas)
- LPs (limited partners, commitment size)
- Funds (fund name, vintage, size)
- Sectors/Technologies
- Market themes and trends

Also extract relationships between entities (founded, invested_in, works_at, advisor_to, co_investor, lp_in).

Be precise and only extract information explicitly mentioned in the text.
Assign confidence scores based on how clearly the information is stated."""

        try:
            result = await self._client.messages.create(
                model=settings.anthropic_model,
                max_tokens=4096,
                system=system_prompt,
                messages=[
                    {
                        "role": "user",
                        "content": f"Extract venture entities from this {source_type}:\n\n{text[:8000]}",
                    }
                ],
                response_model=ExtractionResult,
            )
            result.source_type = source_type
        except Exception as exc:
            logger.error("entity_extraction_failed", error=str(exc))
            result = ExtractionResult(entities=[], relationships=[], summary="Extraction failed", source_type=source_type)

        elapsed = (time.perf_counter() - start) * 1000
        logger.info("entity_extraction_complete", entities=len(result.entities), elapsed_ms=elapsed)
        return result, elapsed
