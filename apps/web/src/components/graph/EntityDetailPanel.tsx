"use client";

import type { Node } from "@xyflow/react";
import { X, ExternalLink, Network, Mail, Calendar, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

interface EntityDetailPanelProps {
  node: Node;
  onClose: () => void;
}

export function EntityDetailPanel({ node, onClose }: EntityDetailPanelProps) {
  const data = node.data as Record<string, unknown>;

  const typeColors = {
    founder: "text-primary",
    company: "text-emerald-400",
    investor: "text-amber-400",
    lp: "text-sky-400",
    fund: "text-purple-400",
  };

  const typeColor = typeColors[data.type as keyof typeof typeColors] || "text-foreground";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-border">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className={`text-[10px] ${typeColor}`}>
              {String(data.type || "entity")}
            </Badge>
            {data.sector && (
              <Badge variant="outline" className="text-[10px]">
                {String(data.sector)}
              </Badge>
            )}
          </div>
          <h2 className="text-base font-semibold truncate">{String(data.label)}</h2>
          {data.subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {String(data.subtitle)}
            </p>
          )}
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 flex-shrink-0 ml-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* AI Score */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium">Thesis Fit Score</span>
          </div>
          <span className="text-sm font-bold text-primary">87%</span>
        </div>
        <Progress value={87} />
        <p className="text-[10px] text-muted-foreground mt-1.5">
          Strong match with AI Infrastructure thesis
        </p>
      </div>

      {/* Details */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden p-5 space-y-4">
        {/* Financial */}
        {(data.valuation || data.aum || data.commitment) && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
              Financial
            </p>
            <div className="space-y-1.5">
              {data.valuation && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Valuation</span>
                  <span className="font-medium">{formatCurrency(Number(data.valuation))}</span>
                </div>
              )}
              {data.aum && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">AUM</span>
                  <span className="font-medium">{formatCurrency(Number(data.aum))}</span>
                </div>
              )}
              {data.commitment && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Commitment</span>
                  <span className="font-medium">{formatCurrency(Number(data.commitment))}</span>
                </div>
              )}
              {data.stage && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Stage</span>
                  <Badge variant="default" className="text-[10px]">{String(data.stage)}</Badge>
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Relationship Stats */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
            Graph Intelligence
          </p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Graph connections</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Warm intro paths</span>
              <span className="font-medium text-emerald-400">3 found</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Relationship strength</span>
              <span className="font-medium">Strong</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Last interaction</span>
              <span className="font-medium">2 days ago</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* AI Summary */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
            AI Summary
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Strong thesis alignment with AI Infrastructure focus. Multiple mutual connections through Sequoia and a16z networks.
            Recent hiring acceleration suggests pre-announcement growth phase.
            Recommend immediate outreach via warm intro through Marcus Williams.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button size="sm" variant="lattice" className="w-full text-xs">
          <Network className="h-3.5 w-3.5" />
          Explore Relationships
        </Button>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Mail className="h-3.5 w-3.5" />
            Draft Outreach
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            Meeting Prep
          </Button>
        </div>
      </div>
    </div>
  );
}
