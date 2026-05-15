"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

const typeConfig = {
  founder: {
    bg: "bg-primary/15",
    border: "border-primary/40",
    dot: "bg-primary",
    label: "Founder",
  },
  company: {
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/40",
    dot: "bg-emerald-400",
    label: "Company",
  },
  investor: {
    bg: "bg-amber-500/15",
    border: "border-amber-500/40",
    dot: "bg-amber-400",
    label: "Investor",
  },
  lp: {
    bg: "bg-sky-500/15",
    border: "border-sky-500/40",
    dot: "bg-sky-400",
    label: "LP",
  },
  fund: {
    bg: "bg-purple-500/15",
    border: "border-purple-500/40",
    dot: "bg-purple-400",
    label: "Fund",
  },
};

export function VentureNode({ data, selected }: NodeProps) {
  const type = (data.type as keyof typeof typeConfig) || "company";
  const config = typeConfig[type] || typeConfig.company;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border px-3 py-2 shadow-lg backdrop-blur-sm transition-all",
        config.bg,
        config.border,
        selected && "ring-2 ring-primary ring-offset-1 ring-offset-background scale-105"
      )}
      style={{ minWidth: 120 }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary/60 !border-primary/40 !w-2 !h-2"
      />

      <div className={`h-2 w-2 rounded-full flex-shrink-0 ${config.dot}`} />

      <div className="flex flex-col min-w-0">
        <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
          {String(data.label)}
        </span>
        {data.subtitle && (
          <span className="text-[9px] text-muted-foreground truncate">
            {String(data.subtitle)}
          </span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-primary/60 !border-primary/40 !w-2 !h-2"
      />
    </div>
  );
}
