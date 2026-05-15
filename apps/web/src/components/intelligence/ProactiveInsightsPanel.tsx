"use client";

import { Sparkles, TrendingUp, UserCheck, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const insights = [
  {
    type: "opportunity",
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    title: "Thesis-aligned founder detected",
    description:
      "Alex Rivera (Quantum Edge) matches your AI Infrastructure thesis — 94% fit. No prior contact.",
    action: "View Profile",
    time: "2h ago",
  },
  {
    type: "relationship",
    icon: UserCheck,
    color: "text-primary",
    bg: "bg-primary/10",
    title: "Dormant relationship alert",
    description:
      "You haven't engaged with Priya Nair (Helion Ventures) in 47 days. She's raising a new fund.",
    action: "Draft Outreach",
    time: "4h ago",
  },
  {
    type: "signal",
    icon: AlertCircle,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    title: "Portfolio company hiring spike",
    description:
      "Luminary AI posted 23 ML engineer roles — 340% above baseline. Pre-announcement signal.",
    action: "View Signals",
    time: "6h ago",
  },
];

export function ProactiveInsightsPanel() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <CardTitle>Proactive Intelligence</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            AI-surfaced opportunities
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <div
              key={idx}
              className="group rounded-lg border border-border p-3 hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${insight.bg}`}
                >
                  <Icon className={`h-3.5 w-3.5 ${insight.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">{insight.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    {insight.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-[11px] text-primary hover:text-primary gap-1"
                    >
                      {insight.action}
                      <ArrowRight className="h-2.5 w-2.5" />
                    </Button>
                    <span className="text-[10px] text-muted-foreground/60">
                      {insight.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
