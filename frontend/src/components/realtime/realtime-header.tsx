import {
    Activity,
    Pause,
    Play,
    WifiOff,
    Plug,
    Smartphone,
    Monitor,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
// Assuming MusicPlayer is not critical or we mock it for now
const MusicPlayer = () => <div className="hidden" />

// Simple counting number component
const CountingNumber = ({ number }: { number: number }) => {
    return <span>{number}</span>
}

type RealtimeHeaderProps = {
    status: 'connecting' | 'connected' | 'disconnected' | 'error'
    onlineUsers?: number
    platforms?: {
        ios?: number
        android?: number
    }
    onPause?: () => void
    onResume?: () => void
    appName?: string
}

function getStatusInfo(
    status: 'connecting' | 'connected' | 'disconnected' | 'error'
): {
    icon: typeof Activity
    color: string
    label: string
} {
    if (status === 'connected') {
        return {
            icon: Activity,
            color: 'text-green-500',
            label: 'Connected',
        }
    }

    if (status === 'connecting') {
        return {
            icon: WifiOff,
            color: 'text-yellow-500',
            label: 'Connecting',
        }
    }

    return {
        icon: Plug,
        color: 'text-destructive',
        label: status === 'error' ? 'Connection Error' : 'Disconnected',
    }
}

export function RealtimeHeader({
    status,
    onlineUsers = 0,
    platforms = {},
    onPause,
    onResume,
    appName,
}: RealtimeHeaderProps) {
    const statusInfo = getStatusInfo(status)

    const platformData = [
        { key: 'ios', label: 'iOS', icon: Smartphone, value: platforms.ios || 0 },
        {
            key: 'android',
            label: 'Android',
            icon: Smartphone,
            value: platforms.android || 0,
        },
    ].filter((p) => p.value > 0)

    return (
        <Card className="w-fit min-w-[370px] py-4">
            <CardContent className="flex w-full flex-col gap-3 space-y-0 px-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="size-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{appName || 'Realtime'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Badge className="flex items-center gap-1.5" variant="outline">
                            <statusInfo.icon className={`size-3.5 ${statusInfo.color}`} />
                            <span className="text-muted-foreground text-sm">
                                {statusInfo.label}
                            </span>
                        </Badge>
                        {(status === 'connected' || status === 'connecting') && onPause && (
                            <Button
                                className="size-7"
                                onClick={onPause}
                                size="icon"
                                variant="outline"
                            >
                                <Pause className="size-4 text-destructive" />
                            </Button>
                        )}
                        {(status === 'disconnected' || status === 'error') && onResume && (
                            <Button
                                className="size-7"
                                onClick={onResume}
                                size="icon"
                                variant="outline"
                            >
                                <Play className="size-4 text-green-500" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className="relative flex size-2">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500" />
                            <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                        </div>
                        <span className="font-medium text-sm">
                            <CountingNumber number={onlineUsers} />
                        </span>
                        <span className="text-muted-foreground text-sm">Online</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Monitor className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground text-sm">Platforms </span>
                        {platformData.length > 0 && (
                            <TooltipProvider>
                                <div className="flex items-center gap-2">
                                    {platformData.map((platform) => (
                                        <Tooltip key={platform.key}>
                                            <TooltipTrigger asChild>
                                                <Badge className="h-6 px-2 py-0" variant="outline">
                                                    <div className="flex items-center gap-1">
                                                        <platform.icon className="size-3.5 text-muted-foreground" />
                                                        <span className="text-sm">{platform.value}</span>
                                                    </div>
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{platform.label}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </TooltipProvider>
                        )}
                    </div>
                </div>

                <MusicPlayer />
            </CardContent>
        </Card>
    )
}
