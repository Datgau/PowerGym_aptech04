import { privateClient, publicClient } from './api';
import type { ApiResponse } from '../@type/apiResponse';

export interface MembershipPackageDTO {
  packageId: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  features: string[];
  isPopular: boolean;
  isActive?: boolean;
  color?: string;
}

export interface CreateMembershipPackageDTO {
  name: string;
  description?: string;
  duration: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  features: string[];
  isPopular: boolean;
  isActive?: boolean;
  color?: string;
}

export interface MembershipPackageResponse {
  id: number;
  packageId: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  color?: string;
  createDate: string;
  updateDate: string;
}

class MembershipPackageService {
  private readonly BASE_URL = '/membership-packages';

  async getAllPackages(): Promise<MembershipPackageResponse[]> {
    const response = await privateClient.get<ApiResponse<MembershipPackageResponse[]>>(this.BASE_URL);
    return response.data.data;
  }


  async getActivePackages(): Promise<MembershipPackageResponse[]> {
    const response = await publicClient.get<ApiResponse<MembershipPackageResponse[]>>(`${this.BASE_URL}/active`);
    return response.data.data;
  }

  async getPackageById(id: number): Promise<MembershipPackageResponse> {
    const response = await privateClient.get<ApiResponse<MembershipPackageResponse>>(`${this.BASE_URL}/${id}`);
    return response.data.data;
  }

  async createPackage(data: CreateMembershipPackageDTO): Promise<MembershipPackageResponse> {
    const response = await privateClient.post<ApiResponse<MembershipPackageResponse>>(`${this.BASE_URL}/create`, data);
    return response.data.data;
  }

  async updatePackage(id: number, data: MembershipPackageDTO): Promise<MembershipPackageResponse> {
    const response = await privateClient.put<ApiResponse<MembershipPackageResponse>>(`${this.BASE_URL}/${id}`, data);
    return response.data.data;
  }

  async deletePackage(id: number): Promise<void> {
    await privateClient.delete<ApiResponse<void>>(`${this.BASE_URL}/${id}`);
  }
  
  async getPackageMembers(packageId: number): Promise<any[]> {
    const response = await privateClient.get<ApiResponse<any[]>>(`${this.BASE_URL}/${packageId}/members`);
    return response.data.data;
  }
  
  async getMyActivePackages(): Promise<number[]> {
    const response = await privateClient.get<ApiResponse<number[]>>('/user/memberships/active-packages');
    return response.data.data;
  }

  async getPackageStats(): Promise<Record<number, number>> {
    const response = await privateClient.get<ApiResponse<Record<number, number>>>(`${this.BASE_URL}/stats`);
    return response.data.data;
  }
}

export default new MembershipPackageService();
