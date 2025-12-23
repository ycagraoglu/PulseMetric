import { CheckmarkSquare01Icon, Copy01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useState, useCallback, type MouseEvent } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type CopyButtonProps = {
    content: string;
    className?: string;
    variant?: 'default' | 'ghost' | 'outline';
    onCopiedChange?: (copied: boolean, content?: string) => void;
    delay?: number;
};

export function CopyButton({
    content,
    className,
    variant = 'ghost',
    onCopiedChange,
    delay = 2000,
}: CopyButtonProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            if (isCopied) return;

            if (content) {
                navigator.clipboard
                    .writeText(content)
                    .then(() => {
                        setIsCopied(true);
                        onCopiedChange?.(true, content);
                        toast('Copied');
                        setTimeout(() => {
                            setIsCopied(false);
                            onCopiedChange?.(false);
                        }, delay);
                    })
                    .catch((error) => {
                        console.error('Error copying', error);
                        toast.error('Failed to copy');
                    });
            }
        },
        [isCopied, content, onCopiedChange, delay]
    );

    const variantClasses = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        outline: 'border bg-background hover:bg-accent hover:text-accent-foreground',
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={cn(
                'flex shrink-0 items-center justify-center rounded-md outline-none transition-all',
                variantClasses[variant],
                className
            )}
        >
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={isCopied ? 'check' : 'copy'}
                    animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ scale: 0, opacity: 0.4, filter: 'blur(4px)' }}
                    initial={{ scale: 0, opacity: 0.4, filter: 'blur(4px)' }}
                    transition={{ duration: 0.25 }}
                >
                    <HugeiconsIcon icon={isCopied ? CheckmarkSquare01Icon : Copy01Icon} />
                </motion.span>
            </AnimatePresence>
        </button>
    );
}
