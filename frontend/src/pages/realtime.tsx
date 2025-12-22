import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity, Globe, Monitor, Smartphone, Tablet } from "lucide-react"
import { api, type RealtimeStats, type DeviceStats } from "@/lib/api"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))']

export function RealtimePage() {
    const [stats, setStats] = useState<RealtimeStats | null>(null)
    const [devices, setDevices] = useState<DeviceStats[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            try {
                const [realtimeData, deviceData] = await Promise.all([
                    api.stats.getRealtime(),
                    api.stats.getDevices(),
                ])
                setStats(realtimeData)
                setDevices(deviceData)
            } catch (error) {
                console.error('Realtime data load error:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()

        // Auto-refresh every 30 seconds
        const interval = setInterval(loadData, 30000)
        return () => clearInterval(interval)
    }, [])

    const deviceIcon = (device: string) => {
        switch (device.toLowerCase()) {
            case 'mobile': return Smartphone
            case 'tablet': return Tablet
            default: return Monitor
        }
    }

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
                        {loading ? (
                            <Skeleton className="h-12 w-20" />
                        ) : (
                            <>
                                <div className="text-5xl font-bold text-success">{stats?.activeUsers ?? 0}</div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Users in the last 5 minutes
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Page Views (1h)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-10 w-16" />
                        ) : (
                            <div className="text-3xl font-bold">{stats?.pageViewsLastHour?.toLocaleString() ?? 0}</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Events (1h)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-10 w-16" />
                        ) : (
                            <div className="text-3xl font-bold">{stats?.eventsLastHour?.toLocaleString() ?? 0}</div>
                        )}
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
                        {loading ? (
                            <div className="space-y-3">
                                {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                            </div>
                        ) : stats?.activePages && stats.activePages.length > 0 ? (
                            <div className="space-y-3">
                                {stats.activePages.map((item) => (
                                    <div key={item.path} className="flex items-center justify-between">
                                        <span className="font-medium truncate">{item.path}</span>
                                        <Badge variant="outline">{item.users} users</Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-32 flex items-center justify-center text-muted-foreground">
                                No active pages
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Devices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-48 w-full" />
                        ) : devices.length > 0 ? (
                            <div className="flex items-center gap-4">
                                <div className="w-32 h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={devices}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={25}
                                                outerRadius={50}
                                                dataKey="percentage"
                                                nameKey="device"
                                            >
                                                {devices.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1 space-y-3">
                                    {devices.map((d, i) => {
                                        const Icon = deviceIcon(d.device)
                                        return (
                                            <div key={d.device} className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                                />
                                                <Icon className="h-4 w-4 text-muted-foreground" />
                                                <span className="flex-1">{d.device}</span>
                                                <span className="text-muted-foreground">{d.percentage}%</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="h-32 flex items-center justify-center text-muted-foreground">
                                No device data
                            </div>
                        )}
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
                    World map visualization coming soon
                </CardContent>
            </Card>
        </div>
    )
}
