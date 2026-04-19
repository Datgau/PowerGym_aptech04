import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { loadAuthSession } from '../services/authStorage';
import { createBooking } from '../services/newBookingService';
import { registerService } from '../services/serviceRegistrationService';
import { RegistrationType } from '../types';
import type { ApplyPromotionResponse } from '../@type/reward';

export interface BookingSetupData {
  trainerId: number | null;
  trainerName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  endDate: string;
  bookingId?: number; // Store booking ID after creation
  promotionData?: ApplyPromotionResponse | null;
}

export interface ServiceRegistrationFlowState {
  isRegistering: boolean;
  showBookingSetup: boolean;
  pendingBookingData: BookingSetupData | null;
  showPaymentMethodSelection: boolean;
  showMoMoPayment: boolean;
  showBankPayment: boolean;
  isCounterRegistering: boolean;
}

export function useServiceRegistrationFlow(serviceId?: number | string) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showBookingSetup, setShowBookingSetup] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<BookingSetupData | null>(null);
  const [showPaymentMethodSelection, setShowPaymentMethodSelection] = useState(false);
  const [showMoMoPayment, setShowMoMoPayment] = useState(false);
  const [showBankPayment, setShowBankPayment] = useState(false);
  const [isCounterRegistering, setIsCounterRegistering] = useState(false);
  const [pendingRegistrationId, setPendingRegistrationId] = useState<number | null>(null);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState<number | string | undefined>(serviceId);

  const reset = useCallback(() => {
    setIsRegistering(false);
    setShowBookingSetup(false);
    setPendingBookingData(null);
    setShowPaymentMethodSelection(false);
    setShowMoMoPayment(false);
    setShowBankPayment(false);
    setIsCounterRegistering(false);
    setPendingRegistrationId(null);
    setShowPromoModal(false);
  }, []);

  const handleRegisterNow = useCallback(async (serviceIdToRegister?: number | string) => {
    const targetServiceId = serviceIdToRegister || currentServiceId;
    if (!targetServiceId) return;
    
    // Update current service ID
    setCurrentServiceId(targetServiceId);
    
    try {
      setIsRegistering(true);
      const { getMyRegistrations } = await import('../services/serviceRegistrationService');
      const existing = await getMyRegistrations();
      
      // Only block if there's an ACTIVE registration (payment completed)
      // Allow re-registration if previous attempt was PENDING (payment not completed)
      const alreadyRegistered = existing.data?.some(
          r => r.service.id === Number(targetServiceId) && r.status === 'ACTIVE'
      );
      
      if (alreadyRegistered) {
        toast.error('You have already registered for this service!');
        setIsRegistering(false);
        return;
      }
    } catch {
    } finally {
      setIsRegistering(false);
    }
    setShowBookingSetup(true);
  }, [currentServiceId]);

  const handleBookingSetupComplete = useCallback((bookingData: BookingSetupData) => {
    // Just store booking data and show payment modal
    // Booking will be created AFTER payment succeeds
    setPendingBookingData(bookingData);
    setShowBookingSetup(false);
    setShowPaymentMethodSelection(true);
  }, []);

  const handleSelectMoMo = useCallback(() => {
    setShowPaymentMethodSelection(false);
    setShowMoMoPayment(true);
  }, []);

  const handleSelectBankTransfer = useCallback(async () => {
    const targetServiceId = currentServiceId;
    if (!targetServiceId) return;
    setShowPaymentMethodSelection(false);

    // Create a PENDING ONLINE registration first so the webhook can activate it after payment
    try {
      const trainerId = pendingBookingData?.trainerId ?? undefined;
      const res = await registerService({
        serviceId: Number(targetServiceId),
        registrationType: RegistrationType.ONLINE,
        ...(trainerId ? { trainerId } : {}),
      });
      if (res.success && res.data?.id) {
        setPendingRegistrationId(res.data.id);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || '';
      if (msg.toLowerCase().includes('already registered')) {
        toast.error('You have already registered for this service');
        setShowPaymentMethodSelection(true);
        return;
      }
      // Non-fatal — BankPaymentModal will fall back to userId+serviceId lookup
    }

    // Open bank payment directly (promo code already entered in step 3)
    setShowBankPayment(true);
  }, [currentServiceId, pendingBookingData]);

  const handleSelectCounter = useCallback(async (serviceName?: string) => {
    const targetServiceId = currentServiceId;
    if (!targetServiceId) return;
    setShowPaymentMethodSelection(false);
    setIsCounterRegistering(true);
    try {
      const trainerId = pendingBookingData?.trainerId ?? undefined;
      const res = await registerService({
        serviceId: Number(targetServiceId),
        registrationType: RegistrationType.COUNTER,
        ...(trainerId ? { trainerId } : {}),
      });

      if (!res.success) {
        toast.error(res.message || 'Registration failed');
        setShowPaymentMethodSelection(true);
        return;
      }

      const registrationId: number = res.data?.id;

      // If trainer + schedule were selected, create the booking now (PENDING until admin confirms payment).
      const hasSchedule = !!(
        registrationId &&
        pendingBookingData?.trainerId &&
        pendingBookingData?.bookingDate &&
        pendingBookingData?.startTime &&
        pendingBookingData?.endTime
      );

      if (hasSchedule) {
        try {
          const session = loadAuthSession();
          const userId = session?.user?.id;
          if (userId) {
            await createBooking(userId, {
              trainerId: pendingBookingData!.trainerId!,
              serviceRegistrationId: registrationId,
              bookingDate: pendingBookingData!.bookingDate,
              startTime: pendingBookingData!.startTime,
              endTime: pendingBookingData!.endTime,
            });
          }
        } catch (bookingErr: any) {
          // Non-fatal — registration succeeded, admin can assign schedule when confirming payment.
          console.warn('[handleSelectCounter] Booking creation failed (non-fatal):', bookingErr);
        }
      }

      toast.success(
        `Registration successful! Please visit the counter to complete payment for "${serviceName ?? 'this service'}".`
      );
      reset();
    } catch (err: any) {
      const msg: string = err?.response?.data?.message ?? err?.message ?? '';
      if (msg.toLowerCase().includes('already registered')) {
        toast.error('You have already registered for this service');
      } else {
        toast.error(msg || 'Registration failed');
      }
      setShowPaymentMethodSelection(true);
    } finally {
      setIsCounterRegistering(false);
    }
  }, [currentServiceId, pendingBookingData, reset]);

  const handlePaymentSuccess = useCallback(async (onDone?: () => void) => {
    // Payment successful — webhook has already activated ServiceRegistration.
    // Now create a TrainerBooking only if the user selected a trainer + schedule.
    const targetServiceId = currentServiceId;
    if (!pendingBookingData || !targetServiceId) {
      toast.error('Booking data not found');
      return;
    }

    const hasSchedule = !!(
      pendingBookingData.trainerId &&
      pendingBookingData.bookingDate &&
      pendingBookingData.startTime &&
      pendingBookingData.endTime
    );

    if (!hasSchedule) {
      // User skipped trainer selection — no booking to create.
      // Admin will assign trainer/schedule later.
      toast.success('Payment successful! Our staff will assign a trainer and schedule for you.');
      reset();
      onDone?.();
      return;
    }

    try {
      const session = loadAuthSession();
      const userId = session?.user?.id;
      if (!userId) {
        toast.error('User session not found');
        return;
      }

      // Find the ACTIVE ServiceRegistration (activated by webhook)
      const { getMyRegistrations } = await import('../services/serviceRegistrationService');
      const registrationsRes = await getMyRegistrations();
      const activeRegistration = pendingRegistrationId
        ? registrationsRes.data?.find(r => r.id === pendingRegistrationId && r.status === 'ACTIVE')
        : registrationsRes.data?.find(r => r.service.id === Number(targetServiceId) && r.status === 'ACTIVE');

      if (!activeRegistration) {
        toast.error('Service registration not found. Please contact support.');
        return;
      }

      const bookingRes = await createBooking(userId, {
        trainerId: pendingBookingData.trainerId!,
        serviceRegistrationId: activeRegistration.id,
        bookingDate: pendingBookingData.bookingDate,
        startTime: pendingBookingData.startTime,
        endTime: pendingBookingData.endTime,
      });

      if (!bookingRes.success) {
        toast.error(bookingRes.message || 'Failed to create booking');
        return;
      }

      toast.success('Payment successful! Your booking is pending trainer confirmation.');
      reset();
      onDone?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to complete booking');
    }
  }, [pendingBookingData, currentServiceId, pendingRegistrationId, reset]);

  return {
    // State
    isRegistering,
    showBookingSetup,
    pendingBookingData,
    showPaymentMethodSelection,
    showMoMoPayment,
    showBankPayment,
    isCounterRegistering,
    pendingRegistrationId,
    showPromoModal,
    // Actions
    handleRegisterNow,
    handleBookingSetupComplete,
    handleSelectMoMo,
    handleSelectBankTransfer,
    handleSelectCounter,
    handlePaymentSuccess,
    reset,
    // Setters for close handlers
    setShowBookingSetup,
    setShowPaymentMethodSelection,
    setShowMoMoPayment,
    setShowBankPayment,
    setShowPromoModal,
  };
}