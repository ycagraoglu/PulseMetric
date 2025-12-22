import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

const events = [
    { id: 1, name: "page_view", page: "/products", visitor: "v_abc123", device: "Desktop", time: "2 min ago" },
    { id: 2, name: "button_click", page: "/checkout", visitor: "v_def456", device: "Mobile", time: "5 min ago" },
    { id: 3, name: "scroll_depth", page: "/blog/post-1", visitor: "v_ghi789", device: "Desktop", time: "8 min ago" },
    { id: 4, name: "page_view", page: "/about", visitor: "v_jkl012", device: "Tablet", time: "12 min ago" },
    { id: 5, name: "outbound_click", page: "/partners", visitor: "v_mno345", device: "Desktop", time: "15 min ago" },
    { id: 6, name: "time_on_page", page: "/pricing", visitor: "v_pqr678", device: "Mobile", time: "18 min ago" },
    { id: 7, name: "page_view", page: "/", visitor: "v_stu901", device: "Desktop", time: "22 min ago" },
    { id: 8, name: "session_start", page: "/", visitor: "v_vwx234", device: "Mobile", time: "25 min ago" },
]

export function EventsPage() {
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
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="grid grid-cols-5 gap-4 border-b p-4 text-sm last:border-0 hover:bg-muted/30 transition-colors"
                            >
                                <div>
                                    <Badge variant="secondary">{event.name}</Badge>
                                </div>
                                <div className="font-medium">{event.page}</div>
                                <div className="text-muted-foreground font-mono text-xs">
                                    {event.visitor}
                                </div>
                                <div className="text-muted-foreground">{event.device}</div>
                                <div className="text-muted-foreground">{event.time}</div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                            Showing 8 of 1,234 events
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled>
                                Previous
                            </Button>
                            <Button variant="outline" size="sm">
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
