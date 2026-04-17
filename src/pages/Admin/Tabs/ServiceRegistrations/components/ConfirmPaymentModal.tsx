import React, { useState, useEffect } from 'react';
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
import { CheckCircle, Warning, CalendarMonth } from '@mui/icons-material';
import { confirmCounterPayment, getTrainerBookedSlots } from '../../../../../services/serviceRegistrationService';
import TrainerSchedulePicker, { type ScheduleSelection, toDateStr } from './TrainerSchedulePicker';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConfirmPaymentModalProps {
  open: boolean;
  onClose: () => void;
  registrationId: number;
  memberName: string;
  serviceName: string;
  amount: number;
  /** Trainer already assigned (from TrainerAssignmentModal) */
  trainerId?: number;
  trainerName?: string;
  /** Pre-selected schedule from TrainerAssignmentModal — skips the picker step */
  preselectedSchedule?: ScheduleSelection | null;
  onSuccess: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

// ─── Component ────────────────────────────────────────────────────────────────

const ConfirmPaymentModal: React.FC<ConfirmPaymentModalProps> = ({
  open,
  onClose,
  registrationId,
  memberName,
  serviceName,
  amount,
  trainerId,
  trainerName,
  preselectedSchedule,
  onSuccess,
}) => {
  const hasTrainer = !!trainerId;
  // If trainer exists but no pre-selected schedule, show picker first
  const needsPicker = hasTrainer && !preselectedSchedule;

  type Step = 'schedule' | 'confirm';
  const [step, setStep] = useState<Step>(needsPicker ? 'schedule' : 'confirm');
  const [schedule, setSchedule] = useState<ScheduleSelection | null>(preselectedSchedule ?? null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync when modal opens / preselectedSchedule changes
  useEffect(() => {
    if (open) {
      const hasPre = !!preselectedSchedule;
      setStep(hasTrainer && !hasPre ? 'schedule' : 'confirm');
      setSchedule(preselectedSchedule ?? null);
      setError('');
    }
  }, [open, preselectedSchedule, hasTrainer]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError('');

      const bookingDate = schedule ? toDateStr(schedule.date) : undefined;
      const startTime   = schedule?.slot.start;
      const endTime     = schedule?.slot.end;

      const response = await confirmCounterPayment(
        registrationId, amount, bookingDate, startTime, endTime,
      );

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.message || 'Xác nhận thất bại');
      }
    } catch (err: any) {
      setError(err.message || 'Xác nhận thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={step === 'schedule' ? 'md' : 'sm'}
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' } }}
    >
      {/* ── Title ── */}
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #00b4ff22, #0066ff22)',
        borderBottom: '1px solid #eaeef8', pb: 2,
      }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          {step === 'schedule'
            ? <CalendarMonth sx={{ color: '#0066ff', fontSize: 28 }} />
            : <Warning sx={{ color: '#ff9800', fontSize: 28 }} />}
          <Box>
            <Typography variant="h6" fontWeight={700} color="#0f172a">
              {step === 'schedule' ? 'Chọn lịch hẹn cho trainer' : 'Xác nhận thanh toán'}
            </Typography>
            {hasTrainer && needsPicker && (
              <Typography fontSize={12} color="#64748b" mt={0.2}>
                Bước {step === 'schedule' ? '1' : '2'} / 2
              </Typography>
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* ── Schedule picker (only when trainer exists but no pre-selected schedule) ── */}
        {step === 'schedule' && hasTrainer && trainerId && trainerName && (
          <>
            {/* Summary bar */}
            <Box sx={{
              background: '#f8faff', borderRadius: 2, border: '1px solid #eaeef8',
              p: 2, mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap',
            }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Khách hàng</Typography>
                <Typography fontWeight={600} color="#0f172a">{memberName}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Dịch vụ</Typography>
                <Typography fontWeight={600} color="#0f172a">{serviceName}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Trainer</Typography>
                <Typography fontWeight={600} color="#0066ff">{trainerName}</Typography>
              </Box>
            </Box>

            <TrainerSchedulePicker
              trainerId={trainerId}
              trainerName={trainerName}
              value={schedule}
              onChange={setSchedule}
            />
          </>
        )}

        {/* ── Confirm summary ── */}
        {step === 'confirm' && (
          <>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Bạn có chắc chắn khách hàng đã thanh toán dịch vụ với thông tin sau?
            </Typography>

            <Box sx={{ background: '#f8faff', borderRadius: 2, border: '1px solid #eaeef8', p: 2.5 }}>
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Khách hàng</Typography>
                <Typography variant="body1" fontWeight={600} color="#0f172a">{memberName}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Dịch vụ</Typography>
                <Typography variant="body1" fontWeight={600} color="#0f172a">{serviceName}</Typography>
              </Box>

              {hasTrainer && trainerName && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Trainer</Typography>
                    <Typography variant="body1" fontWeight={600} color="#0066ff">{trainerName}</Typography>
                  </Box>
                </>
              )}

              {schedule && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Lịch hẹn đầu tiên</Typography>
                    <Typography variant="body1" fontWeight={600} color="#0f172a">
                      {schedule.date.toLocaleDateString('vi-VN', {
                        weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric',
                      })}
                      {' · '}
                      {schedule.slot.label}
                    </Typography>
                  </Box>
                </>
              )}

              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Số tiền</Typography>
                <Typography variant="h6" fontWeight={700} color="#0066ff" sx={{ mt: 0.5 }}>
                  {formatCurrency(amount)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{
              mt: 2, p: 2, background: '#fff5f5',
              borderLeft: '4px solid #ff6b6b', borderRadius: 1,
            }}>
              <Typography variant="body2" color="#742a2a" fontWeight={500}>
                ⚠️ Sau khi xác nhận, trạng thái thanh toán sẽ được cập nhật thành "PAID" và không thể hoàn tác.
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>

      {/* ── Actions ── */}
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, borderTop: '1px solid #eaeef8', gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3,
            color: '#64748b', '&:hover': { background: '#f1f5f9' },
          }}
        >
          Hủy
        </Button>

        {/* Back (step 2 → step 1, only when picker was shown) */}
        {step === 'confirm' && needsPicker && (
          <Button
            onClick={() => setStep('schedule')}
            disabled={loading}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            Quay lại
          </Button>
        )}

        {step === 'schedule' ? (
          <Button
            onClick={() => setStep('confirm')}
            disabled={!schedule}
            variant="contained"
            sx={{
              borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3,
              background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
              '&:hover': { background: 'linear-gradient(135deg, #00c6ff, #0077ff)' },
            }}
          >
            Tiếp theo
          </Button>
        ) : (
          <Button
            onClick={handleConfirm}
            disabled={loading}
            variant="contained"
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CheckCircle />}
            sx={{
              borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3,
              background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
              boxShadow: '0 4px 12px rgba(0,102,255,0.24)',
              '&:hover': { background: 'linear-gradient(135deg, #00c6ff, #0077ff)' },
            }}
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmPaymentModal;
