import { privateClient } from './api';
import type { ApiResponse } from '../@type/apiResponse';
import type { ServiceRegistrationWithTrainerSelectionResponse } from './enhancedServiceRegistrationService';

export interface CreatePaymentRequest {
  amount: number;
  orderInfo: string;
  extraData?: string;
  lang?: string;
  itemType?: string; // "SERVICE" or "MEMBERSHIP"
  itemId?: string;   // Service ID or Package ID
  itemName?: string; // Service name or Package name
}

export interface MoMoPaymentResponse {
  partnerCode: string;
  requestId: string;
  orderId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  deeplink: string;
  qrCodeUrl: string;
  deeplinkMiniApp: string;
  signature: string;
  userFee: number;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  content: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';
  createdAt: string;
  expiredAt: string;
  retryCount: number;
  transactionRef?: string;
  momoTransId?: string;
  paymentMethod?: string;
  paymentUrl?: string;
  qrCodeUrl?: string;
  deeplink?: string;
  requestId?: string;
  extraData?: string;
  itemType?: string;
  itemId?: string;
  itemName?: string;
  user?: {
    id: number;
    email: string;
    fullName: string;
    username: string;
  };
}

export interface PaymentWithTrainerSelectionResponse {
  orderId: string;
  transactionId?: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  createdAt: string;
  completedAt?: string;
  userId: number;
  userFullName: string;
  userEmail: string;
  serviceRegistrations: ServiceRegistrationWithTrainerSelectionResponse[];
  totalRegistrations: number;
  registrationsNeedingTrainer: number;
  paymentCompleted: boolean;
  hasServiceRegistrations: boolean;
  needsTrainerSelection: boolean;
  nextAction: 'COMPLETE_PAYMENT' | 'REGISTER_SERVICE' | 'SELECT_TRAINER' | 'BOOK_SESSION';
}

export const paymentService = {
  /**
   * Create MoMo payment
   */
  createMoMoPayment: async (request: CreatePaymentRequest): Promise<ApiResponse<MoMoPaymentResponse>> => {
    const response = await privateClient.post<ApiResponse<MoMoPaymentResponse>>('/payment/momo/create', request);
    return response.data;
  },

  /**
   * Get payment status
   */
  getPaymentStatus: async (orderId: string): Promise<ApiResponse<PaymentOrder>> => {
    const response = await privateClient.get<ApiResponse<PaymentOrder>>(`/payment/status/${orderId}`);
    return response.data;
  },

  /**
   * Get payment status with trainer selection information
   */
  getPaymentStatusWithTrainerSelection: async (orderId: string): Promise<ApiResponse<PaymentWithTrainerSelectionResponse>> => {
    const response = await privateClient.get<ApiResponse<PaymentWithTrainerSelectionResponse>>(`/payment/status/${orderId}/with-trainer-selection`);
    return response.data;
  },

  /**
   * Get payment history
   */
  getPaymentHistory: async (): Promise<ApiResponse<PaymentOrder[]>> => {
    const response = await privateClient.get<ApiResponse<PaymentOrder[]>>('/payment/history');
    return response.data;
  },

  /**
   * Cancel payment
   */
  cancelPayment: async (orderId: string): Promise<ApiResponse<string>> => {
    const response = await privateClient.post<ApiResponse<string>>(`/payment/cancel/${orderId}`);
    return response.data;
  },

  /**
   * Open MoMo payment URL
   */
  openMoMoPayment: (payUrl: string) => {
    window.open(payUrl, '_blank');
  },

  /**
   * Open MoMo app via deeplink
   */
  openMoMoApp: (deeplink: string) => {
    window.location.href = deeplink;
  },

  /**
   * Generate QR code URL for display
   */
  generateQRCode: (qrCodeUrl: string): string => {
    // You can use a QR code generation library like qrcode.js
    // For now, return the URL that can be used with QR code generators
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`;
  }
};

export default paymentService;