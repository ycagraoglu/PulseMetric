import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter } from "lucide-react"
import { api, type EventListItem } from "@/lib/api"

export function EventsPage() {
    const [events, setEvents] = useState<EventListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            try {
                const data = await api.stats.getEvents('DEMO_TENANT', page, 20)
                setEvents(data)
            } catch (error) {
                console.error('Events load error:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [page])

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return 'just now'
        if (diffMins < 60) return `${diffMins} min ago`
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
        return date.toLocaleDateString()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Events</h1>
                    <p className="text-muted-foreground">
                        Browse and filter all analytics events.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search events..." className="pl-10" />
                        </div>
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Events Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border">
                        {/* Table Header */}
                        <div className="grid grid-cols-5 gap-4 border-b bg-muted/50 p-4 text-sm font-medium text-muted-foreground">
                            <div>Event</div>
                            <div>Page</div>
                            <div>Visitor</div>
                            <div>Device</div>
                            <div>Time</div>
                        </div>

                        {/* Table Body */}
                        {loading ? (
                            Array(8).fill(0).map((_, i) => (
                                <div key={i} className="grid grid-cols-5 gap-4 border-b p-4">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            ))
                        ) : events.length > 0 ? (
                            events.map((event) => (
                                <div
                                    key={event.id}
                                    className="grid grid-cols-5 gap-4 border-b p-4 text-sm last:border-0 hover:bg-muted/30 transition-colors"
                                >
                                    <div>
                                        <Badge variant="secondary">{event.eventName}</Badge>
                                    </div>
                                    <div className="font-medium truncate">{event.urlPath}</div>
                                    <div className="text-muted-foreground font-mono text-xs truncate">
                                        {event.visitorId ?? '-'}
                                    </div>
                                    <div className="text-muted-foreground">{event.device ?? '-'}</div>
                                    <div className="text-muted-foreground">{formatTime(event.timestamp)}</div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-muted-foreground">
                                No events found
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                            Page {page}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => p + 1)}
                                disabled={events.length < 20}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
