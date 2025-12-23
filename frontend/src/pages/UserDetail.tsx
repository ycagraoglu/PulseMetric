import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    AppleIcon,
    ArrowTurnBackwardIcon,
    Calendar03Icon,
    CursorPointer02Icon,
    LanguageSquareIcon,
    LinkSquare01Icon,
    PlayCircleIcon,
    PlaySquareIcon,
    SmartPhone01Icon,
    StopCircleIcon,
    Time03Icon,
    ViewIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import 'flag-icons/css/flag-icons.min.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CopyButton } from '@/components/ui/copy-button';
import { UserAvatar, getGeneratedName } from '@/components/user-profile';
import { cn } from '@/lib/utils';

// Types
type MockEvent = {
    id: string;
    name: string;
    isScreen: boolean;
    timestamp: string;
};

type MockSession = {
    id: string;
    startedAt: string;
    lastActivityAt: string;
    eventCount: number;
    events: MockEvent[];
};

// Mock user data
const mockUserData = {
    deviceId: 'A1B2C3D4-E5F6-7890-ABCD-EF1234567890',
    platform: 'ios',
    osVersion: '17.2',
    model: 'iPhone 15 Pro',
    country: 'TR',
    city: 'Istanbul',
    locale: 'tr_TR',
    properties: {
        appVersion: '2.1.0',
        pushEnabled: 'true',
    },
    firstSeen: '2024-12-15T10:30:00Z',
    lastActivity: '2024-12-23T09:45:00Z',
    totalSessions: 15,
    avgSessionDuration: 342,
};

// Generate 365 days of mock activity data
const generateActivityData = () => {
    const data = [];
    const now = new Date();
    for (let i = 364; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const sessionCount = Math.random() > 0.85 ? Math.floor(Math.random() * 5) : 0;
        data.push({
            date: dateStr,
            sessionCount,
            formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        });
    }
    return data;
};

const mockActivityData = generateActivityData();

// Mock sessions with events
const mockSessions: MockSession[] = [
    {
        id: '1',
        startedAt: '2024-12-23T09:00:00Z',
        lastActivityAt: '2024-12-23T09:45:00Z',
        eventCount: 5,
        events: [
            { id: 'e1', name: '/details', isScreen: true, timestamp: '2024-12-23T09:40:00Z' },
            { id: 'e2', name: 'button_click', isScreen: false, timestamp: '2024-12-23T09:35:00Z' },
            { id: 'e3', name: '/home', isScreen: true, timestamp: '2024-12-23T09:20:00Z' },
            { id: 'e4', name: 'purchase_completed', isScreen: false, timestamp: '2024-12-23T09:10:00Z' },
        ],
    },
    {
        id: '2',
        startedAt: '2024-12-22T14:30:00Z',
        lastActivityAt: '2024-12-22T15:15:00Z',
        eventCount: 8,
        events: [
            { id: 'e5', name: '/profile', isScreen: true, timestamp: '2024-12-22T15:10:00Z' },
            { id: 'e6', name: 'settings_changed', isScreen: false, timestamp: '2024-12-22T15:00:00Z' },
            { id: 'e7', name: '/settings', isScreen: true, timestamp: '2024-12-22T14:50:00Z' },
        ],
    },
    {
        id: '3',
        startedAt: '2024-12-21T10:00:00Z',
        lastActivityAt: '2024-12-21T10:30:00Z',
        eventCount: 5,
        events: [
            { id: 'e8', name: '/dashboard', isScreen: true, timestamp: '2024-12-21T10:25:00Z' },
            { id: 'e9', name: 'notification_opened', isScreen: false, timestamp: '2024-12-21T10:15:00Z' },
        ],
    },
    {
        id: '4',
        startedAt: '2024-12-20T18:00:00Z',
        lastActivityAt: '2024-12-20T18:45:00Z',
        eventCount: 15,
        events: [
            { id: 'e10', name: '/checkout', isScreen: true, timestamp: '2024-12-20T18:40:00Z' },
            { id: 'e11', name: 'add_to_cart', isScreen: false, timestamp: '2024-12-20T18:30:00Z' },
            { id: 'e12', name: '/product/123', isScreen: true, timestamp: '2024-12-20T18:20:00Z' },
            { id: 'e13', name: '/search', isScreen: true, timestamp: '2024-12-20T18:10:00Z' },
        ],
    },
    {
        id: '5',
        startedAt: '2024-12-19T12:00:00Z',
        lastActivityAt: '2024-12-19T12:20:00Z',
        eventCount: 6,
        events: [
            { id: 'e14', name: '/home', isScreen: true, timestamp: '2024-12-19T12:15:00Z' },
            { id: 'e15', name: 'app_opened', isScreen: false, timestamp: '2024-12-19T12:05:00Z' },
        ],
    },
];

