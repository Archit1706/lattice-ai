"""Celery background tasks."""
from __future__ import annotations

import asyncio
from typing import Any

from src.core.logging import get_logger
from src.workers.celery_app import celery_app

logger = get_logger(__name__)


def run_async(coro):
    """Run async function in sync Celery task."""
    return asyncio.get_event_loop().run_until_complete(coro)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def extract_entities(self, text: str, source_type: str, source_id: str | None = None) -> dict[str, Any]:
    """Extract venture entities from text in background."""
    try:
        from src.agents.entity_extraction import EntityExtractionAgent
        agent = EntityExtractionAgent()
        result, elapsed = run_async(agent.extract(text=text, source_type=source_type))
        return {
            "entities": len(result.entities),
            "relationships": len(result.relationships),
            "elapsed_ms": elapsed,
        }
    except Exception as exc:
        logger.error("entity_extraction_task_failed", error=str(exc))
        raise self.retry(exc=exc)


@celery_app.task
def monitor_signals() -> dict[str, Any]:
    """Periodic task to monitor and classify new signals."""
    logger.info("signal_monitoring_started")
    return {"status": "completed", "signals_processed": 0}


@celery_app.task(bind=True, max_retries=2)
def enrich_company(self, company_id: str) -> dict[str, Any]:
    """Enrich a company record with external data."""
    try:
        logger.info("company_enrichment_started", company_id=company_id)
        return {"company_id": company_id, "status": "enriched"}
    except Exception as exc:
        raise self.retry(exc=exc)
