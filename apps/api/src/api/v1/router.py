"""API v1 router — aggregates all sub-routers."""
from fastapi import APIRouter

from src.api.v1.routes.companies import router as companies_router
from src.api.v1.routes.founders import router as founders_router
from src.api.v1.routes.graph import router as graph_router
from src.api.v1.routes.intelligence import router as intelligence_router
from src.api.v1.routes.memos import router as memos_router
from src.api.v1.routes.pipeline import router as pipeline_router
from src.api.v1.routes.portfolio import router as portfolio_router
from src.api.v1.routes.signals import router as signals_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(intelligence_router)
api_router.include_router(graph_router)
api_router.include_router(signals_router)
api_router.include_router(founders_router)
api_router.include_router(companies_router)
api_router.include_router(pipeline_router)
api_router.include_router(memos_router)
api_router.include_router(portfolio_router)
