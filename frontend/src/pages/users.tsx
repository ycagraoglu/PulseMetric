import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Monitor, Smartphone, Tablet } from "lucide-react"

const users = [
    { id: "v_abc123", sessions: 12, lastSeen: "2 min ago", device: "Desktop", browser: "Chrome", os: "Windows" },
    { id: "v_def456", sessions: 8, lastSeen: "15 min ago", device: "Mobile", browser: "Safari", os: "iOS" },
    { id: "v_ghi789", sessions: 23, lastSeen: "1 hour ago", device: "Desktop", browser: "Firefox", os: "macOS" },
    { id: "v_jkl012", sessions: 5, lastSeen: "2 hours ago", device: "Tablet", browser: "Chrome", os: "Android" },
    { id: "v_mno345", sessions: 15, lastSeen: "3 hours ago", device: "Desktop", browser: "Edge", os: "Windows" },
    { id: "v_pqr678", sessions: 3, lastSeen: "5 hours ago", device: "Mobile", browser: "Chrome", os: "Android" },
]

function DeviceIcon({ device }: { device: string }) {
    switch (device) {
        case "Mobile":
            return <Smartphone className="h-4 w-4" />
        case "Tablet":
            return <Tablet className="h-4 w-4" />
        default:
            return <Monitor className="h-4 w-4" />
    }
}

export function UsersPage() {
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
                        <div className="text-3xl font-bold">12,543</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Returning Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">4,231</div>
                        <Badge variant="secondary" className="mt-2">33.7%</Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            New Users (Today)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">342</div>
                        <Badge variant="success" className="mt-2">+12%</Badge>
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
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="grid grid-cols-6 gap-4 border-b p-4 text-sm last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                            >
                                <div className="font-mono text-xs font-medium">{user.id}</div>
                                <div>{user.sessions}</div>
                                <div className="flex items-center gap-2">
                                    <DeviceIcon device={user.device} />
                                    {user.device}
                                </div>
                                <div className="text-muted-foreground">{user.browser}</div>
                                <div className="text-muted-foreground">{user.os}</div>
                                <div className="text-muted-foreground">{user.lastSeen}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                            Showing 6 of 12,543 users
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
