
import {
    DevicesListResponse,
    DeviceOverviewResponse,
    DeviceLiveResponse,
    DeviceTimeseriesResponse,
    DeviceActivityTimeseriesResponse,
    DeviceDetail,
    TimeRange,
    DeviceMetric
} from './api/types';

// Constants to ensure consistent data
const COUNTRIES_LIST = ['US', 'DE', 'GB', 'FR', 'JP', 'BR', 'CA', 'AU', 'IN', 'CN'];
const CITIES_LIST = ['New York', 'Berlin', 'London', 'Paris', 'Tokyo', 'Sao Paulo', 'Toronto', 'Sydney', 'Mumbai', 'Beijing'];
const PLATFORMS_LIST = ['ios', 'android', 'web'];

// Random number generator in a range
const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// --- MOCK QUERY HOOKS ---

// @ts-ignore
export function useDevices(_appId: string, filters?: any) {
    // Simulate loading and return data
    const data: DevicesListResponse = {
        devices: Array.from({ length: 10 }).map((_) => ({
            deviceId: `device-${Math.random().toString(36).substr(2, 9)}`,
            platform: PLATFORMS_LIST[getRandomInt(0, 2)] as any,
            country: COUNTRIES_LIST[getRandomInt(0, 9)],
            city: CITIES_LIST[getRandomInt(0, 9)],
            firstSeen: new Date(Date.now() - getRandomInt(0, 100000000)).toISOString(),
        })),
        pagination: {
            total: 12450,
            page: Number(filters?.page) || 1,
            pageSize: Number(filters?.pageSize) || 10,
            totalPages: 1245,
        },
    };

    return { data, isLoading: false };
}

// @ts-ignore
export function useDevice(deviceId: string, _appId: string) {
    const data: DeviceDetail = {
        deviceId,
        deviceType: 'phone',
        osVersion: '17.2',
        platform: 'ios',
        locale: 'en-US',
        country: 'US',
        city: 'New York',
        properties: { model: 'iPhone 15' },
        firstSeen: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
    };
    return { data, isLoading: false };
}

// @ts-ignore
export function useDeviceOverviewResponse(_appId: string) {
    const data: DeviceOverviewResponse = {
        totalDevices: 12847,
        activeDevices24h: 3421,
        platformStats: {
            ios: 6234,
            android: 4123,
            unknown: 2490,
        },
        countryStats: {
            US: 4500,
            DE: 2100,
            GB: 1800,
            FR: 1200,
            JP: 900,
        },
        cityStats: {
            'New York': { count: 1200, country: 'US' },
            'Berlin': { count: 800, country: 'DE' },
            'London': { count: 750, country: 'GB' },
        },
        totalDevicesChange24h: 12,
        activeDevicesChange24h: -2.1,
    };

    return { data, isLoading: false };
}

// @ts-ignore
export function useDeviceLiveResponse(_appId: string) {
    const data: DeviceLiveResponse = {
        activeNow: 42,
    };
    return { data, isLoading: false };
}

// @ts-ignore
export function useDeviceTimeseries(
    _appId: string,
    _range?: TimeRange,
    _metric?: DeviceMetric
) {
    // Generate last 30 days
    const data: DeviceTimeseriesResponse = {
        data: Array.from({ length: 30 }).map((_, i) => {
            const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
            return {
                date: date.toISOString().split('T')[0],
                activeUsers: getRandomInt(2000, 4000),
                totalUsers: 10000 + i * 100 + getRandomInt(0, 50),
            };
        }),
        period: {
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString(),
        },
    };

    return { data, isLoading: false };
}

// @ts-ignore
export function useDeviceActivityTimeseries(
    _deviceId: string,
    _appId: string,
    _range?: any
) {
    const data: DeviceActivityTimeseriesResponse = {
        data: [],
        period: {
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString()
        },
        totalSessions: 12,
        avgSessionDuration: 120,
        firstSeen: new Date().toISOString(),
        lastActivityAt: new Date().toISOString()
    }
    return { data, isLoading: false }
}
