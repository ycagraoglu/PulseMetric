import axios from 'axios';

// API Base URL - Development ve Production için
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Storage keys (auth.ts ile senkron olmalı)
const TOKEN_KEY = 'pulsemetric_token';
const REFRESH_TOKEN_KEY = 'pulsemetric_refresh_token';

// Axios instance oluştur
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor - Auth token eklemek için
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Tenant ID header'ı (multi-tenant için)
        const tenantId = localStorage.getItem('tenant_id') || 'DEMO_TENANT';
        config.headers['X-Tenant-Id'] = tenantId;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Hata yönetimi ve token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 Unauthorized - Token expired, try refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
                        refreshToken
                    });

                    localStorage.setItem(TOKEN_KEY, data.accessToken);
                    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return apiClient(originalRequest);
                } catch {
                    // Refresh failed, clear auth and redirect to login
                    localStorage.removeItem(TOKEN_KEY);
                    localStorage.removeItem(REFRESH_TOKEN_KEY);
                    localStorage.removeItem('pulsemetric_user');
                    window.location.href = '/auth';
                }
            } else {
                window.location.href = '/auth';
            }
        }

        // Network error
        if (!error.response) {
            console.error('Network error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default apiClient;

