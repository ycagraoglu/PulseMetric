import { apiClient } from './api';

// ============================================
// Constants
// ============================================

const SETTINGS_BASE = '/api/settings';

// ============================================
// Types
// ============================================

export interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    dailyDigest: boolean;
}

export interface SecuritySettings {
    twoFactorEnabled: boolean;
    sessionTimeoutMinutes: number;
    ipWhitelist: string | null;
}

export interface TenantSettings {
    tenantId: string;
    projectName: string;
    projectUrl: string;
    dataRetentionDays: number;
    timezone: string;
    notifications: NotificationSettings;
    security: SecuritySettings;
    embedScript: string;
}

export interface UpdateSettingsRequest {
    projectName?: string;
    projectUrl?: string;
    dataRetentionDays?: number;
    timezone?: string;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    weeklyReports?: boolean;
    dailyDigest?: boolean;
    twoFactorEnabled?: boolean;
    sessionTimeoutMinutes?: number;
    ipWhitelist?: string;
}

// ============================================
// Query Keys
// ============================================

export const settingsQueryKeys = {
    all: ['settings'] as const,
    script: ['settings', 'script'] as const,
};

// ============================================
// Helper Functions
// ============================================

const buildUrl = (path: string = '') => `${SETTINGS_BASE}${path}`;

// ============================================
// API Functions
// ============================================

/** Get current tenant settings */
export const getSettings = async (): Promise<TenantSettings> => {
    const { data } = await apiClient.get<TenantSettings>(buildUrl());
    return data;
};

/** Update tenant settings */
export const updateSettings = async (request: UpdateSettingsRequest): Promise<TenantSettings> => {
    const { data } = await apiClient.put<TenantSettings>(buildUrl(), request);
    return data;
};

/** Get embed script only */
export const getEmbedScript = async (): Promise<string> => {
    const { data } = await apiClient.get<{ script: string }>(buildUrl('/script'));
    return data.script;
};

// ============================================
// Utility Functions
// ============================================

/** Check if data retention is extended (90 days) */
export const isExtendedRetention = (days: number): boolean => days >= 90;

/** Check if session timeout is extended (30 min) */
export const isExtendedTimeout = (minutes: number): boolean => minutes >= 30;

/** Get data retention days from toggle */
export const getRetentionDays = (extended: boolean): number => extended ? 90 : 30;

/** Get session timeout minutes from toggle */
export const getTimeoutMinutes = (extended: boolean): number => extended ? 30 : 15;
