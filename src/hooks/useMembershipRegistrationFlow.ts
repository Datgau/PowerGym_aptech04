import { useState } from 'react';

export const useMembershipRegistrationFlow = (packageId?: string) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPaymentMethodSelection, setShowPaymentMethodSelection] = useState(false);
  const [showMoMoPayment, setShowMoMoPayment] = useState(false);
  const [showBankPayment, setShowBankPayment] = useState(false);

  const handleRegisterNow = () => {
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

  const handlePaymentSuccess = async (onSuccess?: () => void) => {
    setShowMoMoPayment(false);
    setShowBankPayment(false);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return {
    isRegistering,
    showPaymentMethodSelection,
    showMoMoPayment,
    showBankPayment,
    setShowPaymentMethodSelection,
    setShowMoMoPayment,
    setShowBankPayment,
    handleRegisterNow,
    handleSelectMoMo,
    handleSelectBankTransfer,
    handlePaymentSuccess,
  };
};
