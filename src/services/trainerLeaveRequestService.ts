import privateClient from './api';
import type { ApiResponse } from '../@type/apiResponse';

export type LeaveRequestType = 'FULL_DAY' | 'TIME_SLOT';
export type LeaveRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequestResponse {
  id: number;
  trainerId: number;
  trainerName: string;
  trainerEmail: string;
  trainerAvatar?: string;
  leaveDate: string;
  leaveType: LeaveRequestType;
  startTime?: string;
  endTime?: string;
  reason?: string;
  status: LeaveRequestStatus;
  adminNotes?: string;
  reviewedBy?: number;
  reviewedByName?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequestCreateRequest {
  leaveDate: string;
  leaveType: LeaveRequestType;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export interface LeaveRequestReviewRequest {
  status: 'APPROVED' | 'REJECTED';
  adminNotes?: string;
}

export const trainerLeaveRequestService = {
  /**
   * Create a new leave request (Trainer only)
   */
  createLeaveRequest: async (
    trainerId: number,
    request: LeaveRequestCreateRequest
  ): Promise<ApiResponse<LeaveRequestResponse>> => {
    const response = await privateClient.post(
      `/trainer-leave-requests/trainer/${trainerId}`,
      request
    );
    return response.data;
  },

  /**
   * Get all leave requests for a trainer
   */
  getTrainerLeaveRequests: async (
    trainerId: number
  ): Promise<ApiResponse<LeaveRequestResponse[]>> => {
    const response = await privateClient.get(
      `/trainer-leave-requests/trainer/${trainerId}`
    );
    return response.data;
  },

  /**
   * Get all pending leave requests (Admin only)
   */
  getAllPendingLeaveRequests: async (): Promise<ApiResponse<LeaveRequestResponse[]>> => {
    const response = await privateClient.get('/trainer-leave-requests/pending');
    return response.data;
  },

  /**
   * Review (approve/reject) a leave request (Admin only)
   */
  reviewLeaveRequest: async (
    requestId: number,
    adminId: number,
    request: LeaveRequestReviewRequest
  ): Promise<ApiResponse<LeaveRequestResponse>> => {
    const response = await privateClient.put(
      `/trainer-leave-requests/${requestId}/review`,
      request,
      { params: { adminId } }
    );
    return response.data;
  },

  /**
   * Delete a leave request (Trainer only)
   */
  deleteLeaveRequest: async (
    requestId: number,
    trainerId: number
  ): Promise<ApiResponse<void>> => {
    const response = await privateClient.delete(
      `/trainer-leave-requests/${requestId}/trainer/${trainerId}`
    );
    return response.data;
  },
};

export default trainerLeaveRequestService;
