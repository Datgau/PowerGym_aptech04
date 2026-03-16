import { privateClient, publicClient } from './api';
import { getPublicServiceCategories } from './serviceCategoryService';
import type { ServiceCategoryResponse } from './serviceCategoryService';

export interface TrainerSpecialtyRequest {
  specialty: { id: number }; // Send only the ID to match backend expectations
  description?: string;
  experienceYears?: number;
  certifications?: string;
  level?: string;
}

export interface CreateTrainerRequest {
  email: string;
  fullName: string;
  phoneNumber: string;
  bio?: string;
  totalExperienceYears?: number;
  education?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  specialties: TrainerSpecialtyRequest[];
}

export interface TrainerDocumentResponse {
  id: number;
  documentType: string;
  fileName: string;
  fileUrl: string;
  description?: string;
  expiryDate?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface TrainerSpecialtyResponse {
  id: number;
  specialty: {
    id: number;
    name: string;
    displayName: string;
    description?: string;
    icon?: string;
    color?: string;
    isActive: boolean;
    sortOrder: number;
  };
  description?: string;
  experienceYears?: number;
  certifications?: string;
  level?: string;
  isActive: boolean;
  createdAt: string;
}

export interface TrainerResponse {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatar?: string;
  bio?: string;
  coverPhoto?: string;
  isActive: boolean;
  createDate: string;
  totalExperienceYears?: number;
  education?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  specialties: TrainerSpecialtyResponse[];
  documents: TrainerDocumentResponse[];
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

// Trainer CRUD operations (Admin endpoints - require authentication)
export const createTrainer = async (data: CreateTrainerRequest): Promise<ApiResponse<TrainerResponse>> => {
  const response = await privateClient.post('/admin/trainers', data);
  return response.data;
};

export const getAllTrainers = async (page: number = 0, size: number = 10): Promise<ApiResponse<PageResponse<TrainerResponse>>> => {
  const response = await privateClient.get(`/admin/trainers?page=${page}&size=${size}`);
  return response.data;
};

export const getTrainerById = async (id: number): Promise<ApiResponse<TrainerResponse>> => {
  const response = await privateClient.get(`/admin/trainers/${id}`);
  return response.data;
};

export const updateTrainer = async (id: number, data: CreateTrainerRequest): Promise<ApiResponse<TrainerResponse>> => {
  const response = await privateClient.put(`/admin/trainers/${id}`, data);
  return response.data;
};

export const deactivateTrainer = async (id: number): Promise<ApiResponse<string>> => {
  const response = await privateClient.put(`/admin/trainers/${id}/deactivate`);
  return response.data;
};

// File upload operations (Admin endpoints - require authentication)
export const uploadTrainerAvatar = async (trainerId: number, file: File): Promise<ApiResponse<string>> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await privateClient.post(`/admin/trainers/${trainerId}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadTrainerCoverPhoto = async (trainerId: number, file: File): Promise<ApiResponse<string>> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await privateClient.post(`/admin/trainers/${trainerId}/cover-photo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadTrainerDocument = async (
  trainerId: number, 
  file: File, 
  documentType: string,
  description?: string,
  expiryDate?: string
): Promise<ApiResponse<TrainerDocumentResponse>> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);
  if (description) formData.append('description', description);
  if (expiryDate) formData.append('expiryDate', expiryDate);
  
  const response = await privateClient.post(`/admin/trainers/${trainerId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Document management (Admin endpoints - require authentication)
export const verifyTrainerDocument = async (documentId: number, isVerified: boolean): Promise<ApiResponse<string>> => {
  const response = await privateClient.put(`/admin/trainers/documents/${documentId}/verify?isVerified=${isVerified}`);
  return response.data;
};

export const deleteTrainerDocument = async (trainerId: number, documentId: number): Promise<ApiResponse<string>> => {
  const response = await privateClient.delete(`/admin/trainers/${trainerId}/documents/${documentId}`);
  return response.data;
};

// ServiceCategory operations (Public endpoints - No authentication required)
export const getServiceCategories = async (): Promise<ApiResponse<ServiceCategoryResponse[]>> => {
  return await getPublicServiceCategories();
};

export const getServiceCategoryById = async (id: number): Promise<ApiResponse<ServiceCategoryResponse>> => {
  const response = await publicClient.get(`/public/service-categories/${id}`);
  return response.data;
};

export const getServiceCategoryByName = async (name: string): Promise<ApiResponse<ServiceCategoryResponse>> => {
  const response = await publicClient.get(`/public/service-categories/name/${name}`);
  return response.data;
};

// Public endpoints (No authentication required)
export const getPublicTrainers = async (page: number = 0, size: number = 10): Promise<ApiResponse<PageResponse<TrainerResponse>>> => {
  const response = await publicClient.get(`/public/trainers?page=${page}&size=${size}`);
  return response.data;
};

export const getTrainersBySpecialty = async (specialtyName: string): Promise<ApiResponse<TrainerResponse[]>> => {
  const response = await publicClient.get(`/public/trainers/specialty/${specialtyName}`);
  return response.data;
};

export const getAvailableSpecialties = async (): Promise<ApiResponse<ServiceCategoryResponse[]>> => {
  return await getPublicServiceCategories();
};

// Constants - Keep for backward compatibility, but prefer dynamic loading
export const LEVELS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' }
];

export const DOCUMENT_TYPES = [
  { value: 'ID_CARD', label: 'CMND/CCCD' },
  { value: 'PASSPORT', label: 'Hộ chiếu' },
  { value: 'CERTIFICATE', label: 'Chứng chỉ' },
  { value: 'LICENSE', label: 'Giấy phép hành nghề' },
  { value: 'DIPLOMA', label: 'Bằng cấp' },
  { value: 'HEALTH_CERTIFICATE', label: 'Giấy khám sức khỏe' },
  { value: 'CRIMINAL_RECORD', label: 'Lý lịch tư pháp' },
  { value: 'CV', label: 'Sơ yếu lý lịch' },
  { value: 'OTHER', label: 'Khác' }
];