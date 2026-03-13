import { useState, useEffect, useCallback } from 'react';
import {
  gymServiceApi,
  type GymServiceDto as GymServiceType,
  // type ClassSchedule,
  type GymServiceDto
} from '../services/gymService';
// import { getAccessToken } from '../services/authStorage';
import type {ServiceItem} from "../@type/powergym.ts";
import type { PageResponse } from '../@type/apiResponse';

interface UseGymServicesReturn {
  services: GymServiceDto[];
  // schedules: ClassSchedule[];
  // myBookings: ClassSchedule[];
  loading: boolean;
  error: string | null;
  // bookClass: (scheduleId: string, notes?: string) => Promise<boolean>;
  // cancelBooking: (bookingId: string) => Promise<boolean>;
  // checkIn: (qrCode: string) => Promise<boolean>;
  // refreshSchedules: () => Promise<void>;
  // refreshBookings: () => Promise<void>;
}

interface UseGymServicesPaginatedReturn {
  services: GymServiceDto[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}

export const useGymServices = (): UseGymServicesReturn => {
    // const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
    // const [myBookings, setMyBookings] = useState<ClassSchedule[]>([]);

    // const fetchSchedules = async (): Promise<void> => {
    //   // Check if user is authenticated
    //   if (!getAccessToken()) {
    //     return;
    //   }
    //
    //   try {
    //     const response = await GymService.getSchedules();
    //     if (response.success && response.data) {
    //       setSchedules(response.data);
    //     }
    //   } catch (err) {
    //     console.error('Error fetching schedules:', err);
    //   }
    // };

    // const fetchMyBookings = async (): Promise<void> => {
    //   // Check if user is authenticated
    //   if (!getAccessToken()) {
    //     return;
    //   }
    //
    //   try {
    //     const response = await GymService.getMyBookings();
    //     if (response.success && response.data) {
    //       setMyBookings(response.data);
    //     }
    //   } catch (err) {
    //     console.error('Error fetching bookings:', err);
    //   }
    // };

    // const bookClass = async (scheduleId: string, notes?: string): Promise<boolean> => {
    //   // Check if user is authenticated
    //   if (!getAccessToken()) {
    //     setError('Please login to book a class');
    //     return false;
    //   }
    //
    //   try {
    //     setLoading(true);
    //     setError(null);
    //
    //     const response = await GymService.bookClass({ scheduleId, notes });
    //
    //     if (response.success) {
    //       // Refresh schedules and bookings after successful booking
    //       await Promise.all([fetchSchedules(), fetchMyBookings()]);
    //       return true;
    //     } else {
    //       setError(response.message || 'Failed to book class');
    //       return false;
    //     }
    //   } catch (err) {
    //     setError(err instanceof Error ? err.message : 'Booking failed');
    //     console.error('Error booking class:', err);
    //     return false;
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // const cancelBooking = async (bookingId: string): Promise<boolean> => {
    //   // Check if user is authenticated
    //   if (!getAccessToken()) {
    //     setError('Please login to cancel booking');
    //     return false;
    //   }
    //
    //   try {
    //     setLoading(true);
    //     setError(null);
    //
    //     const response = await GymService.cancelBooking(bookingId);
    //
    //     if (response.success) {
    //       // Refresh schedules and bookings after successful cancellation
    //       await Promise.all([fetchSchedules(), fetchMyBookings()]);
    //       return true;
    //     } else {
    //       setError(response.message || 'Failed to cancel booking');
    //       return false;
    //     }
    //   } catch (err) {
    //     setError(err instanceof Error ? err.message : 'Cancellation failed');
    //     console.error('Error canceling booking:', err);
    //     return false;
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // const checkIn = async (qrCode: string): Promise<boolean> => {
    //   // Check if user is authenticated
    //   if (!getAccessToken()) {
    //     setError('Please login to check in');
    //     return false;
    //   }
    //
    //   try {
    //     setLoading(true);
    //     setError(null);
    //
    //     const response = await GymService.checkIn({ qrCode });
    //
    //     if (response.success) {
    //       return true;
    //     } else {
    //       setError(response.message || 'Check-in failed');
    //       return false;
    //     }
    //   } catch (err) {
    //     setError(err instanceof Error ? err.message : 'Check-in failed');
    //     console.error('Error checking in:', err);
    //     return false;
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // const refreshSchedules = async (): Promise<void> => {
    //   await fetchSchedules();
    // };
    //
    // const refreshBookings = async (): Promise<void> => {
    //   await fetchMyBookings();
    // };

    const [services, setServices] = useState<GymServiceType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await gymServiceApi.getServicesActive();
        console.log('API Response:', res); // Debug log

        const mapped: ServiceItem[] = res.data.map(
            (service: GymServiceDto) => ({
                id: service.id.toString(),
                name: service.name,
                description: service.description,
                category: service.category,
                images: service.images || [],
                price: service.price,
                duration: service.duration,
                maxParticipants: service.maxParticipants,
                isActive: service.isActive,
                registrationCount: service.registrationCount || 0,
            })
        );

        console.log('Mapped services:', mapped); // Debug log
        setServices(mapped);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { services, loading, error };
};

export const useGymServicesPaginated = (pageSize: number = 6): UseGymServicesPaginatedReturn => {
  const [services, setServices] = useState<GymServiceDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageInfo, setPageInfo] = useState<PageResponse<GymServiceDto> | null>(null);

  const fetchServices = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gymServiceApi.getServicesActivePaginated(page, pageSize);
      console.log('Paginated API Response:', response);
      
      if (response.success && response.data) {
        setServices(response.data.content);
        setPageInfo(response.data);
        setCurrentPage(page);
      } else {
        setError(response.message || 'Failed to fetch services');
      }
    } catch (err) {
      console.error('Error fetching paginated services:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchServices(0);
  }, [fetchServices]);

  const goToPage = useCallback((page: number) => {
    if (pageInfo && page >= 0 && page < pageInfo.totalPages) {
      fetchServices(page);
    }
  }, [fetchServices, pageInfo]);

  const nextPage = useCallback(() => {
    if (pageInfo && !pageInfo.last) {
      fetchServices(currentPage + 1);
    }
  }, [fetchServices, currentPage, pageInfo]);

  const previousPage = useCallback(() => {
    if (pageInfo && !pageInfo.first) {
      fetchServices(currentPage - 1);
    }
  }, [fetchServices, currentPage, pageInfo]);

  return {
    services,
    loading,
    error,
    currentPage,
    totalPages: pageInfo?.totalPages || 0,
    totalElements: pageInfo?.totalElements || 0,
    hasNext: pageInfo ? !pageInfo.last : false,
    hasPrevious: pageInfo ? !pageInfo.first : false,
    goToPage,
    nextPage,
    previousPage
  };
};

//   return {
//     services,
//     // schedules,
//     // myBookings,
//     loading,
//     error,
//     // bookClass,
//     // cancelBooking,
//     // checkIn,
//     // refreshSchedules,
//     // refreshBookings
//   };
// };