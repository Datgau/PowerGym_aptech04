import React from 'react';
import {
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, QrCode2 } from '@mui/icons-material';
import { type MoMoPaymentResponse } from '../../../services/paymentService';

interface QRCodeStepProps {
  paymentResponse: MoMoPaymentResponse | null;
  amount: number;
  onBack: () => void;
  onClose: () => void;
  formatAmount: (amount: number) => string;
}

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const QRCodeStep: React.FC<QRCodeStepProps> = ({
                                                 paymentResponse,
                                                 amount,
                                                 onBack,
                                                 onClose,
                                                 formatAmount
                                               }) => {
  return (
      <>
        <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>
          <Box sx={{ textAlign: 'center' }}>

            {/* Title */}
            <Typography sx={{
              fontFamily: '"Sora", "DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#1a1a2e',
              mb: 0.5
            }}>
              Scan QR Code to Pay
            </Typography>
            <Typography sx={{
              fontFamily: '"Sora", sans-serif',
              fontSize: '0.82rem',
              color: '#7a7a8c',
              mb: 3
            }}>
              Use the MoMo app to scan the QR code below
            </Typography>

            {/* QR Card */}
            {paymentResponse && (
                <Box
                    sx={{
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      borderRadius: '20px',
                      border: '2px solid #ebebf0',
                      backgroundColor: 'white',
                      boxShadow: '0 8px 32px rgba(4,86,104,0.10)',
                      overflow: 'hidden',
                    }}
                >
                  {/* QR header strip */}
                  <Box sx={{
                    width: '100%',
                    background: BRAND_GRADIENT,
                    py: 1.2,
                    px: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}>
                    <Box
                        component="img"
                        src="/images/Logo-MoMo.png"
                        alt="MoMo"
                        sx={{ width: 20, height: 20, objectFit: 'contain' }}
                    />
                    <Typography sx={{
                      fontFamily: '"Sora", sans-serif',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      color: 'white',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      MoMo Payment
                    </Typography>
                  </Box>

                  {/* QR Image */}
                  <Box sx={{ p: 2.5, pb: 1.5 }}>
                    <Box
                        component="img"
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentResponse.qrCodeUrl)}`}
                        alt="MoMo QR Code"
                        sx={{
                          width: 200,
                          height: 200,
                          display: 'block',
                          borderRadius: '12px',
                          border: '1.5px solid #e8edf2',
                        }}
                    />
                  </Box>

                  {/* Amount + Order ID */}
                  <Box sx={{
                    px: 3,
                    pb: 2.5,
                    textAlign: 'center',
                  }}>
                    <Typography sx={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: '0.72rem',
                      color: '#9aa5b4',
                      letterSpacing: '0.06em',
                      mb: 0.3
                    }}>
                      {paymentResponse.orderId}
                    </Typography>
                    <Typography sx={{
                      fontFamily: '"Sora", sans-serif',
                      fontWeight: 800,
                      fontSize: '1.4rem',
                      background: BRAND_GRADIENT,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {formatAmount(amount)}
                    </Typography>
                  </Box>
                </Box>
            )}

            {/* Instructions */}
            <Box
                sx={{
                  mt: 3,
                  px: 2.5,
                  py: 2,
                  borderRadius: '14px',
                  backgroundColor: '#f0f7ff',
                  border: '1.5px solid #c8e0f7',
                  textAlign: 'left',
                }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1.2}>
                <QrCode2 sx={{ fontSize: 16, color: '#1366ba' }} />
                <Typography sx={{
                  fontFamily: '"Sora", sans-serif',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  color: '#1366ba',
                  letterSpacing: '0.04em'
                }}>
                  Payment Instructions
                </Typography>
              </Box>
              {[
                'Open the MoMo app on your phone',
                'Select "Scan QR"',
                'Scan the QR code on the screen',
                'Confirm the payment'
              ].map((step, i) => (
                  <Box key={i} display="flex" alignItems="flex-start" gap={1.2} mb={i < 3 ? 0.8 : 0}>
                    <Box sx={{
                      width: 18, height: 18,
                      borderRadius: '50%',
                      background: BRAND_GRADIENT,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, mt: '1px'
                    }}>
                      <Typography sx={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        color: 'white',
                        lineHeight: 1
                      }}>
                        {i + 1}
                      </Typography>
                    </Box>
                    <Typography sx={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: '0.8rem',
                      color: '#3a4a5c',
                      lineHeight: 1.5
                    }}>
                      {step}
                    </Typography>
                  </Box>
              ))}
            </Box>

            {/* Polling indicator */}
            <Box mt={2.5} mb={0.5} display="flex" alignItems="center" justifyContent="center" gap={1.2}>
              <CircularProgress
                  size={14}
                  thickness={5}
                  sx={{
                    color: '#00b4ff',
                    '& .MuiCircularProgress-circle': { strokeLinecap: 'round' }
                  }}
              />
              <Typography sx={{
                fontFamily: '"Sora", sans-serif',
                fontSize: '0.78rem',
                color: '#7a7a8c',
              }}>
                Waiting for payment confirmation...
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5, borderTop: '1px solid #e8edf2' }}>
          <Button
              onClick={onBack}
              startIcon={<ArrowBack sx={{ fontSize: '16px !important' }} />}
              sx={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 600,
                fontSize: '0.82rem',
                color: '#8892a0',
                textTransform: 'none',
                px: 2.5, py: 1,
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
            Back
          </Button>
          <Button
              onClick={onClose}
              sx={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 600,
                fontSize: '0.82rem',
                color: '#8892a0',
                textTransform: 'none',
                px: 2.5, py: 1,
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
        </DialogActions>
      </>
  );
};

export default QRCodeStep;