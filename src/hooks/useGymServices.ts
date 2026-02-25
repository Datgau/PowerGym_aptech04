import { useState, useEffect } from 'react';
import {
  gymServiceApi,
  type GymServiceDto as GymServiceType,
  // type ClassSchedule,
  type GymServiceDto
} from '../services/gymService';
// import { getAccessToken } from '../services/authStorage';
import type {ServiceItem} from "../@type/powergym.ts";

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