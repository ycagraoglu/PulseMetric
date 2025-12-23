import { Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ThemeSelection = 'light' | 'dark';

function ThemeTogglerButton({ className }: { className?: string }) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleToggle = useCallback(() => {
        const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
    }, [resolvedTheme, setTheme]);

    // Keyboard shortcut: Ctrl/Cmd + Shift + L
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                handleToggle();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleToggle]);

    if (!mounted) {
        return (
            <Button
                className={cn(
                    'flex size-9 items-center justify-center rounded-full p-0 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
                    className
                )}
                disabled
                variant="outline"
            >
                <HugeiconsIcon icon={Sun03Icon} />
            </Button>
        );
    }

    return (
        <Button
            className={cn(
                'flex size-9 items-center justify-center rounded-full p-0 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
                className
            )}
            onClick={handleToggle}
            variant="outline"
        >
            <HugeiconsIcon icon={resolvedTheme === 'dark' ? Moon02Icon : Sun03Icon} />
        </Button>
    );
}

export { ThemeTogglerButton };
