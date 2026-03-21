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
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={onClearError}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
            helperText="Minimum: 1,000 VND - Maximum: 50,000,000 VND"
          />

          <TextField
              label="Order Information"
              name="orderInfo"
              value={formData.orderInfo}
              onChange={onFormChange}
              required
              fullWidth
              disabled={loading || !!itemType} // Disable if item is pre-selected
              multiline
              rows={2}
              placeholder="e.g. Gym service payment..."
              slotProps={{ htmlInput: { maxLength: 255 } }}
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
          />

          <Divider />

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Payment Method:
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Box
                  component="img"
                  src="/images/Logo-MoMo.png"
                  alt="MoMo"
                  sx={{ width: 24, height: 24 }}
              />
              <Typography variant="body2">
                MoMo E-Wallet
              </Typography>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mt: 1 }}>
            Scan the QR code using the MoMo app to complete your payment.
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
            onClick={onClose}
            disabled={loading}
            color="inherit"
        >
          Cancel
        </Button>
        <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              background: 'linear-gradient(135deg, #d82d8b, #a4036f)',
              minWidth: 140
            }}
        >
          {loading ? 'Processing...' : 'Generate QR Code'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default PaymentFormStep;