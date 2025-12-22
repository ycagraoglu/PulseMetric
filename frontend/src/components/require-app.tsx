import { parseAsString, useQueryState } from '@/lib/shims/nuqs';
import { Navigate } from 'react-router-dom';

export function RequireApp({ children }: { children: React.ReactNode }) {
    const [appId] = useQueryState('app', parseAsString);

    if (!appId) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
                <h2 className="text-2xl font-bold">No App Selected</h2>
                <p className="text-muted-foreground">Please select or create an app to view analytics.</p>
            </div>
        )
    }

    return <>{children}</>;
}
