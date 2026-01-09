import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
    getEvents,
    getEventAggregations,
    getEventsCount,
    getEventsChart,
    getEventTypes,
    type GetEventsParams,
} from '@/services/events';
import type { EventItem, EventAggregation } from '@/types/api';

// Query Keys
export const eventKeys = {
    all: ['events'] as const,
    lists: () => [...eventKeys.all, 'list'] as const,
    list: (params: GetEventsParams) => [...eventKeys.lists(), params] as const,
    aggregations: () => [...eventKeys.all, 'aggregations'] as const,
    counts: () => [...eventKeys.all, 'count'] as const,
    chart: (days: number) => [...eventKeys.all, 'chart', days] as const,
    types: () => [...eventKeys.all, 'types'] as const,
};

/**
 * Event listesi hook'u
 */
export function useEvents(params: GetEventsParams = {}, options?: Omit<UseQueryOptions<EventItem[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: eventKeys.list(params),
        queryFn: () => getEvents(params),
        staleTime: 30 * 1000,
        ...options,
    });
}

/**
 * Event aggregations hook'u
 */
export function useEventAggregations(options?: Omit<UseQueryOptions<EventAggregation[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: eventKeys.aggregations(),
        queryFn: () => getEventAggregations(),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Event sayıları (KPI) hook'u
 */
export function useEventsCount(options?: UseQueryOptions) {
    return useQuery({
        queryKey: eventKeys.counts(),
        queryFn: () => getEventsCount(),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Event chart hook'u
 */
export function useEventsChart(days: number = 7, options?: UseQueryOptions) {
    return useQuery({
        queryKey: eventKeys.chart(days),
        queryFn: () => getEventsChart(undefined, days),
        staleTime: 60 * 1000,
        ...options,
    });
}

/**
 * Event types hook'u
 */
export function useEventTypes(options?: Omit<UseQueryOptions<string[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: eventKeys.types(),
        queryFn: () => getEventTypes(),
        staleTime: 5 * 60 * 1000, // 5 dakika - event tipleri nadiren değişir
        ...options,
    });
}
