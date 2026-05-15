"""Portfolio routes — active investments and performance tracking."""
from __future__ import annotations

import uuid
from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter

from src.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/portfolio", tags=["portfolio"])

MOCK_PORTFOLIO = [
    {
        "id": str(uuid.uuid4()),
        "name": "Luminary AI",
        "sector": "AI/ML",
        "status": "active",
        "investment_date": (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d"),
        "invested_amount": 5000000,
        "ownership_pct": 12.4,
        "current_valuation": 90000000,
        "current_value": 11160000,
        "moic": 2.23,
        "irr": 87.4,
        "stage_at_entry": "Seed",
        "current_stage": "Series A",
        "location": "San Francisco, CA",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "DataStack",
        "sector": "Data Infrastructure",
        "status": "active",
        "investment_date": (datetime.now() - timedelta(days=540)).strftime("%Y-%m-%d"),
        "invested_amount": 3000000,
        "ownership_pct": 9.8,
        "current_valuation": 110000000,
        "current_value": 10780000,
        "moic": 3.59,
        "irr": 132.6,
        "stage_at_entry": "Pre-Seed",
        "current_stage": "Series A",
        "location": "Seattle, WA",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Apex Climate",
        "sector": "Climate Tech",
        "status": "active",
        "investment_date": (datetime.now() - timedelta(days=210)).strftime("%Y-%m-%d"),
        "invested_amount": 4000000,
        "ownership_pct": 10.2,
        "current_valuation": 68000000,
        "current_value": 6936000,
        "moic": 1.73,
        "irr": 68.2,
        "stage_at_entry": "Seed",
        "current_stage": "Series A",
        "location": "New York, NY",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "VeritasNet",
        "sector": "AI/ML",
        "status": "exited",
        "investment_date": (datetime.now() - timedelta(days=1460)).strftime("%Y-%m-%d"),
        "invested_amount": 2000000,
        "ownership_pct": 8.5,
        "current_valuation": 180000000,
        "current_value": 15300000,
        "moic": 7.65,
        "irr": 61.3,
        "stage_at_entry": "Seed",
        "current_stage": "Acquired",
        "location": "Austin, TX",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "GridLayer",
        "sector": "Climate Tech",
        "status": "written_off",
        "investment_date": (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d"),
        "invested_amount": 1500000,
        "ownership_pct": 11.0,
        "current_valuation": 0,
        "current_value": 0,
        "moic": 0.0,
        "irr": -100.0,
        "stage_at_entry": "Seed",
        "current_stage": "Defunct",
        "location": "Denver, CO",
    },
]


def _build_performance_series() -> list[dict[str, Any]]:
    """Generate 12 months of monthly portfolio value data points."""
    base_value = 18_000_000
    growth_rates = [1.02, 1.03, 1.015, 1.04, 1.025, 1.05, 1.03, 1.02, 1.035, 1.04, 1.02, 1.03]
    series = []
    value = base_value
    for i in range(12):
        month_date = datetime.now() - timedelta(days=(11 - i) * 30)
        value = round(value * growth_rates[i], 0)
        series.append(
            {
                "month": month_date.strftime("%Y-%m"),
                "portfolio_value": int(value),
                "invested_amount": 15500000,
            }
        )
    return series


@router.get("/companies")
async def list_portfolio_companies() -> dict[str, Any]:
    return {
        "companies": MOCK_PORTFOLIO,
        "total": len(MOCK_PORTFOLIO),
        "active": sum(1 for c in MOCK_PORTFOLIO if c["status"] == "active"),
        "exited": sum(1 for c in MOCK_PORTFOLIO if c["status"] == "exited"),
        "written_off": sum(1 for c in MOCK_PORTFOLIO if c["status"] == "written_off"),
    }


@router.get("/stats")
async def get_portfolio_stats() -> dict[str, Any]:
    total_invested = sum(c["invested_amount"] for c in MOCK_PORTFOLIO)
    total_value = sum(c["current_value"] for c in MOCK_PORTFOLIO)
    active = [c for c in MOCK_PORTFOLIO if c["status"] == "active"]
    avg_moic = total_value / total_invested if total_invested else 0
    return {
        "total_invested": total_invested,
        "total_value": total_value,
        "portfolio_moic": round(avg_moic, 2),
        "irr": 74.3,
        "active_count": len(active),
        "exited_count": sum(1 for c in MOCK_PORTFOLIO if c["status"] == "exited"),
        "written_off_count": sum(1 for c in MOCK_PORTFOLIO if c["status"] == "written_off"),
        "unrealised_gain": total_value - total_invested,
    }


@router.get("/performance")
async def get_portfolio_performance() -> dict[str, Any]:
    """Return monthly time-series data for portfolio value chart."""
    series = _build_performance_series()
    return {
        "series": series,
        "period": "12m",
        "start_value": series[0]["portfolio_value"],
        "end_value": series[-1]["portfolio_value"],
        "total_return_pct": round(
            (series[-1]["portfolio_value"] - series[0]["portfolio_value"])
            / series[0]["portfolio_value"]
            * 100,
            1,
        ),
    }
