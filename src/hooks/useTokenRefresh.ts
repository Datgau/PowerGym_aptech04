import { useEffect, useRef } from 'react';
import { getAccessToken, updateStoredTokens, loadAuthSession } from '../services/authStorage';
import { publicClient } from '../services/api';

interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
  status: number;
}
export const useTokenRefresh = () => {
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleTokenRefresh = () => {
    // Clear existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    const token = getAccessToken();
    if (!token) return;

    try {
      // Decode JWT to get expiration
      const parts = token.split('.');
      if (parts.length !== 3) return;

      const payload = JSON.parse(atob(parts[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      // Refresh 5 minutes before expiration
      const refreshBuffer = 5 * 60 * 1000;
      const timeUntilRefresh = timeUntilExpiration - refreshBuffer;

      if (timeUntilRefresh <= 0) {
        refreshToken();
      } else {
        refreshTimeoutRef.current = setTimeout(() => {
          refreshToken();
        }, timeUntilRefresh);
      }
    } catch (error) {
      console.error('Error scheduling token refresh:', error);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await publicClient.post<RefreshTokenResponse>('/auth/refresh-token');
      
      if (response.data.success && response.data.data.accessToken) {
        const newAccessToken = response.data.data.accessToken;
        updateStoredTokens({ accessToken: newAccessToken });
        
        // Schedule next refresh
        scheduleTokenRefresh();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const session = loadAuthSession();
    if (!session) return;

    scheduleTokenRefresh();

    // Cleanup on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  return { scheduleTokenRefresh };
};
