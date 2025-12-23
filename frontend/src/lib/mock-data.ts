// Mock data for the analytics dashboard

export const mockUsers = [
    { id: '1', deviceId: 'device_abc123', country: 'TR', platform: 'iOS', firstSeen: '2024-01-15T10:30:00Z', lastSeen: '2024-12-20T14:22:00Z', totalSessions: 45, totalEvents: 312 },
    { id: '2', deviceId: 'device_def456', country: 'US', platform: 'Android', firstSeen: '2024-02-20T08:15:00Z', lastSeen: '2024-12-19T18:45:00Z', totalSessions: 32, totalEvents: 198 },
    { id: '3', deviceId: 'device_ghi789', country: 'DE', platform: 'Web', firstSeen: '2024-03-10T16:00:00Z', lastSeen: '2024-12-21T09:30:00Z', totalSessions: 28, totalEvents: 156 },
    { id: '4', deviceId: 'device_jkl012', country: 'FR', platform: 'iOS', firstSeen: '2024-04-05T12:45:00Z', lastSeen: '2024-12-18T20:15:00Z', totalSessions: 21, totalEvents: 89 },
    { id: '5', deviceId: 'device_mno345', country: 'GB', platform: 'Android', firstSeen: '2024-05-12T09:20:00Z', lastSeen: '2024-12-22T11:00:00Z', totalSessions: 67, totalEvents: 445 },
];

export const mockSessions = [
    { id: '1', deviceId: 'device_abc123', country: 'TR', platform: 'iOS', startedAt: '2024-12-20T14:00:00Z', endedAt: '2024-12-20T14:22:00Z', duration: 1320, eventCount: 12 },
    { id: '2', deviceId: 'device_def456', country: 'US', platform: 'Android', startedAt: '2024-12-19T18:30:00Z', endedAt: '2024-12-19T18:45:00Z', duration: 900, eventCount: 8 },
    { id: '3', deviceId: 'device_ghi789', country: 'DE', platform: 'Web', startedAt: '2024-12-21T09:00:00Z', endedAt: '2024-12-21T09:30:00Z', duration: 1800, eventCount: 15 },
    { id: '4', deviceId: 'device_abc123', country: 'TR', platform: 'iOS', startedAt: '2024-12-19T10:00:00Z', endedAt: '2024-12-19T10:45:00Z', duration: 2700, eventCount: 22 },
    { id: '5', deviceId: 'device_mno345', country: 'GB', platform: 'Android', startedAt: '2024-12-22T10:30:00Z', endedAt: '2024-12-22T11:00:00Z', duration: 1800, eventCount: 18 },
];

export const mockEvents = [
    { id: '1', name: 'screen_view', deviceId: 'device_abc123', country: 'TR', platform: 'iOS', timestamp: '2024-12-20T14:05:00Z', properties: { screen: 'Home' }, isScreen: true },
    { id: '2', name: 'button_click', deviceId: 'device_abc123', country: 'TR', platform: 'iOS', timestamp: '2024-12-20T14:06:00Z', properties: { button: 'Start' }, isScreen: false },
    { id: '3', name: 'screen_view', deviceId: 'device_def456', country: 'US', platform: 'Android', timestamp: '2024-12-19T18:32:00Z', properties: { screen: 'Dashboard' }, isScreen: true },
    { id: '4', name: 'purchase', deviceId: 'device_ghi789', country: 'DE', platform: 'Web', timestamp: '2024-12-21T09:15:00Z', properties: { amount: 29.99 }, isScreen: false },
    { id: '5', name: 'screen_view', deviceId: 'device_mno345', country: 'GB', platform: 'Android', timestamp: '2024-12-22T10:45:00Z', properties: { screen: 'Profile' }, isScreen: true },
];

export const mockUsersOverview = {
    totalUsers: 1234,
    totalUsersChange: 12.5,
    newUsers: 156,
    newUsersChange: 8.3,
    activeUsers: 892,
    activeUsersChange: -2.1,
    avgSessionsPerUser: 3.2,
    avgSessionsChange: 5.7,
};

export const mockSessionsOverview = {
    totalSessions: 4567,
    totalSessionsChange: 15.2,
    avgDuration: 342,
    avgDurationChange: 3.8,
    bounceRate: 23.4,
    bounceRateChange: -5.2,
    avgEventsPerSession: 8.4,
    avgEventsChange: 12.1,
};

