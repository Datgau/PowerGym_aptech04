import { privateClient, publicClient } from './api';

export interface CreateTrainerBookingRequest {
  trainerId: number;
  bookingDate: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  notes?: string;
  sessionType?: string;
}

export interface TrainerBookingResponse {
  id: number;
  bookingId: string;
  userId: number;
  userName: string;
  userEmail: string;
  trainerId: number;
  trainerName: string;
  trainerEmail: string;
  trainerAvatar?: string;
  bookingDate: string; // ISO date string
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  notes?: string;
  sessionType?: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  createdAt: string;
  updatedAt: string;
  canCancel: boolean;
  upcoming: boolean;
}

export interface TimeSlot {
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  bookingId?: string; // Only for booked slots
  clientName?: string; // Only for booked slots
}

export interface TrainerAvailabilityResponse {
  trainerId: number;
  trainerName: string;
  date: string; // ISO date string
  bookedSlots: TimeSlot[];
  availableSlots: TimeSlot[];
}

export interface TrainerInfo {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  totalExperienceYears?: number;
  education?: string;
  specialties: SpecialtyInfo[];
  active: boolean;
}

export interface SpecialtyInfo {
  specialtyId: number;
  specialtyName: string;
  description?: string;
  experienceYears?: number;
  level?: string;
  certifications?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}

// Trainer Booking Operations
export const createTrainerBooking = async (
  userId: number, 
  request: CreateTrainerBookingRequest
): Promise<ApiResponse<TrainerBookingResponse>> => {
  const response = await privateClient.post(`/trainer-bookings/user/${userId}`, request);
  return response.data;
};

export const getUserBookings = async (userId: number): Promise<ApiResponse<TrainerBookingResponse[]>> => {
  const response = await privateClient.get(`/trainer-bookings/user/${userId}`);
  return response.data;
};

export const getUpcomingUserBookings = async (userId: number): Promise<ApiResponse<TrainerBookingResponse[]>> => {
  const response = await privateClient.get(`/trainer-bookings/user/${userId}/upcoming`);
  return response.data;
};

export const getTrainerBookings = async (trainerId: number): Promise<ApiResponse<TrainerBookingResponse[]>> => {
  const response = await privateClient.get(`/trainer-bookings/trainer/${trainerId}`);
  return response.data;
};

export const getUpcomingTrainerBookings = async (trainerId: number): Promise<ApiResponse<TrainerBookingResponse[]>> => {
  const response = await privateClient.get(`/trainer-bookings/trainer/${trainerId}/upcoming`);
  return response.data;
};

export const getTrainerAvailability = async (
  trainerId: number, 
  date: string
): Promise<ApiResponse<TrainerAvailabilityResponse>> => {
  const response = await privateClient.get(`/trainer-bookings/trainer/${trainerId}/availability?date=${date}`);
  return response.data;
};

export const cancelTrainerBooking = async (
  bookingId: number, 
  userId: number, 
  reason?: string
): Promise<ApiResponse<TrainerBookingResponse>> => {
  const params = new URLSearchParams({ userId: userId.toString() });
  if (reason) params.append('reason', reason);
  
  const response = await privateClient.put(`/trainer-bookings/${bookingId}/cancel?${params.toString()}`);
  return response.data;
};

// Trainer Information Operations
export const getAllActiveTrainers = async (): Promise<ApiResponse<TrainerInfo[]>> => {
  const response = await publicClient.get('/trainers');
  return response.data;
};

export const getTrainerById = async (trainerId: number): Promise<ApiResponse<TrainerInfo>> => {
  const response = await publicClient.get(`/trainers/${trainerId}`);
  return response.data;
};

// Utility functions
export const formatBookingTime = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

export const formatBookingDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const isBookingUpcoming = (booking: TrainerBookingResponse): boolean => {
  const bookingDateTime = new Date(`${booking.bookingDate}T${booking.startTime}`);
  return bookingDateTime > new Date() && booking.status === 'CONFIRMED';
};

export const canCancelBooking = (booking: TrainerBookingResponse): boolean => {
  if (booking.status !== 'CONFIRMED') return false;
  
  const bookingDateTime = new Date(`${booking.bookingDate}T${booking.startTime}`);
  const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
  
  return bookingDateTime > twoHoursFromNow;
};

export const getBookingStatusColor = (status: TrainerBookingResponse['status']): string => {
  switch (status) {
    case 'CONFIRMED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    case 'COMPLETED':
      return 'info';
    case 'NO_SHOW':
      return 'warning';
    default:
      return 'default';
  }
};

export const getBookingStatusText = (status: TrainerBookingResponse['status']): string => {
  switch (status) {
    case 'CONFIRMED':
      return 'Đã xác nhận';
    case 'CANCELLED':
      return 'Đã hủy';
    case 'COMPLETED':
      return 'Hoàn thành';
    case 'NO_SHOW':
      return 'Không đến';
    default:
      return status;
  }
};

// Session types
export const SESSION_TYPES = [
  { value: 'PERSONAL_TRAINING', label: 'Personal Training' },
  { value: 'GROUP_SESSION', label: 'Group Session' },
  { value: 'CONSULTATION', label: 'Consultation' },
  { value: 'ASSESSMENT', label: 'Fitness Assessment' },
  { value: 'NUTRITION_COACHING', label: 'Nutrition Coaching' },
  { value: 'REHABILITATION', label: 'Rehabilitation' },
  { value: 'OTHER', label: 'Other' }
];

// Time slots for booking (8 AM to 8 PM, 1-hour slots)
export const generateTimeSlots = (): { value: string; label: string }[] => {
  const slots = [];
  for (let hour = 8; hour < 20; hour++) {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    const displayTime = hour < 12 ? `${hour}:00 AM` : 
                       hour === 12 ? '12:00 PM' : 
                       `${hour - 12}:00 PM`;
    slots.push({ value: timeString, label: displayTime });
  }
  return slots;
};

export const TIME_SLOTS = generateTimeSlots();