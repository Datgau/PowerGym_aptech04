import React from 'react';
import {
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { type MoMoPaymentResponse } from '../../../services/paymentService';

interface QRCodeStepProps {
  paymentResponse: MoMoPaymentResponse | null;
  amount: number;
  onBack: () => void;
  onClose: () => void;
  formatAmount: (amount: number) => string;
}

const QRCodeStep: React.FC<QRCodeStepProps> = ({
                                                 paymentResponse,
                                                 amount,
                                                 onBack,
                                                 onClose,
                                                 formatAmount
                                               }) => {
  return (
      <>
        <DialogContent dividers>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scan QR Code to Pay
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Use the MoMo app to scan the QR code below
            </Typography>

            {paymentResponse && (
                <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      display: 'inline-block',
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #f8f9fa, #ffffff)'
                    }}
                >
                  <Box
                      component="img"
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentResponse.qrCodeUrl)}`}
                      alt="MoMo QR Code"
                      sx={{
                        width: 200,
                        height: 200,
                        border: '2px solid #e0e0e0',
                        borderRadius: 2
                      }}
                  />
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      {paymentResponse.orderId}
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight={600}>
                      {formatAmount(amount)}
                    </Typography>
                  </Box>
                </Paper>
            )}

            <Box mt={3}>
              <Alert severity="info" sx={{ textAlign: 'left' }}>
                <Typography variant="body2" component="div">
                  <strong>Payment Instructions:</strong>
                  <br />1. Open the MoMo app on your phone
                  <br />2. Select "Scan QR"
                  <br />3. Scan the QR code on the screen
                  <br />4. Confirm the payment
                </Typography>
              </Alert>
            </Box>

            <Box mt={2} display="flex" alignItems="center" justifyContent="center" gap={1}>
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">
                Waiting for payment...
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onBack} color="inherit">
            Back
          </Button>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </>
  );
};

export default QRCodeStep;