export type HttpStatus = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 405 | 409 | 429 | 500;

export type ErrorCode =
    | 'VALIDATION_ERROR'
    | 'BAD_REQUEST'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'METHOD_NOT_ALLOWED'
    | 'CONFLICT'
    | 'TOO_MANY_REQUESTS'
    | 'INTERNAL_SERVER_ERROR';

export type ErrorResponse<TMeta extends Record<string, unknown> | undefined = undefined> = {
    code: ErrorCode;
    detail: string;
} & (TMeta extends undefined ? { meta?: Record<string, unknown> } : { meta: TMeta });

export type PaginationMeta = {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

export type PaginationQuery = {
    page?: string;
    pageSize?: string;
};

export type DateFilterQuery = {
    startDate?: string;
    endDate?: string;
};

export type PaginationQueryParams = {
    page?: string;
    pageSize?: string;
};

export type DateFilterQueryParams = {
    startDate?: string;
    endDate?: string;
};

export type DateRangeParams = {
    startDate?: string;
    endDate?: string;
};

export type TimeRange = '7d' | '30d' | '90d' | 'all';

export type Platform = 'ios' | 'android' | 'unknown';
export type DeviceType = 'phone' | 'tablet' | 'desktop' | 'unknown';
export type DeviceProperties = Record<string, string | number | boolean | null>;
export type PropertyOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'startsWith' | 'endsWith';

export type PropertySearchCondition = {
    key: string;
    operator: PropertyOperator;
    value: string | number | boolean | null;
};

export type PropertySearchFilter = PropertySearchCondition[];

export type Device = {
    deviceId: string;
    deviceType: DeviceType | null;
    osVersion: string | null;
    platform: Platform | null;
    locale: string | null;
    country: string | null;
    city: string | null;
    properties: DeviceProperties | null;
    firstSeen: string;
};

export type CreateDeviceRequest = {
    deviceId: string;
    deviceType?: DeviceType | null;
    osVersion?: string | null;
    platform?: Platform | null;
    locale?: string | null;
    properties?: DeviceProperties;
    disableGeolocation?: boolean;
};

export type DeviceListItem = {
    deviceId: string;
    platform: Platform | null;
    country: string | null;
    city: string | null;
    firstSeen: string;
};

export type DeviceDetail = {
    deviceId: string;
    deviceType: DeviceType | null;
    osVersion: string | null;
    platform: Platform | null;
    locale: string | null;
    country: string | null;
    city: string | null;
    properties: DeviceProperties | null;
    firstSeen: string;
    lastActivityAt: string | null;
};

export type DevicesListResponse = {
    devices: DeviceListItem[];
    pagination: PaginationMeta;
};

export type DeviceOverviewResponse = {
    totalDevices: number;
    activeDevices24h: number;
    platformStats: Record<string, number>;
    countryStats: Record<string, number>;
    cityStats: Record<string, { count: number; country: string }>;
    totalDevicesChange24h: number;
    activeDevicesChange24h: number;
};

export type DevicePlatformOverviewResponse = {
    totalDevices: number;
    activeDevices24h: number;
    platformStats: Record<string, number>;
    totalDevicesChange24h: number;
    activeDevicesChange24h: number;
};

export type DeviceLocationOverviewResponse = {
    totalDevices: number;
    countryStats: Record<string, number>;
    cityStats: Record<string, { count: number; country: string }>;
};

export type DeviceTimeseriesDataPoint = {
    date: string;
    activeUsers?: number;
    totalUsers?: number;
};

export type DeviceTimeseriesResponse = {
    data: DeviceTimeseriesDataPoint[];
    period: {
        startDate: string;
        endDate: string;
    };
};

export type DeviceLiveResponse = {
    activeNow: number;
};

export type DeviceActivityTimeseriesDataPoint = {
    date: string;
    sessionCount: number;
};

export type DeviceActivityTimeseriesResponse = {
    data: DeviceActivityTimeseriesDataPoint[];
    period: {
        startDate: string;
        endDate: string;
    };
    totalSessions: number;
    avgSessionDuration: number | null;
    firstSeen: string;
    lastActivityAt: string | null;
};

export type ListDevicesQuery = {
    page?: string;
    pageSize?: string;
    startDate?: string;
    endDate?: string;
    platform?: Platform;
    properties?: string;
    appId: string;
};

export type GetDeviceQuery = {
    appId: string;
};

export type DeviceOverviewQuery = {
    appId: string;
};

export type DevicePlatformOverviewQuery = {
    appId: string;
};

export type DeviceLocationOverviewQuery = {
    appId: string;
    limit?: 'top3' | 'all';
};

export type DeviceLiveQuery = {
    appId: string;
};

export type DeviceTimeseriesQuery = {
    appId: string;
    startDate?: string;
    endDate?: string;
    metric?: 'dau' | 'total';
};

export type DeviceActivityTimeseriesQuery = {
    appId: string;
    startDate?: string;
    endDate?: string;
};

export type DeviceMetric = 'dau' | 'total';
