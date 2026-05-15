"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Filter, Target, Clock, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePipeline, usePipelineStats, usePipelineStages } from "@/lib/hooks/usePipeline";
import { formatCurrency, formatRelativeTime, getInitials } from "@/lib/utils";

const STAGE_ORDER = [
  { id: "sourcing", label: "Sourcing" },
  { id: "initial_review", label: "Initial Review" },
  { id: "diligence", label: "Diligence" },
  { id: "partner_meeting", label: "Partner Meeting" },
  { id: "term_sheet", label: "Term Sheet" },
  { id: "closed", label: "Closed" },
];

export function DealPipelinePage() {
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const { data: pipelineData, isLoading } = usePipeline({ limit: 50 });
  const { data: stats } = usePipelineStats();
  const deals = pipelineData?.deals ?? [];

  const dealsByStage = STAGE_ORDER.map((stage) => ({
    ...stage,
    deals: deals.filter((d) => d.stage === stage.id),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Deal Pipeline</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {stats
              ? `${stats.total_deals} active deals · ${formatCurrency(stats.total_value)} pipeline · avg ${Math.round(stats.avg_fit_score)}% thesis fit`
              : "Loading..."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "kanban" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              Table
            </button>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <Filter className="h-3.5 w-3.5" />Filter
          </Button>
          <Button size="sm" variant="nexus" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />Add Deal
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGE_ORDER.map((s) => (
            <div key={s.id} className="flex-shrink-0 w-72">
              <div className="h-6 w-32 bg-muted/40 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 rounded-xl bg-muted/30 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : view === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hidden">
          {dealsByStage.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-72">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary/60" />
                  <span className="text-xs font-semibold">{stage.label}</span>
                  <Badge variant="secondary" className="text-[10px]">{stage.deals.length}</Badge>
                </div>
                <Button size="icon" variant="ghost" className="h-6 w-6">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {stage.deals.map((deal) => (
                  <motion.div
                    key={deal.id}
                    whileHover={{ y: -1 }}
                    className="group rounded-xl border border-border bg-card p-3 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary">
                          {getInitials(deal.company)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{deal.company}</p>
                          <p className="text-[10px] text-muted-foreground">{deal.founder}</p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="h-5 w-5 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-[10px]">{deal.sector}</Badge>
                      <span className="text-[10px] font-medium">{formatCurrency(deal.round_size)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3 text-primary" />
                        <span className={`text-[11px] font-bold ${deal.fit_score >= 90 ? "text-emerald-400" : deal.fit_score >= 80 ? "text-primary" : "text-amber-400"}`}>
                          {deal.fit_score}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" />
                        {formatRelativeTime(deal.last_contact)}
                      </div>
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[9px] font-bold">
                        {deal.assignee}
                      </div>
                    </div>
                    <Progress value={deal.fit_score} className="mt-2 h-0.5" />
                  </motion.div>
                ))}
                {stage.deals.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border p-4 text-center">
                    <p className="text-[11px] text-muted-foreground">No deals</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {["Company", "Founder", "Sector", "Stage", "Round Size", "Fit Score", "Last Contact", "Assignee"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => {
                  const stageLabel = STAGE_ORDER.find((s) => s.id === deal.stage)?.label ?? deal.stage;
                  return (
                    <tr key={deal.id} className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-4 py-3 font-medium">{deal.company}</td>
                      <td className="px-4 py-3 text-muted-foreground">{deal.founder}</td>
                      <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{deal.sector}</Badge></td>
                      <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{stageLabel}</Badge></td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(deal.round_size)}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${deal.fit_score >= 90 ? "text-emerald-400" : deal.fit_score >= 80 ? "text-primary" : "text-amber-400"}`}>
                          {deal.fit_score}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatRelativeTime(deal.last_contact)}</td>
                      <td className="px-4 py-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                          {deal.assignee}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
