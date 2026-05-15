"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Filter,
  SlidersHorizontal,
  Target,
  Clock,
  ChevronDown,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatRelativeTime, getInitials } from "@/lib/utils";

type DealStage = "sourcing" | "initial_review" | "diligence" | "partner_meeting" | "term_sheet" | "closed";

interface Deal {
  id: string;
  company: string;
  founder: string;
  sector: string;
  stage: DealStage;
  roundSize: number;
  fitScore: number;
  lastContact: string;
  assignee: string;
  notes: string;
}

const STAGES: { id: DealStage; label: string; color: string }[] = [
  { id: "sourcing", label: "Sourcing", color: "bg-muted" },
  { id: "initial_review", label: "Initial Review", color: "bg-sky-500/20" },
  { id: "diligence", label: "Diligence", color: "bg-amber-500/20" },
  { id: "partner_meeting", label: "Partner Meeting", color: "bg-purple-500/20" },
  { id: "term_sheet", label: "Term Sheet", color: "bg-emerald-500/20" },
  { id: "closed", label: "Closed", color: "bg-primary/20" },
];

const DEALS: Deal[] = [
  { id: "1", company: "Luminary AI", founder: "Sarah Chen", sector: "AI/ML", stage: "partner_meeting", roundSize: 18000000, fitScore: 94, lastContact: new Date(Date.now() - 86400000 * 2).toISOString(), assignee: "JD", notes: "Strong thesis fit — inferencing optimization" },
  { id: "2", company: "Nexus Robotics", founder: "Marcus Williams", sector: "Robotics", stage: "diligence", roundSize: 4000000, fitScore: 88, lastContact: new Date(Date.now() - 86400000 * 5).toISOString(), assignee: "SK", notes: "Awaiting technical diligence report" },
  { id: "3", company: "DeepVault", founder: "Priya Sharma", sector: "Security", stage: "term_sheet", roundSize: 45000000, fitScore: 76, lastContact: new Date(Date.now() - 86400000).toISOString(), assignee: "JD", notes: "Term sheet under review" },
  { id: "4", company: "Quantum Edge", founder: "Alex Rivera", sector: "Quantum", stage: "initial_review", roundSize: 2000000, fitScore: 82, lastContact: new Date(Date.now() - 86400000 * 3).toISOString(), assignee: "MK", notes: "Pre-seed — exceptional team background" },
  { id: "5", company: "Meridian Health", founder: "Emma Johansson", sector: "HealthTech", stage: "diligence", roundSize: 32000000, fitScore: 71, lastContact: new Date(Date.now() - 86400000 * 7).toISOString(), assignee: "SK", notes: "FDA pathway needs clarification" },
  { id: "6", company: "Apex Climate", founder: "Jason Park", sector: "CleanTech", stage: "sourcing", roundSize: 8000000, fitScore: 65, lastContact: new Date(Date.now() - 86400000 * 14).toISOString(), assignee: "MK", notes: "Sourced from DOE announcement" },
  { id: "7", company: "FinFlow", founder: "Aisha Okafor", sector: "FinTech", stage: "initial_review", roundSize: 6000000, fitScore: 78, lastContact: new Date(Date.now() - 86400000 * 4).toISOString(), assignee: "JD", notes: "SMB payments infrastructure" },
];

export function DealPipelinePage() {
  const [view, setView] = useState<"kanban" | "table">("kanban");

  const dealsByStage = STAGES.map((stage) => ({
    ...stage,
    deals: DEALS.filter((d) => d.stage === stage.id),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Deal Pipeline</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-scored deals across all stages — {DEALS.length} active opportunities
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
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button size="sm" variant="nexus" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add Deal
          </Button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hidden">
          {dealsByStage.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-72">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${stage.color.replace('/20', '')}`} />
                  <span className="text-xs font-semibold">{stage.label}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {stage.deals.length}
                  </Badge>
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
                      <Badge variant="secondary" className="text-[10px]">
                        {deal.sector}
                      </Badge>
                      <span className="text-[10px] font-medium text-foreground">
                        {formatCurrency(deal.roundSize)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3 text-primary" />
                        <span className={`text-[11px] font-bold ${deal.fitScore >= 90 ? "text-emerald-400" : deal.fitScore >= 80 ? "text-primary" : "text-amber-400"}`}>
                          {deal.fitScore}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" />
                        {formatRelativeTime(deal.lastContact)}
                      </div>
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[9px] font-bold">
                        {deal.assignee}
                      </div>
                    </div>

                    <Progress value={deal.fitScore} className="mt-2 h-0.5" />
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
                    <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEALS.map((deal) => {
                  const stage = STAGES.find((s) => s.id === deal.stage)!;
                  return (
                    <tr key={deal.id} className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-4 py-3 font-medium">{deal.company}</td>
                      <td className="px-4 py-3 text-muted-foreground">{deal.founder}</td>
                      <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{deal.sector}</Badge></td>
                      <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{stage.label}</Badge></td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(deal.roundSize)}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${deal.fitScore >= 90 ? "text-emerald-400" : deal.fitScore >= 80 ? "text-primary" : "text-amber-400"}`}>
                          {deal.fitScore}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatRelativeTime(deal.lastContact)}</td>
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
