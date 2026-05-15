"""Memo routes — investment memos, diligence notes, research."""
from __future__ import annotations

import uuid
from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from src.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/memos", tags=["memos"])

_COMPANY_IDS = {name: str(uuid.uuid4()) for name in [
    "Luminary AI", "Nexus Robotics", "DeepVault",
    "Meridian Health", "Apex Climate", "DataStack",
]}

MOCK_MEMOS = [
    {
        "id": str(uuid.uuid4()),
        "title": "Luminary AI — Investment Thesis",
        "company_id": _COMPANY_IDS["Luminary AI"],
        "company_name": "Luminary AI",
        "content": (
            "Luminary AI addresses the enterprise AI adoption gap by providing an opinionated "
            "decision-intelligence layer that sits above existing data infrastructure. "
            "The founding team has rare depth in both applied ML and enterprise GTM. "
            "We believe the $42B TAM in decision automation is underpenetrated and Luminary "
            "is positioned as the default choice for Fortune 1000 buyers."
        ),
        "memo_type": "investment_thesis",
        "conviction_score": 92,
        "author": "Jordan Lee",
        "tags": ["AI/ML", "enterprise", "Series A", "high-conviction"],
        "created_at": (datetime.now() - timedelta(days=14)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=2)).isoformat(),
        "structured_data": {
            "tam": 42000000000,
            "revenue_run_rate": 4200000,
            "growth_rate_yoy": 3.1,
            "key_risks": ["competition from hyperscalers", "long enterprise sales cycles"],
            "upside_scenario": "Platform becomes the Salesforce of AI operations",
        },
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Nexus Robotics — Seed Diligence Notes",
        "company_id": _COMPANY_IDS["Nexus Robotics"],
        "company_name": "Nexus Robotics",
        "content": (
            "Visited warehouse facility in Lowell, MA. AMR fleet of 12 units running live "
            "with 99.4% uptime. Toyota contract confirmation received from VP Ops. "
            "Unit economics show 18-month payback vs. human labour at $28/hr. "
            "Concerns: hardware BOM is high; software moat unclear at scale."
        ),
        "memo_type": "diligence_notes",
        "conviction_score": 78,
        "author": "Taylor Morgan",
        "tags": ["Robotics", "seed", "hardware", "diligence"],
        "created_at": (datetime.now() - timedelta(days=7)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=1)).isoformat(),
        "structured_data": {
            "units_deployed": 12,
            "uptime_pct": 99.4,
            "payback_months": 18,
            "key_risks": ["hardware margin compression", "incumbent robotics vendors"],
            "next_steps": ["reference call with Toyota VP Ops", "cap table review"],
        },
    },
    {
        "id": str(uuid.uuid4()),
        "title": "DeepVault — Security Sector Research",
        "company_id": _COMPANY_IDS["DeepVault"],
        "company_name": "DeepVault",
        "content": (
            "Enterprise cybersecurity spend is accelerating post-NIS2. DeepVault's "
            "AI-native architecture allows sub-100ms threat response — 40x faster than "
            "legacy SIEM tools. Head of Enterprise Sales from Palantir brings a proven "
            "federal and enterprise playbook. ARR is $8.2M with NRR of 124%."
        ),
        "memo_type": "research",
        "conviction_score": 74,
        "author": "Sam Rivera",
        "tags": ["Security", "Series B", "cybersecurity", "NIS2"],
        "created_at": (datetime.now() - timedelta(days=21)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=5)).isoformat(),
        "structured_data": {
            "arr": 8200000,
            "nrr": 124,
            "threat_response_ms": 100,
            "competitive_advantage": "AI-native zero-trust architecture",
            "key_risks": ["crowded market", "lengthy procurement cycles in enterprise"],
        },
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Meridian Health — Term Sheet Memo",
        "company_id": _COMPANY_IDS["Meridian Health"],
        "company_name": "Meridian Health",
        "content": (
            "Recommending participation in the $32M Series B led by Bessemer. "
            "FDA 510(k) clearance obtained last month de-risks regulatory path. "
            "Clinical outcomes data from three hospital systems shows 23% reduction "
            "in readmission rates. Pro-rata reserved for Series C."
        ),
        "memo_type": "investment_thesis",
        "conviction_score": 81,
        "author": "Taylor Morgan",
        "tags": ["Health Tech", "Series B", "FDA", "clinical outcomes"],
        "created_at": (datetime.now() - timedelta(days=3)).isoformat(),
        "updated_at": (datetime.now() - timedelta(hours=12)).isoformat(),
        "structured_data": {
            "round_size": 32000000,
            "lead_investor": "Bessemer Venture Partners",
            "readmission_reduction_pct": 23,
            "hospital_systems": 3,
            "key_risks": ["reimbursement uncertainty", "hospital IT integration complexity"],
        },
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Apex Climate — Climate Tech Landscape Overview",
        "company_id": _COMPANY_IDS["Apex Climate"],
        "company_name": "Apex Climate",
        "content": (
            "Regulatory tailwinds from SEC climate disclosure rules and EU CSRD are "
            "creating urgent enterprise demand for carbon accounting software. Apex Climate "
            "has signed 3 Fortune 500 customers in the last 90 days. "
            "Proprietary emissions factor database with 1.2M data points is a durable moat."
        ),
        "memo_type": "research",
        "conviction_score": 87,
        "author": "Sam Rivera",
        "tags": ["Climate Tech", "Series A", "ESG", "regulatory tailwind"],
        "created_at": (datetime.now() - timedelta(days=10)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=3)).isoformat(),
        "structured_data": {
            "fortune500_customers": 3,
            "emissions_factor_records": 1200000,
            "arr": 3100000,
            "key_risks": ["voluntary vs mandatory reporting uncertainty", "point solutions from Big 4"],
            "regulatory_catalysts": ["SEC climate disclosure", "EU CSRD"],
        },
    },
    {
        "id": str(uuid.uuid4()),
        "title": "DataStack — Series A Diligence Notes",
        "company_id": _COMPANY_IDS["DataStack"],
        "company_name": "DataStack",
        "content": (
            "DataStack's open-lakehouse approach resolves the vendor lock-in problem "
            "that plagues Snowflake and Databricks customers. NRR of 138% with $2.1M ARR "
            "growing at 290% YoY. CTO architecture review confirmed the query engine "
            "outperforms Trino by 3.2x on TPC-H benchmarks at scale."
        ),
        "memo_type": "diligence_notes",
        "conviction_score": 93,
        "author": "Jordan Lee",
        "tags": ["Data Infrastructure", "Series A", "open-source", "high-conviction"],
        "created_at": (datetime.now() - timedelta(days=5)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=1)).isoformat(),
        "structured_data": {
            "arr": 2100000,
            "nrr": 138,
            "growth_rate_yoy": 2.9,
            "benchmark_speedup": 3.2,
            "key_risks": ["open-source commoditisation risk", "cloud provider competition"],
            "next_steps": ["reference calls with 2 enterprise customers", "legal IP review"],
        },
    },
]


