import { privateClient, publicClient } from './api';

export interface CreateServiceCategoryRequest {
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
}

export interface UpdateServiceCategoryRequest {
  displayName: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
}

export interface ServiceCategoryResponse {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Admin endpoints (require authentication)
export const createServiceCategory = async (data: CreateServiceCategoryRequest): Promise<ApiResponse<ServiceCategoryResponse>> => {
  const response = await privateClient.post('/admin/service-categories', data);
  return response.data;
};

export const getAllServiceCategories = async (page: number = 0, size: number = 10): Promise<ApiResponse<PageResponse<ServiceCategoryResponse>>> => {
  const response = await privateClient.get(`/admin/service-categories?page=${page}&size=${size}`);
  return response.data;
};

export const getAllServiceCategoriesNoPaging = async (): Promise<ApiResponse<ServiceCategoryResponse[]>> => {
  const response = await privateClient.get('/admin/service-categories/all');
  return response.data;
};

export const getServiceCategoryById = async (id: number): Promise<ApiResponse<ServiceCategoryResponse>> => {
  const response = await privateClient.get(`/admin/service-categories/${id}`);
  return response.data;
};

export const updateServiceCategory = async (id: number, data: UpdateServiceCategoryRequest): Promise<ApiResponse<ServiceCategoryResponse>> => {
  const response = await privateClient.put(`/admin/service-categories/${id}`, data);
  return response.data;
};

export const deleteServiceCategory = async (id: number): Promise<ApiResponse<string>> => {
  const response = await privateClient.delete(`/admin/service-categories/${id}`);
  return response.data;
};

export const toggleServiceCategoryStatus = async (id: number): Promise<ApiResponse<ServiceCategoryResponse>> => {
  const response = await privateClient.put(`/admin/service-categories/${id}/toggle-status`);
  return response.data;
};

export const searchServiceCategories = async (query: string): Promise<ApiResponse<ServiceCategoryResponse[]>> => {
  const response = await privateClient.get(`/admin/service-categories/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

// Public endpoints (No authentication required)
export const getPublicServiceCategories = async (): Promise<ApiResponse<ServiceCategoryResponse[]>> => {
  const response = await publicClient.get('/public/service-categories');
  return response.data;
};

export const getPublicServiceCategoryById = async (id: number): Promise<ApiResponse<ServiceCategoryResponse>> => {
  const response = await publicClient.get(`/public/service-categories/${id}`);
  return response.data;
};

export const getPublicServiceCategoryByName = async (name: string): Promise<ApiResponse<ServiceCategoryResponse>> => {
  const response = await publicClient.get(`/public/service-categories/name/${name}`);
  return response.data;
};

// Constants for UI
export const DEFAULT_COLORS = [
  '#FF5722', '#F44336', '#4CAF50', '#2196F3', '#9C27B0', '#607D8B',
  '#FF9800', '#E91E63', '#8BC34A', '#03A9F4', '#673AB7', '#795548'
];

export const DEFAULT_ICONS = [
  'person', 'sports_mma', 'self_improvement', 'favorite', 'fitness_center', 
  'more_horiz', 'sports_gymnastics', 'pool', 'directions_run', 'sports_kabaddi'
];