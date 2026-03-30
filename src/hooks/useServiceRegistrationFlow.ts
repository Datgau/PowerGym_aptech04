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
    if (pendingBookingData) {
      try {
        const session = loadAuthSession();
        const userId = session?.user?.id;
        if (userId) {
          const { getMyRegistrations } = await import('../services/serviceRegistrationService');
          let registrationId: number | null = null;
          for (let attempt = 0; attempt < 3; attempt++) {
            if (attempt > 0) await new Promise(r => setTimeout(r, 1500));
            const existing = await getMyRegistrations();
            const found = existing.data?.find(
                r => r.service.id === Number(serviceId) && r.status === 'ACTIVE'
            );
            if (found) { registrationId = found.id; break; }
          }

          if (registrationId) {
            await createBooking(userId, {
              trainerId: pendingBookingData.trainerId ?? undefined,
              serviceRegistrationId: registrationId,
              bookingDate: pendingBookingData.bookingDate,
              startTime: pendingBookingData.startTime,
              endTime: pendingBookingData.endTime,
            });
          } else {
            console.warn('ServiceRegistration not found after payment — booking skipped');
          }
        }
      } catch (e) {
        console.error('Could not create booking after payment:', e);
      }
    }
    toast.success('Payment successful! Your trainer booking is being processed.');
    reset();
    onDone?.();
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