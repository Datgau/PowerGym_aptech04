import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  AccessTime as PendingIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { paymentService, type PaymentOrder } from '../../services/paymentService';

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentOrder, setPaymentOrder] = useState<PaymentOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get parameters from URL
  const orderId = searchParams.get('orderId');
  const resultCode = searchParams.get('resultCode');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!orderId) {
        setError('Không tìm thấy thông tin đơn hàng');
        setLoading(false);
        return;
      }

      try {
        const response = await paymentService.getPaymentStatus(orderId);
        if (response.success && response.data) {
          setPaymentOrder(response.data);
        } else {
          setError(response.message || 'Không thể lấy thông tin thanh toán');
        }
      } catch (err: any) {
        setError(err.message || 'Có lỗi xảy ra khi kiểm tra trạng thái thanh toán');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [orderId]);

  const getStatusInfo = () => {
    if (!paymentOrder) return null;

    switch (paymentOrder.status) {
      case 'SUCCESS':
        return {
          icon: <SuccessIcon sx={{ fontSize: 64, color: 'success.main' }} />,
          title: 'Thanh toán thành công!',
          message: 'Giao dịch của bạn đã được xử lý thành công.',
          color: 'success.main'
        };
      case 'FAILED':
        return {
          icon: <ErrorIcon sx={{ fontSize: 64, color: 'error.main' }} />,
          title: 'Thanh toán thất bại',
          message: 'Giao dịch không thể hoàn tất. Vui lòng thử lại.',
          color: 'error.main'
        };
      case 'EXPIRED':
        return {
          icon: <ErrorIcon sx={{ fontSize: 64, color: 'warning.main' }} />,
          title: 'Thanh toán đã hết hạn',
          message: 'Giao dịch đã hết thời gian xử lý.',
          color: 'warning.main'
        };
      default:
        return {
          icon: <PendingIcon sx={{ fontSize: 64, color: 'info.main' }} />,
          title: 'Đang xử lý thanh toán',
          message: 'Giao dịch đang được xử lý. Vui lòng đợi trong giây lát.',
          color: 'info.main'
        };
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress size={48} />
          <Typography variant="h6">Đang kiểm tra trạng thái thanh toán...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Có lỗi xảy ra
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </Button>
        </Paper>
      </Container>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Box textAlign="center" mb={4}>
          {statusInfo?.icon}
          <Typography variant="h4" gutterBottom sx={{ color: statusInfo?.color, mt: 2 }}>
            {statusInfo?.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {statusInfo?.message}
          </Typography>
        </Box>

        {paymentOrder && (
          <>
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin giao dịch
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Mã đơn hàng:</Typography>
                  <Typography fontWeight={600}>{paymentOrder.id}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Số tiền:</Typography>
                  <Typography fontWeight={600} color="primary.main">
                    {formatAmount(paymentOrder.amount)}
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Nội dung:</Typography>
                  <Typography fontWeight={600}>{paymentOrder.content}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Thời gian tạo:</Typography>
                  <Typography>{formatDateTime(paymentOrder.createdAt)}</Typography>
                </Box>
                
                {paymentOrder.transactionRef && (
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="text.secondary">Mã giao dịch:</Typography>
                    <Typography fontWeight={600}>{paymentOrder.transactionRef}</Typography>
                  </Box>
                )}
                
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Phương thức:</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      component="img"
                      src="https://developers.momo.vn/v3/assets/images/square-logo.svg"
                      alt="MoMo"
                      sx={{ width: 20, height: 20 }}
                    />
                    <Typography>MoMo</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </>
        )}

        <Box display="flex" gap={2} justifyContent="center" mt={4}>
          <Button
            variant="outlined"
            onClick={() => navigate('/services')}
          >
            Tiếp tục mua sắm
          </Button>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentResult;