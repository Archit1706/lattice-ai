"use client";

import { motion } from "framer-motion";
import {
  TrendingUp, DollarSign, PieChart, ArrowUpRight,
  Building2, Users, CheckCircle, XCircle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePortfolioCompanies, usePortfolioStats, usePortfolioPerformance } from "@/lib/hooks/usePortfolio";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusConfig = {
  active: { label: "Active", variant: "success" as const, icon: CheckCircle, color: "text-emerald-400" },
  exited: { label: "Exited", variant: "default" as const, icon: ArrowUpRight, color: "text-primary" },
  written_off: { label: "Written Off", variant: "destructive" as const, icon: XCircle, color: "text-destructive" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground capitalize">{p.dataKey}:</span>
          <span className="font-medium">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function PortfolioIntelligencePage() {
  const { data: companiesData, isLoading: companiesLoading } = usePortfolioCompanies();
  const { data: stats, isLoading: statsLoading } = usePortfolioStats();
  const { data: performance } = usePortfolioPerformance();

  const companies = companiesData?.companies ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Portfolio Intelligence</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Performance tracking and intelligence across all portfolio companies
          </p>
        </div>
        <Button size="sm" variant="nexus" className="gap-1.5 text-xs">
          <PieChart className="h-3.5 w-3.5" />Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total Invested", icon: DollarSign,
            value: stats ? formatCurrency(stats.total_invested) : "—",
            sub: `${stats?.active_count ?? "—"} active companies`,
          },
          {
            label: "Portfolio Value", icon: TrendingUp,
            value: stats ? formatCurrency(stats.total_value) : "—",
            sub: stats ? `${((stats.total_value / stats.total_invested - 1) * 100).toFixed(0)}% unrealised gain` : "—",
          },
          {
            label: "Portfolio MOIC", icon: ArrowUpRight,
            value: stats ? `${stats.portfolio_moic.toFixed(2)}x` : "—",
            sub: "multiple on invested capital",
          },
          {
            label: "Net IRR", icon: PieChart,
            value: stats ? `${stats.irr.toFixed(1)}%` : "—",
            sub: "internal rate of return",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold tracking-tight">
                  {statsLoading ? <span className="h-7 w-24 bg-muted/40 animate-pulse rounded block" /> : stat.value}
                </p>
                <p className="text-xs font-medium mt-0.5">{stat.label}</p>
                <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Performance chart */}
        {performance && performance.length > 0 && (
          <Card className="col-span-12 lg:col-span-8">
            <CardHeader>
              <CardTitle>Portfolio Value Over Time</CardTitle>
              <p className="text-xs text-muted-foreground">12-month portfolio value vs. invested capital</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={performance} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(245 80% 65%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(245 80% 65%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 13%)" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1e6).toFixed(0)}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="hsl(245 80% 65%)" strokeWidth={2} fill="url(#valueGrad)" />
                  <Area type="monotone" dataKey="invested" stroke="#34d399" strokeWidth={2} fill="url(#investedGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Stage breakdown */}
        {stats && (
          <Card className="col-span-12 lg:col-span-4">
            <CardHeader>
              <CardTitle>Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Active", count: stats.active_count, color: "bg-emerald-400" },
                { label: "Exited", count: stats.exited_count, color: "bg-primary" },
                { label: "Written Off", count: (companiesData?.total ?? 0) - stats.active_count - stats.exited_count, color: "bg-destructive" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${item.color}`} />
                  <span className="text-xs flex-1">{item.label}</span>
                  <span className="text-xs font-bold">{item.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Companies table */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Companies</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {["Company", "Sector", "Status", "Invested", "Current Value", "Ownership", "MOIC", "Invested Date"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companiesLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-3 bg-muted/30 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : companies.map((co) => {
                    const cfg = statusConfig[co.status];
                    return (
                      <tr key={co.id} className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-[10px] font-bold">
                              {co.name[0]}
                            </div>
                            <span className="font-medium">{co.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{co.sector}</Badge></td>
                        <td className="px-4 py-3"><Badge variant={cfg.variant} className="text-[10px]">{cfg.label}</Badge></td>
                        <td className="px-4 py-3 font-medium">{formatCurrency(co.amount_invested)}</td>
                        <td className="px-4 py-3 font-medium">{formatCurrency(co.current_valuation)}</td>
                        <td className="px-4 py-3">{co.ownership_pct.toFixed(1)}%</td>
                        <td className="px-4 py-3">
                          <span className={co.moic >= 2 ? "text-emerald-400 font-bold" : co.moic >= 1 ? "text-primary" : "text-destructive"}>
                            {co.moic.toFixed(2)}x
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(co.investment_date)}</td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
