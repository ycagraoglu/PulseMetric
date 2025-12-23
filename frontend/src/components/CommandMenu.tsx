import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ComputerPhoneSyncIcon,
    PlaySquareIcon,
    Blockchain05Icon,
    GlobalIcon,
    Setting07Icon,
    Key01Icon,
    UserGroupIcon,
    Search01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type CommandItem = {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: typeof ComputerPhoneSyncIcon;
    keywords: string[];
    path: string;
    external?: boolean;
};

const commandItems: CommandItem[] = [
    {
        id: 'users',
        name: 'Users',
        description: 'Track user activity and engagement',
        category: 'Analytics',
        icon: ComputerPhoneSyncIcon,
        keywords: ['users', 'people', 'accounts', 'analytics'],
        path: '/users',
    },
    {
        id: 'sessions',
        name: 'Sessions',
        description: 'Monitor user sessions',
        category: 'Analytics',
        icon: PlaySquareIcon,
        keywords: ['sessions', 'activity', 'analytics'],
        path: '/sessions',
    },
    {
        id: 'activity',
        name: 'Activity',
        description: 'View tracked events and actions',
        category: 'Analytics',
        icon: Blockchain05Icon,
        keywords: ['activity', 'events', 'tracking', 'analytics'],
        path: '/activity',
    },
    {
        id: 'realtime',
        name: 'Realtime',
        description: 'View realtime analytics',
        category: 'Analytics',
        icon: GlobalIcon,
        keywords: ['realtime', 'analytics', 'real-time'],
        path: '/realtime',
    },
    {
        id: 'settings',
        name: 'Settings',
        description: 'Configure application settings',
        category: 'Application',
        icon: Setting07Icon,
        keywords: ['settings', 'configuration', 'preferences', 'app'],
        path: '/settings',
    },
    {
        id: 'api-keys',
        name: 'API Keys',
        description: 'Manage API keys and tokens',
        category: 'Application',
        icon: Key01Icon,
        keywords: ['api', 'keys', 'tokens', 'credentials', 'authentication'],
        path: '/api-keys',
    },
    {
        id: 'team',
        name: 'Team',
        description: 'Manage team members',
        category: 'Application',
        icon: UserGroupIcon,
        keywords: ['team', 'members', 'users', 'collaboration'],
        path: '/team',
    },
];

// Command Menu Trigger (Search Button)
function CommandMenuTrigger({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex h-9 w-48 items-center gap-2 rounded-md border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
        >
            <HugeiconsIcon icon={Search01Icon} className="size-4" />
            <span className="flex-1 text-left">Search</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
            </kbd>
        </button>
    );
}

// Command Menu Dialog
function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const filteredItems = useMemo(() => {
        if (!search) return commandItems;
        const query = search.toLowerCase();
        return commandItems.filter(
            (item) =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.keywords.some((k) => k.includes(query))
        );
    }, [search]);

    // Reset selection when search changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    // Reset search when dialog closes
    useEffect(() => {
        if (!open) {
            setSearch('');
            setSelectedIndex(0);
        }
    }, [open]);

    // Handle keyboard navigation
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((i) => Math.min(i + 1, filteredItems.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const item = filteredItems[selectedIndex];
                if (item) {
                    if (item.external) {
                        window.open(item.path, '_blank');
                    } else {
                        navigate(item.path);
                    }
                    onOpenChange(false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, filteredItems, selectedIndex, navigate, onOpenChange]);

    // Group items by category
    const groupedItems = useMemo(() => {
        const groups: Record<string, CommandItem[]> = {};
        for (const item of filteredItems) {
            if (!groups[item.category]) {
                groups[item.category] = [];
            }
            groups[item.category].push(item);
        }
        return groups;
    }, [filteredItems]);

    let itemIndex = 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg overflow-hidden p-0">
                <div className="flex items-center border-b px-3">
                    <HugeiconsIcon icon={Search01Icon} className="size-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
                        autoFocus
                    />
                </div>
                <div className="max-h-[300px] overflow-y-auto p-2">
                    {filteredItems.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">No results found.</p>
                    ) : (
                        Object.entries(groupedItems).map(([category, items]) => (
                            <div key={category}>
                                <p className="mb-1 px-2 text-xs font-medium text-muted-foreground">{category}</p>
                                {items.map((item) => {
                                    const currentIndex = itemIndex++;
                                    const isSelected = currentIndex === selectedIndex;
                                    return (
                                        <button
                                            key={item.id}
                                            className={cn(
                                                'flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors',
                                                isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
                                            )}
                                            onClick={() => {
                                                if (item.external) {
                                                    window.open(item.path, '_blank');
                                                } else {
                                                    navigate(item.path);
                                                }
                                                onOpenChange(false);
                                            }}
                                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                                        >
                                            <HugeiconsIcon icon={item.icon} className="size-4 text-muted-foreground" />
                                            <div className="flex-1">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.description}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export { CommandMenu, CommandMenuTrigger };
