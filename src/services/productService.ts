import { privateClient, publicClient } from './api';
import type { 
  Product, 
  CreateProductRequest, 
  UpdateProductRequest,
  StockStatus 
} from '../types/product';

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

/**
 * Get all products with pagination, search, and filtering
 * Public access
 */
export const getProducts = async (
  page: number = 0,
  size: number = 10,
  search?: string,
  stockStatus?: StockStatus
): Promise<PageResponse<Product>> => {
  const params: Record<string, any> = { page, size };
  
  if (search) {
    params.search = search;
  }
  
  if (stockStatus && stockStatus !== 'all') {
    params.stockStatus = stockStatus;
  }
  
  const response = await publicClient.get<ApiResponse<PageResponse<Product>>>('/products', { params });
  return response.data.data;
};

/**
 * Get product by ID
 * Public access
 */
export const getProductById = async (id: number): Promise<Product> => {
  const response = await publicClient.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data.data;
};

/**
 * Create a new product
 * ADMIN only
 */
export const createProduct = async (data: CreateProductRequest): Promise<Product> => {
  const response = await privateClient.post<ApiResponse<Product>>('/products', data);
  return response.data.data;
};

/**
 * Update an existing product
 * ADMIN only
 */
export const updateProduct = async (id: number, data: UpdateProductRequest): Promise<Product> => {
  const response = await privateClient.put<ApiResponse<Product>>(`/products/${id}`, data);
  return response.data.data;
};

/**
 * Delete a product
 * ADMIN only
 */
export const deleteProduct = async (id: number): Promise<void> => {
  await privateClient.delete(`/products/${id}`);
};

/**
 * Upload product image
 * ADMIN only
 */
export const uploadProductImage = async (id: number, file: File): Promise<Product> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await privateClient.post<ApiResponse<Product>>(
    `/products/${id}/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.data;
};
