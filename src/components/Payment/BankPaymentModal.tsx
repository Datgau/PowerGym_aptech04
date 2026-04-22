import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  Typography,
  IconButton,
  Card,
  CardContent,
  Stack,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Close,
  AccountBalance,
  ContentCopy,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import paymentService, {type CreateBankPaymentResponse} from "../../services/paymentService.ts";
import { createOrderFromPayment } from '../../services/productOrderService';
import {toast} from "react-toastify";

interface BankPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  serviceName?: string;
  amount?: number;
  serviceId?: string;
  itemType?: 'SERVICE' | 'MEMBERSHIP' | 'PRODUCT';
  promotionCode?: string;
  itemName?: string;
  /** Link payment to a specific ServiceRegistration to avoid ambiguity */
  registrationId?: number | null;
  /** Target user ID for admin operations (if not provided, uses current user) */
  targetUserId?: number;
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

const BankPaymentModal: React.FC<BankPaymentModalProps> = ({
  open,
  onClose,
  onSuccess,
  serviceName,
  serviceId,
  itemType = 'SERVICE',
  promotionCode,
  amount,
  itemName,
  registrationId,
  targetUserId,
  deliveryInfo,
  cartItems
}) => {
  const { user } = useAuth();
  const [paymentInfo, setPaymentInfo] = useState<CreateBankPaymentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatAmount = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(val);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    if (open && user?.id) {
      // For SERVICE type, wait until registrationId is available before initializing payment
      if (itemType === 'SERVICE' && !registrationId) {
        return;
      }
      const initPayment = async () => {
        try {
          setLoading(true);
          setError(null);
          setPaymentSuccess(false);
          
          const request: any = {
            userId: targetUserId || user.id, // Use targetUserId for admin operations, fallback to current user
            itemType: itemType
          };
          
          if (itemType === 'MEMBERSHIP') {
            request.packageId = Number(serviceId);
            // Send pre-calculated amount (with discount) as override
            if (amount && amount > 0) request.amount = amount;
          } else if (itemType === 'PRODUCT') {
            // For PRODUCT, send amount and itemName
            if (!amount || amount <= 0) {
              throw new Error('Amount is required for product orders');
            }
            request.amount = amount;
            request.itemName = itemName || serviceName || 'Product Order';
            request.serviceId = serviceId ? Number(serviceId) : 0;
          } else {
            request.serviceId = Number(serviceId);
            // Send pre-calculated amount (with discount) as override
            if (amount && amount > 0) request.amount = amount;
          }
          
          // Add promotion code if available
          if (promotionCode) {
            request.promotionCode = promotionCode;
          }

          // Link to specific registration to avoid ambiguity
          if (registrationId) {
            request.registrationId = registrationId;
          }
          
          console.log('[BankPaymentModal] Creating payment with request:', request);
          
          const response = await paymentService.createBankPayment(request);

          if (response.success && response.data) {
            setPaymentInfo(response.data);
          } else {
            setError(response.message || 'Failed to initialize payment.');
          }
        } catch (err: any) {
          setError(err.response?.data?.message || err.message || 'Failed to create bank payment request.');
          console.error('Error creating bank payment', err);
        } finally {
          setLoading(false);
        }
      };

      initPayment();
    } else if (!open) {
      setPaymentInfo(null);
      setError(null);
      setPaymentSuccess(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [open, serviceId, user, itemType, promotionCode, amount, itemName, serviceName, registrationId, targetUserId]);

  useEffect(() => {
    // Polling mechanism
    if (open && paymentInfo?.content && !paymentSuccess) {
      intervalRef.current = setInterval(async () => {
        try {
          const statusRes = await paymentService.getBankPaymentStatus(paymentInfo.content);
          if (statusRes.success && statusRes.data) {
            if (statusRes.data.status === 'SUCCESS') {
               // If itemType is PRODUCT, create order from payment
               if (itemType === 'PRODUCT' && deliveryInfo && cartItems && cartItems.length > 0) {
                 try {
                   await createOrderFromPayment({
                     paymentId: paymentInfo.orderId, // Use orderId, not content
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
                   // Stop polling
                   if (intervalRef.current) clearInterval(intervalRef.current);
                   setPaymentSuccess(false);
                   setError('Payment succeeded but order creation failed. Please contact support.');
                   return;
                 }
               }
               
               // Stop polling
               if (intervalRef.current) clearInterval(intervalRef.current);
               setPaymentSuccess(true);
               
               // Delay then fire onSuccess mapping
               setTimeout(() => {
                 onSuccess?.();
                 onClose();
               }, 2000);
            } else if (statusRes.data.status === 'FAILED' || statusRes.data.status === 'EXPIRED') {
               setError('Payment transaction expired or failed.');
               if (intervalRef.current) clearInterval(intervalRef.current);
            }
          }
        } catch (e) {
            toast.error('Error checking payment status', e);
        }
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [open, paymentInfo?.content, onSuccess, onClose, paymentSuccess, itemType, deliveryInfo, cartItems]);

  const handleClose = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPaymentInfo(null);
    setError(null);
    onClose();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 5 }}>
          <CircularProgress size={50} sx={{ mb: 2, color: '#1366ba' }} />
          <Typography variant="body1" color="text.secondary">
            Initializing secure payment gateway...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ m: 3 }}>
          <Typography fontWeight="bold">Payment Error</Typography>
          {error}
        </Alert>
      );
    }

    if (paymentSuccess) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 5 }}>
          <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" color="#2e7d32" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your payment was detected and verified automatically.
          </Typography>
        </Box>
      );
    }

    if (paymentInfo) {
      return (
        <Box sx={{ px: { xs: 1, md: 3 } }}>
          {/* Service Info Header */}
          {serviceName && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Service Registration
              </Typography>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {serviceName}
              </Typography>
            </Box>
          )}

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Scan the QR code with your Banking application. The exact amount and transfer note will be filled in automatically.
            </Typography>
          </Alert>

          {/* QR Code & Information Card */}
          <Card sx={{ mb: 3, border: '2px solid #1366ba', overflow: 'visible' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center' }}>
                
                {/* QR Code Section */}
                <Box sx={{ textAlign: 'center', flexShrink: 0 }}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 3, backgroundColor: '#fff', border: '1px solid #eaeaea' }}>
                    <img 
                      src={paymentInfo.qrUrl} 
                      alt="VietQR Code" 
                      style={{ width: '100%', maxWidth: '220px', display: 'block' }} 
                    />
                  </Paper>
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: '#1366ba' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Waiting for payment...
                    </Typography>
                  </Box>
                </Box>

                {/* Manual Transfer Details */}
                <Stack spacing={2} sx={{ flexGrow: 1, width: '100%' }}>
                  <Box sx={{ borderBottom: '1px solid #eaeaea', pb: 1, mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700} color="#1366ba">
                      Manual Transfer Info
                    </Typography>
                  </Box>

                  {/* Transfer Amount */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Amount
                    </Typography>
                    <Paper elevation={0} sx={{ p: 1.5, backgroundColor: '#fff3e0', border: '1px solid #ffb74d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2 }}>
                      <Typography variant="h6" fontWeight={800} color="#e65100">
                        {formatAmount(paymentInfo.amount)}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(paymentInfo.amount.toString(), 'amount')}
                        sx={{ color: copiedField === 'amount' ? '#4caf50' : '#f57c00' }}
                      >
                        {copiedField === 'amount' ? <CheckCircle /> : <ContentCopy />}
                      </IconButton>
                    </Paper>
                  </Box>

                  {/* Transfer Note */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Transfer Note (Required)
                    </Typography>
                    <Paper elevation={0} sx={{ p: 1.5, backgroundColor: '#e8f5e8', border: '1px solid #81c784', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2 }}>
                      <Typography variant="body1" fontWeight={700} color="#2e7d32">
                        {paymentInfo.content}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(paymentInfo.content, 'transferNote')}
                        sx={{ color: copiedField === 'transferNote' ? '#4caf50' : '#2e7d32' }}
                      >
                        {copiedField === 'transferNote' ? <CheckCircle /> : <ContentCopy />}
                      </IconButton>
                    </Paper>
                  </Box>

                  {/* Additional Warning */}
                  <Alert severity="warning" sx={{ mt: 1, px: 2, py: 0.5 }}>
                    <Typography variant="caption" fontWeight={600}>
                      Do NOT change the Transfer Note. We use it to verify your payment!
                    </Typography>
                  </Alert>

                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return null;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #045668 0%, #1366ba 100%)',
          color: 'white',
          position: 'relative',
          py: 3,
          px: { xs: 2, md: 4 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccountBalance sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Bank Transfer Checkout
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Secure and automatic confirmation via VietQR
            </Typography>
          </Box>
        </Box>
        
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)'
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, pt: 3, maxHeight: '80vh' }}>
        {renderContent()}
      </DialogContent>
      
      {/* Footer Close Button */}
      {(!loading && !paymentSuccess) && (
        <Box sx={{ p: 2, px: 4, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f0f0f0' }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ px: 4, py: 1, borderRadius: 2 }}
            color="inherit"
          >
            Cancel Payment
          </Button>
        </Box>
      )}
    </Dialog>
  );
};

export default BankPaymentModal;