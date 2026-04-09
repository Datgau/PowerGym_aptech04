import { privateClient } from './api';
import type { ProductStatistics, OrderStatistics } from '../types/statistics';
import type {ApiResponse} from "../@type/apiResponse.ts";


export const getProductStatistics = async (
  startDate?: string,
  endDate?: string
): Promise<ProductStatistics> => {
  const params: Record<string, any> = {};
  
  if (startDate) {
    params.startDate = startDate;
  }
  
  if (endDate) {
    params.endDate = endDate;
  }
  
  const response = await privateClient.get<ApiResponse<ProductStatistics>>(
    '/products/statistics',
    { params }
  );
  return response.data.data;
};

export const getOrderStatistics = async (
  startDate?: string,
  endDate?: string
): Promise<OrderStatistics> => {
  const params: Record<string, any> = {};
  
  if (startDate) {
    params.startDate = startDate;
  }
  
  if (endDate) {
    params.endDate = endDate;
  }
  
  const response = await privateClient.get<ApiResponse<OrderStatistics>>(
    '/product-orders/statistics',
    { params }
  );
  return response.data.data;
};
