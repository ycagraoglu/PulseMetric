import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface TopScreen {
  path: string;
  count: number;
  percentage: number;
}

interface TopScreensProps {
  screens: TopScreen[];
}

export function TopScreens({ screens }: TopScreensProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="mb-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
            TOP SCREENS
          </h3>
          <p className="text-sm text-muted-foreground">Most frequently viewed screens</p>
        </div>

        <div className="space-y-4">
          {screens.map((screen) => (
            <div key={screen.path} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-mono text-foreground">{screen.path}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-foreground">{screen.count}</span>
                  <span className="text-sm text-muted-foreground">({screen.percentage}%)</span>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${screen.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
