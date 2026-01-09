import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
    getSessions,
    getSessionDetails,
    getSessionsCount,
    getSessionsChart,
    type GetSessionsParams,
} from '@/services/sessions';
import type { Session, SessionDetails } from '@/types/api';

// Query Keys
export const sessionKeys = {
    all: ['sessions'] as const,
    lists: () => [...sessionKeys.all, 'list'] as const,
    list: (params: GetSessionsParams) => [...sessionKeys.lists(), params] as const,
    details: () => [...sessionKeys.all, 'detail'] as const,
    detail: (sessionId: string) => [...sessionKeys.details(), sessionId] as const,
    counts: () => [...sessionKeys.all, 'count'] as const,
    chart: (days: number) => [...sessionKeys.all, 'chart', days] as const,
};

/**
 * Session listesi hook'u
 */
export function useSessions(params: GetSessionsParams = {}, options?: Omit<UseQueryOptions<Session[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: sessionKeys.list(params),
        queryFn: () => getSessions(params),
        staleTime: 30 * 1000,
        ...options,
    });
}

/**
 * Session detayları hook'u
 */
export function useSessionDetails(sessionId: string, options?: Omit<UseQueryOptions<SessionDetails>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: sessionKeys.detail(sessionId),
        queryFn: () => getSessionDetails(sessionId),
        enabled: !!sessionId,
        ...options,
    });
}

/**
 * Session sayıları (KPI) hook'u
 */
export function useSessionsCount(options?: UseQueryOptions) {
    return useQuery({
        queryKey: sessionKeys.counts(),
        queryFn: () => getSessionsCount(),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Session chart hook'u
 */
export function useSessionsChart(days: number = 7, options?: UseQueryOptions) {
    return useQuery({
        queryKey: sessionKeys.chart(days),
        queryFn: () => getSessionsChart(undefined, days),
        staleTime: 60 * 1000,
        ...options,
    });
}
