import { publicClient} from './api';
import type { ApiResponse } from '../@type/apiResponse';

export interface GymServiceDto {
  id: string;
  name: string;
  description: string;
  category: 'PERSONAL_TRAINER' | 'BOXING' | 'YOGA' | 'CARDIO' | 'OTHER';
  images: string[];
  price: number;
  duration?: number;
  maxParticipants?: number;
  isActive: boolean;
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

  // /**
  //  * Get service by category
  //  */
  // getServicesByCategory: async (category: string): Promise<ApiResponse<GymService[]>> => {
  //   const response = await publicClient.get<ApiResponse<GymService[]>>(`/gym/services/category/${category}`);
  //   return response.data;
  // },
  //
  // /**
  //  * Get class schedules
  //  */
  // getSchedules: async (date?: string): Promise<ApiResponse<ClassSchedule[]>> => {
  //   const params = date ? { date } : {};
  //   const response = await privateClient.get<ApiResponse<ClassSchedule[]>>('/gym/schedules', { params });
  //   return response.data;
  // },
  //
  // /**
  //  * Book a class
  //  */
  // bookClass: async (booking: BookingRequest): Promise<ApiResponse<{ bookingId: string }>> => {
  //   const response = await privateClient.post<ApiResponse<{ bookingId: string }>>(
  //     '/gym/book-class',
  //     booking
  //   );
  //   return response.data;
  // },
  //
  // /**
  //  * Cancel a booking
  //  */
  // cancelBooking: async (bookingId: string): Promise<ApiResponse<void>> => {
  //   const response = await privateClient.delete<ApiResponse<void>>(`/gym/bookings/${bookingId}`);
  //   return response.data;
  // },
  //
  // /**
  //  * Get user's bookings
  //  */
  // getMyBookings: async (): Promise<ApiResponse<ClassSchedule[]>> => {
  //   const response = await privateClient.get<ApiResponse<ClassSchedule[]>>('/gym/my-bookings');
  //   return response.data;
  // },
  //
  // /**
  //  * Check in to gym using QR code
  //  */
  // checkIn: async (checkInData: CheckInRequest): Promise<ApiResponse<{ checkInTime: string }>> => {
  //   const response = await privateClient.post<ApiResponse<{ checkInTime: string }>>(
  //     '/gym/check-in',
  //     checkInData
  //   );
  //   return response.data;
  // },
  //
  // /**
  //  * Get check-in history
  //  */
  // getCheckInHistory: async (): Promise<ApiResponse<Array<{ date: string; checkInTime: string; checkOutTime?: string }>>> => {
  //   const response = await privateClient.get<ApiResponse<Array<{ date: string; checkInTime: string; checkOutTime?: string }>>>('/gym/check-in-history');
  //   return response.data;
  // }
};