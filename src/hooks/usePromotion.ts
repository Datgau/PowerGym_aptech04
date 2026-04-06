import { useState, useEffect } from 'react';
import { promotionService } from '../services/promotionService';
import { useAuth } from './useAuth';
import type {ApplyPromotionRequest, ApplyPromotionResponse, Promotion} from "../@type/reward.ts";

export const usePromotion = () => {
  const { isLoggedIn } = useAuth();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [featuredPromotions, setFeaturedPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyLoading, setApplyLoading] = useState(false);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      
      // Fetch based on authentication status (Requirements 1.2, 2.4)
      // For Rewards page: promotions will contain either featured OR active based on auth
      // For backward compatibility: featuredPromotions always contains featured promotions
      
      if (isLoggedIn) {
        // Authenticated: fetch active promotions
        const activeData = await promotionService.getActivePromotions();
        setPromotions(activeData);
        
        // Also fetch featured for backward compatibility (Promotions page)
        const featuredData = await promotionService.getFeaturedPromotions();
        setFeaturedPromotions(featuredData);
      } else {
        // Not authenticated: fetch only featured promotions
        const featuredData = await promotionService.getFeaturedPromotions();
        setPromotions(featuredData);
        setFeaturedPromotions(featuredData);
      }
      
      setError(null);
    } catch (err: any) {
      // Error handling (Requirements 5.1, 5.2, 5.3)
      if (err.response?.status === 401) {
        setError('Vui lòng đăng nhập để xem thông tin này');
      } else if (err.response?.status === 500) {
        setError('Lỗi hệ thống. Vui lòng thử lại sau.');
      } else if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.');
      } else {
        setError(err.response?.data?.message || 'Không thể tải danh sách khuyến mãi');
      }
      console.error('Error fetching promotions:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyPromotion = async (
    request: ApplyPromotionRequest
  ): Promise<ApplyPromotionResponse> => {
    try {
      setApplyLoading(true);
      const response = await promotionService.applyPromotion(request);
      return response;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to apply promotion');
    } finally {
      setApplyLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [isLoggedIn]); // Re-fetch when authentication status changes

  return {
    promotions,
    featuredPromotions,
    loading,
    error,
    applyLoading,
    applyPromotion,
    refresh: fetchPromotions,
  };
};
