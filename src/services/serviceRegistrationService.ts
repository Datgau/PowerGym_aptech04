import privateClient from './api';
import type {ApiResponse, PageResponse} from '../@type/apiResponse';
import type {
  ServiceRegistrationResponse as EnhancedServiceRegistrationResponse,
  AvailableTrainerResponse,
  RegistrationStatus,
  PaymentStatus,
  RegistrationType
} from '../types/serviceRegistration';

export interface ServiceRegistrationRequest {
  serviceId: number;
  notes?: string;
  registrationType?: RegistrationType; // ONLINE hoặc COUNTER
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
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED' | 'EXPIRED';
  notes?: string;
  registrationDate: string;
  expirationDate?: string;
  cancelledDate?: string;
  cancellationReason?: string;
}

export interface ServiceRegistrationFilters {
  status?: RegistrationStatus;
  paymentStatus?: PaymentStatus;
  registrationType?: RegistrationType;
  searchQuery?: string;
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

/**
 * Get all service registrations with filters and pagination
 * Used by admin service registration management page
 * 
 * @param page - Page number (0-indexed)
 * @param size - Page size (number of items per page)
 * @param filters - Optional filters for status, payment status, registration type, and search query
 * @returns Promise with paginated response containing enhanced ServiceRegistrationResponse[]
 */
export const getAllServiceRegistrations = async (
  page: number = 0,
  size: number = 10,
  filters?: ServiceRegistrationFilters
): Promise<ApiResponse<PageResponse<EnhancedServiceRegistrationResponse>>> => {
  const params: Record<string, any> = { page, size };
  
  // Add filters to query parameters if provided
  if (filters?.status) {
    params.status = filters.status;
  }
  if (filters?.paymentStatus) {
    params.paymentStatus = filters.paymentStatus;
  }
  if (filters?.registrationType) {
    params.registrationType = filters.registrationType;
  }
  if (filters?.searchQuery) {
    params.searchQuery = filters.searchQuery;
  }
  
  const response = await privateClient.get('/service-registrations/all/paginated', {
    params
  });
  return response.data;
};

/**
 * Get available trainers for a specific service registration
 * Returns trainers who have specialty in the service's category
 * 
 * @param registrationId - Service registration ID
 * @returns Promise with array of AvailableTrainerResponse
 */
export const getAvailableTrainers = async (
  registrationId: number
): Promise<ApiResponse<AvailableTrainerResponse[]>> => {
  const response = await privateClient.get(`/service-registrations/${registrationId}/available-trainers`);
  return response.data;
};

/**
 * Confirm counter payment for a service registration
 * Creates a PaymentOrder with SUCCESS status
 * 
 * @param registrationId - Service registration ID
 * @param amount - Payment amount
 * @returns Promise with void response
 */
export const confirmCounterPayment = async (
  registrationId: number,
  amount: number
): Promise<ApiResponse<void>> => {
  const response = await privateClient.post(
    `/service-registrations/${registrationId}/confirm-payment`,
    null,
    {
      params: { amount }
    }
  );
  return response.data;
};