export const mockEventsOverview = {
    totalEvents: 28456,
    totalEventsChange: 18.7,
    uniqueEvents: 42,
    uniqueEventsChange: 4.2,
    screenViews: 12345,
    screenViewsChange: 14.3,
    customEvents: 16111,
    customEventsChange: 22.1,
};

export const mockUsersActivityData = [
    { date: '2024-12-16', users: 120, newUsers: 25 },
    { date: '2024-12-17', users: 145, newUsers: 32 },
    { date: '2024-12-18', users: 132, newUsers: 18 },
    { date: '2024-12-19', users: 168, newUsers: 45 },
    { date: '2024-12-20', users: 189, newUsers: 52 },
    { date: '2024-12-21', users: 156, newUsers: 28 },
    { date: '2024-12-22', users: 201, newUsers: 61 },
];

export const mockSessionsActivityData = [
    { date: '2024-12-16', sessions: 450, avgDuration: 320 },
    { date: '2024-12-17', sessions: 520, avgDuration: 345 },
    { date: '2024-12-18', sessions: 480, avgDuration: 310 },
    { date: '2024-12-19', sessions: 610, avgDuration: 378 },
    { date: '2024-12-20', sessions: 720, avgDuration: 392 },
    { date: '2024-12-21', sessions: 580, avgDuration: 335 },
    { date: '2024-12-22', sessions: 780, avgDuration: 405 },
];

export const mockEventsActivityData = [
    { date: '2024-12-16', events: 3200, screenViews: 1400 },
    { date: '2024-12-17', events: 3800, screenViews: 1650 },
    { date: '2024-12-18', events: 3500, screenViews: 1520 },
    { date: '2024-12-19', events: 4200, screenViews: 1890 },
    { date: '2024-12-20', events: 4800, screenViews: 2100 },
    { date: '2024-12-21', events: 4100, screenViews: 1780 },
    { date: '2024-12-22', events: 5200, screenViews: 2350 },
];

export const mockPlatformDistribution = [
    { platform: 'iOS', users: 520, percentage: 42.2 },
    { platform: 'Android', users: 480, percentage: 38.9 },
    { platform: 'Web', users: 234, percentage: 18.9 },
];

export const mockTopCountries = [
    { code: 'TR', name: 'Turkey', users: 320, percentage: 26.0 },
    { code: 'US', name: 'United States', users: 245, percentage: 19.9 },
    { code: 'DE', name: 'Germany', users: 189, percentage: 15.3 },
    { code: 'GB', name: 'United Kingdom', users: 156, percentage: 12.6 },
    { code: 'FR', name: 'France', users: 124, percentage: 10.1 },
];

export const mockTopEvents = [
    { name: 'screen_view', count: 12345, percentage: 43.4 },
    { name: 'button_click', count: 8234, percentage: 28.9 },
    { name: 'form_submit', count: 3456, percentage: 12.1 },
    { name: 'purchase', count: 2345, percentage: 8.2 },
    { name: 'share', count: 2076, percentage: 7.3 },
];

export const mockTopScreens = [
    { name: 'Home', views: 4567, percentage: 37.0 },
    { name: 'Dashboard', views: 3234, percentage: 26.2 },
    { name: 'Profile', views: 2345, percentage: 19.0 },
    { name: 'Settings', views: 1234, percentage: 10.0 },
    { name: 'Help', views: 965, percentage: 7.8 },
];

export const mockUserDetail = {
    deviceId: 'device_abc123',
    country: 'TR',
    countryName: 'Turkey',
    platform: 'iOS',
    appVersion: '2.3.1',
    osVersion: 'iOS 17.2',
    deviceModel: 'iPhone 15 Pro',
    firstSeen: '2024-01-15T10:30:00Z',
    lastSeen: '2024-12-20T14:22:00Z',
    totalSessions: 45,
    totalEvents: 312,
    avgSessionDuration: 1240,
};

export const mockUserActivityCalendar = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (364 - i));
    return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 10),
    };
});

export const mockApps = [
    { id: '1', name: 'My Analytics App', role: 'owner' as const },
    { id: '2', name: 'Demo App', role: 'member' as const },
];

export const mockRealtimeData = {
    onlineUsers: 42,
    platforms: { ios: 18, android: 15, web: 9 },
    countries: { TR: 12, US: 10, DE: 8, GB: 7, FR: 5 },
};
