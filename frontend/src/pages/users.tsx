import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AndroidIcon,
    AppleIcon,
    Calendar03Icon,
    ChartDownIcon,
    ChartUpIcon,
    ComputerPhoneSyncIcon,
    Search01Icon,
    ViewIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import 'flag-icons/css/flag-icons.min.css';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Mock data matching the screenshot
const mockOverview = {
    totalDevices: 2,
    totalDevicesChange24h: 200,
    activeDevices24h: 2,
    activeDevicesChange24h: 200,
    onlineNow: 0,
    platformStats: {
        ios: 2,
        android: 0,
    },
    countryStats: {
        TR: 2,
    },
    cityStats: {
        'Istanbul': { count: 2, country: 'TR' },
    },
};

// Mock chart data for 7 days
const mockChartData = [
    { date: 'Dec 17', totalUsers: 0, dailyActive: 0 },
    { date: 'Dec 18', totalUsers: 0, dailyActive: 0 },
    { date: 'Dec 19', totalUsers: 1, dailyActive: 1 },
    { date: 'Dec 20', totalUsers: 1, dailyActive: 0 },
    { date: 'Dec 21', totalUsers: 1, dailyActive: 1 },
    { date: 'Dec 22', totalUsers: 2, dailyActive: 2 },
    { date: 'Dec 23', totalUsers: 2, dailyActive: 1 },
];

function getChangeColor(change: number) {
    if (change === 0) return 'text-muted-foreground';
    return change > 0 ? 'text-success' : 'text-destructive';
}

function getCountryLabel(countryCode: string) {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode) || countryCode;
}

// Users Overview Cards Component
function UsersOverviewCards() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Total Users */}
            <Card className="py-0">
                <CardContent className="p-4">
                    <p className="text-muted-foreground text-xs uppercase">Total Users</p>
                    <p className="font-bold text-3xl">{mockOverview.totalDevices}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs">
                        {mockOverview.totalDevicesChange24h !== 0 && (
                            <HugeiconsIcon
                                className={cn('size-3', getChangeColor(mockOverview.totalDevicesChange24h))}
                                icon={mockOverview.totalDevicesChange24h > 0 ? ChartUpIcon : ChartDownIcon}
                            />
                        )}
                        <span className={cn('font-medium', getChangeColor(mockOverview.totalDevicesChange24h))}>
                            {Math.abs(mockOverview.totalDevicesChange24h)}%
                        </span>
                        <span className="text-muted-foreground">from yesterday</span>
                    </div>
                </CardContent>
            </Card>

            {/* Daily Active Users */}
            <Card className="py-0">
                <CardContent className="p-4">
                    <p className="text-muted-foreground text-xs uppercase">Daily Active Users</p>
                    <p className="font-bold text-3xl">{mockOverview.activeDevices24h}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs">
                        {mockOverview.activeDevicesChange24h !== 0 && (
                            <HugeiconsIcon
                                className={cn('size-3', getChangeColor(mockOverview.activeDevicesChange24h))}
                                icon={mockOverview.activeDevicesChange24h > 0 ? ChartUpIcon : ChartDownIcon}
                            />
                        )}
                        <span className={cn('font-medium', getChangeColor(mockOverview.activeDevicesChange24h))}>
                            {Math.abs(mockOverview.activeDevicesChange24h)}%
                        </span>
                        <span className="text-muted-foreground">from yesterday</span>
                    </div>
                </CardContent>
            </Card>

            {/* Online Users */}
            <Card className="py-0">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                        <p className="text-muted-foreground text-xs uppercase">Online Users</p>
                        <div className="relative flex size-2">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success" />
                            <span className="relative inline-flex size-2 rounded-full bg-success" />
                        </div>
                    </div>
                    <p className="font-bold text-3xl">{mockOverview.onlineNow}</p>
                    <p className="mt-1 text-muted-foreground text-xs">Users currently online</p>
                </CardContent>
            </Card>
        </div>
    );
}

