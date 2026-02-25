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
    });

export const publicClient = createClient();
export const privateClient = createClient();

privateClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token) {
        if (!config.headers) {
            config.headers = new AxiosHeaders();
        }
        config.headers.set("Authorization", `Bearer ${token}`);
    }
    if (!config.headers.has("Content-Type") && !(config.data instanceof FormData)) {
        config.headers.set("Content-Type", "application/json");
    }

    return config;
});

interface RefreshTokenResponse {
    success: boolean;
    message: string;
    data: AuthTokens;
    status: number;
}

const refreshAccessToken = async (): Promise<string> => {
    const response: AxiosResponse<RefreshTokenResponse> = await publicClient.post("/auth/refresh-token");

    const newAccessToken = response.data?.data?.accessToken;

    if (!newAccessToken) {
        throw new Error("Refresh token response invalid");
    }

    updateStoredTokens({ accessToken: newAccessToken });
    return newAccessToken;
};

privateClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as
            | (InternalAxiosRequestConfig & { _retry?: boolean })
            | undefined;

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();

                if (!originalRequest.headers) {
                    originalRequest.headers = new AxiosHeaders();
                }
                originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);

                return privateClient(originalRequest);
            } catch (refreshError) {
                clearAuthSession();
                triggerLoginModal();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default privateClient;