"""Graph routes — venture relationship graph API."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from src.core.logging import get_logger
from src.graph.engine import GraphEngine
from src.schemas.entities import GraphResponse

logger = get_logger(__name__)
router = APIRouter(prefix="/graph", tags=["graph"])


def get_graph_engine() -> GraphEngine:
    return GraphEngine()


@router.get("/", response_model=GraphResponse)
async def get_full_graph(limit: int = Query(default=100, le=500)) -> GraphResponse:
    """Get the full venture relationship graph."""
    engine = get_graph_engine()
    try:
        data = await engine.get_full_graph(limit=limit)
    except Exception as exc:
        logger.warning("neo4j_unavailable", error=str(exc))
        # Return seed data if Neo4j unavailable
        from src.graph.seed import GRAPH_SEED_DATA
        data = GRAPH_SEED_DATA

    return GraphResponse(
        nodes=data.get("nodes", []),
        edges=data.get("edges", []),
        node_count=len(data.get("nodes", [])),
        edge_count=len(data.get("edges", [])),
    )


@router.get("/entity/{entity_id}", response_model=GraphResponse)
async def get_entity_subgraph(entity_id: str, depth: int = Query(default=2, ge=1, le=4)) -> GraphResponse:
    """Get subgraph around a specific entity."""
    engine = get_graph_engine()
    try:
        data = await engine.get_entity_graph(entity_id=entity_id, depth=depth)
    except Exception as exc:
        logger.error("entity_graph_failed", entity_id=entity_id, error=str(exc))
        raise HTTPException(status_code=404, detail="Entity not found or graph unavailable")

    return GraphResponse(
        nodes=data.get("nodes", []),
        edges=data.get("edges", []),
        node_count=len(data.get("nodes", [])),
        edge_count=len(data.get("edges", [])),
    )


@router.get("/path/{source_id}/{target_id}")
async def find_relationship_path(source_id: str, target_id: str) -> dict:
    """Find shortest relationship path between two entities."""
    engine = get_graph_engine()
    try:
        path = await engine.find_shortest_path(source_id=source_id, target_id=target_id)
    except Exception as exc:
        logger.error("path_finding_failed", error=str(exc))
        raise HTTPException(status_code=500, detail="Path finding failed")

    return {"path": path, "hops": len(path) - 1 if path else 0}


@router.post("/seed")
async def seed_demo_graph() -> dict:
    """Seed the graph with demo venture data."""
    engine = get_graph_engine()
    try:
        await engine.seed_demo_data()
        return {"status": "seeded", "message": "Demo graph data loaded"}
    except Exception as exc:
        logger.error("seeding_failed", error=str(exc))
        raise HTTPException(status_code=500, detail=f"Seeding failed: {exc}")
