"""Lattice — FastAPI application entry point."""
from __future__ import annotations

import time
from contextlib import asynccontextmanager
from typing import Any

import sentry_sdk
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.api.v1.router import api_router
from src.core.config import get_settings
from src.core.logging import configure_logging, get_logger

settings = get_settings()
configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup/shutdown lifecycle."""
    logger.info("lattice_starting", env=settings.app_env, port=settings.app_port)

    # Initialize Sentry
    if settings.sentry_dsn:
        try:
            sentry_sdk.init(dsn=settings.sentry_dsn, environment=settings.app_env, traces_sample_rate=0.1)
            logger.info("sentry_initialized")
        except Exception as exc:
            logger.warning("sentry_init_skipped", reason=str(exc))

    yield

    logger.info("lattice_shutdown")


app = FastAPI(
    title="Lattice API",
    description="AI-native venture intelligence platform API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    elapsed = (time.perf_counter() - start) * 1000
    response.headers["X-Process-Time-Ms"] = f"{elapsed:.2f}"
    return response


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error("unhandled_exception", path=str(request.url), error=str(exc))
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": type(exc).__name__},
    )


# Include routers
app.include_router(api_router)


# Health check
@app.get("/health", tags=["system"])
async def health() -> dict[str, Any]:
    return {
        "status": "healthy",
        "version": "0.1.0",
        "environment": settings.app_env,
        "services": {
            "api": "up",
            "ai_agents": "ready",
        },
    }


@app.get("/", tags=["system"])
async def root() -> dict[str, str]:
    return {
        "name": "Lattice API",
        "version": "0.1.0",
        "docs": "/docs",
    }
