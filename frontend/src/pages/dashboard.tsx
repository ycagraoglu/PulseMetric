import { Link } from 'react-router-dom';
import {
    Activity03Icon,
    AddSquareIcon,
    ArrowRight01Icon,
    ArtboardIcon,
    ChartLineData03Icon,
    CustomerSupportIcon,
    DatabaseIcon,
    File02Icon,
    GithubIcon,
    UserGroupIcon,
    UserSquareIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Mock apps data
const apps = [
    { id: '1', name: 'Mobile App', role: 'owner' },
    { id: '2', name: 'Web Dashboard', role: 'member' },
    { id: '3', name: 'API Service', role: 'owner' },
];

function Dashboard() {
    return (
        <div className="flex flex-1 flex-col gap-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="font-bold font-sans text-4xl">Welcome to Phase</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    Select an application to view analytics and insights
                </p>
            </div>

            {/* App Cards */}
            <div className="flex flex-wrap justify-center gap-4">
                {apps.map((app) => (
                    <Link to={`/users?app=${app.id}`} key={app.id}>
                        <Card
                            className={cn(
                                'w-full cursor-pointer py-0 transition-all hover:scale-[1.02] hover:shadow-lg sm:w-80'
                            )}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                        <HugeiconsIcon className="size-6" icon={ArtboardIcon} />
                                    </div>
                                    <div
                                        className={cn(
                                            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs',
                                            app.role === 'owner'
                                                ? 'bg-primary/10 text-primary'
                                                : 'bg-muted text-muted-foreground'
                                        )}
                                    >
                                        <HugeiconsIcon
                                            className="size-3"
                                            icon={app.role === 'owner' ? UserSquareIcon : UserGroupIcon}
                                        />
                                        <span className="font-medium capitalize">{app.role}</span>
                                    </div>
                                </div>
                                <h3 className="mt-4 font-semibold text-lg">{app.name}</h3>
                                <div className="mt-4 flex items-center gap-4 text-muted-foreground text-xs">
                                    <div className="flex items-center gap-1">
                                        <HugeiconsIcon className="size-3.5" icon={ChartLineData03Icon} />
                                        <span>Analytics</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <HugeiconsIcon className="size-3.5" icon={DatabaseIcon} />
                                        <span>Events</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Create New App Button */}
            <div className="flex justify-center">
                <button
                    className="flex items-center gap-2 rounded-lg border border-dashed px-6 py-3 font-medium transition-all hover:scale-[1.02] hover:border-primary hover:bg-accent"
                    type="button"
                >
                    <HugeiconsIcon className="size-5" icon={AddSquareIcon} />
                    Create New App
                </button>
            </div>

            {/* Quick Links */}
            <div className="mt-8">
                <h2 className="mb-3 font-semibold text-muted-foreground text-sm uppercase">
                    Quick Links
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <a className="block" href="/docs" target="_blank">
                        <Card className="cursor-pointer py-0 transition-colors hover:bg-accent">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-primary/10 p-3">
                                        <HugeiconsIcon className="size-5 text-primary" icon={File02Icon} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-muted-foreground text-sm uppercase">
                                            Documentation
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            Learn how to use Phase
                                        </p>
                                    </div>
                                </div>
                                <HugeiconsIcon className="size-5 text-muted-foreground" icon={ArrowRight01Icon} />
                            </CardContent>
                        </Card>
                    </a>

                    <a className="block" href="/support" target="_blank">
                        <Card className="cursor-pointer py-0 transition-colors hover:bg-accent">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-primary/10 p-3">
                                        <HugeiconsIcon className="size-5 text-primary" icon={CustomerSupportIcon} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-muted-foreground text-sm uppercase">
                                            Support
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            Get help from our team
                                        </p>
                                    </div>
                                </div>
                                <HugeiconsIcon className="size-5 text-muted-foreground" icon={ArrowRight01Icon} />
                            </CardContent>
                        </Card>
                    </a>

                    <a className="block" href="https://status.phase.sh" target="_blank" rel="noopener noreferrer">
                        <Card className="cursor-pointer py-0 transition-colors hover:bg-accent">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-primary/10 p-3">
                                        <HugeiconsIcon className="size-5 text-primary" icon={Activity03Icon} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-muted-foreground text-sm uppercase">
                                            Status
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            Check system status
                                        </p>
                                    </div>
                                </div>
                                <HugeiconsIcon className="size-5 text-muted-foreground" icon={ArrowRight01Icon} />
                            </CardContent>
                        </Card>
                    </a>

                    <a className="block" href="https://github.com/Phase-Analytics/Phase/" target="_blank" rel="noopener noreferrer">
                        <Card className="cursor-pointer py-0 transition-colors hover:bg-accent">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-primary/10 p-3">
                                        <HugeiconsIcon className="size-5 text-primary" icon={GithubIcon} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-muted-foreground text-sm uppercase">
                                            GitHub
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            View source code
                                        </p>
                                    </div>
                                </div>
                                <HugeiconsIcon className="size-5 text-muted-foreground" icon={ArrowRight01Icon} />
                            </CardContent>
                        </Card>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
