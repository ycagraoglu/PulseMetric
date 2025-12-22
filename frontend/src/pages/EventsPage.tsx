import { motion } from 'framer-motion'
import { MousePointerClick, TrendingUp, TrendingDown, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatNumber } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Demo data
const stats = [
    { title: 'Total Events', value: 234521, change: 22.4, trend: 'up' },
    { title: 'Unique Events', value: 156, change: 5.2, trend: 'up' },
    { title: 'Events/User', value: 18.2, change: 8.7, trend: 'up' },
    { title: 'Screen Views', value: 89432, change: 12.1, trend: 'up' },
]

const topEvents = [
    { name: 'page_view', count: 89432, type: 'screen' },
    { name: 'button_click', count: 45231, type: 'action' },
    { name: 'purchase', count: 12847, type: 'action' },
    { name: 'sign_up', count: 8923, type: 'action' },
    { name: 'add_to_cart', count: 23456, type: 'action' },
]

const eventTrend = [
    { hour: '00:00', events: 1200 },
    { hour: '04:00', events: 800 },
    { hour: '08:00', events: 3200 },
    { hour: '12:00', events: 4500 },
    { hour: '16:00', events: 5200 },
    { hour: '20:00', events: 3800 },
]

const recentEvents = [
    { id: '1', name: 'purchase', user: 'Mysterious Tiger', time: '1 min ago', params: { amount: 99.99 } },
    { id: '2', name: 'page_view', user: 'Swift Falcon', time: '2 min ago', params: { page: '/products' } },
    { id: '3', name: 'button_click', user: 'Gentle Bear', time: '3 min ago', params: { button: 'cta' } },
    { id: '4', name: 'sign_up', user: 'Brave Wolf', time: '5 min ago', params: { method: 'email' } },
    { id: '5', name: 'add_to_cart', user: 'Quick Fox', time: '6 min ago', params: { product_id: 'ABC123' } },
]

export default function EventsPage() {
    return (
        <div className="flex flex-col gap-6 overflow-y-auto p-6">
            {/* Page Header */}
            <div>
                <h1 className="font-bold text-2xl">Events</h1>
                <p className="text-muted-foreground">Track custom events and user actions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <MousePointerClick className="h-5 w-5 text-primary" />
                                    </div>
                                    <div
                                        className={cn(
                                            'flex items-center gap-1 text-xs font-medium',
                                            stat.trend === 'up' ? 'text-green-600' : 'text-red-500'
                                        )}
                                    >
                                        {stat.trend === 'up' ? (
                                            <TrendingUp className="h-3.5 w-3.5" />
                                        ) : (
                                            <TrendingDown className="h-3.5 w-3.5" />
                                        )}
                                        {stat.change}%
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                                    <p className="font-mono font-bold text-3xl">
                                        {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Event Trend Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Events by Hour</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={eventTrend}>
                                    <XAxis
                                        dataKey="hour"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--popover))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Bar dataKey="events" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Events */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Top Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topEvents.map((event, i) => (
                                <div
                                    key={event.name}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm font-mono">{event.name}</p>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                {event.type === 'screen' ? (
                                                    <Eye className="h-3 w-3" />
                                                ) : (
                                                    <MousePointerClick className="h-3 w-3" />
                                                )}
                                                <span>{event.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="font-mono text-sm">{formatNumber(event.count)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Events */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recentEvents.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                        <MousePointerClick className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm font-mono">{event.name}</p>
                                        <p className="text-xs text-muted-foreground">by {event.user}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">{event.time}</p>
                                    <p className="font-mono text-xs text-muted-foreground">
                                        {JSON.stringify(event.params)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
