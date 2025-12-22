const API_BASE = '/api'

// Types
export interface StatsOverview {
    totalUsers: number
    activeNow: number
    totalPageViews: number
    avgSessionSeconds: number
    bounceRate: number
}

export interface RealtimeStats {
    activeUsers: number
    pageViewsLastHour: number
    eventsLastHour: number
    activePages: { path: string; users: number }[]
}

export interface TopPage {
    path: string
    views: number
    percentage: number
}

export interface DeviceStats {
    device: string
    count: number
    percentage: number
}

export interface ChartDataPoint {
    timestamp: number
    value: number
}

export interface EventListItem {
    id: string
    eventName: string
    urlPath: string
    visitorId: string | null
    device: string | null
    timestamp: number
}

export interface UserListItem {
    visitorId: string
    sessionCount: number
    device: string | null
    browser: string | null
    os: string | null
    lastSeen: number
}

// API Functions
async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
    }
    return response.json()
}

export const api = {
    stats: {
        getOverview: (tenantId = 'DEMO_TENANT') =>
            fetchJson<StatsOverview>(`${API_BASE}/stats/overview?tenantId=${tenantId}`),

        getRealtime: (tenantId = 'DEMO_TENANT') =>
            fetchJson<RealtimeStats>(`${API_BASE}/stats/realtime?tenantId=${tenantId}`),

        getTopPages: (tenantId = 'DEMO_TENANT', limit = 10) =>
            fetchJson<TopPage[]>(`${API_BASE}/stats/top-pages?tenantId=${tenantId}&limit=${limit}`),

        getDevices: (tenantId = 'DEMO_TENANT') =>
            fetchJson<DeviceStats[]>(`${API_BASE}/stats/devices?tenantId=${tenantId}`),

        getPageViewChart: (tenantId = 'DEMO_TENANT', days = 7) =>
            fetchJson<ChartDataPoint[]>(`${API_BASE}/stats/chart/pageviews?tenantId=${tenantId}&days=${days}`),

        getEvents: (tenantId = 'DEMO_TENANT', page = 1, pageSize = 20) =>
            fetchJson<EventListItem[]>(`${API_BASE}/stats/events?tenantId=${tenantId}&page=${page}&pageSize=${pageSize}`),

        getUsers: (tenantId = 'DEMO_TENANT', page = 1, pageSize = 20) =>
            fetchJson<UserListItem[]>(`${API_BASE}/stats/users?tenantId=${tenantId}&page=${page}&pageSize=${pageSize}`),
    },
}
