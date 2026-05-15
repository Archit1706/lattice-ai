"use client";

import { Zap, TrendingUp, Users, Globe, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSignals } from "@/lib/hooks/useSignals";
import { formatRelativeTime } from "@/lib/utils";

const signalConfig = {
  funding: { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  hiring: { icon: Users, color: "text-primary", bg: "bg-primary/10" },
  news: { icon: Globe, color: "text-amber-400", bg: "bg-amber-400/10" },
  market: { icon: Zap, color: "text-sky-400", bg: "bg-sky-400/10" },
};

const relevanceBadge = {
  high: "success" as const,
  medium: "warning" as const,
  low: "secondary" as const,
};

export function SignalFeedWidget() {
  const { data, isLoading } = useSignals({ limit: 6 });
  const signals = data?.signals ?? [];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <Zap className="h-3.5 w-3.5 text-primary" />
          </div>
          <CardTitle>Signal Feed</CardTitle>
        </div>
        <Button size="sm" variant="ghost" className="text-xs" asChild>
          <a href="/signals">View all</a>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[340px]">
          <div className="space-y-0 px-5 pb-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="py-3 border-b border-border">
                    <div className="h-3 w-3/4 rounded bg-muted/50 animate-pulse mb-2" />
                    <div className="h-2.5 w-1/2 rounded bg-muted/30 animate-pulse" />
                  </div>
                ))
              : signals.map((signal, idx) => {
                  const type = signal.signal_type as keyof typeof signalConfig;
                  const config = signalConfig[type] ?? signalConfig.news;
                  const Icon = config.icon;
                  return (
                    <div
                      key={signal.id ?? idx}
                      className="group flex gap-3 py-3 border-b border-border last:border-0 hover:bg-muted/30 -mx-5 px-5 transition-colors cursor-pointer"
                    >
                      <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md mt-0.5 ${config.bg}`}>
                        <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold">{signal.company_name}</span>
                          <Badge variant={relevanceBadge[signal.urgency] ?? "secondary"} className="text-[9px] py-0">
                            {signal.urgency}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{signal.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground/60">
                            {formatRelativeTime(signal.detected_at)}
                          </span>
                          <span className="text-[10px] text-muted-foreground/40">·</span>
                          <span className="text-[10px] text-muted-foreground/60">{signal.sector}</span>
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
