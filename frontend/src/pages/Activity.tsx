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
import { Progress } from '@/components/ui/progress';
import {
    mockEvents,
    mockEventsOverview,
    mockEventsActivityData,
    mockTopEvents,
    mockTopScreens,
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const chartConfig = {
    events: {
        label: "Events",
        color: "var(--chart-1)",
    },
    screenViews: {
        label: "Screen Views",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

function Activity() {
    return (
        <div className="flex flex-1 flex-col gap-6">
            <div>
                <h1 className="font-bold font-sans text-2xl">Events</h1>
                <p className="font-sans text-muted-foreground text-sm">
                    Track and analyze events in your application
                </p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="py-0">
                    <CardContent className="p-4">
                        <p className="text-muted-foreground text-sm">Total Events</p>
                        <p className="mt-1 font-bold text-2xl">{mockEventsOverview.totalEvents.toLocaleString()}</p>
                        <div className={cn(
                            'mt-2 flex items-center gap-1 text-xs',
                            mockEventsOverview.totalEventsChange >= 0 ? 'text-success' : 'text-destructive'
                        )}>
                            <HugeiconsIcon
                                icon={mockEventsOverview.totalEventsChange >= 0 ? ChartUpIcon : ChartDownIcon}
                                className="size-3"
                            />
                            <span>{Math.abs(mockEventsOverview.totalEventsChange)}%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="py-0">
                    <CardContent className="p-4">
                        <p className="text-muted-foreground text-sm">Unique Events</p>
                        <p className="mt-1 font-bold text-2xl">{mockEventsOverview.uniqueEvents}</p>
                        <div className={cn(
                            'mt-2 flex items-center gap-1 text-xs',
                            mockEventsOverview.uniqueEventsChange >= 0 ? 'text-success' : 'text-destructive'
                        )}>
                            <HugeiconsIcon
                                icon={mockEventsOverview.uniqueEventsChange >= 0 ? ChartUpIcon : ChartDownIcon}
                                className="size-3"
                            />
                            <span>{Math.abs(mockEventsOverview.uniqueEventsChange)}%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="py-0">
                    <CardContent className="p-4">
                        <p className="text-muted-foreground text-sm">Screen Views</p>
                        <p className="mt-1 font-bold text-2xl">{mockEventsOverview.screenViews.toLocaleString()}</p>
                        <div className={cn(
                            'mt-2 flex items-center gap-1 text-xs',
                            mockEventsOverview.screenViewsChange >= 0 ? 'text-success' : 'text-destructive'
                        )}>
                            <HugeiconsIcon
                                icon={mockEventsOverview.screenViewsChange >= 0 ? ChartUpIcon : ChartDownIcon}
                                className="size-3"
                            />
                            <span>{Math.abs(mockEventsOverview.screenViewsChange)}%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="py-0">
                    <CardContent className="p-4">
                        <p className="text-muted-foreground text-sm">Custom Events</p>
                        <p className="mt-1 font-bold text-2xl">{mockEventsOverview.customEvents.toLocaleString()}</p>
                        <div className={cn(
                            'mt-2 flex items-center gap-1 text-xs',
                            mockEventsOverview.customEventsChange >= 0 ? 'text-success' : 'text-destructive'
                        )}>
                            <HugeiconsIcon
                                icon={mockEventsOverview.customEventsChange >= 0 ? ChartUpIcon : ChartDownIcon}
                                className="size-3"
                            />
                            <span>{Math.abs(mockEventsOverview.customEventsChange)}%</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Chart */}
            <Card className="py-0">
                <CardContent className="p-4">
                    <h2 className="mb-4 font-semibold text-muted-foreground text-sm uppercase">
                        Event Activity
                    </h2>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <AreaChart data={mockEventsActivityData}>
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
                                dataKey="events"
                                stroke="var(--color-events)"
                                fill="var(--color-events)"
                                fillOpacity={0.3}
                            />
                            <Area
                                type="monotone"
                                dataKey="screenViews"
                                stroke="var(--color-screenViews)"
                                fill="var(--color-screenViews)"
                                fillOpacity={0.3}
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Top Events & Screens */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="py-0">
                    <CardContent className="p-4">
                        <h2 className="mb-4 font-semibold text-muted-foreground text-sm uppercase">
                            Top Events
                        </h2>
                        <div className="space-y-4">
                            {mockTopEvents.map((event) => (
                                <div key={event.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{event.name}</span>
                                        <span className="text-muted-foreground text-sm">{event.count.toLocaleString()}</span>
                                    </div>
                                    <Progress value={event.percentage} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="py-0">
                    <CardContent className="p-4">
                        <h2 className="mb-4 font-semibold text-muted-foreground text-sm uppercase">
                            Top Screens
                        </h2>
                        <div className="space-y-4">
                            {mockTopScreens.map((screen) => (
                                <div key={screen.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{screen.name}</span>
                                        <span className="text-muted-foreground text-sm">{screen.views.toLocaleString()}</span>
                                    </div>
                                    <Progress value={screen.percentage} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Events Table */}
            <Card className="py-0">
                <CardContent className="space-y-4 p-4">
                    <div>
                        <h2 className="font-semibold text-muted-foreground text-sm uppercase">
                            All Events
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Complete list of all events
                        </p>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Name</TableHead>
                                <TableHead>Device ID</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Platform</TableHead>
                                <TableHead>Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockEvents.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.name}</TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {event.deviceId.substring(0, 12)}...
                                    </TableCell>
                                    <TableCell>
                                        <span className={`fi fi-${event.country.toLowerCase()} mr-2`} />
                                        {event.country}
                                    </TableCell>
                                    <TableCell>{event.platform}</TableCell>
                                    <TableCell>
                                        {format(new Date(event.timestamp), 'MMM d, yyyy HH:mm:ss')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default Activity;
