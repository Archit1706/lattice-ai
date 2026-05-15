"""Memory Retrieval Agent — institutional semantic memory search and retrieval."""
from __future__ import annotations

import time
from typing import Any

from src.core.config import get_settings
from src.core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()


class MemoryRetrievalAgent:
    """Semantic memory retrieval over all institutional documents."""

    def __init__(self, weaviate_client: Any | None = None) -> None:
        self._weaviate = weaviate_client

    async def search(
        self,
        query: str,
        limit: int = 10,
        filters: dict[str, Any] | None = None,
    ) -> tuple[list[dict[str, Any]], float]:
        """Semantic search over institutional memory.

        Returns (results, processing_time_ms).
        Falls back to mock data if Weaviate is not configured.
        """
        start = time.perf_counter()

        if self._weaviate is None:
            results = self._mock_search(query, limit)
        else:
            results = await self._weaviate_search(query, limit, filters or {})

        elapsed = (time.perf_counter() - start) * 1000
        logger.info("memory_search_complete", query=query[:50], results=len(results), elapsed_ms=elapsed)
        return results, elapsed

    async def _weaviate_search(
        self, query: str, limit: int, filters: dict[str, Any]
    ) -> list[dict[str, Any]]:
        """Search Weaviate vector store."""
        try:
            collection = self._weaviate.collections.get("InstitutionalMemory")
            response = await collection.query.near_text(
                query=query,
                limit=limit,
                return_metadata=["score", "explain_score"],
            )
            return [
                {
                    "id": str(obj.uuid),
                    "doc_type": obj.properties.get("doc_type", "document"),
                    "title": obj.properties.get("title", ""),
                    "excerpt": obj.properties.get("content", "")[:300],
                    "entities": obj.properties.get("entities", []),
                    "relevance_score": obj.metadata.score if obj.metadata else 0.8,
                    "date": obj.properties.get("date"),
                    "source": obj.properties.get("source", "unknown"),
                }
                for obj in response.objects
            ]
        except Exception as exc:
            logger.error("weaviate_search_failed", error=str(exc))
            return self._mock_search(query, limit)

    def _mock_search(self, query: str, limit: int) -> list[dict[str, Any]]:
        """Mock search results for demo/development."""
        from datetime import datetime, timedelta
        mock_docs = [
            {
                "id": "mock-1",
                "doc_type": "meeting",
                "title": "Series A Discussion — Luminary AI (Oct 2024)",
                "excerpt": "Sarah shared that inference cost is the primary blocker for LLM adoption at scale. 40% cost reduction through kernel-level optimizations.",
                "entities": ["Sarah Chen", "Luminary AI", "Anthropic"],
                "relevance_score": 0.97,
                "date": datetime.now() - timedelta(days=45),
                "source": "Meeting transcript",
            },
            {
                "id": "mock-2",
                "doc_type": "memo",
                "title": "AI Infrastructure Thesis — Q4 2024",
                "excerpt": "The inference optimization market is projected to reach $12B by 2027.",
                "entities": ["AI Infrastructure", "Luminary AI"],
                "relevance_score": 0.92,
                "date": datetime.now() - timedelta(days=30),
                "source": "Research memo",
            },
            {
                "id": "mock-3",
                "doc_type": "email",
                "title": "Follow-up: Nexus Robotics technical diligence",
                "excerpt": "Marcus confirmed autonomous warehouse navigation deployed in 3 Toyota facilities. Monthly recurring revenue $180K.",
                "entities": ["Marcus Williams", "Nexus Robotics", "Toyota"],
                "relevance_score": 0.88,
                "date": datetime.now() - timedelta(days=10),
                "source": "Email thread",
            },
        ]
        return mock_docs[:limit]

    async def index_document(
        self,
        doc_id: str,
        doc_type: str,
        title: str,
        content: str,
        entities: list[str],
        metadata: dict[str, Any] | None = None,
    ) -> bool:
        """Index a document into the vector memory store."""
        if self._weaviate is None:
            logger.warning("weaviate_not_configured", doc_id=doc_id)
            return False

        try:
            collection = self._weaviate.collections.get("InstitutionalMemory")
            await collection.data.insert(
                properties={
                    "doc_id": doc_id,
                    "doc_type": doc_type,
                    "title": title,
                    "content": content[:10000],
                    "entities": entities,
                    **(metadata or {}),
                }
            )
            return True
        except Exception as exc:
            logger.error("document_indexing_failed", doc_id=doc_id, error=str(exc))
            return False
