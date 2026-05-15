"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
  BackgroundVariant,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ZoomIn,
  RefreshCw,
  Network,
  Users,
  Building2,
  Briefcase,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EntityDetailPanel } from "./EntityDetailPanel";
import { VentureNode } from "./VentureNode";
import { SEED_NODES, SEED_EDGES } from "./graphSeedData";

const nodeTypes = {
  venture: VentureNode,
};

const filters = [
  { id: "all", label: "All", icon: Network },
  { id: "founder", label: "Founders", icon: Users },
  { id: "company", label: "Companies", icon: Building2 },
  { id: "investor", label: "Investors", icon: Briefcase },
];

export function GraphExplorerPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(SEED_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(SEED_EDGES);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
      (activeFilter !== "all" && node.data.type !== activeFilter) ||
      (searchQuery &&
        !String(node.data.label).toLowerCase().includes(searchQuery.toLowerCase())),
  }));

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] gap-0 -m-6 overflow-hidden">
      {/* Graph Canvas */}
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
            animated: false,
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="hsl(222 47% 15%)"
          />
          <Controls className="glass" />
          <MiniMap
            className="glass"
            nodeColor={(node) => {
              switch ((node.data as any).type) {
                case "founder": return "hsl(245 80% 65%)";
                case "company": return "#34d399";
                case "investor": return "#f59e0b";
                default: return "hsl(215 20% 55%)";
              }
            }}
          />

          {/* Top Panel — Filters */}
          <Panel position="top-left" className="flex flex-col gap-2">
            <div className="glass rounded-xl p-3 flex flex-col gap-3 min-w-[240px]">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Venture Graph</span>
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  {nodes.length} nodes
                </Badge>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search entities..."
                  className="pl-8 h-8 text-xs bg-background/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter buttons */}
              <div className="flex gap-1 flex-wrap">
                {filters.map((f) => {
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
                      <Icon className="h-3 w-3" />
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Panel>

          {/* Stats Panel */}
          <Panel position="bottom-left">
            <div className="glass rounded-xl p-3 flex gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Founders: 8</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-muted-foreground">Companies: 10</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-muted-foreground">Investors: 5</span>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Entity Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-80 border-l border-border bg-card overflow-y-auto scrollbar-hidden"
          >
            <EntityDetailPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
