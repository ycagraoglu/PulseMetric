import { useState } from 'react';
import { CheckmarkCircle02Icon, SquareIcon, ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type App = {
    id: string;
    name: string;
    icon?: string;
};

const mockApps: App[] = [
    { id: '1', name: 'Artover' },
    { id: '2', name: 'MyApp' },
    { id: '3', name: 'Dashboard Pro' },
];

type AppSwitcherProps = {
    variant?: 'standalone' | 'sidebar';
    className?: string;
};

function AppSwitcher({ variant = 'standalone', className }: AppSwitcherProps) {
    const [open, setOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState<App>(mockApps[0]);

    return (
        <div className={cn('relative', className)}>
            <Button
                variant="outline"
                onClick={() => setOpen(!open)}
                className={cn(
                    'flex items-center gap-2 font-medium',
                    variant === 'standalone' && 'h-9 px-3'
                )}
            >
                <div className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
                    <HugeiconsIcon icon={SquareIcon} className="size-4 text-white" />
                </div>
                <span>{selectedApp.name}</span>
                <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 text-muted-foreground" />
            </Button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-50"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-md border bg-popover p-1 shadow-md">
                        <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Applications</p>
                        {mockApps.map((app) => (
                            <button
                                key={app.id}
                                onClick={() => {
                                    setSelectedApp(app);
                                    setOpen(false);
                                }}
                                className={cn(
                                    'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent',
                                    selectedApp.id === app.id && 'bg-accent'
                                )}
                            >
                                <div className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
                                    <HugeiconsIcon icon={SquareIcon} className="size-3 text-white" />
                                </div>
                                <span className="flex-1 text-left">{app.name}</span>
                                {selectedApp.id === app.id && (
                                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4 text-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export { AppSwitcher };
