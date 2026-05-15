"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Network,
  Target,
  Mail,
  Calendar,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { formatRelativeTime, getInitials } from "@/lib/utils";

const FOUNDERS = [
  { id: "1", name: "Sarah Chen", company: "Luminary AI", title: "CEO & Co-Founder", sector: "AI/ML", stage: "Series A", fitScore: 94, connections: 47, lastContact: new Date(Date.now() - 86400000 * 2).toISOString(), status: "active", bio: "Stanford CS PhD dropout, 6 years at Google Brain. Published 12 transformer papers." },
  { id: "2", name: "Marcus Williams", company: "Nexus Robotics", title: "CTO & Co-Founder", sector: "Robotics", stage: "Seed", fitScore: 88, connections: 31, lastContact: new Date(Date.now() - 86400000 * 5).toISOString(), status: "active", bio: "MIT CSAIL alumnus, former lead engineer at Boston Dynamics." },
  { id: "3", name: "Priya Sharma", company: "DeepVault", title: "CEO & Founder", sector: "Security", stage: "Series B", fitScore: 76, connections: 58, lastContact: new Date(Date.now() - 86400000).toISOString(), status: "active", bio: "Ex-Palantir, 10 years in enterprise security. Built $50M ARR business." },
  { id: "4", name: "Alex Rivera", company: "Quantum Edge", title: "CTO & Co-Founder", sector: "Quantum", stage: "Pre-Seed", fitScore: 82, connections: 22, lastContact: new Date(Date.now() - 86400000 * 3).toISOString(), status: "watching", bio: "Caltech quantum physics PhD. Former IBM quantum computing researcher." },
  { id: "5", name: "Emma Johansson", company: "Meridian Health", title: "CEO & Founder", sector: "HealthTech", stage: "Series B", fitScore: 71, connections: 39, lastContact: new Date(Date.now() - 86400000 * 7).toISOString(), status: "active", bio: "MD/MBA from Stanford. Former Chief Medical Officer at Epic Systems." },
  { id: "6", name: "Jason Park", company: "Apex Climate", title: "CEO & Founder", sector: "CleanTech", stage: "Seed", fitScore: 65, connections: 18, lastContact: new Date(Date.now() - 86400000 * 14).toISOString(), status: "cold", bio: "Ex-Tesla energy storage. DOE fellowship recipient." },
];

export function FoundersPage() {
  const [search, setSearch] = useState("");
  const filtered = FOUNDERS.filter(
    (f) =>
      !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.company.toLowerCase().includes(search.toLowerCase()) ||
      f.sector.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = {
    active: "success" as const,
    watching: "warning" as const,
    cold: "secondary" as const,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Founders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {FOUNDERS.length} founders tracked across {new Set(FOUNDERS.map((f) => f.sector)).size} sectors
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
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button size="sm" variant="nexus" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add Founder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((founder, idx) => (
          <motion.div
            key={founder.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="group hover:border-primary/30 transition-all cursor-pointer h-full">
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-nexus text-white text-sm font-bold">
                    {getInitials(founder.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{founder.name}</span>
                      <Badge variant={statusColor[founder.status as keyof typeof statusColor]} className="text-[10px]">
                        {founder.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{founder.title}</p>
                    <p className="text-xs font-medium text-primary">{founder.company}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap mb-3">
                  <Badge variant="secondary" className="text-[10px]">{founder.sector}</Badge>
                  <Badge variant="outline" className="text-[10px]">{founder.stage}</Badge>
                </div>

                {/* Bio */}
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                  {founder.bio}
                </p>

                {/* Metrics */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">Thesis fit</span>
                    </div>
                    <span className={`font-bold ${founder.fitScore >= 90 ? "text-emerald-400" : founder.fitScore >= 80 ? "text-primary" : "text-amber-400"}`}>
                      {founder.fitScore}%
                    </span>
                  </div>
                  <Progress value={founder.fitScore} className="h-1" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Network className="h-2.5 w-2.5" />
                    {founder.connections} connections
                  </div>
                  <span>Last contact {formatRelativeTime(founder.lastContact)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="outline" className="flex-1 text-[11px] h-7 gap-1">
                    <Mail className="h-3 w-3" />
                    Outreach
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-[11px] h-7 gap-1">
                    <Calendar className="h-3 w-3" />
                    Prep
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
