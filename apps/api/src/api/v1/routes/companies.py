"""Companies CRUD routes."""
from __future__ import annotations

import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Query

from src.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/companies", tags=["companies"])

MOCK_COMPANIES = [
    {
        "id": str(uuid.uuid4()),
        "name": "Luminary AI",
        "website": "https://luminaryai.com",
        "description": "Enterprise AI platform for automated decision intelligence and predictive analytics.",
        "sector": "AI/ML",
        "stage": "Series A",
        "round_size": 18000000,
        "valuation": 90000000,
        "total_raised": 23000000,
        "employee_count": 62,
        "founding_year": 2021,
        "location": "San Francisco, CA",
        "ai_fit_score": 94,
        "pipeline_stage": "diligence",
        "founders": ["Sarah Chen", "James Okafor"],
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Nexus Robotics",
        "website": "https://nexusrobotics.io",
        "description": "Autonomous mobile robots for warehouse and manufacturing automation.",
        "sector": "Robotics",
        "stage": "Seed",
        "round_size": 8000000,
        "valuation": 35000000,
        "total_raised": 8000000,
        "employee_count": 28,
        "founding_year": 2022,
        "location": "Boston, MA",
        "ai_fit_score": 88,
        "pipeline_stage": "initial_review",
        "founders": ["Marcus Williams"],
    },
    {
        "id": str(uuid.uuid4()),
        "name": "DeepVault",
        "website": "https://deepvault.security",
        "description": "AI-native cybersecurity platform for threat detection and zero-trust enforcement.",
        "sector": "Security",
        "stage": "Series B",
        "round_size": 40000000,
        "valuation": 220000000,
        "total_raised": 58000000,
        "employee_count": 134,
        "founding_year": 2019,
        "location": "Austin, TX",
        "ai_fit_score": 76,
        "pipeline_stage": "partner_meeting",
        "founders": ["Priya Sharma", "Leon Metzger"],
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Quantum Edge",
        "website": "https://quantumedge.io",
        "description": "Quantum-classical hybrid compute for financial modelling and drug discovery.",
        "sector": "Quantum",
        "stage": "Pre-Seed",
        "round_size": 3000000,
        "valuation": 12000000,
        "total_raised": 3000000,
        "employee_count": 11,
        "founding_year": 2023,
        "location": "Cambridge, MA",
        "ai_fit_score": 82,
        "pipeline_stage": "sourcing",
        "founders": ["Alex Rivera", "Dana Kwon"],
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Meridian Health",
        "website": "https://meridianhealth.ai",
        "description": "AI-powered clinical decision support and remote patient monitoring platform.",
        "sector": "Health Tech",
        "stage": "Series B",
        "round_size": 32000000,
        "valuation": 160000000,
        "total_raised": 47000000,
        "employee_count": 98,
        "founding_year": 2020,
        "location": "Chicago, IL",
        "ai_fit_score": 79,
        "pipeline_stage": "term_sheet",
        "founders": ["Dr. Aisha Patel"],
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Apex Climate",
        "website": "https://apexclimate.tech",
        "description": "Climate risk modelling and carbon accounting software for enterprises.",
        "sector": "Climate Tech",
        "stage": "Series A",
        "round_size": 14000000,
        "valuation": 68000000,
        "total_raised": 17000000,
        "employee_count": 45,
        "founding_year": 2021,
        "location": "New York, NY",
        "ai_fit_score": 85,
        "pipeline_stage": "diligence",
        "founders": ["Nina Torres", "Ben Adeyemi"],
    },
    {
        "id": str(uuid.uuid4()),
        "name": "FinFlow",
        "website": "https://finflow.finance",
        "description": "Real-time cash-flow forecasting and treasury automation for mid-market CFOs.",
        "sector": "FinTech",
        "stage": "Seed",
        "round_size": 6000000,
        "valuation": 28000000,
        "total_raised": 6000000,
        "employee_count": 22,
        "founding_year": 2022,
        "location": "New York, NY",
        "ai_fit_score": 71,
        "pipeline_stage": "initial_review",
        "founders": ["Carlos Mendes"],
    },
    {
        "id": str(uuid.uuid4()),
        "name": "DataStack",
        "website": "https://datastack.dev",
        "description": "Modern data lakehouse infrastructure with built-in governance and lineage.",
        "sector": "Data Infrastructure",
        "stage": "Series A",
        "round_size": 22000000,
        "valuation": 110000000,
        "total_raised": 27000000,
        "employee_count": 78,
        "founding_year": 2020,
        "location": "Seattle, WA",
        "ai_fit_score": 91,
        "pipeline_stage": "diligence",
        "founders": ["Rachel Kim", "Tobias Grant"],
    },
]


@router.get("/sectors")
async def list_sectors() -> dict[str, Any]:
    """Return the list of unique sectors across all companies."""
    sectors = sorted({c["sector"] for c in MOCK_COMPANIES})
    return {"sectors": sectors, "total": len(sectors)}


@router.get("/")
async def list_companies(
    search: str | None = Query(None),
    sector: str | None = Query(None),
    stage: str | None = Query(None),
    limit: int = Query(default=20, le=100),
    page: int = Query(default=1, ge=1),
) -> dict[str, Any]:
    filtered = MOCK_COMPANIES
    if search:
        filtered = [
            c for c in filtered
            if search.lower() in c["name"].lower() or search.lower() in c["description"].lower()
        ]
    if sector:
        filtered = [c for c in filtered if c["sector"].lower() == sector.lower()]
    if stage:
        filtered = [c for c in filtered if c["stage"].lower() == stage.lower()]
    offset = (page - 1) * limit
    return {
        "companies": filtered[offset : offset + limit],
        "total": len(filtered),
        "page": page,
        "pages": (len(filtered) + limit - 1) // limit,
    }


@router.get("/{company_id}")
async def get_company(company_id: str) -> dict[str, Any]:
    company = next((c for c in MOCK_COMPANIES if c["id"] == company_id), None)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company
