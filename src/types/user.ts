export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  avatar?: string;
  bio?: string;
  coverPhoto?: string;
  totalExperienceYears?: number;
  education?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  salaryBalance?: number;
  isActive: boolean;
  createDate: string;
  role: {
    id: number;
    name: string;
  };
}

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
