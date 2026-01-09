import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * StatCard için skeleton - gerçek kartın yapısını yansıtır
 */
export function StatCardSkeleton() {
    return (
        <Card className="bg-card border-border">
            <CardContent className="p-5">
                {/* Label */}
                <Skeleton className="h-3 w-24 mb-3" />
                {/* Value */}
                <Skeleton className="h-10 w-20 mb-2" />
                {/* Change indicator */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Chart için skeleton - grafik yapısını yansıtır
 */
export function ChartSkeleton() {
    return (
        <Card className="bg-card border-border">
            <CardContent className="p-5">
                {/* Tabs */}
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-9 w-32" />
                </div>
                {/* Description */}
                <Skeleton className="h-4 w-64 mb-6" />
                {/* Chart area with fake bars */}
                <div className="h-64 flex items-end justify-between gap-2 px-4">
                    {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <Skeleton className="w-full rounded-t" style={{ height: `${height}%` }} />
                            <Skeleton className="h-3 w-12" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Users tablosu için skeleton
 */
export function UsersTableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <Card className="bg-card border-border">
            <CardContent className="p-5">
                {/* Header */}
                <div className="mb-4">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-48" />
                </div>
                {/* Search */}
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-9 w-20" />
                </div>
                {/* Table */}
                <div className="border border-border rounded-lg overflow-hidden">
                    {/* Table header */}
                    <div className="flex items-center gap-4 p-4 bg-secondary/30 border-b border-border">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-24 ml-auto" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    {/* Table rows */}
                    {Array.from({ length: rows }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-4 w-16 ml-auto" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-4" />
                        </div>
                    ))}
                </div>
                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Platform Distribution için skeleton
 */
export function PlatformDistributionSkeleton() {
    return (
        <Card className="bg-card border-border">
            <CardContent className="p-5">
                <Skeleton className="h-4 w-40 mb-4" />
                <div className="space-y-4">
                    {[75, 60, 40].map((width, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-5 rounded" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <Skeleton className="h-4 w-12" />
                            </div>
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Geo Distribution için skeleton
 */
export function GeoDistributionSkeleton() {
    return (
        <Card className="bg-card border-border">
            <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                </div>
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-7 rounded" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Top Events/Screens için skeleton
 */
export function TopListSkeleton() {
    return (
        <Card className="bg-card border-border">
            <CardContent className="p-5">
                <Skeleton className="h-4 w-24 mb-4" />
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-6 rounded" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-10" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
