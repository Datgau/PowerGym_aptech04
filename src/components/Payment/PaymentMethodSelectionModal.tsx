import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Button,
  Typography,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Close,
  AccountBalance,
  Storefront,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';

interface PaymentMethodSelectionModalProps {
  open: boolean;
  onClose: () => void;
  /** Called when user picks "Register at Counter" */
  onSelectCounter?: () => void;
  onSelectBankTransfer: () => void;
  serviceName?: string;
  amount?: number;
}

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';
const COUNTER_GRADIENT = 'linear-gradient(135deg, #1b5e20 0%, #43a047 100%)';

const PaymentMethodSelectionModal: React.FC<PaymentMethodSelectionModalProps> = ({
  open,
  onClose,
  onSelectCounter,
  onSelectBankTransfer,
  serviceName,
  amount,
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const formatAmount = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          overflow: 'hidden',
          background: '#f0f4f8',
          boxShadow: '0 32px 64px rgba(4,86,104,0.22), 0 0 0 1px rgba(4,86,104,0.08)',
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(4,30,50,0.45)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: BRAND_GRADIENT,
          position: 'relative',
          overflow: 'hidden',
          px: 4,
          pt: 4.5,
          pb: 5.5,
        }}
      >
        {/* Decorative circles */}
        <Box sx={{
          position: 'absolute', top: -40, right: -40,
          width: 180, height: 180, borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -30, left: -20,
          width: 120, height: 120, borderRadius: '50%',
          background: 'rgba(0,180,255,0.10)', pointerEvents: 'none',
        }} />

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute', top: 16, right: 16,
            color: 'rgba(255,255,255,0.8)',
            backgroundColor: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.22)', color: 'white' },
            transition: 'all 0.2s ease',
          }}
        >
          <Close fontSize="small" />
        </IconButton>

        <Typography sx={{
          fontFamily: '"Sora", "DM Sans", sans-serif',
          fontWeight: 300, fontSize: '0.72rem',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.65)', mb: 0.8,
        }}>
          Payment
        </Typography>

        <Typography sx={{
          fontFamily: '"Sora", "DM Sans", sans-serif',
          fontWeight: 700, fontSize: '1.55rem',
          color: 'white', lineHeight: 1.2,
          mb: serviceName ? 1.5 : 0,
        }}>
          Choose payment<br />method
        </Typography>

        {serviceName && (
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1.5,
            mt: 0.5, px: 2, py: 1, borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.13)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}>
            <CheckCircle sx={{ fontSize: 16, color: 'rgba(255,255,255,0.75)' }} />
            <Typography sx={{
              fontFamily: '"Sora", sans-serif', fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.9)', fontWeight: 500,
            }}>
              {serviceName}
            </Typography>
            {amount && (
              <>
                <Box sx={{ width: 1, height: 14, backgroundColor: 'rgba(255,255,255,0.25)' }} />
                <Typography sx={{
                  fontFamily: '"Sora", sans-serif', fontSize: '0.85rem',
                  color: 'white', fontWeight: 700,
                }}>
                  {formatAmount(amount)}
                </Typography>
              </>
            )}
          </Box>
        )}
      </Box>

      {/* Curved separator */}
      <Box sx={{
        height: 28, background: BRAND_GRADIENT, position: 'relative',
        '&::after': {
          content: '""', position: 'absolute',
          bottom: 0, left: 0, right: 0, height: '100%',
          backgroundColor: '#f0f4f8',
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
        },
      }} />

      <DialogContent sx={{ px: 3, pt: 0, pb: 3 }}>
        <Stack spacing={2} sx={{ mt: 0.5 }}>

          {/* Register at Counter Card — only shown when handler is provided */}
          {onSelectCounter && (
            <Box
              onClick={onSelectCounter}
              onMouseEnter={() => setHoveredCard('counter')}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                cursor: 'pointer',
                borderRadius: '16px',
                background: hoveredCard === 'counter' ? COUNTER_GRADIENT : 'white',
                border: hoveredCard === 'counter' ? '2px solid transparent' : '2px solid #ebebf0',
                transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: hoveredCard === 'counter' ? 'translateY(-3px) scale(1.01)' : 'translateY(0) scale(1)',
                boxShadow: hoveredCard === 'counter'
                  ? '0 16px 40px rgba(27,94,32,0.30)'
                  : '0 2px 8px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                p: 2.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 52, height: 52, borderRadius: '14px',
                  background: hoveredCard === 'counter'
                    ? 'rgba(255,255,255,0.2)'
                    : COUNTER_GRADIENT,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.28s ease',
                  border: hoveredCard === 'counter' ? '1px solid rgba(255,255,255,0.3)' : 'none',
                }}>
                  <Storefront sx={{ color: 'white', fontSize: 26 }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{
                    fontFamily: '"Sora", sans-serif', fontWeight: 700, fontSize: '1rem',
                    color: hoveredCard === 'counter' ? 'white' : '#1a1a2e',
                    transition: 'color 0.2s', mb: 0.3,
                  }}>
                    Register at Counter
                  </Typography>
                  <Typography sx={{
                    fontFamily: '"Sora", sans-serif', fontSize: '0.78rem',
                    color: hoveredCard === 'counter' ? 'rgba(255,255,255,0.75)' : '#7a7a8c',
                    transition: 'color 0.2s',
                  }}>
                    Pay in person — staff will confirm your registration
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.8, mt: 1 }}>
                    {['Walk-in', 'Cash / Card'].map((tag) => (
                      <Typography key={tag} sx={{
                        fontSize: '0.68rem', fontWeight: 700,
                        fontFamily: '"Sora", sans-serif',
                        px: 1, py: 0.3, borderRadius: '6px',
                        backgroundColor: hoveredCard === 'counter'
                          ? 'rgba(255,255,255,0.18)'
                          : (tag === 'Walk-in' ? '#e8f5e9' : '#f3e5f5'),
                        color: hoveredCard === 'counter'
                          ? 'rgba(255,255,255,0.9)'
                          : (tag === 'Walk-in' ? '#2e7d32' : '#6a1b9a'),
                        transition: 'all 0.2s', letterSpacing: '0.03em',
                      }}>
                        {tag}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Box sx={{
                  width: 34, height: 34, borderRadius: '10px',
                  backgroundColor: hoveredCard === 'counter' ? 'rgba(255,255,255,0.2)' : '#e8f5e9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.28s ease', flexShrink: 0,
                }}>
                  <ArrowForward sx={{
                    fontSize: 18,
                    color: hoveredCard === 'counter' ? 'white' : '#2e7d32',
                    transition: 'color 0.2s',
                  }} />
                </Box>
              </Box>
            </Box>
          )}

          {/* Divider */}
          {onSelectCounter && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1 }}>
              <Box sx={{ flex: 1, height: '1px', backgroundColor: '#dde3ea' }} />
              <Typography sx={{
                fontFamily: '"Sora", sans-serif', fontSize: '0.7rem',
                fontWeight: 600, color: '#aab0ba', letterSpacing: '0.1em',
              }}>OR</Typography>
              <Box sx={{ flex: 1, height: '1px', backgroundColor: '#dde3ea' }} />
            </Box>
          )}

          {/* Bank Transfer Card */}
          <Box
            onClick={onSelectBankTransfer}
            onMouseEnter={() => setHoveredCard('bank')}
            onMouseLeave={() => setHoveredCard(null)}
            sx={{
              cursor: 'pointer',
              borderRadius: '16px',
              background: hoveredCard === 'bank' ? BRAND_GRADIENT : 'white',
              border: hoveredCard === 'bank' ? '2px solid transparent' : '2px solid #ebebf0',
              transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: hoveredCard === 'bank' ? 'translateY(-3px) scale(1.01)' : 'translateY(0) scale(1)',
              boxShadow: hoveredCard === 'bank'
                ? '0 16px 40px rgba(4,86,104,0.30)'
                : '0 2px 8px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              p: 2.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 52, height: 52, borderRadius: '14px',
                background: hoveredCard === 'bank' ? 'rgba(255,255,255,0.18)' : BRAND_GRADIENT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.28s ease',
                border: hoveredCard === 'bank' ? '1px solid rgba(255,255,255,0.3)' : 'none',
              }}>
                <AccountBalance sx={{ color: 'white', fontSize: 26 }} />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{
                  fontFamily: '"Sora", sans-serif', fontWeight: 700, fontSize: '1rem',
                  color: hoveredCard === 'bank' ? 'white' : '#1a1a2e',
                  transition: 'color 0.2s', mb: 0.3,
                }}>
                  Bank Transfer
                </Typography>
                <Typography sx={{
                  fontFamily: '"Sora", sans-serif', fontSize: '0.78rem',
                  color: hoveredCard === 'bank' ? 'rgba(255,255,255,0.75)' : '#7a7a8c',
                  transition: 'color 0.2s',
                }}>
                  Transfer directly to our bank account
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.8, mt: 1 }}>
                  {['Manual Verification', 'Secure'].map((tag) => (
                    <Typography key={tag} sx={{
                      fontSize: '0.68rem', fontWeight: 700,
                      fontFamily: '"Sora", sans-serif',
                      px: 1, py: 0.3, borderRadius: '6px',
                      backgroundColor: hoveredCard === 'bank'
                        ? 'rgba(255,255,255,0.18)'
                        : (tag === 'Manual Verification' ? '#fff3e0' : '#e3f2fd'),
                      color: hoveredCard === 'bank'
                        ? 'rgba(255,255,255,0.9)'
                        : (tag === 'Manual Verification' ? '#e65100' : '#1565c0'),
                      transition: 'all 0.2s', letterSpacing: '0.03em',
                    }}>
                      {tag}
                    </Typography>
                  ))}
                </Box>
              </Box>

              <Box sx={{
                width: 34, height: 34, borderRadius: '10px',
                backgroundColor: hoveredCard === 'bank' ? 'rgba(255,255,255,0.18)' : '#e3f0fc',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.28s ease', flexShrink: 0,
              }}>
                <ArrowForward sx={{
                  fontSize: 18,
                  color: hoveredCard === 'bank' ? 'white' : '#1366ba',
                  transition: 'color 0.2s',
                }} />
              </Box>
            </Box>
          </Box>
        </Stack>

        {/* Cancel */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            onClick={onClose}
            sx={{
              fontFamily: '"Sora", sans-serif', fontWeight: 600,
              fontSize: '0.82rem', color: '#8892a0', textTransform: 'none',
              letterSpacing: '0.04em', px: 3, py: 0.8, borderRadius: '10px',
              border: '1.5px solid #dde3ea', backgroundColor: 'transparent',
              '&:hover': { backgroundColor: '#e8edf2', borderColor: '#c5cdd8', color: '#4a5568' },
              transition: 'all 0.2s ease',
            }}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodSelectionModal;
