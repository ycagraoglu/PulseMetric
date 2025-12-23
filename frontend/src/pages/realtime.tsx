import { useState, useEffect, useRef } from 'react';
import {
    AppleIcon,
    AndroidIcon,
    Globe02Icon,
    PauseIcon,
    PlayIcon,
    Wifi01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import createGlobe from 'cobe';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockRealtimeData } from '@/lib/mock-data';


type ActivityItem = {
    id: string;
    type: 'event' | 'session' | 'device';
    name: string;
    deviceId: string;
    country: string | null;
    platform: string | null;
    timestamp: string;
};

function Realtime() {
    const [isPaused, setIsPaused] = useState(false);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [onlineUsers] = useState(mockRealtimeData.onlineUsers);
    const [platforms] = useState(mockRealtimeData.platforms);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Generate fake realtime activities
    useEffect(() => {
        if (isPaused) return;

        const eventNames = ['screen_view', 'button_click', 'purchase', 'share', 'form_submit'];
        const countries = ['TR', 'US', 'DE', 'GB', 'FR'];
        const platformList = ['iOS', 'Android', 'Web'];

        const interval = setInterval(() => {
            const newActivity: ActivityItem = {
                id: Math.random().toString(36).substring(7),
                type: Math.random() > 0.7 ? 'session' : 'event',
                name: eventNames[Math.floor(Math.random() * eventNames.length)],
                deviceId: `device_${Math.random().toString(36).substring(7)}`,
                country: countries[Math.floor(Math.random() * countries.length)],
                platform: platformList[Math.floor(Math.random() * platformList.length)],
                timestamp: new Date().toISOString(),
            };

            setActivities((prev) => [newActivity, ...prev].slice(0, 50));
        }, 2000);

        return () => clearInterval(interval);
    }, [isPaused]);

    // Globe setup
    useEffect(() => {
        if (!canvasRef.current) return;

        let phi = 0;
        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0.3,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 0.1],
            glowColor: [0.1, 0.1, 0.1],
            markers: [
                { location: [39.9334, 32.8597], size: 0.1 }, // Turkey
                { location: [37.0902, -95.7129], size: 0.08 }, // US
                { location: [51.1657, 10.4515], size: 0.06 }, // Germany
                { location: [55.3781, -3.4360], size: 0.05 }, // UK
                { location: [46.2276, 2.2137], size: 0.04 }, // France
            ],
            onRender: (state) => {
                state.phi = phi;
                phi += 0.003;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    const getPlatformIcon = (platform: string | null) => {
        switch (platform?.toLowerCase()) {
            case 'ios':
                return AppleIcon;
            case 'android':
                return AndroidIcon;
            default:
                return Globe02Icon;
        }
    };

    return (
        <div className="relative flex h-[calc(100vh-8rem)] flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold font-sans text-2xl">Realtime</h1>
                    <p className="font-sans text-muted-foreground text-sm">
                        Live analytics data from your application
                    </p>
                </div>
                <Button
                    onClick={() => setIsPaused(!isPaused)}
                    variant="outline"
                    size="sm"
                >
                    <HugeiconsIcon icon={isPaused ? PlayIcon : PauseIcon} className="size-4" />
                    {isPaused ? 'Resume' : 'Pause'}
                </Button>
            </div>

            <div className="grid flex-1 gap-6 lg:grid-cols-2">
                {/* Left side - Stats & Feed */}
                <div className="flex flex-col gap-6">
                    {/* Online Users Stats */}
                    <Card className="py-0">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-full bg-success/20">
                                    <HugeiconsIcon icon={Wifi01Icon} className="size-6 text-success" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">Online Users</p>
                                    <p className="font-bold text-3xl">{onlineUsers}</p>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-4">
                                <div className="flex items-center gap-2">
                                    <HugeiconsIcon icon={AppleIcon} className="size-4 text-muted-foreground" />
                                    <span className="font-medium">{platforms.ios}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HugeiconsIcon icon={AndroidIcon} className="size-4 text-muted-foreground" />
                                    <span className="font-medium">{platforms.android}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HugeiconsIcon icon={Globe02Icon} className="size-4 text-muted-foreground" />
                                    <span className="font-medium">{platforms.web}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Feed */}
                    <Card className="flex-1 py-0">
                        <CardContent className="flex h-full flex-col p-4">
                            <h2 className="mb-4 font-semibold text-muted-foreground text-sm uppercase">
                                Live Activity
                            </h2>
                            <ScrollArea className="flex-1">
                                <div className="space-y-3">
                                    {activities.length === 0 ? (
                                        <p className="text-center text-muted-foreground">
                                            {isPaused ? 'Paused - Resume to see live data' : 'Waiting for events...'}
                                        </p>
                                    ) : (
                                        activities.map((activity) => (
                                            <div
                                                key={activity.id}
                                                className="flex items-center gap-3 rounded-lg border p-3"
                                            >
                                                <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                                                    <HugeiconsIcon
                                                        icon={getPlatformIcon(activity.platform)}
                                                        className="size-4"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{activity.name}</p>
                                                    <p className="text-muted-foreground text-xs truncate">
                                                        {activity.deviceId}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {activity.country && (
                                                        <span className={`fi fi-${activity.country.toLowerCase()}`} />
                                                    )}
                                                    <Badge variant={activity.type === 'session' ? 'success' : 'outline'}>
                                                        {activity.type}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Right side - Globe */}
                <div className="flex items-center justify-center">
                    <div className="relative aspect-square w-full max-w-[500px]">
                        <canvas
                            ref={canvasRef}
                            style={{
                                width: '100%',
                                height: '100%',
                                contain: 'layout paint size',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Realtime;
