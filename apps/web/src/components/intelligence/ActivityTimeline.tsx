"use client";

import {
  Mail,
  Calendar,
  FileText,
  Network,
  Zap,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

const activities = [
  {
    type: "meeting",
    icon: Calendar,
    color: "text-primary",
    bg: "bg-primary/10",
    title: "Meeting with Sarah Chen — Luminary AI",
    detail: "45 min · Series A discussion · Notes captured by AI",
    time: new Date(Date.now() - 7200000).toISOString(),
    tags: ["AI/ML", "Series A"],
  },
  {
    type: "email",
    icon: Mail,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    title: "Email thread with Marcus Williams",
    detail: "5 messages · Term sheet follow-up · Relationship strength: Strong",
    time: new Date(Date.now() - 18000000).toISOString(),
    tags: ["Robotics", "Seed"],
  },
  {
    type: "memo",
    icon: FileText,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    title: "AI Research Memo — DeepVault Security",
    detail: "Competitive analysis · Market sizing · 92% conviction score",
    time: new Date(Date.now() - 86400000).toISOString(),
    tags: ["Security", "Series B"],
  },
  {
    type: "graph",
    icon: Network,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    title: "New relationship path discovered",
    detail: "3-hop connection: You → Sequoia → Priya Sharma (DeepVault)",
    time: new Date(Date.now() - 172800000).toISOString(),
    tags: ["Graph Intelligence"],
  },
  {
    type: "signal",
    icon: Zap,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    title: "Signal cluster detected — Quantum Computing",
    detail: "12 companies, 8 funding events, 3 government grants in 30 days",
    time: new Date(Date.now() - 259200000).toISOString(),
    tags: ["Market Signal"],
  },
];

export function ActivityTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <p className="text-xs text-muted-foreground">
          AI-enriched interaction history across all channels
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {/* Vertical line */}
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-border" />

          {activities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <div
                key={idx}
                className="group relative flex gap-4 pb-5 last:pb-0 hover:bg-muted/20 -mx-5 px-5 py-3 rounded-lg transition-colors cursor-pointer"
              >
                {/* Icon */}
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${activity.bg} relative z-10 border-2 border-background`}
                >
                  <Icon className={`h-4 w-4 ${activity.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {formatRelativeTime(activity.time)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {activity.detail}
                  </p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {activity.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
