import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";

interface ChartDataPoint {
  date: string;
  value: number;
}

interface UserChartProps {
  totalUsersData: ChartDataPoint[];
  dailyActiveData: ChartDataPoint[];
  onDateRangeChange?: (range: { from: Date; to: Date }, preset?: string) => void;
}

export function UserChart({ totalUsersData, dailyActiveData, onDateRangeChange }: UserChartProps) {
  const [metric, setMetric] = useState<"total" | "daily">("total");
  const data = metric === "total" ? totalUsersData : dailyActiveData;

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <Tabs defaultValue="total" onValueChange={(v) => setMetric(v as "total" | "daily")}>
            <TabsList className="bg-muted h-9">
              <TabsTrigger value="total" className="text-xs font-mono uppercase tracking-wider">
                Total Users
              </TabsTrigger>
              <TabsTrigger value="daily" className="text-xs font-mono uppercase tracking-wider">
                Daily Active Users
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DateRangeFilter
            showPresets={true}
            defaultPreset="7d"
            onChange={(range, preset) => onDateRangeChange?.(range, preset)}
          />
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Cumulative {metric === "total" ? "total users" : "daily active users"} over selected period
        </p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
