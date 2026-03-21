import privateClient from './api';
import type { ApiResponse } from '../@type/apiResponse';
import { registerService, type ServiceRegistrationRequest } from './serviceRegistrationService';

// Enhanced Service Registration Types
export interface ServiceRegistrationWithTrainerRequest {
  userId: number;
  serviceId: number;
  trainerId?: number;
  notes?: string;
  trainerSelectionNotes?: string;
}

export interface TrainerAvailabilityDTO {
  trainerId: number;
  trainerName: string;
  trainerEmail: string;
  trainerPhone?: string;
  trainerAvatar?: string;
  specialties: Array<{
    id: number;
    specialty: {
      id: number;
      name: string;
      displayName: string;
    };
    experienceYears?: number;
    level?: string;
  }>;
  totalExperienceYears?: number;
  rating: number;
  totalRatings: number;
  isAvailable: boolean;
  nextAvailableSlot?: string;
  workloadLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'OVERLOADED';
  completedSessions: number;
  averageSessionRating: number;
}

export interface ServiceRegistrationWithTrainerResponse {
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
  trainer?: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber?: string;
    avatar?: string;
  };
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  registrationDate: string;
  trainerSelectedAt?: string;
  trainerSelectionNotes?: string;
  hasTrainer: boolean;
  bookings: Array<{
    id: number;
    bookingId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    status: string;
  }>;
}

export interface ServiceRegistrationWithTrainerSelectionResponse {
  registrationId: number;
  serviceName: string;
  serviceDescription: string;
  serviceCategory: string;
  servicePrice: number;
  registrationDate: string;
  registrationStatus: string;
  userId: number;
  userFullName: string;
  userEmail: string;
  userPhone?: string;
  availableTrainers: TrainerAvailabilityDTO[];
  totalAvailableTrainers: number;
  hasSelectedTrainer: boolean;
  selectedTrainerId?: number;
  selectedTrainerName?: string;
  trainerSelectedAt?: string;
  hasActiveBooking: boolean;
  activeBookingId?: number;
  bookingStatus?: string;
}

export const enhancedServiceRegistrationService = {
  /**
   * Register service with trainer selection
   */
  registerServiceWithTrainer: async (
    data: ServiceRegistrationWithTrainerRequest
  ): Promise<ApiResponse<ServiceRegistrationWithTrainerResponse>> => {
    const response = await privateClient.post('/service-registrations/with-trainer', data);
    return response.data;
  },

  /**
   * Get available trainers for a service
   */
  getAvailableTrainers: async (
    serviceId: number,
    preferredDate?: string
  ): Promise<ApiResponse<TrainerAvailabilityDTO[]>> => {
    const params = preferredDate ? { preferredDate } : {};
    const response = await privateClient.get(
      `/service-registrations/service/${serviceId}/available-trainers`,
      { params }
    );
    return response.data;
  },

  /**
   * Assign trainer to existing registration
   */
  assignTrainer: async (
    registrationId: number,
    trainerId: number,
    notes?: string
  ): Promise<ApiResponse<ServiceRegistrationWithTrainerResponse>> => {
    const params = { trainerId, ...(notes && { notes }) };
    const response = await privateClient.put(
      `/service-registrations/${registrationId}/assign-trainer`,
      null,
      { params }
    );
    return response.data;
  },

  /**
   * Remove trainer from registration
   */
  removeTrainer: async (
    registrationId: number,
    reason?: string
  ): Promise<ApiResponse<void>> => {
    const params = reason ? { reason } : {};
    const response = await privateClient.delete(
      `/service-registrations/${registrationId}/remove-trainer`,
      { params }
    );
    return response.data;
  },

  /**
   * Get registration with full details including trainer and bookings
   */
  getRegistrationFullDetails: async (
    registrationId: number
  ): Promise<ApiResponse<ServiceRegistrationWithTrainerResponse>> => {
    const response = await privateClient.get(
      `/service-registrations/${registrationId}/full-details`
    );
    return response.data;
  },

  /**
   * Get user's registrations with trainer information
   */
  getUserRegistrationsWithTrainers: async (
    userId: number
  ): Promise<ApiResponse<ServiceRegistrationWithTrainerResponse[]>> => {
    const response = await privateClient.get(
      `/service-registrations/user/${userId}/with-trainers`
    );
    return response.data;
  },

  /**
   * Get trainer's registrations
   */
  getTrainerRegistrations: async (
    trainerId: number
  ): Promise<ApiResponse<ServiceRegistrationWithTrainerResponse[]>> => {
    const response = await privateClient.get(
      `/service-registrations/trainer/${trainerId}`
    );
    return response.data;
  },

  /**
   * Update trainer selection notes
   */
  updateTrainerNotes: async (
    registrationId: number,
    notes: string
  ): Promise<ApiResponse<ServiceRegistrationWithTrainerResponse>> => {
    const response = await privateClient.put(
      `/service-registrations/${registrationId}/trainer-notes`,
      null,
      { params: { notes } }
    );
    return response.data;
  },

  /**
   * Get registration for trainer selection (used after service registration or payment)
   */
  getRegistrationForTrainerSelection: async (
    registrationId: number
  ): Promise<ApiResponse<ServiceRegistrationWithTrainerSelectionResponse>> => {
    const response = await privateClient.get(
      `/service-registrations/${registrationId}/trainer-selection`
    );
    return response.data;
  },

  /**
   * Register service normally and then get trainer selection data
   * This combines the existing service registration with trainer selection
   */
  registerServiceAndGetTrainerSelection: async (
    serviceRegistrationData: ServiceRegistrationRequest
  ): Promise<{
    registration: ApiResponse<any>;
    trainerSelection: ApiResponse<ServiceRegistrationWithTrainerSelectionResponse>;
  }> => {
    // First register the service using existing service
    const registration = await registerService(serviceRegistrationData);
    
    // Then get trainer selection data
    const trainerSelection = await enhancedServiceRegistrationService.getRegistrationForTrainerSelection(
      registration.data.id
    );
    
    return { registration, trainerSelection };
  }
};

export default enhancedServiceRegistrationService;