"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, SlidersHorizontal, Plus, Network,
  Target, Mail, Calendar, ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useFounders } from "@/lib/hooks/useFounders";
import { formatRelativeTime, getInitials } from "@/lib/utils";

const statusVariant = {
  active: "success" as const,
  watching: "warning" as const,
  cold: "secondary" as const,
};

export function FoundersPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useFounders({ search: search || undefined, limit: 50 });
  const founders = data?.founders ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Founders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data ? `${data.total} founders tracked` : "Loading..."}{" "}
            across multiple sectors
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search founders..."
              className="pl-8 h-8 text-xs w-52"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5" />Filter
          </Button>
          <Button size="sm" variant="lattice" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />Add Founder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
                </CardContent>
              </Card>
            ))
          : founders.map((founder, idx) => (
              <motion.div
                key={founder.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Card className="group hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-lattice text-white text-sm font-bold">
                        {getInitials(founder.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{founder.name}</span>
                          <Badge
                            variant={statusVariant[founder.status as keyof typeof statusVariant] ?? "secondary"}
                            className="text-[10px]"
                          >
                            {founder.status}
                          </Badge>
                        </div>
                        {founder.title && (
                          <p className="text-xs text-muted-foreground">{founder.title}</p>
                        )}
                        <p className="text-xs font-medium text-primary">{founder.company}</p>
                      </div>
                    </div>

                    <div className="flex gap-1.5 flex-wrap mb-3">
                      <Badge variant="secondary" className="text-[10px]">{founder.sector}</Badge>
                      <Badge variant="outline" className="text-[10px]">{founder.stage}</Badge>
                    </div>

                    {founder.bio && (
                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                        {founder.bio}
                      </p>
                    )}

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3 text-primary" />
                          <span className="text-muted-foreground">Thesis fit</span>
                        </div>
                        <span className={`font-bold ${founder.fit_score >= 90 ? "text-emerald-400" : founder.fit_score >= 80 ? "text-primary" : "text-amber-400"}`}>
                          {founder.fit_score}%
                        </span>
                      </div>
                      <Progress value={founder.fit_score} className="h-1" />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3">
                      {founder.connections != null && (
                        <div className="flex items-center gap-1">
                          <Network className="h-2.5 w-2.5" />
                          {founder.connections} connections
                        </div>
                      )}
                      {founder.last_contact && (
                        <span>Last contact {formatRelativeTime(founder.last_contact)}</span>
                      )}
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="outline" className="flex-1 text-[11px] h-7 gap-1">
                        <Mail className="h-3 w-3" />Outreach
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-[11px] h-7 gap-1">
                        <Calendar className="h-3 w-3" />Prep
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
