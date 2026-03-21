import privateClient from './api';
import type {ApiResponse, PageResponse} from '../@type/apiResponse';

export interface ServiceRegistrationRequest {
  serviceId: number;
  notes?: string;
}

export interface ServiceRegistrationResponse {
  id: number;
  user: {
    id: number;
    email: string;
    fullName: string;
    phoneNumber?: string;
  };
  service: {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
  };
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED' | 'EXPIRED';
  notes?: string;
  registrationDate: string;
  expirationDate?: string;
  cancelledDate?: string;
  cancellationReason?: string;
}

export const registerService = async (data: ServiceRegistrationRequest): Promise<ApiResponse<ServiceRegistrationResponse>> => {
  console.log('registerService called with data:', data);
    const response = await privateClient.post('/service-registrations', data);
    return response.data;
};

export const cancelRegistration = async (id: number): Promise<ApiResponse<void>> => {
  const response = await privateClient.delete(`/service-registrations/${id}`);
  return response.data;
};

export const getMyRegistrations = async (): Promise<ApiResponse<ServiceRegistrationResponse[]>> => {
  const response = await privateClient.get('/service-registrations/my-registrations');
  return response.data;
};

// Admin APIs
export const getServiceRegistrations = async (
  serviceId: number,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageResponse<ServiceRegistrationResponse>>> => {
  const response = await privateClient.get(`/service-registrations/service/${serviceId}/paginated`, {
    params: { page, size }
  });
  return response.data;
};

export const getAllRegistrations = async (
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageResponse<ServiceRegistrationResponse>>> => {
  const response = await privateClient.get('/service-registrations/all/paginated', {
    params: { page, size }
  });
  return response.data;
};

// Legacy methods without pagination
export const getServiceRegistrationsLegacy = async (serviceId: number): Promise<ApiResponse<ServiceRegistrationResponse[]>> => {
  const response = await privateClient.get(`/service-registrations/service/${serviceId}`);
  return response.data;
};

export const getAllRegistrationsLegacy = async (): Promise<ApiResponse<ServiceRegistrationResponse[]>> => {
  const response = await privateClient.get('/service-registrations/all');
  return response.data;
};
