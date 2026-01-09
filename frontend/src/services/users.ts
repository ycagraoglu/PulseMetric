import { apiClient } from './api';
import type { User, UserDetails, DateRangeParams, PaginationParams } from '@/types/api';

// ============================================
// Constants
// ============================================

const USERS_BASE = '/api/users';

// ============================================
// Types
// ============================================

export type Platform = 'iOS' | 'Android' | 'Web';
export type PlatformIcon = 'ios' | 'android' | 'web';

export interface GetUsersParams extends PaginationParams {
    tenantId?: string;
    from?: string;
    to?: string;
    platform?: Platform;
    country?: string;
}

export interface UsersCountResponse {
    total: number;
    dailyActive: number;
    online: number;
    changePercent: number;
}

export interface PlatformDistributionItem {
    name: string;
    icon: PlatformIcon;
    count: number;
    percentage: number;
}

export interface CountryItem {
    name: string;
    countryCode: string;
    count: number;
    percentage: number;
}

export interface CityItem extends CountryItem {
    country: string;
}

export interface GeoDistributionResponse {
    countries: CountryItem[];
    cities: CityItem[];
}

export interface ChartDataPoint {
    date: string;
    value: number;
}

export interface UsersChartResponse {
    totalUsers: ChartDataPoint[];
    dailyActive: ChartDataPoint[];
}

// ============================================
// Helper Functions
// ============================================

const buildUrl = (path: string = '') => `${USERS_BASE}${path}`;
const withTenantParams = (tenantId?: string) => ({ params: { tenantId } });

// ============================================
// Query Keys
// ============================================

export const usersQueryKeys = {
    all: ['users'] as const,
    list: (params: GetUsersParams) => ['users', 'list', params] as const,
    count: ['users-count'] as const,
    platforms: ['users-platforms'] as const,
    geo: ['users-geo'] as const,
    chart: (days: number) => ['users-chart', days] as const,
    details: (visitorId: string) => ['users', 'detail', visitorId] as const,
};

// ============================================
// API Functions
// ============================================

/** Kullanıcı listesi */
export const getUsers = async (params: GetUsersParams = {}): Promise<User[]> => {
    const { data } = await apiClient.get(buildUrl(), { params });
    return data;
};

/** Kullanıcı detayları */
export const getUserDetails = async (
    visitorId: string,
    tenantId?: string
): Promise<UserDetails> => {
    const { data } = await apiClient.get(buildUrl(`/${visitorId}`), withTenantParams(tenantId));
    return data;
};

/** Kullanıcı sayısı (KPI için) */
export const getUsersCount = async (
    tenantId?: string,
    dateRange?: DateRangeParams
): Promise<UsersCountResponse> => {
    const { data } = await apiClient.get(buildUrl('/count'), {
        params: { tenantId, ...dateRange },
    });
    return data;
};

/** Platform dağılımı (iOS, Android, Web) */
export const getPlatformDistribution = async (
    tenantId?: string
): Promise<PlatformDistributionItem[]> => {
    const { data } = await apiClient.get(buildUrl('/platforms'), withTenantParams(tenantId));
    return data;
};

/** Coğrafi dağılım (ülke ve şehir) */
export const getGeoDistribution = async (
    tenantId?: string
): Promise<GeoDistributionResponse> => {
    const { data } = await apiClient.get(buildUrl('/geo'), withTenantParams(tenantId));
    return data;
};

/** Kullanıcı chart verisi (Total vs Daily Active) */
export const getUsersChart = async (
    tenantId?: string,
    days: number = 7
): Promise<UsersChartResponse> => {
    const { data } = await apiClient.get(buildUrl('/chart'), {
        params: { tenantId, days },
    });
    return data;
};

// ============================================
// Utility Functions
// ============================================

/** Default empty platform data */
export const getDefaultPlatforms = (): PlatformDistributionItem[] => [
    { name: "iOS", icon: "ios", count: 0, percentage: 0 },
    { name: "Android", icon: "android", count: 0, percentage: 0 },
    { name: "Web", icon: "web", count: 0, percentage: 0 },
];

/** Default empty geo data */
export const getDefaultGeo = (): GeoDistributionResponse => ({
    countries: [],
    cities: [],
});

/** Format user display name */
export const formatUserName = (user: User): string =>
    user.name || `User ${user.visitorId?.slice(-6) || 'Unknown'}`;
