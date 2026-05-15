"use client";

import { Zap, TrendingUp, Users, Globe, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRelativeTime } from "@/lib/utils";

const signals = [
  {
    type: "funding",
    company: "Quantum Edge",
    description: "Raised $12M Seed led by Accel",
    sector: "AI/ML",
    time: new Date(Date.now() - 3600000).toISOString(),
    relevance: "high",
  },
  {
    type: "hiring",
    company: "Luminary AI",
    description: "23 ML engineer openings (↑340%)",
    sector: "AI Infrastructure",
    time: new Date(Date.now() - 7200000).toISOString(),
    relevance: "high",
  },
  {
    type: "news",
    company: "Nexus Robotics",
    description: "Partnership with Toyota Manufacturing",
    sector: "Robotics",
    time: new Date(Date.now() - 14400000).toISOString(),
    relevance: "medium",
  },
  {
    type: "hiring",
    company: "DeepVault",
    description: "Head of Enterprise Sales hired from Palantir",
    sector: "Security",
    time: new Date(Date.now() - 21600000).toISOString(),
    relevance: "medium",
  },
  {
    type: "funding",
    company: "Meridian Health",
    description: "Series B $32M — Bessemer led",
    sector: "Health Tech",
    time: new Date(Date.now() - 86400000).toISOString(),
    relevance: "low",
  },
  {
    type: "news",
    company: "Apex Climate",
    description: "DOE grant awarded — $8M federal",
    sector: "CleanTech",
    time: new Date(Date.now() - 172800000).toISOString(),
    relevance: "low",
  },
];

const signalConfig = {
  funding: { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  hiring: { icon: Users, color: "text-primary", bg: "bg-primary/10" },
  news: { icon: Globe, color: "text-amber-400", bg: "bg-amber-400/10" },
};

const relevanceBadge = {
  high: "success" as const,
  medium: "warning" as const,
  low: "secondary" as const,
};

export function SignalFeedWidget() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <Zap className="h-3.5 w-3.5 text-primary" />
          </div>
          <CardTitle>Signal Feed</CardTitle>
        </div>
        <Button size="sm" variant="ghost" className="text-xs">
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[340px]">
          <div className="space-y-0 px-5 pb-4">
            {signals.map((signal, idx) => {
              const config = signalConfig[signal.type as keyof typeof signalConfig];
              const Icon = config.icon;
              return (
                <div
                  key={idx}
                  className="group flex gap-3 py-3 border-b border-border last:border-0 hover:bg-muted/30 -mx-5 px-5 transition-colors cursor-pointer"
                >
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md mt-0.5 ${config.bg}`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold">{signal.company}</span>
                      <Badge variant={relevanceBadge[signal.relevance as keyof typeof relevanceBadge]} className="text-[9px] py-0">
                        {signal.relevance}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {signal.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground/60">
                        {formatRelativeTime(signal.time)}
                      </span>
                      <span className="text-[10px] text-muted-foreground/40">·</span>
                      <span className="text-[10px] text-muted-foreground/60">
                        {signal.sector}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground/30 group-hover:text-muted-foreground flex-shrink-0 mt-1 transition-colors" />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
