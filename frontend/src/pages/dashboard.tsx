import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Activity, MousePointerClick, Clock } from "lucide-react"

const stats = [
    {
        title: "Total Users",
        value: "12,543",
        change: "+12.5%",
        icon: Users,
        trend: "up" as const,
    },
    {
        title: "Active Now",
        value: "342",
        change: "+5.2%",
        icon: Activity,
        trend: "up" as const,
    },
    {
        title: "Page Views",
        value: "89,432",
        change: "+18.7%",
        icon: MousePointerClick,
        trend: "up" as const,
    },
    {
        title: "Avg. Session",
        value: "4m 32s",
        change: "+2.3%",
        icon: Clock,
        trend: "up" as const,
    },
]

export function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here's an overview of your analytics.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <Badge
                                variant={stat.trend === "up" ? "success" : "destructive"}
                                className="mt-2"
                            >
                                {stat.change}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Page Views Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center text-muted-foreground">
                        Chart will be integrated here
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { page: "/", views: "12,543", percentage: 100 },
                                { page: "/products", views: "8,234", percentage: 65 },
                                { page: "/about", views: "4,521", percentage: 36 },
                                { page: "/contact", views: "2,345", percentage: 19 },
                                { page: "/blog", views: "1,892", percentage: 15 },
                            ].map((item) => (
                                <div key={item.page} className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium">{item.page}</span>
                                            <span className="text-muted-foreground">{item.views}</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { event: "page_view", page: "/products", time: "2 min ago", visitor: "v_abc123" },
                            { event: "button_click", page: "/checkout", time: "5 min ago", visitor: "v_def456" },
                            { event: "page_view", page: "/about", time: "8 min ago", visitor: "v_ghi789" },
                            { event: "scroll_depth", page: "/blog/post-1", time: "12 min ago", visitor: "v_jkl012" },
                        ].map((activity, i) => (
                            <div key={i} className="flex items-center gap-4 text-sm">
                                <Badge variant="secondary">{activity.event}</Badge>
                                <span className="flex-1 font-medium">{activity.page}</span>
                                <span className="text-muted-foreground">{activity.visitor}</span>
                                <span className="text-muted-foreground">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
