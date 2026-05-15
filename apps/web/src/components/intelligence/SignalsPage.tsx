"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  TrendingUp,
  Users,
  Globe,
  Building2,
  Filter,
  Search,
  ExternalLink,
  Star,
  Bell,
  BarChart2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRelativeTime, formatCurrency } from "@/lib/utils";

type SignalType = "all" | "funding" | "hiring" | "news" | "market";

const SIGNALS = [
  { id: "1", type: "funding", company: "Quantum Edge", description: "Raised $12M Seed led by Accel", detail: "7 investors. This is the third quantum computing startup in this space to raise in 30 days.", sector: "AI/ML", time: new Date(Date.now() - 3600000).toISOString(), relevance: "high", amount: 12000000 },
  { id: "2", type: "hiring", company: "Luminary AI", description: "23 ML engineer openings (↑340%)", detail: "Based on LinkedIn job data. 70% require CUDA expertise — suggests GPU optimization focus.", sector: "AI Infrastructure", time: new Date(Date.now() - 7200000).toISOString(), relevance: "high" },
  { id: "3", type: "news", company: "Nexus Robotics", description: "Partnership with Toyota Manufacturing", detail: "5-year manufacturing automation contract. Estimated $40M ARR impact by 2027.", sector: "Robotics", time: new Date(Date.now() - 14400000).toISOString(), relevance: "high" },
  { id: "4", type: "hiring", company: "DeepVault", description: "Head of Enterprise Sales hired from Palantir", detail: "Signal of enterprise go-to-market acceleration. Previous exec managed $200M book of business.", sector: "Security", time: new Date(Date.now() - 21600000).toISOString(), relevance: "medium" },
  { id: "5", type: "funding", company: "Meridian Health", description: "Series B $32M — Bessemer led", detail: "Strong valuation step-up from Series A. FDA clearance obtained last month.", sector: "Health Tech", time: new Date(Date.now() - 86400000).toISOString(), relevance: "medium", amount: 32000000 },
  { id: "6", type: "market", company: "AI Infrastructure", description: "Sector funding up 280% QoQ", detail: "12 companies raised in this category in Q4. Average deal size $18M.", sector: "Market", time: new Date(Date.now() - 172800000).toISOString(), relevance: "medium" },
  { id: "7", type: "news", company: "Apex Climate", description: "DOE grant awarded — $8M federal", detail: "Non-dilutive funding. Confirms government validation of core technology.", sector: "CleanTech", time: new Date(Date.now() - 259200000).toISOString(), relevance: "low" },
  { id: "8", type: "hiring", company: "FinFlow", description: "CTO role posted — previously VP at Stripe", detail: "Leadership gap being filled. Strong pedigree hire suggests board-driven upgrade.", sector: "FinTech", time: new Date(Date.now() - 345600000).toISOString(), relevance: "low" },
];

const FILTERS: { id: SignalType; label: string; icon: typeof Zap }[] = [
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

const relevanceVariant = { high: "success" as const, medium: "warning" as const, low: "secondary" as const };

export function SignalsPage() {
  const [activeFilter, setActiveFilter] = useState<SignalType>("all");
  const [search, setSearch] = useState("");
  const [starred, setStarred] = useState<Set<string>>(new Set());

  const filtered = SIGNALS.filter(
    (s) =>
      (activeFilter === "all" || s.type === activeFilter) &&
      (!search ||
        s.company.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()))
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
          <Bell className="h-3.5 w-3.5" />
          Configure Alerts
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Signals", value: "63", sub: "This week", color: "text-primary" },
          { label: "High Priority", value: "12", sub: "Requires action", color: "text-emerald-400" },
          { label: "Funding Events", value: "8", sub: "$284M total", color: "text-amber-400" },
          { label: "Hiring Spikes", value: "15", sub: "↑ from baseline", color: "text-sky-400" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
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
                <Icon className="h-3 w-3" />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Signal List */}
      <div className="space-y-3">
        {filtered.map((signal, idx) => {
          const config = signalConfig[signal.type as keyof typeof signalConfig];
          const Icon = config.icon;
          const isStarred = starred.has(signal.id);

          return (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className={`group hover:border-primary/30 transition-all cursor-pointer ${config.border}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold">{signal.company}</span>
                        <Badge variant={relevanceVariant[signal.relevance as keyof typeof relevanceVariant]} className="text-[10px]">
                          {signal.relevance}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {signal.sector}
                        </Badge>
                        {signal.amount && (
                          <span className="text-[11px] font-medium text-emerald-400">
                            {formatCurrency(signal.amount)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium">{signal.description}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        {signal.detail}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-[10px] text-muted-foreground">
                        {formatRelativeTime(signal.time)}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
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
