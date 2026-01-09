import { apiClient } from './api';

// ============================================
// Types
// ============================================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    tenantId?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    user: UserInfo;
}

export interface UserInfo {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: string;
    tenantId: string | null;
}

// ============================================
// Constants
// ============================================

const AUTH_BASE = '/api/auth';

export const StorageKeys = {
    TOKEN: 'pulsemetric_token',
    REFRESH_TOKEN: 'pulsemetric_refresh_token',
    USER: 'pulsemetric_user',
} as const;

// ============================================
// Validation
// ============================================

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required";
    if (!EMAIL_REGEX.test(email)) return "Invalid email format";
    return null;
};

export const validatePassword = (password: string, minLength = 6): string | null => {
    if (!password) return "Password is required";
    if (password.length < minLength) return `Password must be at least ${minLength} characters`;
    return null;
};

export const validateName = (name: string): string | null => {
    if (!name) return "Name is required";
    return null;
};

/** Split full name into firstName and lastName */
export const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
    const parts = fullName.trim().split(' ');
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ') || firstName;
    return { firstName, lastName };
};

// ============================================
// Storage Helpers
// ============================================

const storage = {
    getToken: (): string | null =>
        localStorage.getItem(StorageKeys.TOKEN),

    getRefreshToken: (): string | null =>
        localStorage.getItem(StorageKeys.REFRESH_TOKEN),

    getUser: (): UserInfo | null => {
        const user = localStorage.getItem(StorageKeys.USER);
        return user ? JSON.parse(user) : null;
    },

    setAuth: (auth: AuthResponse): void => {
        localStorage.setItem(StorageKeys.TOKEN, auth.accessToken);
        localStorage.setItem(StorageKeys.REFRESH_TOKEN, auth.refreshToken);
        localStorage.setItem(StorageKeys.USER, JSON.stringify(auth.user));
    },

    clear: (): void => {
        localStorage.removeItem(StorageKeys.TOKEN);
        localStorage.removeItem(StorageKeys.REFRESH_TOKEN);
        localStorage.removeItem(StorageKeys.USER);
    },
};

// ============================================
// Auth State Exports
// ============================================

export const getToken = storage.getToken;
export const getRefreshToken = storage.getRefreshToken;
export const getUser = storage.getUser;
export const setAuth = storage.setAuth;
export const clearAuth = storage.clear;
export const isAuthenticated = (): boolean => !!storage.getToken();
export const isTokenExpired = (expiresAt: number): boolean => Date.now() > expiresAt;

// ============================================
// Helper Functions
// ============================================

const buildUrl = (path: string) => `${AUTH_BASE}${path}`;

// ============================================
// API Functions
// ============================================

/** Login user */
export const login = async (request: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(buildUrl('/login'), request);
    storage.setAuth(data);
    return data;
};

/** Register new user */
export const register = async (request: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(buildUrl('/register'), request);
    storage.setAuth(data);
    return data;
};

/** Refresh access token */
export const refreshToken = async (): Promise<AuthResponse> => {
    const refreshTokenValue = storage.getRefreshToken();
    if (!refreshTokenValue) {
        throw new Error('No refresh token available');
    }
    const { data } = await apiClient.post<AuthResponse>(buildUrl('/refresh'), {
        refreshToken: refreshTokenValue,
    });
    storage.setAuth(data);
    return data;
};

/** Logout user */
export const logout = async (): Promise<void> => {
    try {
        await apiClient.post(buildUrl('/logout'));
    } catch {
        // Ignore errors - logout should always clear local state
    } finally {
        storage.clear();
    }
};

/** Get current user info */
export const getCurrentUser = async (): Promise<UserInfo> => {
    const { data } = await apiClient.get<UserInfo>(buildUrl('/me'));
    return data;
};
