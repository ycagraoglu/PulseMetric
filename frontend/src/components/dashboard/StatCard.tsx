import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: string;
    isPositive: boolean;
    suffix?: string;
  };
  indicator?: {
    type: "online" | "offline";
    label: string;
  };
}

export function StatCard({ label, value, change, indicator }: StatCardProps) {
  return (
    <Card className="bg-card border-border transition-theme hover:border-primary/30">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="stat-label">{label}</span>
          {indicator && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  indicator.type === "online"
                    ? "bg-primary animate-pulse-dot"
                    : "bg-muted-foreground"
                )}
              />
            </div>
          )}
        </div>
        <div className="stat-value text-foreground mb-2">{value}</div>
        {change && (
          <div className="flex items-center gap-1.5 text-sm">
            <TrendingUp
              className={cn(
                "w-4 h-4",
                change.isPositive ? "text-primary" : "text-destructive"
              )}
            />
            <span className={cn(
              "font-medium",
              change.isPositive ? "text-primary" : "text-destructive"
            )}>
              {change.value}
            </span>
            {change.suffix && (
              <span className="text-muted-foreground">{change.suffix}</span>
            )}
          </div>
        )}
        {indicator && (
          <p className="text-sm text-muted-foreground">{indicator.label}</p>
        )}
      </CardContent>
    </Card>
  );
}