// Helper functions
function getCountryLabel(countryCode: string | null) {
    if (!countryCode) return null;
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode) || countryCode;
}

function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getIntensityClass(sessionCount: number): string {
    if (sessionCount === 0) return 'bg-muted hover:bg-muted/80';
    if (sessionCount === 1) return 'bg-emerald-500/20 hover:bg-emerald-500/30';
    if (sessionCount === 2) return 'bg-emerald-500/40 hover:bg-emerald-500/50';
    if (sessionCount === 3) return 'bg-emerald-500/60 hover:bg-emerald-500/70';
    return 'bg-emerald-500 hover:bg-emerald-500/90';
}

// Event Row Component with animation
function EventRow({ event, onClick }: { event: MockEvent; onClick?: () => void }) {
    const displayName = event.isScreen ? `View ${event.name}` : event.name;
    return (
        <motion.button
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                'flex w-full items-center gap-3 rounded-md bg-muted/30 px-3 py-2 text-left transition-colors duration-100',
                'cursor-pointer hover:bg-accent hover:text-accent-foreground'
            )}
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            onClick={onClick}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            type="button"
        >
            <HugeiconsIcon
                className="size-4 shrink-0"
                icon={event.isScreen ? ViewIcon : CursorPointer02Icon}
            />
            <span className="flex-1 truncate font-medium text-sm" title={displayName}>
                {displayName}
            </span>
            <span className="shrink-0 text-muted-foreground text-xs">
                {formatTime(event.timestamp)}
            </span>
            <HugeiconsIcon icon={ViewIcon} className="size-4 shrink-0 text-muted-foreground" />
        </motion.button>
    );
}

