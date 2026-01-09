import { apiClient } from './api';
import type { EventItem, EventAggregation, PaginationParams } from '@/types/api';

// ============================================
// Constants
// ============================================

const EVENTS_BASE = '/api/stats/events';

// ============================================
// Types
// ============================================

export interface GetEventsParams extends PaginationParams {
    tenantId?: string;
    from?: string;
    to?: string;
    eventName?: string;
    visitorId?: string;
    sessionId?: string;
}

export interface EventsCountResponse {
    total: number;
    todayCount: number;
    uniqueEventTypes: number;
    avgPerSession: number;
}

export interface ChartDataPoint {
    date: string;
    value: number;
}

export type EventType = 'view' | 'action';

// ============================================
// Helper Functions
// ============================================

const buildUrl = (path: string = '') => `${EVENTS_BASE}${path}`;
const withTenantParams = (tenantId?: string) => ({ params: { tenantId } });

// ============================================
// Query Keys
// ============================================

export const eventsQueryKeys = {
    all: ['events'] as const,
    list: (params: GetEventsParams) => ['events', 'list', params] as const,
    count: ['events-count'] as const,
    chart: (days: number) => ['events-chart', days] as const,
    aggregations: ['events-aggregations'] as const,
    types: ['events-types'] as const,
};

// ============================================
// API Functions
// ============================================

/** Event listesi */
export const getEvents = async (params: GetEventsParams = {}): Promise<EventItem[]> => {
    const { data } = await apiClient.get(buildUrl(), { params });
    return data;
};

/** Event aggregations (event tiplerine göre gruplu sayılar) */
export const getEventAggregations = async (tenantId?: string): Promise<EventAggregation[]> => {
    const { data } = await apiClient.get(buildUrl('/aggregations'), withTenantParams(tenantId));
    return data;
};

/** Event sayısı (KPI için) */
export const getEventsCount = async (tenantId?: string): Promise<EventsCountResponse> => {
    const { data } = await apiClient.get(buildUrl('/count'), withTenantParams(tenantId));
    return data;
};

/** Event chart verisi */
export const getEventsChart = async (
    tenantId?: string,
    days: number = 7
): Promise<ChartDataPoint[]> => {
    const { data } = await apiClient.get(buildUrl('/chart'), {
        params: { tenantId, days },
    });
    return data;
};

/** Event tipleri listesi */
export const getEventTypes = async (tenantId?: string): Promise<string[]> => {
    const { data } = await apiClient.get(buildUrl('/types'), withTenantParams(tenantId));
    return data;
};

// ============================================
// Utility Functions
// ============================================

/** Determine event type from event name */
export const getEventType = (eventName: string): EventType =>
    eventName.includes('view') || eventName.includes('page') ? 'view' : 'action';

/** Format user display name from visitor ID */
export const formatEventUserName = (visitorId: string): string =>
    `User ${visitorId?.slice(-6) || 'Unknown'}`;

/** Calculate percentage for aggregation */
export const calcPercentage = (count: number, total: number): number =>
    Math.round((count / (total || 1)) * 1000) / 10;

/** Transform aggregations to top events format */
export const transformToTopEvents = (
    aggregations: EventAggregation[]
): { name: string; count: number; percentage: number }[] => {
    const total = aggregations.reduce((sum, a) => sum + a.count, 0);
    return aggregations.map((a) => ({
        name: a.eventName,
        count: a.count,
        percentage: calcPercentage(a.count, total),
    }));
};
