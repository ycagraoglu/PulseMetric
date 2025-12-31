import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";

const apiKeys = [
  { id: 1, name: "Production", key: "pk_live_***********************1234", created: "Dec 15, 2024", lastUsed: "2 hours ago" },
  { id: 2, name: "Development", key: "pk_test_***********************5678", created: "Dec 10, 2024", lastUsed: "1 day ago" },
];

const ApiKeys = () => {
  const [visibleKeys, setVisibleKeys] = useState<number[]>([]);

  const toggleKeyVisibility = (id: number) => {
    setVisibleKeys((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
    );
  };

  return (
    <DashboardLayout
      title="API Keys"
      description="Manage your API keys for SDK integration"
    >
      <Card className="bg-card border-border mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Your API Keys</CardTitle>
            <CardDescription>Use these keys to integrate the SDK into your app</CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Key
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium text-foreground">{apiKey.name}</p>
                    <Badge variant={apiKey.name === "Production" ? "default" : "secondary"}>
                      {apiKey.name === "Production" ? "Live" : "Test"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                      {visibleKeys.includes(apiKey.id)
                        ? apiKey.key.replace("***********************", "abcd1234efgh5678ijkl")
                        : apiKey.key}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {visibleKeys.includes(apiKey.id) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Created: {apiKey.created}</span>
                    <span>Last used: {apiKey.lastUsed}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Quick Start</CardTitle>
          <CardDescription>Install the SDK and start tracking events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4">
            <code className="text-sm font-mono text-foreground">
              npm install @phase/analytics
            </code>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ApiKeys;
