import { privateClient, publicClient } from './api';
import type { ApiResponse } from '../@type/apiResponse';

export interface NewCreateBookingRequest {
  trainerId?: number | null;
  serviceRegistrationId: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
  sessionType?: string;
}

export interface NewTrainerBookingResponse {
  id: number;
  bookingId: string;
  user: { id: number; fullName: string; email: string; avatar?: string };
  trainer: { id: number; fullName: string; email: string; avatar?: string } | null;
  bookingDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
  sessionType?: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW' | 'RESCHEDULED';
  isAssignedByAdmin: boolean;
  serviceRegistrationId?: number;
  serviceName?: string;
  rejectionReason?: string;
  rejectionMediaUrl?: string;
  rejectedAt?: string;
  createdAt: string;
}

export interface SlotInfo {
  slotId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'DAY_OFF' | 'INACTIVE';
  isDayOff: boolean;
  note?: string;
  bookingId?: number | null;
}

export interface TrainerScheduleResponse {
  trainerId: number;
  trainerName: string;
  trainerAvatar?: string;
  date?: string;
  dailySlots?: SlotInfo[];
  weeklySchedule?: Record<string, SlotInfo[]>;
}

export const createBooking = async (
  userId: number,
  request: NewCreateBookingRequest
): Promise<ApiResponse<NewTrainerBookingResponse>> => {
  const response = await privateClient.post<ApiResponse<NewTrainerBookingResponse>>(
    `/bookings/user/${userId}`,
    request
  );
  return response.data;
};

export const getMyBookings = async (
  userId: number,
  status?: string
): Promise<ApiResponse<NewTrainerBookingResponse[]>> => {
  const params = status ? { status } : {};
  const response = await privateClient.get<ApiResponse<NewTrainerBookingResponse[]>>(
    `/bookings/user/${userId}`,
    { params }
  );
  return response.data;
};

export const cancelBooking = async (
  bookingId: number,
  userId: number,
  reason?: string
): Promise<ApiResponse<NewTrainerBookingResponse>> => {
  const params: Record<string, string> = { userId: String(userId) };
  if (reason) params.reason = reason;
  const response = await privateClient.put<ApiResponse<NewTrainerBookingResponse>>(
    `/bookings/${bookingId}/cancel`,
    null,
    { params }
  );
  return response.data;
};

export const validateBooking = async (
  userId: number,
  request: NewCreateBookingRequest
): Promise<ApiResponse<string>> => {
  const response = await privateClient.post<ApiResponse<string>>(
    `/bookings/validate?userId=${userId}`,
    request
  );
  return response.data;
};

export const getTrainerDailySchedule = async (
  trainerId: number,
  date: string // YYYY-MM-DD
): Promise<ApiResponse<TrainerScheduleResponse>> => {
  const response = await privateClient.get<ApiResponse<TrainerScheduleResponse>>(
    `/bookings/trainers/${trainerId}/schedule`,
    { params: { date } }
  );
  return response.data;
};

export const getTrainersByServiceId = async (
  serviceId: number
): Promise<ApiResponse<TrainerSpecialtyItem[]>> => {
  const response = await publicClient.get<ApiResponse<TrainerSpecialtyItem[]>>(
    `/public/trainers/specialty-category/${serviceId}`
  );
  return response.data;
};

export interface TrainerSpecialtyItem {
  id: number;
  fullName: string;
  email: string;
  avatar?: string;
  bio?: string;
  totalExperienceYears?: number;
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
  isActive: boolean;
}


export interface TimeSlotOption {
  startTime: string;
  endTime: string;
  label: string;
}

export const generateBookingSlots = (): TimeSlotOption[] => {
  const slots: TimeSlotOption[] = [];
  for (let h = 8; h < 22; h++) {
    const start = `${String(h).padStart(2, '0')}:00`;
    const end   = `${String(h + 2).padStart(2, '0')}:00`;
    const label = `${start} – ${end}`;
    slots.push({ startTime: start, endTime: end, label });
  }
  return slots;
};

export const BOOKING_SLOTS = generateBookingSlots();

export const calcEndDate = (startDate: string, durationDays: number): string => {
  const d = new Date(startDate);
  d.setDate(d.getDate() + durationDays - 1);
  return d.toISOString().split('T')[0];
};
export const formatDateVi = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
};


export const getTrainerBookedDatesInMonth = async (
  trainerId: number,
  year: number,
  month: number
): Promise<ApiResponse<{ fullyBooked: string[]; partiallyBooked: string[] }>> => {
  const response = await privateClient.get<ApiResponse<{ fullyBooked: string[]; partiallyBooked: string[] }>>(
    `/bookings/trainers/${trainerId}/booked-dates`,
    { params: { year, month } }
  );
  return response.data;
};
