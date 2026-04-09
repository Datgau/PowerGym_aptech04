import React, { useState, useEffect } from 'react';
import {
  Dialog
} from '@mui/material';
import { paymentService, type CreatePaymentRequest, type MoMoPaymentResponse, type PaymentOrder } from '../../services/paymentService';
import { createOrderFromPayment } from '../../services/productOrderService';
import PaymentSuccessWithTrainerModal from './PaymentSuccessWithTrainerModal';

import PaymentFormStep from './steps/PaymentFormStep';
import QRCodeStep from './steps/QRCodeStep';
import PaymentResultStep from './steps/PaymentResultStep';
import PaymentStepper from './components/PaymentStepper';
import PaymentHeader from './components/PaymentHeader';
import {toast} from "react-toastify";

interface MoMoPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (response: MoMoPaymentResponse) => void;
  defaultAmount?: number;
  defaultOrderInfo?: string;
  itemType?: string;
  itemId?: string;
  itemName?: string;
  deliveryInfo?: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    notes?: string;
  };
  cartItems?: Array<{
    productId: number;
    quantity: number;
  }>;
}

const MoMoPaymentModal: React.FC<MoMoPaymentModalProps> = ({
  open,
  onClose,
  onSuccess,
  defaultAmount = 0,
  defaultOrderInfo = '',
  itemType,
  itemId,
  itemName,
  deliveryInfo,
  cartItems
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentResponse, setPaymentResponse] = useState<MoMoPaymentResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentOrder | null>(null);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);
  const [showTrainerSelection, setShowTrainerSelection] = useState(false);
  const [paymentWithTrainerData, setPaymentWithTrainerData] = useState<any>(null);

  const generateOrderInfo = () => {
    if (itemType === 'SERVICE') {
      return `PowerGym Payment - Service: ${itemName}`;
    } else if (itemType === 'MEMBERSHIP') {
      return `PowerGym Payment - Membership Package: ${itemName}`;
    }
    return defaultOrderInfo || 'PowerGym Payment';
  };

  const [formData, setFormData] = useState({
    amount: defaultAmount,
    orderInfo: generateOrderInfo(),
    extraData: '',
    lang: 'vi'
  });
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      amount: defaultAmount,
      orderInfo: generateOrderInfo()
    }));
  }, [defaultAmount, itemName, itemType]);
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const steps = ['Payment Information', 'Scan QR Code', 'Result'];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.amount < 1000) {
        throw new Error('Minimum amount is 1,000 VND');
      }
      if (formData.amount > 50000000) {
        throw new Error('Maximum amount is 50,000,000 VND');
      }
      if (!formData.orderInfo.trim()) {
        throw new Error('Please enter order information');
      }

      const request: CreatePaymentRequest = {
        amount: formData.amount,
        orderInfo: formData.orderInfo.trim(),
        extraData: formData.extraData || undefined,
        lang: formData.lang,
        itemType,
        itemId,
        itemName
      };

      const response = await paymentService.createMoMoPayment(request);

      if (response.success && response.data) {
        setPaymentResponse(response.data);
        setCurrentStep(1);
        startPaymentPolling(response.data.orderId);
      } else {
        throw new Error(response.message || 'Failed to create payment');
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Please log in to proceed with payment');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to perform this payment');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred while creating the payment');
      }
    } finally {
      setLoading(false);
    }
  };

  const startPaymentPolling = (orderId: string) => {
    const interval = setInterval(async () => {
      try {
        const statusResponse = await paymentService.getPaymentStatus(orderId);
        if (statusResponse.success && statusResponse.data) {
          const status = statusResponse.data.status;
          setPaymentStatus(statusResponse.data);
          
          if (status === 'SUCCESS') {
            // If itemType is PRODUCT, create order from payment
            if (itemType === 'PRODUCT' && deliveryInfo && cartItems && cartItems.length > 0) {
              try {
                await createOrderFromPayment({
                  paymentId: orderId,
                  customerName: deliveryInfo.customerName,
                  customerPhone: deliveryInfo.customerPhone,
                  customerAddress: deliveryInfo.customerAddress,
                  notes: deliveryInfo.notes,
                  cartItems
                });
                
                toast.success('Order created successfully!');
              } catch (orderError: any) {
                console.error('Failed to create order:', orderError);
                toast.error(orderError.response?.data?.message || 'Failed to create order. Please contact support.');
                // Don't clear interval yet, let user see the error
                clearInterval(interval);
                setCurrentStep(2);
                return;
              }
            }
            
            try {
              const trainerSelectionResponse = await paymentService.getPaymentStatusWithTrainerSelection(orderId);
              if (trainerSelectionResponse.success && trainerSelectionResponse.data) {
                setPaymentWithTrainerData(trainerSelectionResponse.data);
                if (trainerSelectionResponse.data.needsTrainerSelection) {
                  setShowTrainerSelection(true);
                } else {
                  setCurrentStep(2);
                }
              } else {
                setCurrentStep(2);
              }
            } catch (error) {
              toast.warn('Could not get trainer selection data, showing regular success:', error);
              setCurrentStep(2);
            }
            
            clearInterval(interval);
            if (onSuccess && paymentResponse) {
              onSuccess(paymentResponse);
            }
          } else if (status === 'FAILED' || status === 'EXPIRED') {
            setCurrentStep(2);
            clearInterval(interval);
          }
        } else {
          toast.warn('Payment status check failed:', statusResponse.message);
        }
      } catch (error: any) {
        toast.error('Error polling payment status:', error);
        if (error.response?.status === 403 || error.response?.status === 401) {
          clearInterval(interval);
          setCurrentStep(2);
          setPaymentStatus({
            id: orderId,
            amount: formData.amount,
            content: formData.orderInfo,
            status: 'FAILED',
            createdAt: new Date().toISOString(),
            expiredAt: new Date().toISOString(),
            retryCount: 0
          });
        }
      }
    }, 3000);

    setPollingInterval(interval);
    setTimeout(() => {
      clearInterval(interval);
      if (currentStep === 1) {
        setCurrentStep(2);
        setPaymentStatus(prev => prev ? { ...prev, status: 'EXPIRED' } : {
          id: orderId,
          amount: formData.amount,
          content: formData.orderInfo,
          status: 'EXPIRED',
          createdAt: new Date().toISOString(),
          expiredAt: new Date().toISOString(),
          retryCount: 0
        });
      }
    }, 600000);
  };

  const handleClose = () => {
    if (loading) return;
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setCurrentStep(0);
    setFormData({
      amount: defaultAmount,
      orderInfo: generateOrderInfo(),
      extraData: '',
      lang: 'vi'
    });
    setError('');
    setPaymentResponse(null);
    setPaymentStatus(null);
    setShowTrainerSelection(false);
    setPaymentWithTrainerData(null);
    onClose();
  };

  const handleTrainerSelectionComplete = () => {
    setShowTrainerSelection(false);
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PaymentFormStep
            formData={formData}
            loading={loading}
            error={error}
            itemType={itemType}
            onFormChange={handleChange}
            onSubmit={handleSubmit}
            onClose={handleClose}
            onClearError={() => setError('')}
          />
        );
      case 1:
        return (
          <QRCodeStep
            paymentResponse={paymentResponse}
            amount={formData.amount}
            onBack={handleBack}
            onClose={handleClose}
            formatAmount={formatAmount}
          />
        );
      case 2:
        return (
          <PaymentResultStep
            paymentStatus={paymentStatus}
            onRetry={() => setCurrentStep(0)}
            onClose={handleClose}
            formatAmount={formatAmount}
          />
        );
      default:
        return (
          <PaymentFormStep
            formData={formData}
            loading={loading}
            error={error}
            itemType={itemType}
            onFormChange={handleChange}
            onSubmit={handleSubmit}
            onClose={handleClose}
            onClearError={() => setError('')}
          />
        );
    }
  };

  return (
    <>
      <Dialog 
        open={open && !showTrainerSelection} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3
          }
        }}
      >
        <PaymentHeader onClose={handleClose} loading={loading} />

        <PaymentStepper activeStep={currentStep} steps={steps} />

        {renderStepContent()}
      </Dialog>

      {/* Trainer Selection Modal */}
      {showTrainerSelection && paymentWithTrainerData && (
        <PaymentSuccessWithTrainerModal
          isOpen={showTrainerSelection}
          onClose={handleClose}
          paymentData={paymentWithTrainerData}
          onAllTrainersSelected={handleTrainerSelectionComplete}
        />
      )}
    </>
  );
};

export default MoMoPaymentModal;