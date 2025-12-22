import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Globe, Monitor, Smartphone, Tablet } from "lucide-react"

export function RealtimePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Realtime</h1>
                <p className="text-muted-foreground">
                    Live visitors on your site right now.
                </p>
            </div>

            {/* Active Users */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Users
                        </CardTitle>
                        <Activity className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-bold text-success">42</div>
                        <p className="text-sm text-muted-foreground mt-2">
                            Users in the last 5 minutes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Page Views (1h)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">1,234</div>
                        <Badge variant="success" className="mt-2">+15% vs prev hour</Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Events (1h)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">856</div>
                        <Badge variant="secondary" className="mt-2">+8% vs prev hour</Badge>
                    </CardContent>
                </Card>
            </div>

            {/* Live Visitors */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Active Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { page: "/", users: 15 },
                                { page: "/products", users: 12 },
                                { page: "/checkout", users: 8 },
                                { page: "/about", users: 4 },
                                { page: "/blog/new-post", users: 3 },
                            ].map((item) => (
                                <div key={item.page} className="flex items-center justify-between">
                                    <span className="font-medium">{item.page}</span>
                                    <Badge variant="outline">{item.users} users</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Devices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Monitor className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Desktop</span>
                                        <span className="text-muted-foreground">62%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-chart-1 rounded-full" style={{ width: "62%" }} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Smartphone className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Mobile</span>
                                        <span className="text-muted-foreground">32%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-chart-2 rounded-full" style={{ width: "32%" }} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Tablet className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Tablet</span>
                                        <span className="text-muted-foreground">6%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-chart-3 rounded-full" style={{ width: "6%" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Map Placeholder */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Geographic Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                    World map visualization will be added here
                </CardContent>
            </Card>
        </div>
    )
}
