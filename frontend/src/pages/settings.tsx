import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, RefreshCw } from "lucide-react"

export function SettingsPage() {
    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your analytics configuration.
                </p>
            </div>

            {/* API Key */}
            <Card>
                <CardHeader>
                    <CardTitle>API Configuration</CardTitle>
                    <CardDescription>
                        Your tracking script configuration
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Client ID</label>
                        <div className="flex gap-2 mt-2">
                            <Input value="DEMO_TENANT" readOnly className="font-mono" />
                            <Button variant="outline" size="icon">
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Tracking Script</label>
                        <div className="mt-2 p-4 bg-muted rounded-lg font-mono text-sm">
                            <code className="text-muted-foreground">
                                {`<script src="https://api.pulsemetric.com/pulse.min.js" data-client-id="DEMO_TENANT"></script>`}
                            </code>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Script
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Domain Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Allowed Domains</CardTitle>
                    <CardDescription>
                        Domains authorized to send analytics data
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input placeholder="example.com" />
                        <Button>Add Domain</Button>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        {["localhost", "example.com", "*.example.com"].map((domain) => (
                            <div key={domain} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <span className="font-mono text-sm">{domain}</span>
                                <Badge variant="outline">Active</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* API Key Rotation */}
            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>
                        Manage API keys and access
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Rotate API Key
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                        Warning: Rotating your API key will invalidate the current key.
                    </p>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                        Irreversible actions
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="destructive">
                        Delete All Analytics Data
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
