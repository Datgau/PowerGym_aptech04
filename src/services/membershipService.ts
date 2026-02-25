import { privateClient } from './api';
import type { ApiResponse } from '../@type/apiResponse';

export interface MembershipInfo {
  id: number;
  membershipType: string;
  startDate: string;
  endDate: string;
  daysLeft: number;
  totalDays: number;
  isActive: boolean;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
}

export interface MembershipPackage {
  id: string;
  name: string;
  duration: number;
  price: number;
  originalPrice?: number;
  features: string[];
  isPopular?: boolean;
  description?: string;
}

export interface PackageRegistration {
  packageId: string;
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER';
  notes?: string;
}

export const MembershipService = {
  /**
   * Get current user's membership information
   */
  getCurrentMembership: async (): Promise<ApiResponse<MembershipInfo>> => {
    const response = await privateClient.get<ApiResponse<MembershipInfo>>('/membership/current');
    return response.data;
  },

  /**
   * Get all available membership packages
   */
  getPackages: async (): Promise<ApiResponse<MembershipPackage[]>> => {
    const response = await privateClient.get<ApiResponse<MembershipPackage[]>>('/membership/packages');
    return response.data;
  },

  /**
   * Register for a new membership package
   */
  registerPackage: async (registration: PackageRegistration): Promise<ApiResponse<{ orderId: string }>> => {
    const response = await privateClient.post<ApiResponse<{ orderId: string }>>(
      '/membership/register',
      registration
    );
    return response.data;
  },

  /**
   * Extend current membership
   */
  extendMembership: async (packageId: string): Promise<ApiResponse<MembershipInfo>> => {
    const response = await privateClient.post<ApiResponse<MembershipInfo>>(
      '/membership/extend',
      { packageId }
    );
    return response.data;
  },

  /**
   * Get membership history
   */
  getMembershipHistory: async (): Promise<ApiResponse<MembershipInfo[]>> => {
    const response = await privateClient.get<ApiResponse<MembershipInfo[]>>('/membership/history');
    return response.data;
  }
};