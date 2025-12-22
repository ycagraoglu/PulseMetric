import { Skeleton } from '@/components/ui/skeleton';

export function UsersOverviewCardsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
        </div>
    );
}

export function UsersPlatformDistributionSkeleton() {
    return <Skeleton className="h-[300px] w-full rounded-xl" />;
}

export function UsersTopCountriesSkeleton() {
    return <Skeleton className="h-[300px] w-full rounded-xl" />;
}

export function UsersTableSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
    );
}
