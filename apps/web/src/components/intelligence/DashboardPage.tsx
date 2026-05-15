"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Building2,
  Zap,
  ArrowUpRight,
  Activity,
  Brain,
  Network,
  Target,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SignalFeedWidget } from "./SignalFeedWidget";
import { ProactiveInsightsPanel } from "./ProactiveInsightsPanel";
import { ActivityTimeline } from "./ActivityTimeline";
import { IntelligenceMetricsChart } from "./IntelligenceMetricsChart";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

const stats = [
  {
    label: "Active Relationships",
    value: "1,247",
    change: "+12%",
    positive: true,
    icon: Users,
    description: "founders, investors, LPs",
  },
  {
    label: "Companies Tracked",
    value: "489",
    change: "+8%",
    positive: true,
    icon: Building2,
    description: "across 24 sectors",
  },
  {
    label: "Signals This Week",
    value: "63",
    change: "+31%",
    positive: true,
    icon: Zap,
    description: "funding, hiring, product",
  },
  {
    label: "Pipeline Value",
    value: formatCurrency(284000000),
    change: "+5%",
    positive: true,
    icon: TrendingUp,
    description: "across 18 active deals",
  },
];

const recentDeals = [
  {
    company: "Luminary AI",
    founder: "Sarah Chen",
    stage: "Series A",
    amount: 18000000,
    fit: 94,
    sector: "AI/ML",
    lastContact: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    company: "Nexus Robotics",
    founder: "Marcus Williams",
    stage: "Seed",
    amount: 4000000,
    fit: 88,
    sector: "Robotics",
    lastContact: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    company: "DeepVault",
    founder: "Priya Sharma",
    stage: "Series B",
    amount: 45000000,
    fit: 76,
    sector: "Security",
    lastContact: new Date(Date.now() - 86400000).toISOString(),
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function DashboardPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Intelligence Hub
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-powered venture intelligence across your entire portfolio and pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1">
            <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-emerald-400">
              Live Intelligence
            </span>
          </div>
          <Button size="sm" variant="nexus">
            <Brain className="h-3.5 w-3.5" />
            AI Briefing
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={item}
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="group relative overflow-hidden hover:border-primary/30 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <Badge
                    variant={stat.positive ? "success" : "destructive"}
                    className="text-[10px]"
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-foreground/80">
                    {stat.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Active Deals */}
        <motion.div variants={item} className="col-span-12 lg:col-span-7">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Pipeline</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  AI-scored deals by investment thesis fit
                </p>
              </div>
              <Button size="sm" variant="ghost" className="text-xs gap-1">
                View all <ArrowUpRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentDeals.map((deal) => (
                <div
                  key={deal.company}
                  className="group flex items-center gap-4 rounded-lg border border-border p-3 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
                >
                  {/* Company Avatar */}
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-muted font-semibold text-sm text-foreground">
                    {deal.company[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{deal.company}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {deal.sector}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {deal.founder} · {deal.stage} ·{" "}
                      {formatCurrency(deal.amount)}
                    </p>
                  </div>

                  {/* AI Fit Score */}
                  <div className="flex flex-col items-end gap-1 min-w-[80px]">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-primary" />
                      <span
                        className={`text-sm font-bold ${
                          deal.fit >= 90
                            ? "text-emerald-400"
                            : deal.fit >= 80
                              ? "text-primary"
                              : "text-amber-400"
                        }`}
                      >
                        {deal.fit}%
                      </span>
                    </div>
                    <Progress value={deal.fit} className="w-20 h-1" />
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      {formatRelativeTime(deal.lastContact)}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <motion.div variants={item}>
            <ProactiveInsightsPanel />
          </motion.div>
        </div>

        {/* Intelligence Chart */}
        <motion.div variants={item} className="col-span-12 lg:col-span-8">
          <IntelligenceMetricsChart />
        </motion.div>

        {/* Signal Feed */}
        <motion.div variants={item} className="col-span-12 lg:col-span-4">
          <SignalFeedWidget />
        </motion.div>

        {/* Activity Timeline */}
        <motion.div variants={item} className="col-span-12">
          <ActivityTimeline />
        </motion.div>
      </div>
    </motion.div>
  );
}
