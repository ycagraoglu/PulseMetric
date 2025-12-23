import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import {
    Activity03Icon,
    ComputerPhoneSyncIcon,
    CursorPointer02Icon,
    File02Icon,
    GithubIcon,
    GlobalIcon,
    Key01Icon,
    Layers01Icon,
    Logout01Icon,
    Mail01Icon,
    PlaySquareIcon,
    PyramidStructure02Icon,
    Setting07Icon,
    SidebarLeftIcon,
    UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';
import { AppSwitcher } from '@/components/AppSwitcher';
import { CommandMenu, CommandMenuTrigger } from '@/components/CommandMenu';
import { ThemeTogglerButton } from '@/components/ThemeToggler';

// Header Component
function Header({ isCollapsed, onToggleCollapse }: { isCollapsed: boolean; onToggleCollapse: () => void }) {
    const [commandMenuOpen, setCommandMenuOpen] = useState(false);

    // ⌘K keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCommandMenuOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <header className="flex h-14 shrink-0 items-center gap-4 border-b px-4">
                <button
                    onClick={onToggleCollapse}
                    className="flex size-8 items-center justify-center rounded-md hover:bg-accent"
                >
                    <HugeiconsIcon icon={SidebarLeftIcon} className="size-5" />
                </button>
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AppSwitcher variant="standalone" />
                    </div>
                    <div className="flex items-center gap-2">
                        <CommandMenuTrigger onClick={() => setCommandMenuOpen(true)} />
                        <ThemeTogglerButton />
                    </div>
                </div>
            </header>
            <CommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />
        </>
    );
}

// Navigation items matching phase-template exactly
const analyticsNavItems = [
    { label: 'Users', icon: ComputerPhoneSyncIcon, path: '/users' },
    { label: 'Sessions', icon: PlaySquareIcon, path: '/sessions' },
    { label: 'Activity', icon: CursorPointer02Icon, path: '/activity' },
    { label: 'Realtime', icon: GlobalIcon, path: '/realtime' },
];

const comingSoonNavItems = [
    { label: 'Segments', icon: Layers01Icon },
    { label: 'Funnels', icon: PyramidStructure02Icon },
];

const applicationNavItems = [
    { label: 'Settings', icon: Setting07Icon, path: '/settings' },
    { label: 'API Keys', icon: Key01Icon, path: '/api-keys' },
    { label: 'Team', icon: UserGroupIcon, path: '/team' },
];

const footerNavItems = [
    { label: 'Docs', icon: File02Icon, path: '/docs' },
    { label: 'Mail', icon: Mail01Icon, path: 'mailto:support@pulsemetric.com' },
    { label: 'Status', icon: Activity03Icon, path: 'https://status.pulsemetric.com' },
    { label: 'Github', icon: GithubIcon, path: 'https://github.com/' },
];

function DashboardLayout() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

    return (
        <div className="flex min-h-screen bg-sidebar">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-150",
                    sidebarWidth
                )}
                data-collapsible={isCollapsed ? 'icon' : ''}
            >
                {/* Logo Header */}
                <div className={cn(
                    "flex h-14 items-center border-b border-sidebar-border px-4",
                    isCollapsed ? "justify-center" : "gap-2"
                )}>
                    {isCollapsed ? (
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                            P
                        </div>
                    ) : (
                        <>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                                P
                            </div>
                            <span className="font-semibold text-lg">Phase</span>
                        </>
                    )}
                </div>

                {/* Sidebar Content */}
                <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-auto">
                    {/* Analytics Section */}
                    <div className="relative flex w-full min-w-0 flex-col px-2 py-1">
                        {!isCollapsed && (
                            <div className="flex h-8 shrink-0 items-center rounded-md px-2 font-medium text-sidebar-foreground/70 text-xs">
                                ANALYTICS
                            </div>
                        )}
                        <ul className="flex w-full min-w-0 flex-col gap-1">
                            {analyticsNavItems.map((item) => {
                                const isActive = location.pathname === item.path ||
                                    location.pathname.startsWith(item.path + '/');
                                return (
                                    <li key={item.label} className="group/menu-item relative">
                                        <NavLink
                                            to={item.path}
                                            className={cn(
                                                "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden transition-colors",
                                                isCollapsed && "justify-center",
                                                isActive
                                                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                            )}
                                        >
                                            <HugeiconsIcon icon={item.icon} className="size-4 shrink-0" />
                                            {!isCollapsed && <span className="font-sans">{item.label}</span>}
                                        </NavLink>
                                    </li>
                                );
                            })}
                            {comingSoonNavItems.map((item) => (
                                <li key={item.label} className="group/menu-item relative">
                                    <div className={cn(
                                        "flex w-full cursor-not-allowed items-center gap-2 rounded-md p-2 text-sm opacity-50",
                                        isCollapsed && "justify-center"
                                    )}>
                                        <HugeiconsIcon icon={item.icon} className="size-4 shrink-0" />
                                        {!isCollapsed && (
                                            <>
                                                <span className="font-sans">{item.label}</span>
                                                <span className="ml-auto rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                                                    SOON
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Application Section */}
                    <div className="relative flex w-full min-w-0 flex-col px-2 py-1">
                        {!isCollapsed && (
                            <div className="flex h-8 shrink-0 items-center rounded-md px-2 font-medium text-sidebar-foreground/70 text-xs">
                                APPLICATION
                            </div>
                        )}
                        <ul className="flex w-full min-w-0 flex-col gap-1">
                            {applicationNavItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={item.label} className="group/menu-item relative">
                                        <NavLink
                                            to={item.path}
                                            className={cn(
                                                "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden transition-colors",
                                                isCollapsed && "justify-center",
                                                isActive
                                                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                            )}
                                        >
                                            <HugeiconsIcon icon={item.icon} className="size-4 shrink-0" />
                                            {!isCollapsed && <span className="font-sans">{item.label}</span>}
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-2 p-2">
                    {!isCollapsed && <div className="mx-2 h-px bg-sidebar-border" />}
                    <ul className="flex w-full min-w-0 flex-col gap-1">
                        {footerNavItems.map((item) => (
                            <li key={item.label}>
                                <a
                                    href={item.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "flex w-full items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                        isCollapsed && "justify-center"
                                    )}
                                >
                                    <HugeiconsIcon icon={item.icon} className="size-4 shrink-0" />
                                    {!isCollapsed && <span className="font-sans">{item.label}</span>}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* User Menu */}
                    <div className={cn(
                        "flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-sidebar-accent",
                        isCollapsed && "justify-center"
                    )}>
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                            <span className="text-sm font-medium text-white">U</span>
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col gap-0.5 leading-none flex-1 min-w-0">
                                <span className="font-sans font-semibold text-sm truncate">User</span>
                                <span className="font-sans text-sidebar-foreground/70 text-xs truncate">user@example.com</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main
                className={cn(
                    "relative flex w-full flex-1 flex-col bg-background transition-all duration-150",
                    isCollapsed ? "ml-16" : "ml-64",
                    "md:m-2 md:ml-0 md:rounded-xl md:shadow-sm"
                )}
                style={{ marginLeft: isCollapsed ? '4rem' : '16rem' }}
            >
                {/* Header */}
                <Header isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />

                {/* Page Content */}
                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default DashboardLayout;