class MemoCreate(BaseModel):
    title: str
    company_id: str | None = None
    content: str | None = None
    memo_type: str | None = None
    tags: list[str] = []


@router.get("/")
async def list_memos(
    search: str | None = Query(None),
    company_id: str | None = Query(None),
    memo_type: str | None = Query(None),
    limit: int = Query(default=20, le=100),
) -> dict[str, Any]:
    filtered = MOCK_MEMOS
    if search:
        filtered = [
            m for m in filtered
            if search.lower() in m["title"].lower() or search.lower() in m["content"].lower()
        ]
    if company_id:
        filtered = [m for m in filtered if m["company_id"] == company_id]
    if memo_type:
        filtered = [m for m in filtered if m["memo_type"] == memo_type]
    return {
        "memos": filtered[:limit],
        "total": len(filtered),
    }


@router.get("/{memo_id}")
async def get_memo(memo_id: str) -> dict[str, Any]:
    memo = next((m for m in MOCK_MEMOS if m["id"] == memo_id), None)
    if not memo:
        raise HTTPException(status_code=404, detail="Memo not found")
    return memo


@router.post("/")
async def create_memo(body: MemoCreate) -> dict[str, Any]:
    now = datetime.now().isoformat()
    new_memo = {
        "id": str(uuid.uuid4()),
        "title": body.title,
        "company_id": body.company_id,
        "company_name": None,
        "content": body.content,
        "memo_type": body.memo_type,
        "conviction_score": None,
        "author": "Current User",
        "tags": body.tags,
        "created_at": now,
        "updated_at": now,
        "structured_data": {},
    }
    return new_memo
