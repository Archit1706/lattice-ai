"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap, TrendingUp, Users, Globe, ExternalLink,
  Star, Bell, BarChart2, Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignals, useSignalsSummary } from "@/lib/hooks/useSignals";
import { formatRelativeTime, formatCurrency } from "@/lib/utils";

type FilterType = "all" | "funding" | "hiring" | "news" | "market";

const FILTERS: { id: FilterType; label: string; icon: typeof Zap }[] = [
  { id: "all", label: "All Signals", icon: Zap },
  { id: "funding", label: "Funding", icon: TrendingUp },
  { id: "hiring", label: "Hiring", icon: Users },
  { id: "news", label: "News", icon: Globe },
  { id: "market", label: "Market", icon: BarChart2 },
];

const signalConfig = {
  funding: { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/20" },
  hiring: { icon: Users, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  news: { icon: Globe, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-500/20" },
  market: { icon: BarChart2, color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-500/20" },
};

const relevanceBadge = { high: "success" as const, medium: "warning" as const, low: "secondary" as const };

export function SignalsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [starred, setStarred] = useState<Set<string>>(new Set());

  const { data, isLoading } = useSignals({
    signal_type: activeFilter === "all" ? undefined : activeFilter,
    limit: 50,
  });
  const { data: summary } = useSignalsSummary();

  const signals = (data?.signals ?? []).filter(
    (s) =>
      !search ||
      s.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Signal Feed</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time intelligence from funding events, hiring spikes, and market movements
          </p>
        </div>
        <Button size="sm" variant="nexus" className="gap-1.5 text-xs">
          <Bell className="h-3.5 w-3.5" />Configure Alerts
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Signals", value: summary?.total_this_week ?? "—", sub: "This week", color: "text-primary" },
          { label: "High Priority", value: summary?.high_priority ?? "—", sub: "Requires action", color: "text-emerald-400" },
          { label: "Funding Events", value: summary?.by_type?.funding ?? "—", sub: `${summary ? formatCurrency(summary.funding_total) : "—"} total`, color: "text-amber-400" },
          { label: "Hiring Spikes", value: summary?.by_type?.hiring ?? "—", sub: "↑ from baseline", color: "text-sky-400" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${stat.color}`}>{String(stat.value)}</p>
              <p className="text-xs font-medium">{stat.label}</p>
              <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search signals..."
            className="pl-8 h-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {FILTERS.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeFilter === f.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Icon className="h-3 w-3" />{f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="h-4 w-1/2 rounded bg-muted/50 animate-pulse mb-2" />
                  <div className="h-3 w-3/4 rounded bg-muted/30 animate-pulse" />
                </CardContent>
              </Card>
            ))
          : signals.map((signal, idx) => {
              const type = signal.signal_type as keyof typeof signalConfig;
              const config = signalConfig[type] ?? signalConfig.news;
              const Icon = config.icon;
              const isStarred = starred.has(signal.id);
              const amount = (signal.metadata as any)?.amount as number | undefined;

              return (
                <motion.div
                  key={signal.id ?? idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Card className={`group hover:border-primary/30 transition-all cursor-pointer ${config.border}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                          <Icon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-semibold">{signal.company_name}</span>
                            <Badge variant={relevanceBadge[signal.urgency] ?? "secondary"} className="text-[10px]">
                              {signal.urgency}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">{signal.sector}</Badge>
                            {amount && (
                              <span className="text-[11px] font-medium text-emerald-400">
                                {formatCurrency(amount)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium">{signal.title}</p>
                          {signal.description && (
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                              {signal.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="text-[10px] text-muted-foreground">
                            {formatRelativeTime(signal.detected_at)}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon" variant="ghost" className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                setStarred((prev) => {
                                  const next = new Set(prev);
                                  isStarred ? next.delete(signal.id) : next.add(signal.id);
                                  return next;
                                });
                              }}
                            >
                              <Star className={`h-3 w-3 ${isStarred ? "fill-amber-400 text-amber-400" : ""}`} />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
      </div>
    </div>
  );
}
