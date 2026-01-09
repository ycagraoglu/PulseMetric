import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
    getUsers,
    getUserDetails,
    getUsersCount,
    getPlatformDistribution,
    getGeoDistribution,
    getUsersChart,
    type GetUsersParams,
} from '@/services/users';
import type { User, UserDetails } from '@/types/api';

// Query Keys
export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (params: GetUsersParams) => [...userKeys.lists(), params] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (visitorId: string) => [...userKeys.details(), visitorId] as const,
    counts: () => [...userKeys.all, 'count'] as const,
    platforms: () => [...userKeys.all, 'platforms'] as const,
    geo: () => [...userKeys.all, 'geo'] as const,
    chart: (days: number) => [...userKeys.all, 'chart', days] as const,
};

/**
 * Kullanıcı listesi hook'u
 */
export function useUsers(params: GetUsersParams = {}, options?: Omit<UseQueryOptions<User[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: userKeys.list(params),
        queryFn: () => getUsers(params),
        staleTime: 30 * 1000, // 30 saniye cache
        ...options,
    });
}

/**
 * Kullanıcı detayları hook'u
 */
export function useUserDetails(visitorId: string, options?: Omit<UseQueryOptions<UserDetails>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: userKeys.detail(visitorId),
        queryFn: () => getUserDetails(visitorId),
        enabled: !!visitorId,
        ...options,
    });
}

/**
 * Kullanıcı sayıları (KPI) hook'u
 */
export function useUsersCount(options?: Omit<UseQueryOptions<ReturnType<typeof getUsersCount> extends Promise<infer T> ? T : never>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: userKeys.counts(),
        queryFn: () => getUsersCount(),
        staleTime: 60 * 1000, // 1 dakika cache
        ...options,
    });
}

/**
 * Platform dağılımı hook'u
 */
export function usePlatformDistribution(options?: UseQueryOptions) {
    return useQuery({
        queryKey: userKeys.platforms(),
        queryFn: () => getPlatformDistribution(),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Coğrafi dağılım hook'u
 */
export function useGeoDistribution(options?: UseQueryOptions) {
    return useQuery({
        queryKey: userKeys.geo(),
        queryFn: () => getGeoDistribution(),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Kullanıcı chart hook'u
 */
export function useUsersChart(days: number = 7, options?: UseQueryOptions) {
    return useQuery({
        queryKey: userKeys.chart(days),
        queryFn: () => getUsersChart(undefined, days),
        staleTime: 60 * 1000,
        ...options,
    });
}
