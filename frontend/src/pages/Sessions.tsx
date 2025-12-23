import { ChartDownIcon, ChartUpIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    mockSessions,
    mockSessionsOverview,
    mockSessionsActivityData,
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const chartConfig = {
    sessions: {
        label: "Sessions",
        color: "var(--chart-1)",
    },
    avgDuration: {
        label: "Avg Duration (s)",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

function Sessions() {
    return (
        <div className="flex flex-1 flex-col gap-6">
            <div>
                <h1 className="font-bold font-sans text-2xl">Sessions</h1>
                <p className="font-sans text-muted-foreground text-sm">
                    Track and analyze user sessions in your application
                </p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="py-0">
                    <CardContent className="p-4">
                        <p className="text-muted-foreground text-sm">Total Sessions</p>
                        <p className="mt-1 font-bold text-2xl">{mockSessionsOverview.totalSessions.toLocaleString()}</p>
                        <div className={cn(
                            'mt-2 flex items-center gap-1 text-xs',
                            mockSessionsOverview.totalSessionsChange >= 0 ? 'text-success' : 'text-destructive'
                        )}>
                            <HugeiconsIcon
                                icon={mockSessionsOverview.totalSessionsChange >= 0 ? ChartUpIcon : ChartDownIcon}
                                className="size-3"
                            />
                            <span>{Math.abs(mockSessionsOverview.totalSessionsChange)}%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="py-0">
                    <CardContent className="p-4">
                        <p className="text-muted-foreground text-sm">Avg Duration</p>
                        <p className="mt-1 font-bold text-2xl">
                            {Math.floor(mockSessionsOverview.avgDuration / 60)}m {mockSessionsOverview.avgDuration % 60}s
                        </p>
                        <div className={cn(
                            'mt-2 flex items-center gap-1 text-xs',
                            mockSessionsOverview.avgDurationChange >= 0 ? 'text-success' : 'text-destructive'
                        )}>
                            <HugeiconsIcon
                                icon={mockSessionsOverview.avgDurationChange >= 0 ? ChartUpIcon : ChartDownIcon}
                                className="size-3"
                            />
                            <span>{Math.abs(mockSessionsOverview.avgDurationChange)}%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="py-0">
                    <CardContent className="p-4">
                        <p className="text-muted-foreground text-sm">Bounce Rate</p>
                        <p className="mt-1 font-bold text-2xl">{mockSessionsOverview.bounceRate}%</p>
                        <div className={cn(
                            'mt-2 flex items-center gap-1 text-xs',
                            mockSessionsOverview.bounceRateChange <= 0 ? 'text-success' : 'text-destructive'
                        )}>
                            <HugeiconsIcon
                                icon={mockSessionsOverview.bounceRateChange <= 0 ? ChartUpIcon : ChartDownIcon}
                                className="size-3"
                            />
                            <span>{Math.abs(mockSessionsOverview.bounceRateChange)}%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="py-0">
                    <CardContent className="p-4">
                        <p className="text-muted-foreground text-sm">Avg Events/Session</p>
                        <p className="mt-1 font-bold text-2xl">{mockSessionsOverview.avgEventsPerSession}</p>
                        <div className={cn(
                            'mt-2 flex items-center gap-1 text-xs',
                            mockSessionsOverview.avgEventsChange >= 0 ? 'text-success' : 'text-destructive'
                        )}>
                            <HugeiconsIcon
                                icon={mockSessionsOverview.avgEventsChange >= 0 ? ChartUpIcon : ChartDownIcon}
                                className="size-3"
                            />
                            <span>{Math.abs(mockSessionsOverview.avgEventsChange)}%</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Chart */}
            <Card className="py-0">
                <CardContent className="p-4">
                    <h2 className="mb-4 font-semibold text-muted-foreground text-sm uppercase">
                        Session Activity
                    </h2>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <AreaChart data={mockSessionsActivityData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => format(new Date(value), 'MMM d')}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis tickLine={false} axisLine={false} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area
                                type="monotone"
                                dataKey="sessions"
                                stroke="var(--color-sessions)"
                                fill="var(--color-sessions)"
                                fillOpacity={0.3}
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Sessions Table */}
            <Card className="py-0">
                <CardContent className="space-y-4 p-4">
                    <div>
                        <h2 className="font-semibold text-muted-foreground text-sm uppercase">
                            All Sessions
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Complete list of all sessions
                        </p>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Device ID</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Platform</TableHead>
                                <TableHead>Started At</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Events</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockSessions.map((session) => (
                                <TableRow key={session.id} className="cursor-pointer">
                                    <TableCell className="font-mono text-sm">
                                        {session.deviceId.substring(0, 12)}...
                                    </TableCell>
                                    <TableCell>
                                        <span className={`fi fi-${session.country.toLowerCase()} mr-2`} />
                                        {session.country}
                                    </TableCell>
                                    <TableCell>{session.platform}</TableCell>
                                    <TableCell>
                                        {format(new Date(session.startedAt), 'MMM d, yyyy HH:mm')}
                                    </TableCell>
                                    <TableCell>
                                        {Math.floor(session.duration / 60)}m {session.duration % 60}s
                                    </TableCell>
                                    <TableCell>{session.eventCount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default Sessions;
