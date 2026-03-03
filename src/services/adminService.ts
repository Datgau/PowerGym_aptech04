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
  roleId: number;
}

export interface UserResponse {
  id: number;
  username?: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  coverPhoto?: string;
  createDate?: string;
  role: Role;
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


export const createUser = async (data: UserRequest): Promise<ApiResponse<UserResponse>> => {
  const response = await privateClient.post('/admin/user', data);
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
