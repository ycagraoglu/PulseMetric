import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
    getStatsOverview,
    getRealtimeStats,
    getTopPages,
    getDeviceStats,
    getPageViewChart,
} from '@/services/stats';
import type { StatsOverview, RealtimeStats, TopPage, DeviceStats, ChartDataPoint } from '@/types/api';

// Query Keys
export const statsKeys = {
    all: ['stats'] as const,
    overview: () => [...statsKeys.all, 'overview'] as const,
    realtime: () => [...statsKeys.all, 'realtime'] as const,
    topPages: (limit: number) => [...statsKeys.all, 'topPages', limit] as const,
    devices: () => [...statsKeys.all, 'devices'] as const,
    pageViewChart: (days: number) => [...statsKeys.all, 'pageViewChart', days] as const,
};

/**
 * Stats overview hook'u
 */
export function useStatsOverview(options?: Omit<UseQueryOptions<StatsOverview>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: statsKeys.overview(),
        queryFn: () => getStatsOverview(),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Realtime stats hook'u (daha sık refresh)
 */
export function useRealtimeStats(options?: Omit<UseQueryOptions<RealtimeStats>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: statsKeys.realtime(),
        queryFn: () => getRealtimeStats(),
        staleTime: 5 * 1000, // 5 saniye - realtime için kısa cache
        refetchInterval: 10 * 1000, // 10 saniyede bir otomatik refresh
        ...options,
    });
}

/**
 * Top pages hook'u
 */
export function useTopPages(limit: number = 10, options?: Omit<UseQueryOptions<TopPage[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: statsKeys.topPages(limit),
        queryFn: () => getTopPages(undefined, limit),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Device stats hook'u
 */
export function useDeviceStats(options?: Omit<UseQueryOptions<DeviceStats[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: statsKeys.devices(),
        queryFn: () => getDeviceStats(),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Page view chart hook'u
 */
export function usePageViewChart(days: number = 7, options?: Omit<UseQueryOptions<ChartDataPoint[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: statsKeys.pageViewChart(days),
        queryFn: () => getPageViewChart(undefined, days),
        staleTime: 60 * 1000,
        ...options,
    });
}
