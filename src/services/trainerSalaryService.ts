import api from './api';

export interface ServiceSalaryDetail {
  serviceId: number;
  serviceName: string;
  studentCount: number;
  servicePrice: number;
  trainerPercentage: number;
  salaryAmount: number;
}

export interface TrainerSalaryResponse {
  trainerId: number;
  trainerName: string;
  totalSalary: number;
  serviceBreakdown: ServiceSalaryDetail[];
  calculatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

export const trainerSalaryApi = {
  // Get current trainer's salary (for authenticated trainer)
  getTrainerSalary: async (): Promise<ApiResponse<TrainerSalaryResponse>> => {
    const response = await api.get('/trainers/me/salary');
    return response.data;
  },

  // Get trainer salary by ID (for admin)
  getTrainerSalaryById: async (trainerId: number): Promise<ApiResponse<TrainerSalaryResponse>> => {
    const response = await api.get(`/trainers/${trainerId}/salary`);
    // Backend returns data directly without wrapper, so wrap it
    return {
      success: true,
      message: 'Success',
      data: response.data,
      statusCode: 200
    };
  },
};
