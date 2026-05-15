"""Signal Monitoring Agent — detects and scores venture-relevant signals."""
from __future__ import annotations

import asyncio
import time
from typing import Any

import instructor
from anthropic import AsyncAnthropic
from pydantic import BaseModel, Field

from src.core.config import get_settings
from src.core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()


class SignalClassification(BaseModel):
    signal_type: str = Field(
        description="Type: funding, hiring, product_launch, partnership, regulatory, market_shift, executive_change"
    )
    company_name: str | None = Field(None, description="Affected company if identifiable")
    title: str = Field(description="Concise signal title")
    description: str = Field(description="Detailed signal description")
    relevance_score: float = Field(ge=0.0, le=1.0, description="Relevance to VC firm 0-1")
    urgency: str = Field(description="low, medium, high")
    investment_implications: str = Field(description="What this means for investment decisions")
    entities_mentioned: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class SignalBatch(BaseModel):
    signals: list[SignalClassification] = Field(default_factory=list)
    processing_time_ms: float


class SignalMonitoringAgent:
    """Monitors and scores venture-relevant signals from multiple sources."""

    def __init__(self) -> None:
        self._client = instructor.from_anthropic(
            AsyncAnthropic(api_key=settings.anthropic_api_key)
        )

    async def classify_signal(self, raw_text: str, source: str) -> SignalClassification:
        """Classify a single raw signal."""
        return await self._client.messages.create(
            model=settings.anthropic_model,
            max_tokens=1024,
            system="You are a venture capital signal analyst. Classify this as a venture-relevant signal.",
            messages=[
                {
                    "role": "user",
                    "content": f"Source: {source}\n\nContent: {raw_text[:2000]}",
                }
            ],
            response_model=SignalClassification,
        )

    async def process_batch(
        self, raw_signals: list[dict[str, str]]
    ) -> SignalBatch:
        """Process multiple signals concurrently."""
        start = time.perf_counter()

        tasks = [
            self.classify_signal(s.get("text", ""), s.get("source", "unknown"))
            for s in raw_signals[:10]
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        signals = [r for r in results if isinstance(r, SignalClassification)]
        errors = [r for r in results if isinstance(r, Exception)]

        if errors:
            logger.warning("signal_classification_errors", count=len(errors))

        elapsed = (time.perf_counter() - start) * 1000
        return SignalBatch(signals=signals, processing_time_ms=elapsed)
