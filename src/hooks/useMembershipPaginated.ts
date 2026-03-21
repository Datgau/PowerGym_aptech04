import { useState, useEffect } from 'react';
import { MembershipService, type MembershipInfo } from '../services/membershipService';
import membershipPackageService, { type MembershipPackageResponse } from '../services/membershipPackageService';
import { getAccessToken } from '../services/authStorage';
import { usePagination } from './usePagination';

interface UseMembershipPaginatedReturn {
  membership: MembershipInfo | null;
  packages: MembershipPackageResponse[];
  loading: boolean;
  error: string | null;
  paginationState: {
    page: number;
    rowsPerPage: number;
    totalPages: number;
    totalElements: number;
  };
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  refreshMembership: () => Promise<void>;
  registerPackage: (packageId: string, paymentMethod: 'CASH' | 'CARD' | 'TRANSFER') => Promise<boolean>;
}

export const useMembershipPaginated = (pageSize: number = 8): UseMembershipPaginatedReturn => {
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [allPackages, setAllPackages] = useState<MembershipPackageResponse[]>([]);
  const [packages, setPackages] = useState<MembershipPackageResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(pageSize);

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
    // Packages endpoint is public, no auth required
    try {
      const data = await membershipPackageService.getActivePackages();
      setAllPackages(data);
      const totalElements = data.length;
      const totalPages = Math.ceil(totalElements / paginationState.rowsPerPage);
      setPaginationData(totalPages, totalElements);
      
      // Get current page data
      const startIndex = paginationState.page * paginationState.rowsPerPage;
      const endIndex = startIndex + paginationState.rowsPerPage;
      setPackages(data.slice(startIndex, endIndex));
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

  // Update packages when pagination changes
  useEffect(() => {
    if (allPackages.length > 0) {
      const startIndex = paginationState.page * paginationState.rowsPerPage;
      const endIndex = startIndex + paginationState.rowsPerPage;
      setPackages(allPackages.slice(startIndex, endIndex));
    }
  }, [allPackages, paginationState.page, paginationState.rowsPerPage]);

  // Initial data fetch
  useEffect(() => {
    fetchMembership();
    fetchPackages();
  }, []);

  // Refetch packages when pagination state changes
  useEffect(() => {
    if (allPackages.length > 0) {
      fetchPackages();
    }
  }, [paginationState.rowsPerPage]);

  return {
    membership,
    packages,
    loading,
    error,
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    refreshMembership,
    registerPackage
  };
};