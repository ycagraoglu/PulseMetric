import { apiClient } from './api';

// ============================================
// Constants
// ============================================

const API_KEYS_BASE = '/api/apikeys';

// ============================================
// Types
// ============================================

export type ApiKeyPrefix = 'live' | 'test';

export interface ApiKey {
    id: string;
    name: string;
    maskedKey: string;
    prefix: ApiKeyPrefix;
    isActive: boolean;
    createdAt: number;
    lastUsedAt: number | null;
    usageCount: number;
}

export interface ApiKeyDetail extends ApiKey {
    expiresAt: number | null;
}

export interface CreateApiKeyRequest {
    name: string;
    isLive?: boolean;
}

export interface UpdateApiKeyRequest {
    name?: string;
    isActive?: boolean;
}

export interface CreateApiKeyResponse {
    id: string;
    name: string;
    key: string;  // Full key - only shown once!
    prefix: string;
    message: string;
}

// ============================================
// Helper Functions
// ============================================

const buildUrl = (path: string = '') => `${API_KEYS_BASE}${path}`;
const withTenantParams = (tenantId?: string) => ({ params: { tenantId } });

// ============================================
// API Functions
// ============================================

/** Get all API keys for tenant */
export const getApiKeys = async (tenantId?: string): Promise<ApiKey[]> => {
    const { data } = await apiClient.get(buildUrl(), withTenantParams(tenantId));
    return data;
};

/** Get single API key details */
export const getApiKeyById = async (id: string, tenantId?: string): Promise<ApiKeyDetail> => {
    const { data } = await apiClient.get(buildUrl(`/${id}`), withTenantParams(tenantId));
    return data;
};

/** Create new API key */
export const createApiKey = async (
    request: CreateApiKeyRequest,
    tenantId?: string
): Promise<CreateApiKeyResponse> => {
    const { data } = await apiClient.post(buildUrl(), request, withTenantParams(tenantId));
    return data;
};

/** Update API key */
export const updateApiKey = async (
    id: string,
    request: UpdateApiKeyRequest,
    tenantId?: string
): Promise<void> => {
    await apiClient.put(buildUrl(`/${id}`), request, withTenantParams(tenantId));
};

/** Delete API key */
export const deleteApiKey = async (id: string, tenantId?: string): Promise<void> => {
    await apiClient.delete(buildUrl(`/${id}`), withTenantParams(tenantId));
};

// ============================================
// Query Keys (for TanStack Query)
// ============================================

export const apiKeysQueryKeys = {
    all: ['apiKeys'] as const,
    detail: (id: string) => ['apiKeys', id] as const,
};

// ============================================
// Utility Functions
// ============================================

/** Check if key is live (production) */
export const isLiveKey = (key: ApiKey): boolean => key.prefix === 'live';

/** Check if key is active and not expired */
export const isKeyValid = (key: ApiKeyDetail): boolean => {
    if (!key.isActive) return false;
    if (key.expiresAt && key.expiresAt < Date.now()) return false;
    return true;
};

/** Format key creation date */
export const formatKeyDate = (timestamp: number | null): string => {
    if (!timestamp) return 'Bilinmiyor';
    return new Date(timestamp).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

/** Format last used as relative time */
export const formatLastUsed = (timestamp: number | null): string => {
    if (!timestamp) return 'Hiç kullanılmadı';

    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Az önce';
    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 30) return `${days} gün önce`;
    return formatKeyDate(timestamp);
};
