"""Static seed data for graph visualization when Neo4j is unavailable."""

GRAPH_SEED_DATA = {
    "nodes": [
        {"id": "f-sarah-chen", "label": "Sarah Chen", "type": "Founder", "properties": {"subtitle": "Luminary AI · CEO", "sector": "AI/ML"}},
        {"id": "f-marcus-williams", "label": "Marcus Williams", "type": "Founder", "properties": {"subtitle": "Nexus Robotics · CTO", "sector": "Robotics"}},
        {"id": "f-priya-sharma", "label": "Priya Sharma", "type": "Founder", "properties": {"subtitle": "DeepVault · CEO", "sector": "Security"}},
        {"id": "f-alex-rivera", "label": "Alex Rivera", "type": "Founder", "properties": {"subtitle": "Quantum Edge · CTO", "sector": "Quantum"}},
        {"id": "c-luminary-ai", "label": "Luminary AI", "type": "Company", "properties": {"subtitle": "$18M Series A", "sector": "AI/ML"}},
        {"id": "c-nexus-robotics", "label": "Nexus Robotics", "type": "Company", "properties": {"subtitle": "$4M Seed", "sector": "Robotics"}},
        {"id": "c-deepvault", "label": "DeepVault", "type": "Company", "properties": {"subtitle": "$45M Series B", "sector": "Security"}},
        {"id": "c-quantum-edge", "label": "Quantum Edge", "type": "Company", "properties": {"subtitle": "$2M Pre-Seed", "sector": "Quantum"}},
        {"id": "i-apex", "label": "Apex Ventures", "type": "Investor", "properties": {"subtitle": "Early Stage VC"}},
        {"id": "i-sequoia", "label": "Sequoia Capital", "type": "Investor", "properties": {"subtitle": "Series A Lead"}},
        {"id": "lp-stanford", "label": "Stanford Endowment", "type": "LP", "properties": {"subtitle": "University LP"}},
    ],
    "edges": [
        {"source": "f-sarah-chen", "target": "c-luminary-ai", "relationship": "FOUNDED", "weight": 1.0},
        {"source": "f-marcus-williams", "target": "c-nexus-robotics", "relationship": "CO_FOUNDED", "weight": 1.0},
        {"source": "f-priya-sharma", "target": "c-deepvault", "relationship": "FOUNDED", "weight": 1.0},
        {"source": "f-alex-rivera", "target": "c-quantum-edge", "relationship": "FOUNDED", "weight": 1.0},
        {"source": "i-apex", "target": "c-luminary-ai", "relationship": "INVESTED_IN", "weight": 0.8},
        {"source": "i-apex", "target": "c-nexus-robotics", "relationship": "INVESTED_IN", "weight": 0.7},
        {"source": "i-sequoia", "target": "c-luminary-ai", "relationship": "LED_ROUND", "weight": 0.9},
        {"source": "i-sequoia", "target": "c-deepvault", "relationship": "INVESTED_IN", "weight": 0.8},
        {"source": "lp-stanford", "target": "i-apex", "relationship": "LP_IN", "weight": 0.6},
        {"source": "lp-stanford", "target": "i-sequoia", "relationship": "LP_IN", "weight": 0.7},
        {"source": "f-sarah-chen", "target": "f-priya-sharma", "relationship": "ADVISOR_TO", "weight": 0.5},
    ],
}
