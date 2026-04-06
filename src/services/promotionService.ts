import { publicClient, privateClient } from './api';
import type {ApplyPromotionRequest, ApplyPromotionResponse, Promotion} from "../@type/reward.ts";

export const promotionService = {
  // Get all active promotions (authenticated)
  getActivePromotions: async (): Promise<Promotion[]> => {
    const response = await privateClient.get('/promotions/active');
    return response.data.data;
  },

  // Get featured promotions (public)
  getFeaturedPromotions: async (): Promise<Promotion[]> => {
    const response = await publicClient.get('/promotions/featured');
    return response.data.data;
  },

  // Apply promotion code (authenticated)
  applyPromotion: async (request: ApplyPromotionRequest): Promise<ApplyPromotionResponse> => {
    const response = await privateClient.post('/promotions/apply', request);
    return response.data;
  },

  // Admin: Get all promotions
  getAllPromotions: async (): Promise<Promotion[]> => {
    const response = await privateClient.get('/promotions');
    return response.data.data;
  },

  // Admin: Get promotion by ID
  getPromotionById: async (id: number): Promise<Promotion> => {
    const response = await privateClient.get(`/promotions/${id}`);
    return response.data.data;
  },

  // Admin: Create promotion
  createPromotion: async (data: any): Promise<Promotion> => {
    const response = await privateClient.post('/promotions', data);
    return response.data.data;
  },

  // Admin: Update promotion
  updatePromotion: async (id: number, data: any): Promise<Promotion> => {
    const response = await privateClient.put(`/promotions/${id}`, data);
    return response.data.data;
  },

  // Admin: Delete promotion
  deletePromotion: async (id: number): Promise<void> => {
    await privateClient.delete(`/promotions/${id}`);
  },
};

export default promotionService;
