"""Pipeline deal-flow routes."""
from __future__ import annotations

import uuid
from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, Query

from src.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/pipeline", tags=["pipeline"])

MOCK_DEALS = [
    {
        "id": str(uuid.uuid4()),
        "company": "Luminary AI",
        "sector": "AI/ML",
        "stage": "diligence",
        "round_size": 18000000,
        "fit_score": 94,
        "assignee": "Jordan Lee",
        "last_contact": (datetime.now() - timedelta(days=2)).isoformat(),
        "notes": "Technical deep-dive scheduled. Strong product-market fit signals.",
    },
    {
        "id": str(uuid.uuid4()),
        "company": "Nexus Robotics",
        "sector": "Robotics",
        "stage": "initial_review",
        "round_size": 8000000,
        "fit_score": 88,
        "assignee": "Taylor Morgan",
        "last_contact": (datetime.now() - timedelta(days=5)).isoformat(),
        "notes": "Toyota partnership validates enterprise demand. Requesting financials.",
    },
    {
        "id": str(uuid.uuid4()),
        "company": "DeepVault",
        "sector": "Security",
        "stage": "partner_meeting",
        "round_size": 40000000,
        "fit_score": 76,
        "assignee": "Jordan Lee",
        "last_contact": (datetime.now() - timedelta(days=1)).isoformat(),
        "notes": "Partner presentation next Tuesday. Competitive landscape concerns remain.",
    },
    {
        "id": str(uuid.uuid4()),
        "company": "Quantum Edge",
        "sector": "Quantum",
        "stage": "sourcing",
        "round_size": 3000000,
        "fit_score": 82,
        "assignee": "Sam Rivera",
        "last_contact": (datetime.now() - timedelta(days=10)).isoformat(),
        "notes": "Introduced via Accel network. Early but thesis-aligned.",
    },
    {
        "id": str(uuid.uuid4()),
        "company": "Meridian Health",
        "sector": "Health Tech",
        "stage": "term_sheet",
        "round_size": 32000000,
        "fit_score": 79,
        "assignee": "Taylor Morgan",
        "last_contact": (datetime.now() - timedelta(hours=18)).isoformat(),
        "notes": "Term sheet issued. Negotiating pro-rata rights and board composition.",
    },
    {
        "id": str(uuid.uuid4()),
        "company": "Apex Climate",
        "sector": "Climate Tech",
        "stage": "diligence",
        "round_size": 14000000,
        "fit_score": 85,
        "assignee": "Sam Rivera",
        "last_contact": (datetime.now() - timedelta(days=3)).isoformat(),
        "notes": "Customer reference calls completed. Legal review in progress.",
    },
    {
        "id": str(uuid.uuid4()),
        "company": "FinFlow",
        "sector": "FinTech",
        "stage": "initial_review",
        "round_size": 6000000,
        "fit_score": 71,
        "assignee": "Jordan Lee",
        "last_contact": (datetime.now() - timedelta(days=7)).isoformat(),
        "notes": "Metrics deck reviewed. Need clarity on enterprise vs SMB mix.",
    },
    {
        "id": str(uuid.uuid4()),
        "company": "DataStack",
        "sector": "Data Infrastructure",
        "stage": "diligence",
        "round_size": 22000000,
        "fit_score": 91,
        "assignee": "Taylor Morgan",
        "last_contact": (datetime.now() - timedelta(days=4)).isoformat(),
        "notes": "Strong NRR of 138%. Architecture review with CTO this week.",
    },
]

STAGE_ORDER = ["sourcing", "initial_review", "diligence", "partner_meeting", "term_sheet", "closed"]


@router.get("/stages")
async def get_stages() -> dict[str, Any]:
    """Return a summary of each pipeline stage with deal count and total round size."""
    summary = []
    for stage in STAGE_ORDER:
        deals = [d for d in MOCK_DEALS if d["stage"] == stage]
        total_value = sum(d["round_size"] for d in deals)
        summary.append(
            {
                "stage": stage,
                "deal_count": len(deals),
                "total_value": total_value,
            }
        )
    return {"stages": summary}


@router.get("/stats")
async def get_pipeline_stats() -> dict[str, Any]:
    """Return aggregate pipeline statistics."""
    total_value = sum(d["round_size"] for d in MOCK_DEALS)
    avg_fit = sum(d["fit_score"] for d in MOCK_DEALS) / len(MOCK_DEALS)
    by_stage = {stage: 0 for stage in STAGE_ORDER}
    for d in MOCK_DEALS:
        by_stage[d["stage"]] = by_stage.get(d["stage"], 0) + 1
    return {
        "total_pipeline_value": total_value,
        "avg_fit_score": round(avg_fit, 1),
        "total_deals": len(MOCK_DEALS),
        "deals_by_stage": by_stage,
    }


@router.get("/")
async def list_pipeline(
    stage: str | None = Query(None),
    assignee: str | None = Query(None),
    limit: int = Query(default=50, le=200),
) -> dict[str, Any]:
    filtered = MOCK_DEALS
    if stage:
        filtered = [d for d in filtered if d["stage"] == stage]
    if assignee:
        filtered = [d for d in filtered if d["assignee"].lower() == assignee.lower()]

    # Group by stage
    grouped: dict[str, list[dict[str, Any]]] = {s: [] for s in STAGE_ORDER}
    for deal in filtered[:limit]:
        grouped[deal["stage"]].append(deal)

    return {
        "deals": filtered[:limit],
        "grouped_by_stage": grouped,
        "total": len(filtered),
    }
