"""Founders CRUD routes."""
from __future__ import annotations

import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Query

from src.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/founders", tags=["founders"])

MOCK_FOUNDERS = [
    {"id": str(uuid.uuid4()), "name": "Sarah Chen", "company": "Luminary AI", "sector": "AI/ML", "stage": "Series A", "fit_score": 94, "status": "active"},
    {"id": str(uuid.uuid4()), "name": "Marcus Williams", "company": "Nexus Robotics", "sector": "Robotics", "stage": "Seed", "fit_score": 88, "status": "active"},
    {"id": str(uuid.uuid4()), "name": "Priya Sharma", "company": "DeepVault", "sector": "Security", "stage": "Series B", "fit_score": 76, "status": "active"},
    {"id": str(uuid.uuid4()), "name": "Alex Rivera", "company": "Quantum Edge", "sector": "Quantum", "stage": "Pre-Seed", "fit_score": 82, "status": "watching"},
]


@router.get("/")
async def list_founders(
    search: str | None = Query(None),
    sector: str | None = Query(None),
    limit: int = Query(default=20, le=100),
    page: int = Query(default=1, ge=1),
) -> dict[str, Any]:
    filtered = MOCK_FOUNDERS
    if search:
        filtered = [f for f in filtered if search.lower() in f["name"].lower() or search.lower() in f["company"].lower()]
    if sector:
        filtered = [f for f in filtered if f["sector"].lower() == sector.lower()]
    return {
        "founders": filtered[:limit],
        "total": len(filtered),
        "page": page,
        "pages": (len(filtered) + limit - 1) // limit,
    }


@router.get("/{founder_id}")
async def get_founder(founder_id: str) -> dict[str, Any]:
    founder = next((f for f in MOCK_FOUNDERS if f["id"] == founder_id), None)
    if not founder:
        raise HTTPException(status_code=404, detail="Founder not found")
    return founder
