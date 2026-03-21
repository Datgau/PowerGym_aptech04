import { publicClient, privateClient} from './api';
import type { ApiResponse, PageResponse } from '../@type/apiResponse';

export interface GymServiceDto {
  id: number;
  name: string;
  description: string;
  category: {
    id: number;
    name: string;
    displayName: string;
    description?: string;
    icon?: string;
    color?: string;
    isActive: boolean;
    sortOrder: number;
  };
  images: string[];
  price: number;
  duration?: number;
  maxParticipants?: number;
  isActive: boolean;
  registrationCount?: number;
}

export interface GymServiceCreateRequest {
  name: string;
  description: string;
  categoryId: number;
  price: number;
  duration?: number;
  maxParticipants?: number;
  isActive?: boolean;
  images?: File[];
}

// Keep this for future use if needed
export interface GymServiceImage {
    id: string;
    serviceId: string;
    imageUrl: string;
    sortOrder: number;
}

export interface ClassSchedule {
  id: string;
  serviceId: string;
  serviceName: string;
  instructorName: string;
  startTime: string;
  endTime: string;
  date: string;
  maxParticipants: number;
  currentParticipants: number;
  isBooked: boolean;
}

export interface BookingRequest {
  scheduleId: string;
  notes?: string;
}

export interface CheckInRequest {
  qrCode: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export const gymServiceApi = {
  /**
   * Get all gym services
   */
  getServicesActive: async (): Promise<ApiResponse<GymServiceDto[]>> => {
    const response = await publicClient.get<ApiResponse<GymServiceDto[]>>('/gym/services/active');
    return response.data;
  },

  /**
   * Get active gym services with pagination
   */
  getServicesActivePaginated: async (
    page: number = 0,
    size: number = 6
  ): Promise<ApiResponse<PageResponse<GymServiceDto>>> => {
    const response = await publicClient.get<ApiResponse<PageResponse<GymServiceDto>>>('/gym/services/active/paginated', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Get all services (Admin) with pagination
   */
  getAllServices: async (
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PageResponse<GymServiceDto>>> => {
    const response = await privateClient.get<ApiResponse<PageResponse<GymServiceDto>>>('/gym/services/paginated', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Get all services (Admin) - without pagination (legacy)
   */
  getAllServicesLegacy: async (): Promise<ApiResponse<GymServiceDto[]>> => {
    const response = await privateClient.get<ApiResponse<GymServiceDto[]>>('/gym/services');
    return response.data;
  },

  /**
   * Get service by ID
   */
  getServiceById: async (id: number): Promise<ApiResponse<GymServiceDto>> => {
    const response = await privateClient.get<ApiResponse<GymServiceDto>>(`/gym/services/${id}`);
    return response.data;
  },

  /**
   * Create service (Admin)
   */
  createService: async (data: GymServiceCreateRequest): Promise<ApiResponse<GymServiceDto>> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    
    // Safety check for categoryId
    if (data.categoryId === undefined || data.categoryId === null) {
      throw new Error('Category ID is required');
    }
    formData.append('categoryId', data.categoryId.toString());
    formData.append('price', data.price.toString());
    
    if (data.duration) formData.append('duration', data.duration.toString());
    if (data.maxParticipants) formData.append('maxParticipants', data.maxParticipants.toString());
    if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
    
    if (data.images && data.images.length > 0) {
      data.images.forEach(image => {
        formData.append('images', image);
      });
    }

    const response = await privateClient.post<ApiResponse<GymServiceDto>>('/gym/services', formData);
    return response.data;
  },

  /**
   * Update service (Admin)
   */
  updateService: async (id: number, data: Partial<GymServiceCreateRequest> & { deletedImages?: string[] }): Promise<ApiResponse<GymServiceDto>> => {
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.categoryId !== undefined && data.categoryId !== null) {
      formData.append('categoryId', data.categoryId.toString());
    }
    if (data.price) formData.append('price', data.price.toString());
    if (data.duration) formData.append('duration', data.duration.toString());
    if (data.maxParticipants) formData.append('maxParticipants', data.maxParticipants.toString());
    if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());

    // Handle new images
    if (data.images && data.images.length > 0) {
      data.images.forEach(image => {
        formData.append('images', image);
      });
    }

    // Handle deleted images
    if (data.deletedImages && data.deletedImages.length > 0) {
      data.deletedImages.forEach(imageUrl => {
        formData.append('deletedImages', imageUrl);
      });
    }

    const response = await privateClient.put<ApiResponse<GymServiceDto>>(`/gym/services/${id}`, formData);
    return response.data;
  },

  /**
   * Delete service (Admin)
   */
  deleteService: async (id: number): Promise<ApiResponse<void>> => {
    const response = await privateClient.delete<ApiResponse<void>>(`/gym/services/${id}`);
    return response.data;
  },

  /**
   * Get service registration stats
   */
  getServiceRegistrationStats: async (id: number): Promise<ApiResponse<{
    serviceId: number;
    serviceName: string;
    registrationCount: number;
    maxParticipants: number;
    availableSlots: number;
    isFullyBooked: boolean;
  }>> => {
    const response = await publicClient.get(`/gym/services/${id}/registration-stats`);
    return response.data;
  },
};