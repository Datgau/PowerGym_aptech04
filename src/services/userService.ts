import api from './api';
import type { UserResponse, UpdateProfileRequest, ChangePasswordRequest } from '../types/user';

export const getCurrentProfile = async (): Promise<UserResponse> => {
  const response = await api.get('/user/profile');
  return response.data.data;
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<UserResponse> => {
  const response = await api.put('/user/profile', data);
  return response.data.data;
};

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await api.put('/user/password', data);
};

export const requestEmailChangeOtp = async (newEmail: string): Promise<void> => {
  await api.post('/user/email/request-change', { newEmail });
};

export const verifyCurrentEmailOtp = async (otp: string): Promise<void> => {
  await api.post('/user/email/verify-current', { otp });
};

export const verifyNewEmailOtp = async (newEmail: string, otp: string): Promise<UserResponse> => {
  const response = await api.post('/user/email/verify-new', { newEmail, otp });
  return response.data.data;
};

export const updateProfileWithAvatar = async (
  data: UpdateProfileRequest,
  avatar: File
): Promise<UserResponse> => {
  const formData = new FormData();
  formData.append('avatar', avatar);
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
  return response.data.data;
};
