import React from 'react';
import {
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper
} from '@mui/material';
import { 
  CheckCircle as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { type PaymentOrder } from '../../../services/paymentService';

interface PaymentResultStepProps {
  paymentStatus: PaymentOrder | null;
  onRetry: () => void;
  onClose: () => void;
  formatAmount: (amount: number) => string;
}

const PaymentResultStep: React.FC<PaymentResultStepProps> = ({
  paymentStatus,
  onRetry,
  onClose,
  formatAmount
}) => {
  const isSuccess = paymentStatus?.status === 'SUCCESS';
  const isFailed = paymentStatus?.status === 'FAILED';
  const isExpired = paymentStatus?.status === 'EXPIRED';

  return (
    <>
      <DialogContent dividers>
        <Box sx={{ textAlign: 'center', py: 3 }}>
          {isSuccess && (
            <>
              <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" color="success.main" gutterBottom>
                Thanh toán thành công!
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Giao dịch của bạn đã được xử lý thành công.
              </Typography>
            </>
          )}

          {isFailed && (
            <>
              <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" color="error.main" gutterBottom>
                Thanh toán thất bại
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Giao dịch không thể hoàn tất. Vui lòng thử lại.
              </Typography>
            </>
          )}

          {isExpired && (
            <>
              <ErrorIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
              <Typography variant="h5" color="warning.main" gutterBottom>
                Thanh toán đã hết hạn
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Giao dịch đã hết thời gian xử lý.
              </Typography>
            </>
          )}

          {paymentStatus && (
            <Paper sx={{ p: 2, textAlign: 'left', mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Thông tin giao dịch:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Mã đơn hàng:</Typography>
                  <Typography variant="body2" fontWeight={600}>{paymentStatus.id}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Số tiền:</Typography>
                  <Typography variant="body2" fontWeight={600} color="primary">
                    {formatAmount(paymentStatus.amount)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Nội dung:</Typography>
                  <Typography variant="body2">{paymentStatus.content}</Typography>
                </Box>
                {paymentStatus.transactionRef && (
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Mã giao dịch:</Typography>
                    <Typography variant="body2" fontWeight={600}>{paymentStatus.transactionRef}</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        {(isFailed || isExpired) && (
          <Button 
            onClick={onRetry} 
            color="primary"
            variant="outlined"
          >
            Thử lại
          </Button>
        )}
        <Button 
          onClick={onClose} 
          variant="contained"
          color="primary"
        >
          Đóng
        </Button>
      </DialogActions>
    </>
  );
};

export default PaymentResultStep;