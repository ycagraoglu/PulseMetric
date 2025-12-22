import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Activity, MousePointerClick, Clock } from "lucide-react"
import { api, type StatsOverview, type TopPage } from "@/lib/api"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export function DashboardPage() {
    const [overview, setOverview] = useState<StatsOverview | null>(null)
    const [topPages, setTopPages] = useState<TopPage[]>([])
    const [chartData, setChartData] = useState<{ date: string; views: number }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            try {
                const [overviewData, pagesData, chartRaw] = await Promise.all([
                    api.stats.getOverview(),
                    api.stats.getTopPages(),
                    api.stats.getPageViewChart(),
                ])
                setOverview(overviewData)
                setTopPages(pagesData)

                // Chart data formatting
                setChartData(chartRaw.map(p => ({
                    date: new Date(p.timestamp).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
                    views: p.value
                })))
            } catch (error) {
                console.error('Dashboard data load error:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}m ${secs}s`
    }

    const stats = overview ? [
        { title: "Total Users", value: overview.totalUsers.toLocaleString(), icon: Users },
        { title: "Active Now", value: overview.activeNow.toString(), icon: Activity },
        { title: "Page Views", value: overview.totalPageViews.toLocaleString(), icon: MousePointerClick },
        { title: "Avg. Session", value: formatDuration(overview.avgSessionSeconds), icon: Clock },
    ] : []

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
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="pb-2">
                                <Skeleton className="h-4 w-24" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    stats.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Page Views Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        {loading ? (
                            <Skeleton className="h-full w-full" />
                        ) : chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="views"
                                        stroke="hsl(var(--chart-1))"
                                        fillOpacity={1}
                                        fill="url(#colorViews)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                No data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {Array(5).fill(0).map((_, i) => (
                                    <Skeleton key={i} className="h-8 w-full" />
                                ))}
                            </div>
                        ) : topPages.length > 0 ? (
                            <div className="space-y-4">
                                {topPages.map((item) => (
                                    <div key={item.path} className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium">{item.path}</span>
                                                <span className="text-muted-foreground">{item.views}</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all"
                                                    style={{ width: `${item.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-32 flex items-center justify-center text-muted-foreground">
                                No pages tracked yet
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
