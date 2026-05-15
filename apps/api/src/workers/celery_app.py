"""Celery worker configuration for background tasks."""
from celery import Celery

from src.core.config import get_settings

settings = get_settings()

celery_app = Celery(
    "sago_nexus",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=["src.workers.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_routes={
        "src.workers.tasks.extract_entities": {"queue": "intelligence"},
        "src.workers.tasks.monitor_signals": {"queue": "signals"},
        "src.workers.tasks.enrich_company": {"queue": "enrichment"},
    },
    beat_schedule={
        "monitor-signals-every-hour": {
            "task": "src.workers.tasks.monitor_signals",
            "schedule": 3600.0,
        },
    },
)
