import type { Node, Edge } from "@xyflow/react";

export const SEED_NODES: Node[] = [
  // Founders
  { id: "f1", type: "venture", position: { x: 100, y: 200 }, data: { label: "Sarah Chen", subtitle: "Luminary AI · CEO", type: "founder", sector: "AI/ML", stage: "Series A" } },
  { id: "f2", type: "venture", position: { x: 100, y: 350 }, data: { label: "Marcus Williams", subtitle: "Nexus Robotics · CTO", type: "founder", sector: "Robotics", stage: "Seed" } },
  { id: "f3", type: "venture", position: { x: 100, y: 500 }, data: { label: "Priya Sharma", subtitle: "DeepVault · CEO", type: "founder", sector: "Security", stage: "Series B" } },
  { id: "f4", type: "venture", position: { x: 100, y: 650 }, data: { label: "Alex Rivera", subtitle: "Quantum Edge · CTO", type: "founder", sector: "Quantum", stage: "Pre-Seed" } },
  { id: "f5", type: "venture", position: { x: 100, y: 800 }, data: { label: "Emma Johansson", subtitle: "Meridian Health · CEO", type: "founder", sector: "HealthTech", stage: "Series B" } },

  // Companies
  { id: "c1", type: "venture", position: { x: 400, y: 150 }, data: { label: "Luminary AI", subtitle: "$18M Series A", type: "company", sector: "AI/ML", valuation: 120000000 } },
  { id: "c2", type: "venture", position: { x: 400, y: 300 }, data: { label: "Nexus Robotics", subtitle: "$4M Seed", type: "company", sector: "Robotics", valuation: 24000000 } },
  { id: "c3", type: "venture", position: { x: 400, y: 450 }, data: { label: "DeepVault", subtitle: "$45M Series B", type: "company", sector: "Security", valuation: 280000000 } },
  { id: "c4", type: "venture", position: { x: 400, y: 600 }, data: { label: "Quantum Edge", subtitle: "$2M Pre-Seed", type: "company", sector: "Quantum", valuation: 15000000 } },
  { id: "c5", type: "venture", position: { x: 400, y: 750 }, data: { label: "Meridian Health", subtitle: "$32M Series B", type: "company", sector: "HealthTech", valuation: 200000000 } },

  // Investors
  { id: "i1", type: "venture", position: { x: 700, y: 200 }, data: { label: "Apex Ventures", subtitle: "Lead Investor", type: "investor", aum: 500000000 } },
  { id: "i2", type: "venture", position: { x: 700, y: 400 }, data: { label: "Sequoia Capital", subtitle: "Series A Lead", type: "investor", aum: 85000000000 } },
  { id: "i3", type: "venture", position: { x: 700, y: 600 }, data: { label: "Bessemer Ventures", subtitle: "Growth Investor", type: "investor", aum: 18000000000 } },
  { id: "i4", type: "venture", position: { x: 700, y: 800 }, data: { label: "a16z", subtitle: "Crypto + AI", type: "investor", aum: 35000000000 } },

  // LPs
  { id: "lp1", type: "venture", position: { x: 1000, y: 300 }, data: { label: "Stanford Endowment", subtitle: "University LP", type: "lp", commitment: 50000000 } },
  { id: "lp2", type: "venture", position: { x: 1000, y: 500 }, data: { label: "CalPERS", subtitle: "Pension Fund LP", type: "lp", commitment: 200000000 } },
  { id: "lp3", type: "venture", position: { x: 1000, y: 700 }, data: { label: "Tiger Global", subtitle: "Cross-stage LP", type: "lp", commitment: 150000000 } },
];

export const SEED_EDGES: Edge[] = [
  // Founder → Company
  { id: "e-f1-c1", source: "f1", target: "c1", label: "founded", animated: false, style: { stroke: "hsl(245 80% 65% / 0.5)" } },
  { id: "e-f2-c2", source: "f2", target: "c2", label: "co-founded", animated: false, style: { stroke: "hsl(245 80% 65% / 0.5)" } },
  { id: "e-f3-c3", source: "f3", target: "c3", label: "founded", animated: false, style: { stroke: "hsl(245 80% 65% / 0.5)" } },
  { id: "e-f4-c4", source: "f4", target: "c4", label: "founded", animated: false, style: { stroke: "hsl(245 80% 65% / 0.5)" } },
  { id: "e-f5-c5", source: "f5", target: "c5", label: "founded", animated: false, style: { stroke: "hsl(245 80% 65% / 0.5)" } },

  // Investor → Company
  { id: "e-i1-c1", source: "i1", target: "c1", label: "invested", style: { stroke: "hsl(45 93% 60% / 0.4)" } },
  { id: "e-i1-c2", source: "i1", target: "c2", label: "invested", style: { stroke: "hsl(45 93% 60% / 0.4)" } },
  { id: "e-i2-c1", source: "i2", target: "c1", label: "Series A lead", style: { stroke: "hsl(45 93% 60% / 0.4)" } },
  { id: "e-i2-c3", source: "i2", target: "c3", label: "invested", style: { stroke: "hsl(45 93% 60% / 0.4)" } },
  { id: "e-i3-c3", source: "i3", target: "c3", label: "Series B lead", style: { stroke: "hsl(45 93% 60% / 0.4)" } },
  { id: "e-i3-c5", source: "i3", target: "c5", label: "invested", style: { stroke: "hsl(45 93% 60% / 0.4)" } },
  { id: "e-i4-c4", source: "i4", target: "c4", label: "invested", style: { stroke: "hsl(45 93% 60% / 0.4)" } },

  // LP → Investor
  { id: "e-lp1-i1", source: "lp1", target: "i1", label: "LP", style: { stroke: "hsl(200 80% 60% / 0.4)", strokeDasharray: "5,5" } },
  { id: "e-lp1-i2", source: "lp1", target: "i2", label: "LP", style: { stroke: "hsl(200 80% 60% / 0.4)", strokeDasharray: "5,5" } },
  { id: "e-lp2-i2", source: "lp2", target: "i2", label: "LP", style: { stroke: "hsl(200 80% 60% / 0.4)", strokeDasharray: "5,5" } },
  { id: "e-lp2-i3", source: "lp2", target: "i3", label: "LP", style: { stroke: "hsl(200 80% 60% / 0.4)", strokeDasharray: "5,5" } },
  { id: "e-lp3-i4", source: "lp3", target: "i4", label: "LP", style: { stroke: "hsl(200 80% 60% / 0.4)", strokeDasharray: "5,5" } },

  // Cross relationships
  { id: "e-f1-f3", source: "f1", target: "f3", label: "advisor", style: { stroke: "hsl(160 60% 45% / 0.4)", strokeDasharray: "3,3" } },
  { id: "e-i1-i2", source: "i1", target: "i2", label: "co-investor", style: { stroke: "hsl(280 60% 60% / 0.3)", strokeDasharray: "4,4" } },
];
