import { useState, useEffect } from 'react';
import { rewardService } from '../services/rewardService';
import type {RewardTransaction, UserReward} from "../@type/reward.ts";
import { useAuth } from './useAuth';

export const useReward = () => {
  const { isLoggedIn } = useAuth();
  const [reward, setReward] = useState<UserReward | null>(null);
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReward = async () => {
    // Early return if not authenticated
    if (!isLoggedIn) {
      setReward(null);
      setTransactions([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      const data = await rewardService.getMyRewards();
      setReward(data);
      setError(null);
    } catch (err: any) {
      // Handle 401 error with login required message
      if (err.response?.status === 401) {
        setError('Vui lòng đăng nhập để xem thông tin điểm thưởng');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch rewards');
      }
      console.error('Error fetching rewards:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    // Early return if not authenticated
    if (!isLoggedIn) {
      return;
    }

    try {
      const data = await rewardService.getMyTransactions();
      setTransactions(data);
    } catch (err: any) {
      // Handle 401 error
      if (err.response?.status === 401) {
        console.error('Unauthorized: Login required to fetch transactions');
      } else {
        console.error('Error fetching transactions:', err);
      }
    }
  };

  useEffect(() => {
    fetchReward();
    fetchTransactions();
  }, [isLoggedIn]);

  const refresh = () => {
    fetchReward();
    fetchTransactions();
  };

  return {
    reward,
    transactions,
    loading,
    error,
    refresh,
  };
};
