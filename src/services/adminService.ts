import privateClient from './api';
import type {ApiResponse, PageResponse} from '../@type/apiResponse';

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface UserRequest {
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  dateOfBirth?: string;
  roleId: number;
}

export interface UserResponse {
  id: number;
  username?: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  avatar?: string;
  bio?: string;
  coverPhoto?: string;
  createDate?: string;
  role: Role;
  isActive?: boolean;
  totalExperienceYears?: number;
  education?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface UserMembership {
  id: number;
  membershipPackage: {
    id: number;
    name: string;
    duration: number;
    price: number;
  };
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface UserServiceRegistration {
  id: number;
  service: {
    id: number;
    name: string;
    category: any;
    price: number;
  };
  registrationDate: string;
  expirationDate?: string;
  status: string;
  trainer?: {
    id: number;
    fullName: string;
    avatar?: string;
  };
}

export interface TrainerSpecialty {
  id: number;
  specialty: {
    id: number;
    name: string;
    displayName: string;
  };
  experienceYears: number;
}

export interface UserDetailResponse extends UserResponse {
  dateOfBirth?: string;
  memberships?: UserMembership[];
  serviceRegistrations?: UserServiceRegistration[];
  trainerSpecialties?: TrainerSpecialty[];
}

// Role APIs
export const getAllRoles = async (
    page: number = 0,
    size: number = 5
): Promise<ApiResponse<PageResponse<Role>>> => {

  const response = await privateClient.get('/admin/roles/paginated', {
    params: {
      page,
      size
    }
  });
  return response.data;
};

export const getAllRolesLegacy = async (): Promise<ApiResponse<Role[]>> => {
  const response = await privateClient.get('/admin/roles');
  return response.data;
};

export const createRole = async (data: { name: string; description?: string }): Promise<ApiResponse<Role>> => {
  const response = await privateClient.post('/admin/role', data);
  return response.data;
};

export const updateRole = async (id: number, data: { name: string; description?: string }): Promise<ApiResponse<Role>> => {
  const response = await privateClient.put(`/admin/role/${id}`, { id, ...data });
  return response.data;
};

export const deleteRole = async (id: number): Promise<ApiResponse<void>> => {
  const response = await privateClient.delete(`/admin/role/${id}`);
  return response.data;
};

// User APIs
export const getAllUsers = async (
    page: number = 0,
    size: number = 10
): Promise<ApiResponse<PageResponse<UserResponse>>> => {
  const response = await privateClient.get('/admin/users', {
    params: { page, size }
  });

  return response.data;
};

export const getUsersByRole = async (
    role: string,
    page: number = 0,
    size: number = 10
): Promise<ApiResponse<PageResponse<UserResponse>>> => {
  const response = await privateClient.get('/admin/users/by-role', {
    params: { role, page, size }
  });

  return response.data;
};

export const getUserCounts = async (): Promise<ApiResponse<{
  USER: number;
  STAFF: number;
  TOTAL: number;
}>> => {
  const response = await privateClient.get('/admin/users/counts');
  return response.data;
};

export const searchUsers = async (
    searchTerm: string,
    role: string = 'ALL',
    page: number = 0,
    size: number = 10
): Promise<ApiResponse<PageResponse<UserResponse>>> => {
  const response = await privateClient.get('/admin/users/search', {
    params: { searchTerm, role, page, size }
  });
  return response.data;
};


export const createUser = async (data: UserRequest): Promise<ApiResponse<UserResponse>> => {
  const response = await privateClient.post('/admin/user', data);
  return response.data;
};

export const checkEmailExists = async (email: string): Promise<ApiResponse<boolean>> => {
  const response = await privateClient.get(`/admin/user/exists`, {
    params: { email }
  });
  return response.data;
};

export const updateUser = async (id: number, data: Partial<UserRequest>): Promise<ApiResponse<UserResponse>> => {
  const response = await privateClient.put(`/admin/user/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<ApiResponse<void>> => {
  const response = await privateClient.delete(`/admin/user/${id}`);
  return response.data;
};

// Get user details with related data
export const getUserDetail = async (id: number): Promise<ApiResponse<UserDetailResponse>> => {
  const response = await privateClient.get(`/admin/user/${id}/details`);
  return response.data;
};

// Get user memberships
export const getUserMemberships = async (userId: number): Promise<ApiResponse<UserMembership[]>> => {
  const response = await privateClient.get(`/admin/user/${userId}/memberships`);
  return response.data;
};

// Get user service registrations
export const getUserServiceRegistrations = async (userId: number): Promise<ApiResponse<UserServiceRegistration[]>> => {
  const response = await privateClient.get(`/admin/user/${userId}/service-registrations`);
  return response.data;
};

// Get trainer specialties (for trainer users)
export const getTrainerSpecialties = async (userId: number): Promise<ApiResponse<TrainerSpecialty[]>> => {
  const response = await privateClient.get(`/admin/user/${userId}/trainer-specialties`);
  return response.data;
};
