import React from 'react';
import {
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { QrCode2, PhoneAndroid } from '@mui/icons-material';

interface PaymentFormStepProps {
  formData: {
    amount: number;
    orderInfo: string;
    extraData: string;
    lang: string;
  };
  loading: boolean;
  error: string;
  itemType?: string;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onClearError: () => void;
}

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    fontFamily: '"Sora", "DM Sans", sans-serif',
    fontSize: '0.9rem',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
    '&:hover fieldset': {
      borderColor: '#00b4ff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#045668',
      borderWidth: '2px',
    },
    '&.Mui-disabled': {
      backgroundColor: '#f0f4f8',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Sora", "DM Sans", sans-serif',
    fontSize: '0.88rem',
    '&.Mui-focused': {
      color: '#045668',
    },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: '"Sora", "DM Sans", sans-serif',
    fontSize: '0.72rem',
  },
};

const PaymentFormStep: React.FC<PaymentFormStepProps> = ({
                                                           formData,
                                                           loading,
                                                           error,
                                                           itemType,
                                                           onFormChange,
                                                           onSubmit,
                                                           onClose,
                                                           onClearError
                                                         }) => {
  return (
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
          {error && (
              <Alert
                  severity="error"
                  onClose={onClearError}
                  sx={{
                    mb: 2.5,
                    borderRadius: '12px',
                    fontFamily: '"Sora", sans-serif',
                    fontSize: '0.82rem',
                    '& .MuiAlert-icon': { alignItems: 'center' }
                  }}
              >
                {error}
              </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
                label="Amount (VNĐ)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={onFormChange}
                required
                fullWidth
                disabled={loading || !!itemType}
                slotProps={{
                  htmlInput: {
                    min: 1000,
                    max: 50000000,
                    step: 1000
                  }
                }}
                helperText="Minimum: 1,000 VND — Maximum: 50,000,000 VND"
                sx={fieldSx}
            />

            <TextField
                label="Order Information"
                name="orderInfo"
                value={formData.orderInfo}
                onChange={onFormChange}
                required
                fullWidth
                disabled={loading || !!itemType}
                multiline
                rows={2}
                placeholder="e.g. Gym service payment..."
                slotProps={{ htmlInput: { maxLength: 255 } }}
                sx={fieldSx}
            />

            <TextField
                label="Additional Information (Optional)"
                name="extraData"
                value={formData.extraData}
                onChange={onFormChange}
                fullWidth
                disabled={loading}
                multiline
                rows={2}
                placeholder="Additional details about the order..."
                slotProps={{ htmlInput: { maxLength: 500 } }}
                sx={fieldSx}
            />

            <Divider sx={{ borderColor: '#e8edf2' }} />

            {/* Payment method row */}
            <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  border: '1.5px solid #ebebf0',
                  backgroundColor: '#f8fafc',
                }}
            >
              <Box>
                <Typography sx={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#9aa5b4',
                  mb: 0.5
                }}>
                  Payment Method
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                      component="img"
                      src="/images/Logo-MoMo.png"
                      alt="MoMo"
                      sx={{ width: 22, height: 22, objectFit: 'contain' }}
                  />
                  <Typography sx={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#1a1a2e'
                  }}>
                    MoMo E-Wallet
                  </Typography>
                </Box>
              </Box>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.6,
                borderRadius: '8px',
                backgroundColor: '#e8f5e8',
              }}>
                <PhoneAndroid sx={{ fontSize: 14, color: '#2e7d32' }} />
                <Typography sx={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: '#2e7d32',
                  letterSpacing: '0.05em'
                }}>
                  Instant
                </Typography>
              </Box>
            </Box>

            <Alert
                severity="info"
                icon={<QrCode2 fontSize="small" />}
                sx={{
                  borderRadius: '12px',
                  fontFamily: '"Sora", sans-serif',
                  fontSize: '0.8rem',
                  backgroundColor: '#e8f4fd',
                  color: '#0c5a8a',
                  border: '1px solid #b3d9f5',
                  '& .MuiAlert-icon': {
                    color: '#1366ba',
                    alignItems: 'center'
                  }
                }}
            >
              Scan the QR code using the MoMo app to complete your payment.
            </Alert>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5, borderTop: '1px solid #e8edf2' }}>
          <Button
              onClick={onClose}
              disabled={loading}
              sx={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 600,
                fontSize: '0.82rem',
                color: '#8892a0',
                textTransform: 'none',
                px: 2.5,
                py: 1,
                borderRadius: '10px',
                border: '1.5px solid #dde3ea',
                '&:hover': {
                  backgroundColor: '#e8edf2',
                  borderColor: '#c5cdd8',
                  color: '#4a5568'
                },
                transition: 'all 0.2s ease'
              }}
          >
            Cancel
          </Button>

          <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} sx={{ color: 'rgba(255,255,255,0.7)' }} /> : <QrCode2 />}
              sx={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 700,
                fontSize: '0.88rem',
                textTransform: 'none',
                letterSpacing: '0.02em',
                background: loading ? '#9aa5b4' : BRAND_GRADIENT,
                minWidth: 160,
                px: 3,
                py: 1.1,
                borderRadius: '10px',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(4,86,104,0.30)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  background: BRAND_GRADIENT,
                  boxShadow: '0 10px 28px rgba(4,86,104,0.40)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&.Mui-disabled': {
                  background: '#d0d7de',
                  color: 'rgba(255,255,255,0.6)',
                  boxShadow: 'none',
                }
              }}
          >
            {loading ? 'Processing...' : 'Generate QR Code'}
          </Button>
        </DialogActions>
      </form>
  );
};

export default PaymentFormStep;