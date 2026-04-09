import { privateClient } from './api';
import type { 
  ProductOrder, 
  ProductOrderDetail,
  CreateProductOrderRequest,
  PaymentStatus,
  DeliveryStatus,
  SaleType
} from '../types/productOrder';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface ProductOrderFilters {
  page?: number;
  size?: number;
  paymentStatus?: PaymentStatus;
  deliveryStatus?: DeliveryStatus;
  saleType?: SaleType;
  startDate?: string;
  endDate?: string;
  search?: string;
}

/**
 * Get all product orders with pagination and filtering
 * Authenticated users
 * - ADMIN: Can see all orders
 * - USER: Can only see their own orders
 */
export const getProductOrders = async (
  filters: ProductOrderFilters = {}
): Promise<PageResponse<ProductOrder>> => {
  const params: Record<string, any> = {
    page: filters.page ?? 0,
    size: filters.size ?? 10,
  };
  
  if (filters.paymentStatus) {
    params.paymentStatus = filters.paymentStatus;
  }
  
  if (filters.deliveryStatus) {
    params.deliveryStatus = filters.deliveryStatus;
  }
  
  if (filters.saleType) {
    params.saleType = filters.saleType;
  }
  
  if (filters.startDate) {
    params.startDate = filters.startDate;
  }
  
  if (filters.endDate) {
    params.endDate = filters.endDate;
  }
  
  if (filters.search) {
    params.search = filters.search;
  }
  
  const response = await privateClient.get<ApiResponse<PageResponse<ProductOrder>>>(
    '/product-orders',
    { params }
  );
  return response.data.data;
};

/**
 * Get product order by ID with items
 * Authenticated users
 * - ADMIN: Can see any order
 * - USER: Can only see their own orders
 */
export const getProductOrderById = async (id: number): Promise<ProductOrderDetail> => {
  const response = await privateClient.get<ApiResponse<ProductOrderDetail>>(
    `/product-orders/${id}`
  );
  return response.data.data;
};

/**
 * Create a new product order
 * Authenticated users
 */
export const createProductOrder = async (
  data: CreateProductOrderRequest
): Promise<ProductOrder> => {
  const response = await privateClient.post<ApiResponse<ProductOrder>>(
    '/product-orders',
    data
  );
  return response.data.data;
};

/**
 * Create product order from successful payment
 * Called after payment succeeds to create the actual order
 * Authenticated users
 */
export const createOrderFromPayment = async (data: {
  paymentId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
  cartItems: Array<{
    productId: number;
    quantity: number;
  }>;
}): Promise<ProductOrder> => {
  const response = await privateClient.post<ApiResponse<ProductOrder>>(
    '/product-orders/from-payment',
    data
  );
  return response.data.data;
};

/**
 * Update payment status of an order
 * ADMIN only
 */
export const updatePaymentStatus = async (
  id: number,
  paymentStatus: PaymentStatus
): Promise<ProductOrder> => {
  const response = await privateClient.put<ApiResponse<ProductOrder>>(
    `/product-orders/${id}/payment-status`,
    { paymentStatus }
  );
  return response.data.data;
};

/**
 * Update delivery status of an order
 * ADMIN only
 */
export const updateDeliveryStatus = async (
  id: number,
  deliveryStatus: DeliveryStatus
): Promise<ProductOrder> => {
  const response = await privateClient.put<ApiResponse<ProductOrder>>(
    `/product-orders/${id}/delivery-status`,
    { deliveryStatus }
  );
  return response.data.data;
};

/**
 * Download product order invoice as PDF
 * Authenticated users
 * - ADMIN: Can download any order invoice
 * - USER: Can only download their own order invoices
 */
export const downloadOrderInvoice = async (id: number): Promise<Blob> => {
  const response = await privateClient.get(`/product-orders/${id}/invoice`, {
    responseType: 'blob',
  });
  return response.data;
};
