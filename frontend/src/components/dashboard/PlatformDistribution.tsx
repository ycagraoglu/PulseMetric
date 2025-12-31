import { Smartphone, Tablet, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlatformData {
  name: string;
  icon: "ios" | "android" | "web";
  count: number;
  percentage: number;
}

interface PlatformDistributionProps {
  data: PlatformData[];
}

export function PlatformDistribution({ data }: PlatformDistributionProps) {
  const getIcon = (icon: PlatformData["icon"]) => {
    switch (icon) {
      case "ios":
        return <Smartphone className="w-4 h-4 text-muted-foreground" />;
      case "android":
        return <Tablet className="w-4 h-4 text-muted-foreground" />;
      case "web":
        return <Globe className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <Tabs defaultValue="distribution" className="mb-4">
          <TabsList className="bg-muted h-9">
            <TabsTrigger value="distribution" className="text-xs font-mono uppercase tracking-wider">
              Platform Distribution
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <p className="text-sm text-muted-foreground mb-6">
          User distribution across platforms
        </p>

        <div className="space-y-5">
          {data.map((platform) => (
            <div key={platform.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(platform.icon)}
                  <span className="text-sm font-medium text-foreground">{platform.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-foreground">{platform.count}</span>
                  <span className="text-sm text-muted-foreground">({platform.percentage}%)</span>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${platform.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
