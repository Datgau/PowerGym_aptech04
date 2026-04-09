import { privateClient } from './api';
import type { 
  ImportReceipt, 
  ImportReceiptDetail,
  CreateImportReceiptRequest 
} from '../types/importReceipt';

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

interface ImportReceiptFilters {
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
  supplierName?: string;
}

/**
 * Get all import receipts with pagination and filtering
 * ADMIN only
 */
export const getImportReceipts = async (
  filters: ImportReceiptFilters = {}
): Promise<PageResponse<ImportReceipt>> => {
  const params: Record<string, any> = {
    page: filters.page ?? 0,
    size: filters.size ?? 10,
  };
  
  if (filters.startDate) {
    params.startDate = filters.startDate;
  }
  
  if (filters.endDate) {
    params.endDate = filters.endDate;
  }
  
  if (filters.supplierName) {
    params.supplierName = filters.supplierName;
  }
  
  const response = await privateClient.get<ApiResponse<PageResponse<ImportReceipt>>>(
    '/import-receipts',
    { params }
  );
  return response.data.data;
};

/**
 * Get import receipt by ID with items
 * ADMIN only
 */
export const getImportReceiptById = async (id: number): Promise<ImportReceiptDetail> => {
  const response = await privateClient.get<ApiResponse<ImportReceiptDetail>>(
    `/import-receipts/${id}`
  );
  return response.data.data;
};

/**
 * Create a new import receipt
 * ADMIN only
 */
export const createImportReceipt = async (
  data: CreateImportReceiptRequest
): Promise<ImportReceipt> => {
  const response = await privateClient.post<ApiResponse<ImportReceipt>>(
    '/import-receipts',
    data
  );
  return response.data.data;
};

/**
 * Update an existing import receipt
 * Requires password verification
 * ADMIN only
 */
export const updateImportReceipt = async (
  id: number,
  data: CreateImportReceiptRequest & { password: string }
): Promise<ImportReceipt> => {
  const response = await privateClient.put<ApiResponse<ImportReceipt>>(
    `/import-receipts/${id}`,
    data
  );
  return response.data.data;
};

/**
 * Delete an import receipt
 * Requires password verification
 * ADMIN only
 */
export const deleteImportReceipt = async (
  id: number,
  password: string
): Promise<void> => {
  await privateClient.delete(`/import-receipts/${id}`, {
    data: { password }
  });
};
