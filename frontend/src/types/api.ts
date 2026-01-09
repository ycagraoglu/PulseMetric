// API Types - Backend DTO'larının TypeScript karşılıkları

// ============================================
// Stats API Types
// ============================================

export interface StatsOverview {
  totalVisitors: number;
  totalPageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  todayVisitors: number;
  todayPageViews: number;
}

export interface RealtimeStats {
  onlineVisitors: number;
  last30MinVisitors: number;
  recentEvents: RecentEvent[];
}

export interface RecentEvent {
  id: string;
  eventName: string;
  url: string;
  visitorId: string;
  device: string;
  country: string;
  timestamp: number;
}

export interface TopPage {
  url: string;
  pageTitle: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
}

export interface DeviceStats {
  device: string;
  count: number;
  percentage: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

// ============================================
// Users API Types
// ============================================

export interface User {
  id: string;
  visitorId: string;
  name: string;
  platform: 'iOS' | 'Android' | 'Web';
  country: string;
  countryCode: string;
  city?: string;
  browser?: string;
  os?: string;
  firstSeen: string;
  lastSeen: string;
  totalSessions: number;
  totalEvents: number;
}

export interface UserDetails extends User {
  sessions: Session[];
  recentEvents: EventItem[];
}

// ============================================
// Sessions API Types
// ============================================

export interface Session {
  id: string;
  visitorId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  device: string;
  browser: string;
  os: string;
  country: string;
  countryCode: string;
  city?: string;
  eventsCount: number;
  pagesViewed: number;
  entryPage: string;
  exitPage?: string;
}

export interface SessionDetails extends Session {
  events: EventItem[];
}

// ============================================
// Events API Types
// ============================================

export interface EventItem {
  id: string;
  eventName: string;
  url: string;
  pageTitle?: string;
  visitorId: string;
  sessionId?: string;
  device: string;
  browser?: string;
  os?: string;
  country?: string;
  countryCode?: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface EventAggregation {
  eventName: string;
  count: number;
  uniqueUsers: number;
}

// ============================================
// Common Types
// ============================================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DateRangeParams {
  from: string;
  to: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// ============================================
// Geo Types
// ============================================

export interface CountryStats {
  name: string;
  countryCode: string;
  count: number;
  percentage: number;
}

export interface CityStats {
  name: string;
  country: string;
  countryCode: string;
  count: number;
  percentage: number;
}

// ============================================
// Platform Types
// ============================================

export interface PlatformStats {
  name: 'iOS' | 'Android' | 'Web';
  icon: 'ios' | 'android' | 'web';
  count: number;
  percentage: number;
}
