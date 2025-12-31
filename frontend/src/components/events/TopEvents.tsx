import { Card, CardContent } from "@/components/ui/card";
import { MousePointer } from "lucide-react";

interface TopItem {
  name: string;
  count: number;
  percentage: number;
}

interface TopEventsProps {
  events: TopItem[];
}

export function TopEvents({ events }: TopEventsProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="mb-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
            TOP EVENTS
          </h3>
          <p className="text-sm text-muted-foreground">Most frequently triggered events</p>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MousePointer className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-mono text-foreground">{event.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-foreground">{event.count}</span>
                  <span className="text-sm text-muted-foreground">({event.percentage}%)</span>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${event.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
