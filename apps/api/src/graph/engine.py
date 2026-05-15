"""Neo4j Graph Engine — venture relationship graph operations."""
from __future__ import annotations

from contextlib import asynccontextmanager
from typing import Any

from neo4j import AsyncGraphDatabase, AsyncSession

from src.core.config import get_settings
from src.core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()


class GraphEngine:
    """Core graph engine for venture relationship operations."""

    def __init__(self) -> None:
        self._driver = AsyncGraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_username, settings.neo4j_password),
        )

    async def close(self) -> None:
        await self._driver.close()

    @asynccontextmanager
    async def session(self):
        async with self._driver.session() as session:
            yield session

    async def verify_connection(self) -> bool:
        try:
            await self._driver.verify_connectivity()
            return True
        except Exception as exc:
            logger.error("neo4j_connection_failed", error=str(exc))
            return False

    # --- Schema initialization ---

    async def initialize_schema(self) -> None:
        """Create indexes and constraints."""
        async with self.session() as s:
            constraints = [
                "CREATE CONSTRAINT founder_id IF NOT EXISTS FOR (n:Founder) REQUIRE n.id IS UNIQUE",
                "CREATE CONSTRAINT company_id IF NOT EXISTS FOR (n:Company) REQUIRE n.id IS UNIQUE",
                "CREATE CONSTRAINT investor_id IF NOT EXISTS FOR (n:Investor) REQUIRE n.id IS UNIQUE",
                "CREATE CONSTRAINT lp_id IF NOT EXISTS FOR (n:LP) REQUIRE n.id IS UNIQUE",
            ]
            for c in constraints:
                try:
                    await s.run(c)
                except Exception:
                    pass

    # --- Node operations ---

    async def upsert_node(
        self,
        node_type: str,
        node_id: str,
        properties: dict[str, Any],
    ) -> dict[str, Any]:
        """Create or update a node."""
        async with self.session() as s:
            result = await s.run(
                f"""
                MERGE (n:{node_type} {{id: $id}})
                SET n += $props
                SET n.updated_at = datetime()
                RETURN n
                """,
                id=node_id,
                props=properties,
            )
            record = await result.single()
            return dict(record["n"]) if record else {}

    async def upsert_relationship(
        self,
        source_type: str,
        source_id: str,
        target_type: str,
        target_id: str,
        rel_type: str,
        properties: dict[str, Any] | None = None,
    ) -> None:
        """Create or update a relationship between nodes."""
        async with self.session() as s:
            await s.run(
                f"""
                MATCH (a:{source_type} {{id: $source_id}})
                MATCH (b:{target_type} {{id: $target_id}})
                MERGE (a)-[r:{rel_type}]->(b)
                SET r += $props
                SET r.updated_at = datetime()
                """,
                source_id=source_id,
                target_id=target_id,
                props=properties or {},
            )

    # --- Query operations ---

    async def get_entity_graph(
        self,
        entity_id: str,
        depth: int = 2,
    ) -> dict[str, Any]:
        """Get the subgraph around an entity."""
        async with self.session() as s:
            result = await s.run(
                """
                MATCH path = (start {id: $id})-[*1..$depth]-(connected)
                WITH nodes(path) AS ns, relationships(path) AS rels
                UNWIND ns AS n
                WITH DISTINCT n, rels
                RETURN
                    collect(DISTINCT {id: n.id, label: coalesce(n.name, n.id), type: labels(n)[0], properties: properties(n)}) AS nodes,
                    collect(DISTINCT {source: startNode(rels[0]).id, target: endNode(rels[0]).id, type: type(rels[0])}) AS edges
                """,
                id=entity_id,
                depth=depth,
            )
            record = await result.single()
            if not record:
                return {"nodes": [], "edges": []}
            return {"nodes": record["nodes"], "edges": record["edges"]}

    async def find_shortest_path(
        self,
        source_id: str,
        target_id: str,
    ) -> list[dict[str, Any]]:
        """Find shortest relationship path between two entities."""
        async with self.session() as s:
            result = await s.run(
                """
                MATCH (a {id: $source_id}), (b {id: $target_id})
                MATCH path = shortestPath((a)-[*]-(b))
                RETURN [n IN nodes(path) | {id: n.id, name: coalesce(n.name, n.id), type: labels(n)[0]}] AS path
                """,
                source_id=source_id,
                target_id=target_id,
            )
            record = await result.single()
            return record["path"] if record else []

    async def get_relationship_strength(
        self,
        entity_a_id: str,
        entity_b_id: str,
    ) -> float:
        """Calculate relationship strength score between two entities."""
        async with self.session() as s:
            result = await s.run(
                """
                MATCH (a {id: $a_id}), (b {id: $b_id})
                MATCH path = (a)-[*1..3]-(b)
                WITH length(path) AS hops, count(path) AS paths
                RETURN 1.0 / (1.0 + min(hops)) * log(1 + max(paths)) AS strength
                """,
                a_id=entity_a_id,
                b_id=entity_b_id,
            )
            record = await result.single()
            return float(record["strength"]) if record and record["strength"] else 0.0

    async def get_full_graph(self, limit: int = 100) -> dict[str, Any]:
        """Get overview graph for visualization."""
        async with self.session() as s:
            result = await s.run(
                """
                MATCH (n)
                WITH n LIMIT $limit
                OPTIONAL MATCH (n)-[r]-(m)
                WHERE m IS NOT NULL
                WITH collect(DISTINCT {id: n.id, label: coalesce(n.name, n.id), type: labels(n)[0]}) AS nodes,
                     collect(DISTINCT {source: startNode(r).id, target: endNode(r).id, type: type(r)}) AS edges
                RETURN nodes, edges
                """,
                limit=limit,
            )
            record = await result.single()
            if not record:
                return {"nodes": [], "edges": []}
            return {"nodes": record["nodes"], "edges": record["edges"]}

    async def seed_demo_data(self) -> None:
        """Seed demo venture graph data."""
        founders = [
            {"id": "f-sarah-chen", "name": "Sarah Chen", "role": "CEO", "company": "Luminary AI"},
            {"id": "f-marcus-williams", "name": "Marcus Williams", "role": "CTO", "company": "Nexus Robotics"},
            {"id": "f-priya-sharma", "name": "Priya Sharma", "role": "CEO", "company": "DeepVault"},
            {"id": "f-alex-rivera", "name": "Alex Rivera", "role": "CTO", "company": "Quantum Edge"},
        ]
        companies = [
            {"id": "c-luminary-ai", "name": "Luminary AI", "sector": "AI/ML", "stage": "Series A"},
            {"id": "c-nexus-robotics", "name": "Nexus Robotics", "sector": "Robotics", "stage": "Seed"},
            {"id": "c-deepvault", "name": "DeepVault", "sector": "Security", "stage": "Series B"},
            {"id": "c-quantum-edge", "name": "Quantum Edge", "sector": "Quantum", "stage": "Pre-Seed"},
        ]
        investors = [
            {"id": "i-apex", "name": "Apex Ventures", "type": "Early Stage VC"},
            {"id": "i-sequoia", "name": "Sequoia Capital", "type": "Tier 1 VC"},
        ]

        for f in founders:
            await self.upsert_node("Founder", f["id"], f)
        for c in companies:
            await self.upsert_node("Company", c["id"], c)
        for i in investors:
            await self.upsert_node("Investor", i["id"], i)

        # Relationships
        rels = [
            ("Founder", "f-sarah-chen", "Company", "c-luminary-ai", "FOUNDED"),
            ("Founder", "f-marcus-williams", "Company", "c-nexus-robotics", "CO_FOUNDED"),
            ("Founder", "f-priya-sharma", "Company", "c-deepvault", "FOUNDED"),
            ("Investor", "i-apex", "Company", "c-luminary-ai", "INVESTED_IN"),
            ("Investor", "i-apex", "Company", "c-nexus-robotics", "INVESTED_IN"),
            ("Investor", "i-sequoia", "Company", "c-luminary-ai", "LED_ROUND"),
            ("Investor", "i-sequoia", "Company", "c-deepvault", "INVESTED_IN"),
        ]
        for rel in rels:
            try:
                await self.upsert_relationship(*rel)
            except Exception:
                pass

        logger.info("demo_graph_seeded", founders=len(founders), companies=len(companies))
