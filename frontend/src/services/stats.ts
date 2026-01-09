import { apiClient } from './api';
import type {
    StatsOverview,
    RealtimeStats,
    TopPage,
    DeviceStats,
    ChartDataPoint,
    CountryStats,
} from '@/types/api';

const STATS_BASE = '/api/stats';

/**
 * Genel istatistik özeti
 */
export const getStatsOverview = async (tenantId?: string): Promise<StatsOverview> => {
    const { data } = await apiClient.get(`${STATS_BASE}/overview`, {
        params: { tenantId },
    });
    return data;
};

/**
 * Realtime (canlı) istatistikler
 */
export const getRealtimeStats = async (tenantId?: string): Promise<RealtimeStats> => {
    const { data } = await apiClient.get(`${STATS_BASE}/realtime`, {
        params: { tenantId },
    });
    return data;
};

/**
 * En popüler sayfalar
 */
export const getTopPages = async (
    tenantId?: string,
    limit: number = 10
): Promise<TopPage[]> => {
    const { data } = await apiClient.get(`${STATS_BASE}/top-pages`, {
        params: { tenantId, limit },
    });
    return data;
};

/**
 * Cihaz dağılımı
 */
export const getDeviceStats = async (tenantId?: string): Promise<DeviceStats[]> => {
    const { data } = await apiClient.get(`${STATS_BASE}/devices`, {
        params: { tenantId },
    });
    return data;
};

/**
 * Sayfa görüntüleme chart verisi
 */
export const getPageViewChart = async (
    tenantId?: string,
    days: number = 7
): Promise<ChartDataPoint[]> => {
    const { data } = await apiClient.get(`${STATS_BASE}/chart/pageviews`, {
        params: { tenantId, days },
    });
    return data;
};

/**
 * Ülke bazlı dağılım
 */
export const getCountryStats = async (tenantId?: string): Promise<CountryStats[]> => {
    const { data } = await apiClient.get(`${STATS_BASE}/countries`, {
        params: { tenantId },
    });
    return data;
};
