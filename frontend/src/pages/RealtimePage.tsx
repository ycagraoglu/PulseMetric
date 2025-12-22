import { useEffect, useState } from 'react'
import { RealtimeActivityFeed, type ActivityItem } from '@/components/realtime/realtime-activity-feed'
import { RealtimeHeader } from '@/components/realtime/realtime-header'
import Earth from '@/components/ui/cobe-globe'
import { Sparkles } from '@/components/ui/sparkles'
import { useSearchParams } from 'react-router-dom'

type CountryData = {
    lat: number
    lng: number
    name: string
}

export default function RealtimePage() {
    const [searchParams] = useSearchParams()
    const appId = searchParams.get('app') || 'demo-app'

    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [onlineUsers, setOnlineUsers] = useState<number>(42)
    const [platforms, setPlatforms] = useState({
        ios: 12,
        android: 18,
        web: 12,
    })
    const [countryCoords, setCountryCoords] = useState<Record<string, CountryData>>({})
    const [markers, setMarkers] = useState<Array<{
        location: [number, number]
        size?: number
        color?: [number, number, number]
    }>>([])

    const [isPaused, setIsPaused] = useState(false)

    // Load country coordinates
    useEffect(() => {
        fetch('/countries.json')
            .then((res) => res.json())
            .then((data: Record<string, CountryData>) => {
                setCountryCoords(data)
            })
            .catch((error) => {
                console.error('Failed to load country coordinates:', error)
            })
    }, [])

    // Simulate realtime updates
    useEffect(() => {
        if (isPaused) return

        const interval = setInterval(() => {
            // 1. Update online users slightly
            setOnlineUsers(prev => Math.max(0, prev + Math.floor(Math.random() * 5) - 2))

            // Update platforms occasionally
            if (Math.random() > 0.7) {
                setPlatforms(prev => ({
                    ios: Math.max(0, prev.ios + Math.floor(Math.random() * 3) - 1),
                    android: Math.max(0, prev.android + Math.floor(Math.random() * 3) - 1),
                    web: Math.max(0, prev.web + Math.floor(Math.random() * 3) - 1),
                }))
            }

            // 2. Add random activity
            const countries = Object.keys(countryCoords)
            if (countries.length === 0) return

            const randomCountryCode = countries[Math.floor(Math.random() * countries.length)]
            const countryData = countryCoords[randomCountryCode]

            // Update globe markers
            if (countryData) {
                setMarkers(prev => {
                    const newMarker = {
                        location: [countryData.lat, countryData.lng] as [number, number],
                        size: 0.05,
                        color: [0.2, 0.8, 0.4] as [number, number, number]
                    }
                    return [...prev.slice(-20), newMarker] // Keep last 20 markers
                })
            }

            const newActivity: ActivityItem = {
                id: Math.random().toString(36).substr(2, 9),
                type: ['event', 'session', 'device'][Math.floor(Math.random() * 3)] as any,
                name: ['page_view', 'purchase', 'New Session', 'New User'][Math.floor(Math.random() * 4)],
                deviceId: Math.random().toString(36).substr(2, 5),
                country: randomCountryCode,
                platform: ['iOS', 'Android', 'Web'][Math.floor(Math.random() * 3)],
                timestamp: new Date(),
                isScreen: Math.random() > 0.5
            }

            setActivities(prev => [newActivity, ...prev].slice(0, 50))
        }, 2000)

        return () => clearInterval(interval)
    }, [countryCoords, isPaused])

    return (
        <div className="relative isolate h-full w-full overflow-hidden">
            {/* Background Sparkles */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <Sparkles
                    className="absolute inset-0"
                    density={100}
                    opacity={0.5}
                    size={1.2}
                    speed={0.5}
                    background="transparent"
                />
            </div>

            <div className="relative flex h-full flex-col gap-6 p-6 lg:grid lg:grid-cols-2">
                {/* Header Section */}
                <div className="order-1">
                    <RealtimeHeader
                        status="connected"
                        onlineUsers={onlineUsers}
                        platforms={platforms}
                        appName="PulseMetric Demo"
                        onPause={() => setIsPaused(true)}
                        onResume={() => setIsPaused(false)}
                    />
                </div>

                {/* 3D Globe Section */}
                <div className="order-2 flex items-center justify-center lg:row-span-2">
                    <Earth
                        className="relative aspect-square w-full max-w-[500px] lg:max-w-[600px]"
                        markers={markers}
                        scale={1.1}
                    />
                </div>

                {/* Activity Feed Section */}
                <div className="order-3 flex-1 lg:flex-none lg:self-end">
                    <RealtimeActivityFeed activities={activities} appId={appId} />
                </div>
            </div>
        </div>
    )
}
