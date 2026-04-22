import { privateClient, publicClient } from './api';
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

export interface UserMembership {
  id: number;
  membershipId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  startDate: string;
  endDate: string;
  paidAmount: number;
  membershipPackage: {
    id: number;
    name: string;
    description: string;
    duration: number;
    price: number;
    features: string[];
    color: string;
  };
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

  getCurrentMembership: async (): Promise<ApiResponse<MembershipInfo>> => {
    const response = await privateClient.get<ApiResponse<MembershipInfo>>('/membership/current');
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
  },

  /**
   * Get user's memberships (all)
   */
  getUserMemberships: async (): Promise<ApiResponse<UserMembership[]>> => {
    const response = await privateClient.get<ApiResponse<UserMembership[]>>('/user/memberships');
    return response.data;
  },

  /**
   * Get user's active memberships only
   */
  getUserActiveMemberships: async (): Promise<ApiResponse<UserMembership[]>> => {
    const response = await privateClient.get<ApiResponse<UserMembership[]>>('/user/memberships/active');
    return response.data;
  }
};