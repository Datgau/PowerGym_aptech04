import { useState } from 'react';
import { toast } from 'react-toastify';
import { loadAuthSession } from '../services/authStorage';
import { createBooking } from '../services/newBookingService';

export interface BookingSetupData {
  trainerId: number | null;
  trainerName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  endDate: string;
  bookingId?: number; // Store booking ID after creation
}

export interface ServiceRegistrationFlowState {
  isRegistering: boolean;
  showBookingSetup: boolean;
  pendingBookingData: BookingSetupData | null;
  showPaymentMethodSelection: boolean;
  showMoMoPayment: boolean;
  showBankPayment: boolean;
}

export function useServiceRegistrationFlow(serviceId: number | string | undefined) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showBookingSetup, setShowBookingSetup] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<BookingSetupData | null>(null);
  const [showPaymentMethodSelection, setShowPaymentMethodSelection] = useState(false);
  const [showMoMoPayment, setShowMoMoPayment] = useState(false);
  const [showBankPayment, setShowBankPayment] = useState(false);

  const reset = () => {
    setIsRegistering(false);
    setShowBookingSetup(false);
    setPendingBookingData(null);
    setShowPaymentMethodSelection(false);
    setShowMoMoPayment(false);
    setShowBankPayment(false);
  };

  const handleRegisterNow = async () => {
    if (!serviceId) return;
    try {
      setIsRegistering(true);
      const { getMyRegistrations } = await import('../services/serviceRegistrationService');
      const existing = await getMyRegistrations();
      const alreadyRegistered = existing.data?.some(
          r => r.service.id === Number(serviceId) && r.status === 'ACTIVE'
      );
      if (alreadyRegistered) {
        toast.error('You have already registered for this service!');
        return;
      }
    } catch {
    } finally {
      setIsRegistering(false);
    }
    setShowBookingSetup(true);
  };

  const handleBookingSetupComplete = (bookingData: BookingSetupData) => {
    // Just store booking data and show payment modal
    // Booking will be created AFTER payment succeeds
    setPendingBookingData(bookingData);
    setShowBookingSetup(false);
    setShowPaymentMethodSelection(true);
  };

  const handleSelectMoMo = () => {
    setShowPaymentMethodSelection(false);
    setShowMoMoPayment(true);
  };

  const handleSelectBankTransfer = () => {
    setShowPaymentMethodSelection(false);
    setShowBankPayment(true);
  };

  const handlePaymentSuccess = async (onDone?: () => void) => {
    // Payment successful - webhook has already activated ServiceRegistration
    // Now just create the TrainerBooking
    console.log('[handlePaymentSuccess] Starting...', { pendingBookingData, serviceId });
    
    if (!pendingBookingData || !serviceId) {
      console.error('[handlePaymentSuccess] Missing data:', { pendingBookingData, serviceId });
      toast.error('Booking data not found');
      return;
    }

    try {
      const session = loadAuthSession();
      const userId = session?.user?.id;
      if (!userId) {
        console.error('[handlePaymentSuccess] No user session');
        toast.error('User session not found');
        return;
      }

      console.log('[handlePaymentSuccess] Fetching registrations for user:', userId);
      
      // Find the ACTIVE ServiceRegistration (activated by webhook)
      const { getMyRegistrations } = await import('../services/serviceRegistrationService');
      const registrationsRes = await getMyRegistrations();
      
      console.log('[handlePaymentSuccess] Registrations response:', registrationsRes);
      
      const activeRegistration = registrationsRes.data?.find(
        r => r.service.id === Number(serviceId) && r.status === 'ACTIVE'
      );
      
      console.log('[handlePaymentSuccess] Active registration found:', activeRegistration);
      
      if (!activeRegistration) {
        console.error('[handlePaymentSuccess] No ACTIVE registration found for serviceId:', serviceId);
        toast.error('Service registration not found. Please contact support.');
        return;
      }

      // Create booking with the activated registration
      const bookingReq = {
        trainerId: pendingBookingData.trainerId ?? undefined,
        serviceRegistrationId: activeRegistration.id,
        bookingDate: pendingBookingData.bookingDate,
        startTime: pendingBookingData.startTime,
        endTime: pendingBookingData.endTime,
      };
      
      console.log('[handlePaymentSuccess] Creating booking with request:', bookingReq);
      
      const bookingRes = await createBooking(userId, bookingReq);
      
      console.log('[handlePaymentSuccess] Booking response:', bookingRes);
      
      if (!bookingRes.success) {
        console.error('[handlePaymentSuccess] Booking creation failed:', bookingRes.message);
        toast.error(bookingRes.message || 'Failed to create booking');
        return;
      }

      console.log('[handlePaymentSuccess] Booking created successfully!');
      toast.success('Payment successful! Your booking is pending trainer confirmation.');
      reset();
      onDone?.();
      
    } catch (error: any) {
      console.error('[handlePaymentSuccess] Error:', error);
      toast.error(error?.response?.data?.message || 'Failed to complete booking');
    }
  };

  return {
    // State
    isRegistering,
    showBookingSetup,
    pendingBookingData,
    showPaymentMethodSelection,
    showMoMoPayment,
    showBankPayment,
    // Actions
    handleRegisterNow,
    handleBookingSetupComplete,
    handleSelectMoMo,
    handleSelectBankTransfer,
    handlePaymentSuccess,
    reset,
    // Setters for close handlers
    setShowBookingSetup,
    setShowPaymentMethodSelection,
    setShowMoMoPayment,
    setShowBankPayment,
  };
}