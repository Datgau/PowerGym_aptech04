import { useState, useEffect } from 'react';
import { MembershipService, type MembershipInfo, type MembershipPackage } from '../services/membershipService';
import { getAccessToken } from '../services/authStorage';

interface UseMembershipReturn {
  membership: MembershipInfo | null;
  packages: MembershipPackage[];
  loading: boolean;
  error: string | null;
  refreshMembership: () => Promise<void>;
  registerPackage: (packageId: string, paymentMethod: 'CASH' | 'CARD' | 'TRANSFER') => Promise<boolean>;
}

export const useMembership = (): UseMembershipReturn => {
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [packages, setPackages] = useState<MembershipPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembership = async (): Promise<void> => {
    // Check if user is authenticated
    if (!getAccessToken()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await MembershipService.getCurrentMembership();
      if (response.success && response.data) {
        setMembership(response.data);
      } else {
        setError(response.message || 'Failed to fetch membership');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching membership:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async (): Promise<void> => {
    // Check if user is authenticated
    if (!getAccessToken()) {
      return;
    }

    try {
      const response = await MembershipService.getPackages();
      if (response.success && response.data) {
        setPackages(response.data);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
    }
  };

  const registerPackage = async (
    packageId: string, 
    paymentMethod: 'CASH' | 'CARD' | 'TRANSFER'
  ): Promise<boolean> => {
    // Check if user is authenticated
    if (!getAccessToken()) {
      setError('Please login to register for a package');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await MembershipService.registerPackage({
        packageId,
        paymentMethod
      });

      if (response.success) {
        // Refresh membership data after successful registration
        await fetchMembership();
        return true;
      } else {
        setError(response.message || 'Failed to register package');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      console.error('Error registering package:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshMembership = async (): Promise<void> => {
    await fetchMembership();
  };

  useEffect(() => {
    fetchMembership();
    fetchPackages();
  }, []);

  return {
    membership,
    packages,
    loading,
    error,
    refreshMembership,
    registerPackage
  };
};