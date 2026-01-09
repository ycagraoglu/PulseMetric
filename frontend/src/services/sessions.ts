import { apiClient } from './api';
import type { Session, SessionDetails, PaginationParams } from '@/types/api';

// ============================================
// Constants
// ============================================

const SESSIONS_BASE = '/api/sessions';

// ============================================
// Types
// ============================================

export interface GetSessionsParams extends PaginationParams {
    tenantId?: string;
    from?: string;
    to?: string;
    visitorId?: string;
    device?: string;
    country?: string;
}

export interface SessionsCountResponse {
    total: number;
    todayCount: number;
    avgDuration: number;
    avgEventsPerSession: number;
    bounceRate: number;
}

export interface ChartDataPoint {
    date: string;
    value: number;
}

// ============================================
// Helper Functions
// ============================================

const buildUrl = (path: string = '') => `${SESSIONS_BASE}${path}`;
const withTenantParams = (tenantId?: string) => ({ params: { tenantId } });

// ============================================
// Query Keys
// ============================================

export const sessionsQueryKeys = {
    all: ['sessions'] as const,
    list: (params: GetSessionsParams) => ['sessions', params] as const,
    count: ['sessions-count'] as const,
    chart: (days: number) => ['sessions-chart', days] as const,
    details: (id: string) => ['session-details', id] as const,
};

// ============================================
// API Functions
// ============================================

/** Session listesi */
export const getSessions = async (params: GetSessionsParams = {}): Promise<Session[]> => {
    const { data } = await apiClient.get(buildUrl(), { params });
    return data;
};

/** Session detayları (eventler dahil) */
export const getSessionDetails = async (
    sessionId: string,
    tenantId?: string
): Promise<SessionDetails> => {
    const { data } = await apiClient.get(buildUrl(`/${sessionId}`), withTenantParams(tenantId));
    return data;
};

/** Session sayısı (KPI için) */
export const getSessionsCount = async (tenantId?: string): Promise<SessionsCountResponse> => {
    const { data } = await apiClient.get(buildUrl('/count'), withTenantParams(tenantId));
    return data;
};

/** Session chart verisi */
export const getSessionsChart = async (
    tenantId?: string,
    days: number = 7
): Promise<ChartDataPoint[]> => {
    const { data } = await apiClient.get(buildUrl('/chart'), {
        params: { tenantId, days },
    });
    return data;
};

// ============================================
// Utility Functions
// ============================================

/** Format duration to human readable string */
export const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

/** Format date to Turkish locale string */
export const formatSessionDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('tr-TR');
};

/** Format time only */
export const formatSessionTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
};
