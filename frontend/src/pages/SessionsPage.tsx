import { motion } from 'framer-motion'
import { Clock, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatNumber, formatDuration } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Demo data
const stats = [
    { title: 'Total Sessions', value: 45231, change: 15.2, trend: 'up' },
    { title: 'Avg. Duration', value: '4m 32s', change: 8.5, trend: 'up' },
    { title: 'Bounce Rate', value: '32.4%', change: -5.2, trend: 'down' },
    { title: 'Pages/Session', value: 3.8, change: 12.1, trend: 'up' },
]

const sessionData = [
    { date: 'Mon', sessions: 1200 },
    { date: 'Tue', sessions: 1800 },
    { date: 'Wed', sessions: 1600 },
    { date: 'Thu', sessions: 2200 },
    { date: 'Fri', sessions: 2800 },
    { date: 'Sat', sessions: 2100 },
    { date: 'Sun', sessions: 1900 },
]

const recentSessions = [
    { id: '1', user: 'Mysterious Tiger', duration: 342, pages: 5, country: 'US', time: '2 min ago' },
    { id: '2', user: 'Swift Falcon', duration: 187, pages: 3, country: 'DE', time: '5 min ago' },
    { id: '3', user: 'Gentle Bear', duration: 521, pages: 8, country: 'GB', time: '8 min ago' },
    { id: '4', user: 'Brave Wolf', duration: 98, pages: 2, country: 'FR', time: '12 min ago' },
    { id: '5', user: 'Quick Fox', duration: 445, pages: 6, country: 'JP', time: '15 min ago' },
]

const countryFlags: Record<string, string> = {
    US: '🇺🇸',
    DE: '🇩🇪',
    GB: '🇬🇧',
    FR: '🇫🇷',
    JP: '🇯🇵',
}

export default function SessionsPage() {
    return (
        <div className="flex flex-col gap-6 overflow-y-auto p-6">
            {/* Page Header */}
            <div>
                <h1 className="font-bold text-2xl">Sessions</h1>
                <p className="text-muted-foreground">Analyze user engagement and session metrics</p>
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
                                        <Clock className="h-5 w-5 text-primary" />
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
                                        {Math.abs(stat.change)}%
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
                {/* Sessions Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Sessions Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sessionData}>
                                    <defs>
                                        <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
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
                                    <Area
                                        type="monotone"
                                        dataKey="sessions"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        fill="url(#sessionGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Sessions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Recent Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentSessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                                            {session.user.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{session.user}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>{formatDuration(session.duration)}</span>
                                                <span>•</span>
                                                <span>{session.pages} pages</span>
                                                <span>•</span>
                                                <span>{countryFlags[session.country]}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{session.time}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
