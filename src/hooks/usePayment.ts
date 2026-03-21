import { useState, useCallback } from 'react';
import { paymentService, type CreatePaymentRequest, type MoMoPaymentResponse, type PaymentOrder } from '../services/paymentService';

interface UsePaymentReturn {
  loading: boolean;
  error: string | null;
  createPayment: (request: CreatePaymentRequest) => Promise<MoMoPaymentResponse | null>;
  getPaymentStatus: (orderId: string) => Promise<PaymentOrder | null>;
  clearError: () => void;
}

export const usePayment = (): UsePaymentReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCallback(async (request: CreatePaymentRequest): Promise<MoMoPaymentResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await paymentService.createMoMoPayment(request);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Không thể tạo thanh toán');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi tạo thanh toán';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentStatus = useCallback(async (orderId: string): Promise<PaymentOrder | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await paymentService.getPaymentStatus(orderId);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Không thể lấy thông tin thanh toán');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi kiểm tra trạng thái thanh toán';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    createPayment,
    getPaymentStatus,
    clearError
  };
};