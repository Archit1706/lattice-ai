"""Signal routes — venture signal monitoring and retrieval."""
from __future__ import annotations

import uuid
from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, Query

from src.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/signals", tags=["signals"])

MOCK_SIGNALS = [
    {
        "id": str(uuid.uuid4()),
        "signal_type": "funding",
        "company_name": "Quantum Edge",
        "title": "Raised $12M Seed led by Accel",
        "description": "Third quantum computing startup to raise in 30 days.",
        "sector": "AI/ML",
        "relevance_score": 0.95,
        "urgency": "high",
        "detected_at": (datetime.now() - timedelta(hours=1)).isoformat(),
        "metadata": {"amount": 12000000, "investors": ["Accel", "Sequoia"]},
    },
    {
        "id": str(uuid.uuid4()),
        "signal_type": "hiring",
        "company_name": "Luminary AI",
        "title": "23 ML engineer openings (↑340%)",
        "description": "Based on LinkedIn data. 70% require CUDA expertise.",
        "sector": "AI Infrastructure",
        "relevance_score": 0.92,
        "urgency": "high",
        "detected_at": (datetime.now() - timedelta(hours=2)).isoformat(),
        "metadata": {"job_count": 23, "change_pct": 340},
    },
    {
        "id": str(uuid.uuid4()),
        "signal_type": "news",
        "company_name": "Nexus Robotics",
        "title": "Partnership with Toyota Manufacturing",
        "description": "5-year manufacturing automation contract. Est. $40M ARR impact.",
        "sector": "Robotics",
        "relevance_score": 0.88,
        "urgency": "high",
        "detected_at": (datetime.now() - timedelta(hours=4)).isoformat(),
        "metadata": {"partner": "Toyota"},
    },
    {
        "id": str(uuid.uuid4()),
        "signal_type": "hiring",
        "company_name": "DeepVault",
        "title": "Head of Enterprise Sales hired from Palantir",
        "description": "Enterprise GTM acceleration signal.",
        "sector": "Security",
        "relevance_score": 0.75,
        "urgency": "medium",
        "detected_at": (datetime.now() - timedelta(hours=6)).isoformat(),
        "metadata": {},
    },
    {
        "id": str(uuid.uuid4()),
        "signal_type": "funding",
        "company_name": "Meridian Health",
        "title": "Series B $32M — Bessemer led",
        "description": "FDA clearance obtained last month.",
        "sector": "Health Tech",
        "relevance_score": 0.70,
        "urgency": "medium",
        "detected_at": (datetime.now() - timedelta(days=1)).isoformat(),
        "metadata": {"amount": 32000000, "lead": "Bessemer Ventures"},
    },
]


@router.get("/")
async def get_signals(
    signal_type: str | None = Query(None),
    limit: int = Query(default=20, le=100),
    urgency: str | None = Query(None),
) -> dict[str, Any]:
    """Get venture signals with optional filters."""
    filtered = MOCK_SIGNALS
    if signal_type:
        filtered = [s for s in filtered if s["signal_type"] == signal_type]
    if urgency:
        filtered = [s for s in filtered if s["urgency"] == urgency]
    return {
        "signals": filtered[:limit],
        "total": len(filtered),
    }


@router.get("/summary")
async def get_signals_summary() -> dict[str, Any]:
    """Get signal summary statistics."""
    return {
        "total_this_week": 63,
        "high_priority": 12,
        "by_type": {
            "funding": 8,
            "hiring": 15,
            "news": 22,
            "market": 18,
        },
        "funding_total": 284000000,
    }
