"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { month: "Jul", signals: 28, deals: 5, relationships: 180 },
  { month: "Aug", signals: 35, deals: 7, relationships: 210 },
  { month: "Sep", signals: 42, deals: 9, relationships: 245 },
  { month: "Oct", signals: 38, deals: 6, relationships: 280 },
  { month: "Nov", signals: 55, deals: 12, relationships: 310 },
  { month: "Dec", signals: 63, deals: 14, relationships: 360 },
  { month: "Jan", signals: 71, deals: 18, relationships: 420 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground capitalize">{p.dataKey}:</span>
          <span className="font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export function IntelligenceMetricsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Intelligence Activity</CardTitle>
        <p className="text-xs text-muted-foreground">
          Signals, deals, and relationship growth over time
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="signalsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(245 80% 65%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(245 80% 65%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dealsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="relsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 13%)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="signals"
              stroke="hsl(245 80% 65%)"
              strokeWidth={2}
              fill="url(#signalsGrad)"
            />
            <Area
              type="monotone"
              dataKey="deals"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#dealsGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