// Session Details Dialog Component
function SessionDetailsDialog({
    session,
    open,
    onOpenChange,
}: {
    session: MockSession | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const navigate = useNavigate();

    const generatedName = useMemo(() => {
        return getGeneratedName(mockUserData.deviceId);
    }, []);

    if (!session) return null;

    const durationInSeconds = Math.floor(
        (new Date(session.lastActivityAt).getTime() - new Date(session.startedAt).getTime()) / 1000
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[85vh] max-w-[95vw] flex-col p-0 sm:max-w-2xl lg:max-w-3xl">
                <DialogHeader className="border-b px-4 pt-4 pb-3 text-left sm:px-6 sm:pt-6 sm:pb-4">
                    <DialogTitle>Session Details</DialogTitle>
                    <div className="space-y-3 pt-3 sm:pt-4">
                        {/* User Info */}
                        <div className="space-y-2">
                            <p className="text-muted-foreground text-xs uppercase">User</p>
                            <div className="flex items-center gap-3">
                                {/* boring-avatars Avatar */}
                                <UserAvatar seed={mockUserData.deviceId} size={40} variant="marble" />
                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-sm text-foreground">{generatedName}</p>
                                        <button
                                            className="size-4 shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-primary"
                                            onClick={() => navigate(`/users/${mockUserData.deviceId}`)}
                                            title="View user details"
                                            type="button"
                                        >
                                            <HugeiconsIcon className="size-4" icon={LinkSquare01Icon} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CopyButton
                                            content={mockUserData.deviceId}
                                            className="size-3 text-muted-foreground hover:text-primary [&_svg]:size-3"
                                            variant="ghost"
                                        />
                                        <p className="truncate font-mono text-muted-foreground text-xs">
                                            {mockUserData.deviceId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 sm:gap-6">
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-xs uppercase">Date</p>
                                <div className="flex items-center gap-2">
                                    <HugeiconsIcon className="size-4 text-muted-foreground" icon={Calendar03Icon} />
                                    <span className="text-foreground text-sm">{formatDate(session.startedAt)}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-xs uppercase">Duration</p>
                                <div className="flex items-center gap-2">
                                    <HugeiconsIcon className="size-4 text-muted-foreground" icon={Time03Icon} />
                                    <span className="text-foreground text-sm">{formatDuration(durationInSeconds)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {/* Events List */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 sm:px-6">
                    <div className="flex flex-col gap-1">
                        {/* Session Ended */}
                        <div className="flex items-center gap-3 rounded-md bg-muted/30 px-3 py-2">
                            <HugeiconsIcon className="size-4 shrink-0 text-destructive" icon={StopCircleIcon} />
                            <span className="flex-1 truncate font-medium text-sm text-foreground">Session Ended</span>
                            <span className="shrink-0 text-muted-foreground text-xs">
                                {formatTime(session.lastActivityAt)}
                            </span>
                        </div>

                        {/* Events */}
                        {session.events.map((event) => {
                            const displayName = event.isScreen ? `View ${event.name}` : event.name;
                            return (
                                <button
                                    key={event.id}
                                    className="flex w-full items-center gap-3 rounded-md bg-muted/30 px-3 py-2 text-left transition-colors duration-100 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                    type="button"
                                >
                                    <HugeiconsIcon
                                        className="size-4 shrink-0 text-foreground"
                                        icon={event.isScreen ? ViewIcon : CursorPointer02Icon}
                                    />
                                    <span className="flex-1 truncate font-medium text-sm text-foreground" title={displayName}>
                                        {displayName}
                                    </span>
                                    <span className="shrink-0 text-muted-foreground text-xs">
                                        {formatTime(event.timestamp)}
                                    </span>
                                    <HugeiconsIcon icon={ViewIcon} className="size-4 shrink-0 text-muted-foreground" />
                                </button>
                            );
                        })}

                        {/* Session Started */}
                        <div className="flex items-center gap-3 rounded-md bg-muted/30 px-3 py-2">
                            <HugeiconsIcon className="size-4 shrink-0 text-success" icon={PlayCircleIcon} />
                            <span className="flex-1 truncate font-medium text-sm text-foreground">Session Started</span>
                            <span className="shrink-0 text-muted-foreground text-xs">
                                {formatTime(session.startedAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// User Detail Card Component
function UserDetailCard() {
    const generatedName = useMemo(() => getGeneratedName(mockUserData.deviceId), []);

    return (
        <Card className="min-w-0 py-0">
            <CardContent className="min-w-0 space-y-4 p-4">
                <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-muted-foreground text-sm uppercase">
                        User Information
                    </h2>
                </div>

                <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                        <UserAvatar seed={mockUserData.deviceId} size={80} variant="marble" />
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <h2 className="font-semibold text-xl">{generatedName}</h2>
                            <div className="flex min-w-0 items-center gap-2">
                                <CopyButton
                                    content={mockUserData.deviceId}
                                    className="size-4 shrink-0 text-muted-foreground hover:text-foreground transition-colors [&_svg]:size-4"
                                    variant="ghost"
                                />
                                <p className="truncate font-mono text-muted-foreground text-xs" title={mockUserData.deviceId}>
                                    {mockUserData.deviceId}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-muted-foreground text-xs uppercase">Geolocation</p>
                        <div className="mt-1 space-y-2">
                            <p className="flex items-center gap-1.5 font-medium text-sm">
                                <span className={`fi fi-${mockUserData.country.toLowerCase()} rounded-xs text-[14px]`} />
                                <span>{getCountryLabel(mockUserData.country)}</span>
                                <span className="text-muted-foreground">,</span>
                                <span>{mockUserData.city}</span>
                            </p>
                            <p className="flex items-center gap-1.5 font-medium text-sm">
                                <HugeiconsIcon className="size-4 text-muted-foreground" icon={LanguageSquareIcon} />
                                <span>{mockUserData.locale}</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-muted-foreground text-xs uppercase">Device</p>
                        <div className="mt-1 space-y-2">
                            <p className="flex items-center gap-1.5 font-medium text-sm">
                                <HugeiconsIcon className="size-4 text-muted-foreground" icon={AppleIcon} />
                                <span>iOS</span>
                                <span className="text-muted-foreground">{mockUserData.osVersion}</span>
                            </p>
                            <p className="flex items-center gap-1.5 font-medium text-sm">
                                <HugeiconsIcon className="size-4 text-muted-foreground" icon={SmartPhone01Icon} />
                                <span>{mockUserData.model}</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-muted-foreground text-xs uppercase">Properties</p>
                        <div className="mt-1 space-y-2">
                            {Object.entries(mockUserData.properties).map(([key, value]) => (
                                <p className="font-medium text-sm" key={key}>
                                    <span className="text-muted-foreground">{key}:</span>{' '}
                                    <span>{value}</span>
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// User Activity Calendar Component
function UserActivityCalendar() {
    return (
        <Card className="min-w-0 py-0">
            <CardContent className="min-w-0 space-y-4 p-4">
                <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-muted-foreground text-sm uppercase">
                        Activity Calendar
                    </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-muted-foreground text-xs uppercase">Total Sessions</p>
                        <p className="mt-1 flex items-center gap-1.5 font-medium text-sm">
                            <HugeiconsIcon className="size-4 text-muted-foreground" icon={PlaySquareIcon} />
                            <span>{mockUserData.totalSessions}</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs uppercase">Avg Session Duration</p>
                        <p className="mt-1 flex items-center gap-1.5 font-medium text-sm">
                            <HugeiconsIcon className="size-4 text-muted-foreground" icon={Time03Icon} />
                            <span>{formatDuration(mockUserData.avgSessionDuration)}</span>
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-muted-foreground text-xs uppercase">First Seen</p>
                        <p className="mt-1 flex items-center gap-1.5 font-medium text-sm">
                            <HugeiconsIcon className="size-4 text-muted-foreground" icon={Calendar03Icon} />
                            <span>{formatDate(mockUserData.firstSeen)}</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs uppercase">Last Activity</p>
                        <p className="mt-1 flex items-center gap-1.5 font-medium text-sm">
                            <HugeiconsIcon className="size-4 text-muted-foreground" icon={Calendar03Icon} />
                            <span>{formatDate(mockUserData.lastActivity)}</span>
                        </p>
                    </div>
                </div>

                <TooltipProvider>
                    <div className="overflow-x-auto">
                        <div className="flex flex-wrap gap-1">
                            {mockActivityData.map((day) => (
                                <Tooltip key={day.date}>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                'size-3 cursor-pointer rounded-[2px] transition-colors',
                                                getIntensityClass(day.sessionCount)
                                            )}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent
                                        className="border-border bg-background px-2.5 py-1.5 text-foreground"
                                        side="top"
                                    >
                                        <div className="flex flex-col gap-1.5">
                                            <span className="flex items-center gap-1.5">
                                                <HugeiconsIcon className="size-3.5" icon={Calendar03Icon} />
                                                <span>{day.formattedDate}</span>
                                            </span>
                                            <div className="flex flex-col gap-0.5">
                                                <div className="font-semibold text-base tabular-nums">
                                                    {day.sessionCount}
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    {day.sessionCount === 0 ? 'No Sessions' : day.sessionCount === 1 ? 'Session' : 'Sessions'}
                                                </div>
                                            </div>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                </TooltipProvider>

                <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Less</span>
                    <div className="flex gap-1">
                        <div className="size-3 rounded-[2px] bg-muted" />
                        <div className="size-3 rounded-[2px] bg-emerald-500/20" />
                        <div className="size-3 rounded-[2px] bg-emerald-500/40" />
                        <div className="size-3 rounded-[2px] bg-emerald-500/60" />
                        <div className="size-3 rounded-[2px] bg-emerald-500" />
                    </div>
                    <span className="text-muted-foreground">More</span>
                </div>
            </CardContent>
        </Card>
    );
}

// User Sessions Table Component with Dialog
function UserSessionsTable() {
    const [selectedSession, setSelectedSession] = useState<MockSession | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleRowClick = (session: MockSession) => {
        setSelectedSession(session);
        setDialogOpen(true);
    };

    return (
        <>
            <Card className="py-0">
                <CardContent className="space-y-4 p-4">
                    <div>
                        <h2 className="font-semibold text-muted-foreground text-sm uppercase">
                            Sessions & Events
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            User session history with events
                        </p>
                    </div>

                    <div className="rounded-md border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground">Date</th>
                                    <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground">Duration</th>
                                    <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground">Events</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockSessions.map((session) => {
                                    const duration = Math.floor(
                                        (new Date(session.lastActivityAt).getTime() - new Date(session.startedAt).getTime()) / 1000
                                    );
                                    return (
                                        <tr
                                            key={session.id}
                                            className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                                            onClick={() => handleRowClick(session)}
                                        >
                                            <td className="h-12 px-4">
                                                <div className="flex items-center gap-2">
                                                    <HugeiconsIcon className="size-4 text-muted-foreground" icon={Calendar03Icon} />
                                                    <span className="text-sm text-primary">{formatDate(session.startedAt)}</span>
                                                </div>
                                            </td>
                                            <td className="h-12 px-4">
                                                <div className="flex items-center gap-2">
                                                    <HugeiconsIcon className="size-4 text-muted-foreground" icon={Time03Icon} />
                                                    <span className="text-sm text-primary">{formatDuration(duration)}</span>
                                                </div>
                                            </td>
                                            <td className="h-12 px-4">
                                                <span className="text-sm">{session.eventCount}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <SessionDetailsDialog
                session={selectedSession}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </>
    );
}

// Main User Detail Page
export default function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="flex flex-1 flex-col gap-6">
            <div>
                <h1 className="font-bold text-2xl">User Details</h1>
                <p className="text-muted-foreground text-sm">
                    View detailed information about this user
                </p>
            </div>

            <div className="flex items-center justify-between">
                <Button
                    className="w-fit font-normal"
                    onClick={() => navigate(-1)}
                    variant="outline"
                >
                    <HugeiconsIcon icon={ArrowTurnBackwardIcon} />
                    Back
                </Button>

                <Button variant="destructive" className="font-normal">
                    Ban User
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <UserDetailCard />
                <UserActivityCalendar />
            </div>

            <UserSessionsTable />
        </div>
    );
}
