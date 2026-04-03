import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { CheckCircle, Warning } from '@mui/icons-material';
import { confirmCounterPayment } from '../../../../../services/serviceRegistrationService';

interface ConfirmPaymentModalProps {
  open: boolean;
  onClose: () => void;
  registrationId: number;
  memberName: string;
  serviceName: string;
  amount: number;
  onSuccess: () => void;
}

const ConfirmPaymentModal: React.FC<ConfirmPaymentModalProps> = ({
  open,
  onClose,
  registrationId,
  memberName,
  serviceName,
  amount,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await confirmCounterPayment(registrationId, amount);

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.message || 'Failed to confirm payment');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to confirm payment');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #00b4ff22, #0066ff22)',
          borderBottom: '1px solid #eaeef8',
          pb: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Warning sx={{ color: '#ff9800', fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700} color="#0f172a">
            Xác nhận thanh toán
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body1" color="text.secondary" mb={3}>
          Bạn có chắc chắn khách hàng đã thanh toán dịch vụ với thông tin sau?
        </Typography>

        <Box
          sx={{
            background: '#f8faff',
            borderRadius: 2,
            border: '1px solid #eaeef8',
            p: 2.5,
          }}
        >
          <Box mb={2}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Khách hàng
            </Typography>
            <Typography variant="body1" fontWeight={600} color="#0f172a">
              {memberName}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box mb={2}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Dịch vụ
            </Typography>
            <Typography variant="body1" fontWeight={600} color="#0f172a">
              {serviceName}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Số tiền
            </Typography>
            <Typography
              variant="h6"
              fontWeight={700}
              color="#0066ff"
              sx={{ mt: 0.5 }}
            >
              {formatCurrency(amount)}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 2,
            p: 2,
            background: '#fff5f5',
            borderLeft: '4px solid #ff6b6b',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" color="#742a2a" fontWeight={500}>
            ⚠️ Lưu ý: Sau khi xác nhận, trạng thái thanh toán sẽ được cập nhật thành "PAID" và không thể hoàn tác.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
          pt: 1,
          borderTop: '1px solid #eaeef8',
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            color: '#64748b',
            '&:hover': {
              background: '#f1f5f9',
            },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          startIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <CheckCircle />
            )
          }
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
            boxShadow: '0 4px 12px rgba(0,102,255,0.24)',
            '&:hover': {
              background: 'linear-gradient(135deg, #00c6ff, #0077ff)',
              boxShadow: '0 6px 16px rgba(0,102,255,0.32)',
            },
          }}
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmPaymentModal;
