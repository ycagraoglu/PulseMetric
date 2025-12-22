import {
    Smartphone,
    MousePointerClick,
    Eye,
    PlaySquare,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import 'flag-icons/css/flag-icons.min.css'
import { ScrollArea } from '@/components/ui/scroll-area'
import { minidenticon } from 'minidenticons'
import { formatRelative } from 'date-fns'

// Types
export type ActivityItem = {
    id: string
    type: 'event' | 'session' | 'device'
    name: string
    deviceId: string
    country: string | null
    platform: string | null
    timestamp: string | Date
    isScreen?: boolean
}

const COUNTRY_CODE_REGEX = /^[A-Za-z]{2}$/

function getCountryLabel(countryCode: string) {
    try {
        return (
            new Intl.DisplayNames(['en'], {
                type: 'region',
            }).of(countryCode) || countryCode
        )
    } catch (e) {
        return countryCode
    }
}

// User Avatar Component
function UserAvatar({
    seed,
    size = 14,
}: {
    seed: string
    size?: number
    variant?: 'marble' | 'beam' | 'pixel'
}) {
    const svgURI = useMemo(
        () =>
            `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(seed, 95, 45))}`,
        [seed]
    )
    return <img src={svgURI} alt={seed} width={size} height={size} className="rounded" />
}

// Generate funny names
function getGeneratedName(seed: string) {
    // Simple hash to generated name logic
    const adjectives = ['Swift', 'Bold', 'Silent', 'Wise', 'Calm']
    const nouns = ['Tiger', 'Eagle', 'Bear', 'Wolf', 'Fox']
    const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return `${adjectives[hash % adjectives.length]} ${nouns[hash % nouns.length]}`
}

function ClientDate({ date }: { date: string | Date }) {
    const d = new Date(date)
    try {
        return <span>{formatRelative(d, new Date())}</span>
    } catch (e) {
        return <span>just now</span>
    }
}

type RealtimeActivityFeedProps = {
    activities: ActivityItem[]
    appId: string
}

export function RealtimeActivityFeed({
    activities,
    appId,
}: RealtimeActivityFeedProps) {
    const navigate = useNavigate()

    const displayActivities = useMemo(
        () => activities.slice(0, 50),
        [activities]
    )

    const handleActivityClick = (activity: ActivityItem) => {
        // Navigate or show details
        if (activity.type === 'device') {
            navigate(`/dashboard/analytics/users?app=${appId}`)
        }
    }

    return (
        <>
            <ScrollArea className="h-[400px] w-full max-w-[400px]">
                <div className="space-y-2 pr-4">
                    <AnimatePresence initial={false} mode="popLayout">
                        {displayActivities.map((activity, index) => (
                            <motion.button
                                layout
                                key={activity.id}
                                initial={{ opacity: 0, y: -25, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                transition={{
                                    duration: 0.4,
                                    delay: Math.min(index * 0.05, 0.3),
                                    ease: [0.16, 1, 0.3, 1],
                                    layout: { duration: 0.35, ease: 'easeInOut' },
                                }}
                                className="w-full cursor-pointer space-y-1 rounded-lg border p-2 text-left transition-colors hover:bg-accent"
                                onClick={() => handleActivityClick(activity)}
                            >
                                <div className="flex items-center gap-1.5">
                                    {activity.type === 'event' && (
                                        <div className="text-muted-foreground">
                                            {activity.isScreen ? <Eye className="size-3.5" /> : <MousePointerClick className="size-3.5" />}
                                        </div>
                                    )}
                                    {activity.type === 'session' && (
                                        <PlaySquare className="size-3.5 text-muted-foreground" />
                                    )}
                                    {activity.type === 'device' && (
                                        <Smartphone className="size-3.5 text-muted-foreground" />
                                    )}
                                    <span className="font-medium text-xs">
                                        {activity.type === 'event' && activity.isScreen
                                            ? `View ${activity.name}`
                                            : activity.name}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-1.5 text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <UserAvatar seed={activity.deviceId} size={14} />
                                        <span className="text-muted-foreground">
                                            {getGeneratedName(activity.deviceId)}
                                        </span>
                                        {activity.country &&
                                            activity.country.length === 2 &&
                                            COUNTRY_CODE_REGEX.test(activity.country) && (
                                                <>
                                                    <span className="text-muted-foreground">from</span>
                                                    <span
                                                        className={`fi fi-${activity.country.toLowerCase()} rounded-sm text-[12px]`}
                                                        title={getCountryLabel(activity.country)}
                                                    />
                                                    <span className="text-primary">
                                                        {activity.country.toUpperCase()}
                                                    </span>
                                                </>
                                            )}
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                        <ClientDate date={activity.timestamp} />
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </ScrollArea>
        </>
    )
}
