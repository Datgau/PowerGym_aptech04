import { privateClient } from './api';
import type {RewardTransaction, UserReward} from "../@type/reward.ts";

export const rewardService = {
  // Get current user's rewards
  getMyRewards: async (): Promise<UserReward> => {
    const response = await privateClient.get('/rewards/my-rewards');
    return response.data.data;
  },

  // Get current user's reward transactions
  getMyTransactions: async (): Promise<RewardTransaction[]> => {
    const response = await privateClient.get('/rewards/transactions');
    return response.data.data;
  },

  // Get specific user's rewards (admin)
  getUserReward: async (userId: number): Promise<UserReward> => {
    const response = await privateClient.get(`/rewards/${userId}`);
    return response.data.data;
  },

  // Admin: Get all user rewards
  getAllUserRewards: async (page: number = 0, size: number = 20): Promise<UserReward[]> => {
    const response = await privateClient.get(`/admin/rewards?page=${page}&size=${size}`);
    return response.data.data;
  },

  // Admin: Get user reward by user ID
  getUserRewardByUserId: async (userId: number): Promise<UserReward> => {
    const response = await privateClient.get(`/admin/rewards/user/${userId}`);
    return response.data.data;
  },

  // Admin: Get user transactions
  getUserTransactions: async (userId: number): Promise<RewardTransaction[]> => {
    const response = await privateClient.get(`/admin/rewards/user/${userId}/transactions`);
    return response.data.data;
  },

  // Admin: Get all transactions
  getAllTransactions: async (page: number = 0, size: number = 20): Promise<any> => {
    const response = await privateClient.get(`/admin/rewards/transactions?page=${page}&size=${size}`);
    return response.data;
  },

  // Admin: Get reward statistics
  getRewardStatistics: async (): Promise<any> => {
    const response = await privateClient.get('/admin/rewards/statistics');
    return response.data.data;
  },
};

export default rewardService;
