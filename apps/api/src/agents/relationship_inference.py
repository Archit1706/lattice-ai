"""Relationship Inference Agent — infers hidden relationships and network paths."""
from __future__ import annotations

from typing import Any

import instructor
from anthropic import AsyncAnthropic
from pydantic import BaseModel, Field

from src.core.config import get_settings
from src.core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()


class InferredRelationship(BaseModel):
    source: str
    target: str
    relationship_type: str
    strength: float = Field(ge=0.0, le=1.0, description="Relationship strength 0-1")
    evidence: list[str] = Field(default_factory=list, description="Evidence supporting this relationship")
    intro_path: list[str] = Field(default_factory=list, description="Warm intro path if exists")
    inferred: bool = Field(default=True, description="Whether this is inferred vs. explicit")


class NetworkAnalysis(BaseModel):
    target_entity: str
    direct_connections: list[str]
    warm_intro_paths: list[list[str]]
    relationship_summary: str
    network_strength: float = Field(ge=0.0, le=1.0)
    recommended_intro: str | None = None


class RelationshipInferenceAgent:
    """Infers relationships, detects warm intro paths, and analyzes network overlap."""

    def __init__(self) -> None:
        self._client = instructor.from_anthropic(
            AsyncAnthropic(api_key=settings.anthropic_api_key)
        )

    async def infer_relationships(
        self,
        entities: list[dict[str, Any]],
        context: str,
    ) -> list[InferredRelationship]:
        """Infer relationships between entities from context."""
        entities_str = "\n".join(f"- {e.get('name', '')} ({e.get('type', '')})" for e in entities[:20])

        result = await self._client.messages.create(
            model=settings.anthropic_model,
            max_tokens=2048,
            system="""You are a venture relationship analyst. Infer relationships between entities
based on context. Look for:
- Investment relationships
- Co-founder relationships
- Advisory relationships
- Alumni networks
- Portfolio synergies""",
            messages=[
                {
                    "role": "user",
                    "content": f"Entities:\n{entities_str}\n\nContext:\n{context[:3000]}\n\nInfer relationships.",
                }
            ],
            response_model=list[InferredRelationship],
        )
        return result

    async def analyze_network(
        self,
        target_entity: str,
        known_network: list[dict[str, Any]],
    ) -> NetworkAnalysis:
        """Analyze network paths to a target entity."""
        network_str = "\n".join(
            f"- {n.get('name', '')} → {n.get('connection', '')}" for n in known_network[:30]
        )

        return await self._client.messages.create(
            model=settings.anthropic_model,
            max_tokens=2048,
            system="You are a VC relationship analyst. Find warm intro paths and network analysis.",
            messages=[
                {
                    "role": "user",
                    "content": f"Target: {target_entity}\n\nKnown network:\n{network_str}\n\nAnalyze network paths and recommend best intro route.",
                }
            ],
            response_model=NetworkAnalysis,
        )
