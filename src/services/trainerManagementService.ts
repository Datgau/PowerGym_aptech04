import privateClient from './api';
import type { ApiResponse } from '../@type/apiResponse';

// Trainer Schedule Types
export interface TrainerScheduleResponse {
  trainerId: number;
  trainerName: string;
  trainerEmail: string;
  trainerPhone?: string;
  trainerAvatar?: string;
  fromDate: string;
  toDate: string;
  dailySchedules: DailySchedule[];
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  averageBookingsPerDay: number;
}

export interface DailySchedule {
  date: string;
  dayOfWeek: string;
  bookings: TrainerBookingInfo[];
  availableSlots: TimeSlot[];
  totalBookings: number;
  hasConflicts: boolean;
}

export interface TrainerBookingInfo {
  bookingId: number;
  bookingCode: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceName: string;
  serviceCategory: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  sessionObjective?: string;
  sessionNumber?: number;
  createdAt: string;
  confirmedAt?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  reason?: string;
}

// Trainer Statistics Types
export interface TrainerStatisticsResponse {
  trainerId: number;
  trainerName: string;
  fromDate: string;
  toDate: string;
  totalBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  completionRate: number;
  averageRating: number;
  totalRatings: number;
  totalRevenue: number;
  averageRevenuePerSession: number;
  busyDays: number;
  availableDays: number;
  peakHours: string[];
  clientRetentionRate: number;
  newClientsCount: number;
  returningClientsCount: number;
  monthlyBreakdown: MonthlyStats[];
  serviceBreakdown: ServiceStats[];
  ratingDistribution: RatingDistribution;
}

export interface MonthlyStats {
  month: string;
  year: number;
  bookings: number;
  revenue: number;
  averageRating: number;
}

export interface ServiceStats {
  serviceName: string;
  serviceCategory: string;
  bookingCount: number;
  revenue: number;
  averageRating: number;
}

export interface RatingDistribution {
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
}

// Bulk Response Types
export interface BulkBookingRequest {
  bookingIds: number[];
  action: 'CONFIRM' | 'REJECT';
  reason?: string;
}

export interface BulkBookingResponse {
  processedCount: number;
  successCount: number;
  failedCount: number;
  results: BulkBookingResult[];
}

export interface BulkBookingResult {
  bookingId: number;
  success: boolean;
  message: string;
  newStatus?: string;
}

// Workload Summary Types
export interface WorkloadSummaryResponse {
  trainers: TrainerWorkloadInfo[];
  totalTrainers: number;
  averageWorkload: number;
  overloadedTrainers: number;
  underutilizedTrainers: number;
}

export interface TrainerWorkloadInfo {
  trainerId: number;
  trainerName: string;
  trainerEmail: string;
  currentBookings: number;
  maxCapacity: number;
  workloadPercentage: number;
  workloadLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'OVERLOADED';
  nextAvailableSlot?: string;
  specialties: string[];
  rating: number;
  isActive: boolean;
}

export const trainerManagementService = {
  /**
   * Get trainer schedule for a specific date range
   */
  getTrainerSchedule: async (
    trainerId: number,
    fromDate: string,
    toDate: string
  ): Promise<ApiResponse<TrainerScheduleResponse>> => {
    const response = await privateClient.get(
      `/trainer-management/trainer/${trainerId}/schedule`,
      { params: { fromDate, toDate } }
    );
    return response.data;
  },

  /**
   * Get pending booking requests for a trainer
   */
  getTrainerPendingRequests: async (
    trainerId: number
  ): Promise<ApiResponse<TrainerBookingInfo[]>> => {
    const response = await privateClient.get(
      `/trainer-management/trainer/${trainerId}/pending-requests`
    );
    return response.data;
  },

  /**
   * Get trainer statistics for a date range
   */
  getTrainerStatistics: async (
    trainerId: number,
    fromDate: string,
    toDate: string
  ): Promise<ApiResponse<TrainerStatisticsResponse>> => {
    const response = await privateClient.get(
      `/trainer-management/trainer/${trainerId}/statistics`,
      { params: { fromDate, toDate } }
    );
    return response.data;
  },

  /**
   * Get overview of all trainers for a specific date (Admin only)
   */
  getTrainersOverview: async (
    date: string
  ): Promise<ApiResponse<TrainerScheduleResponse[]>> => {
    const response = await privateClient.get(
      `/trainer-management/overview`,
      { params: { date } }
    );
    return response.data;
  },

  /**
   * Bulk respond to booking requests (Admin only)
   */
  bulkRespondToBookings: async (
    request: BulkBookingRequest
  ): Promise<ApiResponse<BulkBookingResponse>> => {
    const response = await privateClient.post(
      `/trainer-management/bulk-respond`,
      request
    );
    return response.data;
  },

  /**
   * Get workload summary for all trainers (Admin only)
   */
  getWorkloadSummary: async (
    fromDate: string,
    toDate: string
  ): Promise<ApiResponse<WorkloadSummaryResponse>> => {
    const response = await privateClient.get(
      `/trainer-management/workload-summary`,
      { params: { fromDate, toDate } }
    );
    return response.data;
  },

  /**
   * Get trainer availability for a specific date
   */
  getTrainerAvailability: async (
    trainerId: number,
    date: string
  ): Promise<ApiResponse<TimeSlot[]>> => {
    const response = await privateClient.get(
      `/trainer-management/trainer/${trainerId}/availability`,
      { params: { date } }
    );
    return response.data;
  },

  /**
   * Update trainer working hours
   */
  updateTrainerWorkingHours: async (
    trainerId: number,
    workingHours: {
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }[]
  ): Promise<ApiResponse<void>> => {
    const response = await privateClient.put(
      `/trainer-management/trainer/${trainerId}/working-hours`,
      { workingHours }
    );
    return response.data;
  },

  /**
   * Get trainer performance metrics
   */
  getTrainerPerformance: async (
    trainerId: number,
    period: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR' = 'MONTH'
  ): Promise<ApiResponse<{
    completionRate: number;
    averageRating: number;
    clientSatisfaction: number;
    punctualityScore: number;
    revenueGenerated: number;
    sessionsCompleted: number;
    clientRetention: number;
    improvementAreas: string[];
    strengths: string[];
  }>> => {
    const response = await privateClient.get(
      `/trainer-management/trainer/${trainerId}/performance`,
      { params: { period } }
    );
    return response.data;
  }
};

export default trainerManagementService;