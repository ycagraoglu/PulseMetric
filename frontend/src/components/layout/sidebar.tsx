import { NavLink } from "react-router-dom"
import {
    LayoutDashboard,
    Activity,
    Users,
    MousePointerClick,
    Settings,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Realtime", href: "/realtime", icon: Activity },
    { name: "Users", href: "/users", icon: Users },
    { name: "Events", href: "/events", icon: MousePointerClick },
]

const secondaryNav = [
    { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
    return (
        <aside className="flex h-screen w-64 flex-col border-r bg-sidebar">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Activity className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg text-sidebar-foreground">
                    PulseMetric
                </span>
            </div>

            <Separator />

            {/* Main Navigation */}
            <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <Separator />

            {/* Secondary Navigation */}
            <nav className="space-y-1 p-4">
                {secondaryNav.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </NavLink>
                ))}

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </nav>
        </aside>
    )
}
