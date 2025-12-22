import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Monitor, Smartphone, Tablet } from "lucide-react"
import { api, type UserListItem, type StatsOverview } from "@/lib/api"

function DeviceIcon({ device }: { device: string | null }) {
    switch (device?.toLowerCase()) {
        case 'mobile': return <Smartphone className="h-4 w-4" />
        case 'tablet': return <Tablet className="h-4 w-4" />
        default: return <Monitor className="h-4 w-4" />
    }
}

export function UsersPage() {
    const [users, setUsers] = useState<UserListItem[]>([])
    const [overview, setOverview] = useState<StatsOverview | null>(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            try {
                const [usersData, overviewData] = await Promise.all([
                    api.stats.getUsers('DEMO_TENANT', page, 20),
                    api.stats.getOverview(),
                ])
                setUsers(usersData)
                setOverview(overviewData)
            } catch (error) {
                console.error('Users load error:', error)
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
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground">
                    View and analyze unique visitors.
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-10 w-20" />
                        ) : (
                            <div className="text-3xl font-bold">{overview?.totalUsers?.toLocaleString() ?? 0}</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Now
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-10 w-20" />
                        ) : (
                            <>
                                <div className="text-3xl font-bold">{overview?.activeNow ?? 0}</div>
                                <Badge variant="success" className="mt-2">Live</Badge>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Avg. Session
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-10 w-20" />
                        ) : (
                            <div className="text-3xl font-bold">
                                {Math.floor((overview?.avgSessionSeconds ?? 0) / 60)}m {(overview?.avgSessionSeconds ?? 0) % 60}s
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search users by ID..." className="pl-10" />
            </div>

            {/* Users List */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border">
                        {/* Header */}
                        <div className="grid grid-cols-6 gap-4 border-b bg-muted/50 p-4 text-sm font-medium text-muted-foreground">
                            <div>Visitor ID</div>
                            <div>Sessions</div>
                            <div>Device</div>
                            <div>Browser</div>
                            <div>OS</div>
                            <div>Last Seen</div>
                        </div>

                        {/* Body */}
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <div key={i} className="grid grid-cols-6 gap-4 border-b p-4">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-8" />
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            ))
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <div
                                    key={user.visitorId}
                                    className="grid grid-cols-6 gap-4 border-b p-4 text-sm last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                                >
                                    <div className="font-mono text-xs font-medium truncate">{user.visitorId}</div>
                                    <div>{user.sessionCount}</div>
                                    <div className="flex items-center gap-2">
                                        <DeviceIcon device={user.device} />
                                        {user.device ?? '-'}
                                    </div>
                                    <div className="text-muted-foreground">{user.browser ?? '-'}</div>
                                    <div className="text-muted-foreground">{user.os ?? '-'}</div>
                                    <div className="text-muted-foreground">{formatTime(user.lastSeen)}</div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-muted-foreground">
                                No users found
                            </div>
                        )}
                    </div>

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
                                disabled={users.length < 20}
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
