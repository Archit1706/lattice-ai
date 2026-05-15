"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow, Background, Controls, MiniMap,
  addEdge, useNodesState, useEdgesState,
  type Connection, type Node, type Edge,
  BackgroundVariant, Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Network, Users, Building2, Briefcase, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EntityDetailPanel } from "./EntityDetailPanel";
import { VentureNode } from "./VentureNode";
import { useGraph } from "@/lib/hooks/useGraph";
import { SEED_NODES, SEED_EDGES } from "./graphSeedData";

const nodeTypes = { venture: VentureNode };

const FILTERS = [
  { id: "all", label: "All", icon: Network },
  { id: "Founder", label: "Founders", icon: Users },
  { id: "Company", label: "Companies", icon: Building2 },
  { id: "Investor", label: "Investors", icon: Briefcase },
];

function apiNodesToFlow(nodes: any[]): Node[] {
  return nodes.map((n, idx) => ({
    id: n.id,
    type: "venture",
    position: {
      x: 150 + (idx % 5) * 260,
      y: 150 + Math.floor(idx / 5) * 180,
    },
    data: {
      label: n.label,
      subtitle: n.properties?.subtitle ?? n.properties?.sector ?? "",
      type: (n.type ?? "company").toLowerCase(),
      ...n.properties,
    },
  }));
}

function apiEdgesToFlow(edges: any[]): Edge[] {
  return edges.map((e, idx) => ({
    id: `e-${idx}`,
    source: e.source,
    target: e.target,
    label: e.relationship,
    style: { stroke: "hsl(245 80% 65% / 0.35)", strokeWidth: 1.5 },
  }));
}

export function GraphExplorerPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(SEED_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(SEED_EDGES);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: graphData, isLoading, refetch } = useGraph(150);

  // Populate from API when data arrives
  useEffect(() => {
    if (!graphData) return;
    const apiNodes = graphData.nodes ?? [];
    const apiEdges = graphData.edges ?? [];
    if (apiNodes.length > 0) {
      setNodes(apiNodesToFlow(apiNodes));
      setEdges(apiEdgesToFlow(apiEdges));
    }
  }, [graphData, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const filteredNodes = nodes.map((node) => ({
    ...node,
    hidden:
      (activeFilter !== "all" && String((node.data as any).type).toLowerCase() !== activeFilter.toLowerCase()) ||
      (searchQuery && !String((node.data as any).label).toLowerCase().includes(searchQuery.toLowerCase())),
  }));

  const nodeCount = filteredNodes.filter((n) => !n.hidden).length;

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] gap-0 -m-6 overflow-hidden">
      <div className="flex-1 relative graph-canvas">
        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{
            style: { stroke: "hsl(245 80% 65% / 0.3)", strokeWidth: 1.5 },
          }}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="hsl(222 47% 15%)" />
          <Controls className="glass" />
          <MiniMap
            className="glass"
            nodeColor={(node) => {
              const t = String((node.data as any)?.type ?? "").toLowerCase();
              if (t === "founder") return "hsl(245 80% 65%)";
              if (t === "company") return "#34d399";
              if (t === "investor") return "#f59e0b";
              if (t === "lp") return "#38bdf8";
              return "hsl(215 20% 55%)";
            }}
          />

          <Panel position="top-left" className="flex flex-col gap-2">
            <div className="glass rounded-xl p-3 flex flex-col gap-3 min-w-[240px]">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Venture Graph</span>
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  {isLoading ? "…" : nodeCount} nodes
                </Badge>
                <Button
                  size="icon" variant="ghost" className="h-6 w-6 ml-1"
                  onClick={() => refetch()}
                  title="Refresh"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search entities..."
                  className="pl-8 h-8 text-xs bg-background/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-1 flex-wrap">
                {FILTERS.map((f) => {
                  const Icon = f.icon;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(f.id)}
                      className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                        activeFilter === f.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-3 w-3" />{f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Panel>

          <Panel position="bottom-left">
            <div className="glass rounded-xl p-3 flex gap-4 text-xs">
              {[
                { label: "Founders", color: "bg-primary" },
                { label: "Companies", color: "bg-emerald-400" },
                { label: "Investors", color: "bg-amber-400" },
                { label: "LPs", color: "bg-sky-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${item.color}`} />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </Panel>
        </ReactFlow>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-80 border-l border-border bg-card overflow-y-auto scrollbar-hidden"
          >
            <EntityDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
