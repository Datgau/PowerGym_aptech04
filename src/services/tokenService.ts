// Token refresh service with debouncing and queue management
import { publicClient } from "./api";
import { updateStoredTokens, clearAuthSession } from "./authStorage";

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Notify all subscribers when token is refreshed
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

export const refreshAccessToken = async (): Promise<string> => {
  if (isRefreshing && refreshPromise) {
    console.log("Token refresh already in progress, waiting...");
    return refreshPromise;
  }

  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token: string) => {
        resolve(token);
      });
    });
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const response = await publicClient.post("/auth/refresh-token");

      if (response.data?.success && response.data?.data?.accessToken) {
        const newAccessToken = response.data.data.accessToken;
        updateStoredTokens({
          accessToken: newAccessToken,
          expiresIn: response.data.data.expiresIn,
        });
        onTokenRefreshed(newAccessToken);

        return newAccessToken;
      } else {
        throw new Error("Invalid refresh token response");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      refreshSubscribers = [];
      clearAuthSession();

      window.localStorage.removeItem("pulse.auth.session");
      window.sessionStorage.removeItem("pulse.auth.session");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};