import api from './api';

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  bio?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  avatar?: string;
  bio?: string;
  role: string;
  isActive: boolean;
  createDate: string;
  salaryBalance?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}

/**
 * Get current user profile
 */
export const getCurrentProfile = async (): Promise<ApiResponse<UserResponse>> => {
  const response = await api.get('/user/profile');
  return response.data;
};

/**
 * Update profile information (JSON)
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<ApiResponse<UserResponse>> => {
  const response = await api.put('/user/profile', data);
  return response.data;
};

/**
 * Update profile with avatar upload (Multipart)
 */
export const updateProfileWithAvatar = async (
  data: UpdateProfileRequest,
  avatarFile?: File
): Promise<ApiResponse<UserResponse>> => {
  const formData = new FormData();
  
  if (avatarFile) {
    formData.append('avatar', avatarFile);
  }
  
  if (data.fullName) formData.append('fullName', data.fullName);
  if (data.email) formData.append('email', data.email);
  if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
  if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
  if (data.bio) formData.append('bio', data.bio);
  
  const response = await api.put('/user/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Change password
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
  const response = await api.put('/user/password', data);
  return response.data;
};