// Platform Distribution Component
function UsersPlatformDistribution() {
    const totalDevices = mockOverview.totalDevices || 1;
    const platforms = [
        { key: 'ios', label: 'iOS', icon: AppleIcon, count: mockOverview.platformStats.ios },
        { key: 'android', label: 'Android', icon: AndroidIcon, count: mockOverview.platformStats.android },
    ].sort((a, b) => b.count - a.count);

    return (
        <Card className="py-0">
            <CardContent className="space-y-4 p-4">
                {/* Tab Header */}
                <div className="flex">
                    <div className="inline-flex h-8 items-center justify-center rounded-md bg-muted p-1">
                        <div className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium bg-background text-foreground shadow-sm">
                            PLATFORM DISTRIBUTION
                        </div>
                    </div>
                </div>

                <p className="text-muted-foreground text-sm">User distribution across platforms</p>

                <div className="space-y-3">
                    {platforms.map((platform) => {
                        const percentage = (platform.count / totalDevices) * 100;
                        return (
                            <div className="space-y-1.5" key={platform.key}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <HugeiconsIcon className="size-4 text-muted-foreground" icon={platform.icon} />
                                        <span className="font-medium text-sm">{platform.label}</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-semibold text-sm">{platform.count}</span>
                                        <span className="text-muted-foreground text-xs">({percentage.toFixed(1)}%)</span>
                                    </div>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                    <div className="h-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

// Top Countries Component
function UsersTopCountries() {
    const [activeTab, setActiveTab] = useState<'country' | 'city'>('country');
    const totalDevices = mockOverview.totalDevices || 1;

    const sortedCountries = Object.entries(mockOverview.countryStats).sort(([, a], [, b]) => b - a);
    const sortedCities = Object.entries(mockOverview.cityStats).sort(([, a], [, b]) => b.count - a.count);

    return (
        <Card className="py-0">
            <CardContent className="space-y-4 p-4">
                {/* Tab Headers */}
                <div className="flex">
                    <div className="inline-flex h-8 items-center justify-center rounded-md bg-muted p-1">
                        <button
                            className={cn(
                                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium transition-all",
                                activeTab === 'country' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                            )}
                            onClick={() => setActiveTab('country')}
                        >
                            COUNTRIES
                        </button>
                        <button
                            className={cn(
                                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium transition-all",
                                activeTab === 'city' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                            )}
                            onClick={() => setActiveTab('city')}
                        >
                            CITIES
                        </button>
                    </div>
                </div>

                <p className="text-muted-foreground text-sm">
                    {activeTab === 'country' ? 'User distribution by country' : 'User distribution by city'}
                </p>

                <ScrollArea className="h-[220px]">
                    <div className="space-y-2 pr-4">
                        {activeTab === 'country' && sortedCountries.map(([country, count]) => {
                            const percentage = (count / totalDevices) * 100;
                            return (
                                <div className="space-y-1.5" key={country}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`fi fi-${country.toLowerCase()} rounded-xs text-[14px]`} />
                                            <span className="font-medium text-sm">{getCountryLabel(country)}</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-semibold text-sm">{count}</span>
                                            <span className="text-muted-foreground text-xs">({percentage.toFixed(1)}%)</span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                        <div className="h-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
                                    </div>
                                </div>
                            );
                        })}

                        {activeTab === 'city' && sortedCities.map(([city, data]) => {
                            const percentage = (data.count / totalDevices) * 100;
                            return (
                                <div className="space-y-1.5" key={city}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`fi fi-${data.country.toLowerCase()} rounded-xs text-[14px]`} />
                                            <span className="font-medium text-sm">{city}</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-semibold text-sm">{data.count}</span>
                                            <span className="text-muted-foreground text-xs">({percentage.toFixed(1)}%)</span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                        <div className="h-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

// Users Activity Chart Component
function UsersActivityChart() {
    const [activeTab, setActiveTab] = useState<'total' | 'daily'>('total');
    const [dateRange, setDateRange] = useState<'7d' | '14d' | '30d'>('7d');
    const [showDateDropdown, setShowDateDropdown] = useState(false);

    const dataKey = activeTab === 'total' ? 'totalUsers' : 'dailyActive';

    // Generate mock chart data based on date range
    const generateChartData = (days: number) => {
        const data = [];
        const baseDate = new Date(2025, 11, 23); // Dec 23, 2025
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(baseDate.getTime() - i * 24 * 60 * 60 * 1000);
            const day = date.getDate();
            const month = date.toLocaleString('en', { month: 'short' });
            data.push({
                date: `${month} ${day}`,
                totalUsers: Math.floor(50 + (days - i) * 5 + Math.random() * 20),
                dailyActive: Math.floor(20 + Math.random() * 30),
            });
        }
        return data;
    };

    const daysCount = dateRange === '7d' ? 7 : dateRange === '14d' ? 14 : 30;
    const chartData = generateChartData(daysCount);
    const dateLabel = dateRange === '7d' ? '7 Days' : dateRange === '14d' ? '14 Days' : '30 Days';

    return (
        <Card className="py-0">
            <CardContent className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    {/* Tab Headers */}
                    <div className="inline-flex h-8 items-center justify-center rounded-md bg-muted p-1">
                        <button
                            className={cn(
                                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium transition-all",
                                activeTab === 'total' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                            )}
                            onClick={() => setActiveTab('total')}
                        >
                            TOTAL USERS
                        </button>
                        <button
                            className={cn(
                                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium transition-all",
                                activeTab === 'daily' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                            )}
                            onClick={() => setActiveTab('daily')}
                        >
                            DAILY ACTIVE USERS
                        </button>
                    </div>

                    {/* Date Range Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDateDropdown(!showDateDropdown)}
                            className="inline-flex h-8 items-center gap-2 rounded-md border px-3 cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                            <HugeiconsIcon icon={Calendar03Icon} className="size-4 text-muted-foreground" />
                            <span className="text-sm">{dateLabel}</span>
                        </button>
                        {showDateDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowDateDropdown(false)} />
                                <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded-md border bg-popover shadow-md">
                                    <button
                                        onClick={() => { setDateRange('7d'); setShowDateDropdown(false); }}
                                        className={cn("flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted", dateRange === '7d' && "bg-muted")}
                                    >
                                        7 Days
                                    </button>
                                    <button
                                        onClick={() => { setDateRange('14d'); setShowDateDropdown(false); }}
                                        className={cn("flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted", dateRange === '14d' && "bg-muted")}
                                    >
                                        14 Days
                                    </button>
                                    <button
                                        onClick={() => { setDateRange('30d'); setShowDateDropdown(false); }}
                                        className={cn("flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted", dateRange === '30d' && "bg-muted")}
                                    >
                                        30 Days
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-muted-foreground text-sm">
                    {activeTab === 'total' ? 'Cumulative total users over selected period' : 'Daily active users over selected period'}
                </p>

                {/* Recharts Area Chart */}
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'monospace' }}
                                tickMargin={8}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#71717a', fontSize: 12 }}
                                allowDecimals={false}
                                hide
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl">
                                                <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                                                    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                        <line x1="16" y1="2" x2="16" y2="6" />
                                                        <line x1="8" y1="2" x2="8" y2="6" />
                                                        <line x1="3" y1="10" x2="21" y2="10" />
                                                    </svg>
                                                    <span>{label}</span>
                                                </div>
                                                <div className="mt-1">
                                                    <div className="font-semibold text-lg text-white tabular-nums">
                                                        {payload[0].value}
                                                    </div>
                                                    <div className="text-zinc-500 text-xs">
                                                        {activeTab === 'total' ? 'Total Users' : 'Daily Active Users'}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                                cursor={{
                                    stroke: '#3f3f46',
                                    strokeWidth: 1,
                                    strokeDasharray: '4 2',
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey={dataKey}
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorUsers)"
                                activeDot={{
                                    r: 5,
                                    stroke: '#8b5cf6',
                                    strokeWidth: 2,
                                    fill: '#18181b',
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

// Generate name from device ID (like phase-template)
function getGeneratedName(deviceId: string) {
    const adjectives = ['Antique', 'Emotional', 'Brave', 'Calm', 'Eager', 'Fancy', 'Gentle', 'Happy', 'Jolly', 'Kind'];
    const nouns = ['Alex', 'Tyrese', 'Jordan', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Blake', 'Cameron'];
    const hash = deviceId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return `${adjectives[hash % adjectives.length]} ${nouns[(hash * 7) % nouns.length]}`;
}

// User Avatar with gradient
function UserAvatar({ seed, size = 20 }: { seed: string; size?: number }) {
    const colors = [
        'from-pink-500 to-purple-500',
        'from-blue-500 to-cyan-500',
        'from-green-500 to-emerald-500',
        'from-orange-500 to-red-500',
        'from-violet-500 to-purple-500',
    ];
    const hash = seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const color = colors[hash % colors.length];

    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${color}`}
            style={{ width: size, height: size }}
        />
    );
}

// Users Table Component with search, filters, pagination
function UsersTable() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [platformFilter, setPlatformFilter] = useState<'all' | 'ios' | 'android'>('all');
    const [dateRangeFilter, setDateRangeFilter] = useState<'all' | '7d' | '14d' | '30d'>('all');
    const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [showRowsDropdown, setShowRowsDropdown] = useState(false);

    // Helper to parse date string "DD/MM/YYYY HH:MM AM/PM" to Date object
    const parseDate = (dateStr: string) => {
        const [datePart] = dateStr.split(' ');
        const [day, month, year] = datePart.split('/').map(Number);
        return new Date(year, month - 1, day);
    };

    // 30 mock users for testing pagination
    const mockUsers = [
        { id: '1', deviceId: 'iPhone-X1234-ABCD-5678', platform: 'ios', country: 'TR', firstSeen: '23/12/2025 11:23 AM' },
        { id: '2', deviceId: 'iPhone-Y5678-EFGH-9012', platform: 'ios', country: 'TR', firstSeen: '22/12/2025 02:31 AM' },
        { id: '3', deviceId: 'Samsung-A1234-IJKL-3456', platform: 'android', country: 'US', firstSeen: '21/12/2025 09:15 PM' },
        { id: '4', deviceId: 'iPhone-Z9012-MNOP-7890', platform: 'ios', country: 'DE', firstSeen: '20/12/2025 06:45 PM' },
        { id: '5', deviceId: 'Pixel-B3456-QRST-1234', platform: 'android', country: 'GB', firstSeen: '19/12/2025 03:20 PM' },
        { id: '6', deviceId: 'iPhone-W7890-UVWX-5678', platform: 'ios', country: 'FR', firstSeen: '18/12/2025 11:10 AM' },
        { id: '7', deviceId: 'OnePlus-C5678-YZAB-9012', platform: 'android', country: 'IN', firstSeen: '17/12/2025 08:30 AM' },
        { id: '8', deviceId: 'iPhone-V3456-CDEF-3456', platform: 'ios', country: 'JP', firstSeen: '16/12/2025 05:15 AM' },
        { id: '9', deviceId: 'Xiaomi-D7890-GHIJ-7890', platform: 'android', country: 'CN', firstSeen: '15/12/2025 10:40 PM' },
        { id: '10', deviceId: 'iPhone-U1234-KLMN-1234', platform: 'ios', country: 'BR', firstSeen: '14/12/2025 07:25 PM' },
        { id: '11', deviceId: 'Samsung-E5678-OPQR-5678', platform: 'android', country: 'ES', firstSeen: '13/12/2025 04:50 PM' },
        { id: '12', deviceId: 'iPhone-T9012-STUV-9012', platform: 'ios', country: 'IT', firstSeen: '12/12/2025 01:35 PM' },
        { id: '13', deviceId: 'Pixel-F3456-WXYZ-3456', platform: 'android', country: 'AU', firstSeen: '11/12/2025 10:20 AM' },
        { id: '14', deviceId: 'iPhone-S7890-ABCD-7890', platform: 'ios', country: 'CA', firstSeen: '10/12/2025 07:05 AM' },
        { id: '15', deviceId: 'OnePlus-G1234-EFGH-1234', platform: 'android', country: 'MX', firstSeen: '09/12/2025 03:55 AM' },
        { id: '16', deviceId: 'iPhone-R5678-IJKL-5678', platform: 'ios', country: 'TR', firstSeen: '08/12/2025 12:40 AM' },
        { id: '17', deviceId: 'Xiaomi-H9012-MNOP-9012', platform: 'android', country: 'KR', firstSeen: '07/12/2025 09:25 PM' },
        { id: '18', deviceId: 'iPhone-Q3456-QRST-3456', platform: 'ios', country: 'NL', firstSeen: '06/12/2025 06:15 PM' },
        { id: '19', deviceId: 'Samsung-I7890-UVWX-7890', platform: 'android', country: 'SE', firstSeen: '05/12/2025 03:00 PM' },
        { id: '20', deviceId: 'iPhone-P1234-YZAB-1234', platform: 'ios', country: 'PL', firstSeen: '04/12/2025 11:45 AM' },
        { id: '21', deviceId: 'Pixel-J5678-CDEF-5678', platform: 'android', country: 'AR', firstSeen: '03/12/2025 08:30 AM' },
        { id: '22', deviceId: 'iPhone-O9012-GHIJ-9012', platform: 'ios', country: 'CH', firstSeen: '02/12/2025 05:20 AM' },
        { id: '23', deviceId: 'OnePlus-K3456-KLMN-3456', platform: 'android', country: 'AT', firstSeen: '01/12/2025 02:10 AM' },
        { id: '24', deviceId: 'iPhone-N7890-OPQR-7890', platform: 'ios', country: 'BE', firstSeen: '30/11/2025 10:55 PM' },
        { id: '25', deviceId: 'Xiaomi-L1234-STUV-1234', platform: 'android', country: 'PT', firstSeen: '29/11/2025 07:45 PM' },
        { id: '26', deviceId: 'iPhone-M5678-WXYZ-5678', platform: 'ios', country: 'NO', firstSeen: '28/11/2025 04:30 PM' },
        { id: '27', deviceId: 'Samsung-M9012-ABCD-9012', platform: 'android', country: 'DK', firstSeen: '27/11/2025 01:20 PM' },
        { id: '28', deviceId: 'iPhone-L3456-EFGH-3456', platform: 'ios', country: 'FI', firstSeen: '26/11/2025 10:10 AM' },
        { id: '29', deviceId: 'Pixel-N7890-IJKL-7890', platform: 'android', country: 'IE', firstSeen: '25/11/2025 07:00 AM' },
        { id: '30', deviceId: 'iPhone-K1234-MNOP-1234', platform: 'ios', country: 'SG', firstSeen: '24/11/2025 03:50 AM' },
    ];

    // Filter by search, platform, and date range
    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = searchQuery === '' ||
            getGeneratedName(user.deviceId).toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.deviceId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPlatform = platformFilter === 'all' || user.platform === platformFilter;

        // Date range filter
        let matchesDate = true;
        if (dateRangeFilter !== 'all') {
            const userDate = parseDate(user.firstSeen);
            const now = new Date(2025, 11, 23); // Current date: 23/12/2025
            const daysAgo = dateRangeFilter === '7d' ? 7 : dateRangeFilter === '14d' ? 14 : 30;
            const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
            matchesDate = userDate >= cutoffDate;
        }

        return matchesSearch && matchesPlatform && matchesDate;
    });

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);

    // Reset to page 1 when filters change
    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handlePlatformChange = (platform: 'all' | 'ios' | 'android') => {
        setPlatformFilter(platform);
        setCurrentPage(1);
        setShowPlatformDropdown(false);
    };

    const handleRowsChange = (rows: number) => {
        setRowsPerPage(rows);
        setCurrentPage(1);
        setShowRowsDropdown(false);
    };

    return (
        <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search User"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="h-9 w-48 rounded-md border bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
                    />
                    <button className="inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm hover:bg-muted">
                        <HugeiconsIcon icon={Search01Icon} className="size-4" />
                        <span>Search</span>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    {/* Date Range Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDateDropdown(!showDateDropdown)}
                            className={cn(
                                "inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm hover:bg-muted",
                                dateRangeFilter !== 'all' ? "bg-primary text-primary-foreground" : "bg-background"
                            )}
                        >
                            <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
                            <span>
                                {dateRangeFilter === 'all' ? 'Date Range' :
                                    dateRangeFilter === '7d' ? 'Last 7 Days' :
                                        dateRangeFilter === '14d' ? 'Last 14 Days' : 'Last 30 Days'}
                            </span>
                        </button>
                        {showDateDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowDateDropdown(false)} />
                                <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-md border bg-popover shadow-md">
                                    <button
                                        onClick={() => { setDateRangeFilter('all'); setCurrentPage(1); setShowDateDropdown(false); }}
                                        className={cn("flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted", dateRangeFilter === 'all' && "bg-muted")}
                                    >
                                        All Time
                                    </button>
                                    <button
                                        onClick={() => { setDateRangeFilter('7d'); setCurrentPage(1); setShowDateDropdown(false); }}
                                        className={cn("flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted", dateRangeFilter === '7d' && "bg-muted")}
                                    >
                                        Last 7 Days
                                    </button>
                                    <button
                                        onClick={() => { setDateRangeFilter('14d'); setCurrentPage(1); setShowDateDropdown(false); }}
                                        className={cn("flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted", dateRangeFilter === '14d' && "bg-muted")}
                                    >
                                        Last 14 Days
                                    </button>
                                    <button
                                        onClick={() => { setDateRangeFilter('30d'); setCurrentPage(1); setShowDateDropdown(false); }}
                                        className={cn("flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted", dateRangeFilter === '30d' && "bg-muted")}
                                    >
                                        Last 30 Days
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    {/* Platform Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                            className={cn(
                                "inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm hover:bg-muted",
                                platformFilter !== 'all' ? "bg-primary text-primary-foreground" : "bg-background"
                            )}
                        >
                            <HugeiconsIcon icon={ComputerPhoneSyncIcon} className="size-4" />
                            <span>{platformFilter === 'all' ? 'Platform' : platformFilter === 'ios' ? 'iOS' : 'Android'}</span>
                        </button>
                        {showPlatformDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowPlatformDropdown(false)} />
                                <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-md border bg-popover shadow-md">
                                    <button
                                        onClick={() => handlePlatformChange('all')}
                                        className={cn("flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted", platformFilter === 'all' && "bg-muted")}
                                    >
                                        <HugeiconsIcon icon={ComputerPhoneSyncIcon} className="size-4" />
                                        All
                                    </button>
                                    <button
                                        onClick={() => handlePlatformChange('ios')}
                                        className={cn("flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted", platformFilter === 'ios' && "bg-muted")}
                                    >
                                        <HugeiconsIcon icon={AppleIcon} className="size-4" />
                                        iOS
                                    </button>
                                    <button
                                        onClick={() => handlePlatformChange('android')}
                                        className={cn("flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted", platformFilter === 'android' && "bg-muted")}
                                    >
                                        <HugeiconsIcon icon={AndroidIcon} className="size-4" />
                                        Android
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground uppercase">User</th>
                            <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground uppercase">Platform</th>
                            <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground uppercase">Country</th>
                            <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground uppercase">First Seen</th>
                            <th className="h-10 w-10 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b cursor-pointer transition-colors hover:bg-muted/50"
                                onClick={() => navigate(`/users/${user.deviceId}`)}
                            >
                                <td className="h-12 px-4">
                                    <div className="flex items-center gap-2">
                                        <UserAvatar seed={user.deviceId} size={24} />
                                        <span className="text-sm font-medium">{getGeneratedName(user.deviceId)}</span>
                                    </div>
                                </td>
                                <td className="h-12 px-4">
                                    <div className="flex items-center gap-1.5">
                                        <HugeiconsIcon
                                            className="size-3.5 text-muted-foreground"
                                            icon={user.platform === 'ios' ? AppleIcon : AndroidIcon}
                                        />
                                        <span className="text-sm">{user.platform === 'ios' ? 'iOS' : 'Android'}</span>
                                    </div>
                                </td>
                                <td className="h-12 px-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`fi fi-${user.country.toLowerCase()} rounded-xs text-sm`} />
                                        <span className="text-sm">{getCountryLabel(user.country)}</span>
                                    </div>
                                </td>
                                <td className="h-12 px-4">
                                    <div className="flex items-center gap-1.5">
                                        <HugeiconsIcon className="size-3.5 text-muted-foreground" icon={Calendar03Icon} />
                                        <span className="text-sm">{user.firstSeen}</span>
                                    </div>
                                </td>
                                <td className="h-12 px-4">
                                    <HugeiconsIcon icon={ViewIcon} className="size-4 text-muted-foreground" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex h-9 items-center gap-1 rounded-md border bg-background px-3 text-sm hover:bg-muted disabled:opacity-50"
                >
                    <span>‹</span>
                    <span>Previous</span>
                </button>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>Page {currentPage} of {totalPages || 1} ({filteredUsers.length} total)</span>
                    {/* Rows per page dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowRowsDropdown(!showRowsDropdown)}
                            className="inline-flex h-9 items-center gap-1 rounded-md border bg-background px-3 hover:bg-muted"
                        >
                            <span>Rows: {rowsPerPage}</span>
                        </button>
                        {showRowsDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowRowsDropdown(false)} />
                                <div className="absolute bottom-full left-1/2 z-50 mb-1 w-20 -translate-x-1/2 rounded-md border bg-popover shadow-md">
                                    {[5, 10, 20, 30].map((rows) => (
                                        <button
                                            key={rows}
                                            onClick={() => handleRowsChange(rows)}
                                            className={cn("flex w-full justify-center px-3 py-2 text-sm hover:bg-muted", rowsPerPage === rows && "bg-muted")}
                                        >
                                            {rows}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="inline-flex h-9 items-center gap-1 rounded-md border bg-background px-3 text-sm hover:bg-muted disabled:opacity-50"
                >
                    <span>Next</span>
                    <span>›</span>
                </button>
            </div>
        </div>
    );
}

// Main Users Page
export default function Users() {
    return (
        <div className="flex flex-1 flex-col gap-6">
            {/* Header */}
            <div>
                <h1 className="font-bold font-sans text-2xl">Users</h1>
                <p className="font-sans text-muted-foreground text-sm">
                    Track and analyze users in your application
                </p>
            </div>

            {/* Overview Cards */}
            <UsersOverviewCards />

            {/* Platform & Countries Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                <UsersPlatformDistribution />
                <UsersTopCountries />
            </div>

            {/* Activity Chart */}
            <UsersActivityChart />

            {/* Users Table */}
            <Card className="py-0">
                <CardContent className="space-y-4 p-4">
                    <div>
                        <h2 className="font-semibold text-muted-foreground text-sm uppercase">All Users</h2>
                        <p className="text-muted-foreground text-sm">Complete list of all users</p>
                    </div>
                    <UsersTable />
                </CardContent>
            </Card>
        </div>
    );
}
