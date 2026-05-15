"""Meeting Intelligence Agent — generates contextual AI briefings for founder meetings."""
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


class DiligenceQuestion(BaseModel):
    question: str
    rationale: str = Field(description="Why this question matters for investment decision")
    category: str = Field(description="Category: market, product, team, financials, competition, risk")


class RiskSignal(BaseModel):
    risk: str
    severity: str = Field(description="low, medium, high, critical")
    mitigation: str | None = Field(None, description="Potential mitigation strategy")


class MeetingBriefOutput(BaseModel):
    founder_background: str = Field(description="Comprehensive founder background summary")
    company_overview: str = Field(description="Company thesis and product overview")
    investment_stage: str
    sector: str
    thesis_fit_score: float = Field(ge=0.0, le=100.0, description="0-100 fit score")
    thesis_alignment_reasoning: str = Field(description="Detailed thesis alignment analysis")
    prior_interactions_summary: list[str] = Field(
        default_factory=list, description="Key prior interaction points"
    )
    mutual_connections: list[str] = Field(
        default_factory=list, description="Mutual connections for warm intros"
    )
    portfolio_overlap: list[str] = Field(
        default_factory=list, description="Portfolio company synergies/conflicts"
    )
    diligence_questions: list[DiligenceQuestion] = Field(
        default_factory=list, description="Top 5 questions to ask"
    )
    risk_signals: list[RiskSignal] = Field(default_factory=list, description="Key risk flags")
    recent_signals: list[str] = Field(
        default_factory=list, description="Recent market signals about this company"
    )
    recommended_next_steps: list[str] = Field(default_factory=list)
    overall_confidence: float = Field(ge=0.0, le=1.0, description="Overall brief confidence")


class MeetingIntelligenceAgent:
    """Generates comprehensive AI-powered meeting preparation briefs."""

    def __init__(self) -> None:
        self._client = instructor.from_anthropic(
            AsyncAnthropic(api_key=settings.anthropic_api_key)
        )

    async def generate_brief(
        self,
        founder_name: str,
        company_name: str,
        context: str | None = None,
        institutional_memory: list[dict[str, Any]] | None = None,
        graph_context: dict[str, Any] | None = None,
        recent_signals: list[dict[str, Any]] | None = None,
    ) -> tuple[MeetingBriefOutput, float]:
        """Generate a comprehensive meeting intelligence brief."""
        start = time.perf_counter()

        memory_context = ""
        if institutional_memory:
            memory_context = "\n\nRelevant institutional memory:\n" + "\n".join(
                f"- {m.get('title', '')}: {m.get('excerpt', '')}" for m in institutional_memory[:5]
            )

        graph_ctx = ""
        if graph_context:
            graph_ctx = f"\n\nGraph intelligence:\n{graph_context}"

        signals_ctx = ""
        if recent_signals:
            signals_ctx = "\n\nRecent signals:\n" + "\n".join(
                f"- {s.get('title', '')}: {s.get('description', '')}" for s in recent_signals[:5]
            )

        system_prompt = """You are a senior venture capital analyst AI generating pre-meeting intelligence briefs.

Your briefs should be:
- Deeply contextual and specific
- Based on institutional memory, graph context, and market signals
- Focused on investment decision-relevant information
- Honest about what is known vs. inferred

Generate comprehensive, institutionally-grade meeting briefings."""

        user_prompt = f"""Generate a meeting intelligence brief for:

Founder: {founder_name}
Company: {company_name}
Meeting context: {context or "Initial discussion"}
{memory_context}
{graph_ctx}
{signals_ctx}

Provide a comprehensive brief including thesis fit analysis, diligence questions, risk signals, and recommended next steps."""

        try:
            result = await self._client.messages.create(
                model=settings.anthropic_model,
                max_tokens=8192,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
                response_model=MeetingBriefOutput,
            )
        except Exception as exc:
            logger.error("meeting_brief_failed", founder=founder_name, company=company_name, error=str(exc))
            raise

        elapsed = (time.perf_counter() - start) * 1000
        logger.info("meeting_brief_complete", founder=founder_name, elapsed_ms=elapsed)
        return result, elapsed
