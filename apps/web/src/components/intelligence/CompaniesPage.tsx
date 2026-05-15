"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, SlidersHorizontal, Plus, Globe,
  Target, Users, TrendingUp, ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useCompanies } from "@/lib/hooks/useCompanies";
import { formatCurrency } from "@/lib/utils";

const stageColors: Record<string, string> = {
  "Pre-Seed": "text-muted-foreground",
  Seed: "text-sky-400",
  "Series A": "text-primary",
  "Series B": "text-emerald-400",
  "Series C": "text-amber-400",
};

export function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("");
  const { data, isLoading } = useCompanies({ search: search || undefined, sector: sector || undefined, limit: 50 });
  const companies = data?.companies ?? [];

  const sectors = Array.from(new Set(companies.map((c) => c.sector).filter(Boolean))) as string[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data ? `${data.total} companies tracked` : "Loading..."}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              className="pl-8 h-8 text-xs w-52"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5" />Filter
          </Button>
          <Button size="sm" variant="nexus" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />Add Company
          </Button>
        </div>
      </div>

      {/* Sector pills */}
      {sectors.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSector("")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${!sector ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            All
          </button>
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s === sector ? "" : s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${sector === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <div className="h-28 bg-muted/30 rounded-lg animate-pulse" />
                </CardContent>
              </Card>
            ))
          : companies.map((company, idx) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Card className="group hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-muted font-bold text-sm">
                        {company.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate">{company.name}</span>
                          {company.stage && (
                            <span className={`text-[10px] font-medium ${stageColors[company.stage] ?? "text-muted-foreground"}`}>
                              {company.stage}
                            </span>
                          )}
                        </div>
                        {company.sector && (
                          <Badge variant="secondary" className="text-[10px] mt-0.5">{company.sector}</Badge>
                        )}
                      </div>
                      {company.website && (
                        <a href={company.website} target="_blank" rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}>
                          <Globe className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                        </a>
                      )}
                    </div>

                    {company.description && (
                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                        {company.description}
                      </p>
                    )}

                    {/* Financials */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {company.round_size != null && (
                        <div className="rounded-lg bg-muted/30 p-2">
                          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Round</p>
                          <p className="text-xs font-semibold">{formatCurrency(company.round_size)}</p>
                        </div>
                      )}
                      {company.valuation != null && (
                        <div className="rounded-lg bg-muted/30 p-2">
                          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Valuation</p>
                          <p className="text-xs font-semibold">{formatCurrency(company.valuation)}</p>
                        </div>
                      )}
                      {company.employee_count != null && (
                        <div className="rounded-lg bg-muted/30 p-2">
                          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Team</p>
                          <p className="text-xs font-semibold">{company.employee_count} people</p>
                        </div>
                      )}
                      {company.founding_year != null && (
                        <div className="rounded-lg bg-muted/30 p-2">
                          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Founded</p>
                          <p className="text-xs font-semibold">{company.founding_year}</p>
                        </div>
                      )}
                    </div>

                    {/* AI fit score */}
                    {company.ai_fit_score != null && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3 text-primary" />
                            <span className="text-muted-foreground">Thesis fit</span>
                          </div>
                          <span className={`font-bold ${company.ai_fit_score >= 90 ? "text-emerald-400" : company.ai_fit_score >= 80 ? "text-primary" : "text-amber-400"}`}>
                            {company.ai_fit_score}%
                          </span>
                        </div>
                        <Progress value={company.ai_fit_score} className="h-1" />
                      </div>
                    )}

                    {/* Founders */}
                    {company.founders?.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Users className="h-2.5 w-2.5" />
                        {company.founders.join(", ")}
                      </div>
                    )}

                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="outline" className="flex-1 text-[11px] h-7 gap-1">
                        <TrendingUp className="h-3 w-3" />Pipeline
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
