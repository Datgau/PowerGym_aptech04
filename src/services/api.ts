import axios, { AxiosHeaders } from "axios";
import type {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import { triggerLoginModal } from "./authModalService";
import { clearAuthSession, getAccessToken, updateStoredTokens } from "./authStorage";
import type {AuthTokens} from "../@type/login.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

const createClient = (): AxiosInstance =>
    axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
        timeout: 30000, // 30 seconds timeout
    });

export const publicClient = createClient();
export const privateClient = createClient();

// Request interceptor for private client
privateClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        
        if (token) {
            if (!config.headers) {
                config.headers = new AxiosHeaders();
            }
            config.headers.set("Authorization", `Bearer ${token}`);
        } else {
            console.warn('No access token found for authenticated request');
        }
        
        if (config.data instanceof FormData) {
            config.headers.delete("Content-Type");
        } else if (!config.headers.has("Content-Type")) {
            config.headers.set("Content-Type", "application/json");
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

interface RefreshTokenResponse {
    success: boolean;
    message: string;
    data: AuthTokens;
    status: number;
}

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token!);
        }
    });
    
    failedQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
    try {
        const response: AxiosResponse<RefreshTokenResponse> = await publicClient.post("/auth/refresh-token");

        if (!response.data?.success || !response.data?.data?.accessToken) {
            throw new Error("Invalid refresh token response format");
        }

        const newAccessToken = response.data.data.accessToken;
        updateStoredTokens({ accessToken: newAccessToken });
        
        return newAccessToken;
    } catch (error) {
        console.error('Refresh token failed:', error);
        throw error;
    }
};

// Response interceptor for private client
privateClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        // Log detailed error information
        console.error('=== API Error ===');
        console.error('URL:', error.config?.url);
        console.error('Method:', error.config?.method);
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Response Data:', error.response?.data);
        console.error('Error Message:', error.message);
        
        const originalRequest = error.config as
            | (InternalAxiosRequestConfig & { _retry?: boolean })
            | undefined;
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    if (!originalRequest.headers) {
                        originalRequest.headers = new AxiosHeaders();
                    }
                    originalRequest.headers.set("Authorization", `Bearer ${token}`);
                    return privateClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newAccessToken = await refreshAccessToken();
                processQueue(null, newAccessToken);
                if (!originalRequest.headers) {
                    originalRequest.headers = new AxiosHeaders();
                }
                originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);

                return privateClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                clearAuthSession();
                triggerLoginModal();
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        if (error.response?.status === 403) {
            console.warn('Access forbidden - insufficient permissions');
        } else if (error.response && error.response.status >= 500) {
            console.error('Server error:', error.response.status, error.response.statusText);
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
        } else if (!error.response) {
            console.error('Network error - no response received');
        }

        return Promise.reject(error);
    }
);

export default privateClient;