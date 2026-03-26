import React from 'react';
import {
  DialogTitle,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface PaymentHeaderProps {
  onClose: () => void;
  loading: boolean;
}

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const PaymentHeader: React.FC<PaymentHeaderProps> = ({
                                                       onClose,
                                                       loading
                                                     }) => {
  return (
      <DialogTitle
          sx={{
            background: BRAND_GRADIENT,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb:3
          }}
      >
        <Box sx={{
          position: 'absolute', top: -30, right: -30,
          width: 120, height: 120,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)',
          pointerEvents: 'none'
        }} />
        <Box sx={{
          position: 'absolute', bottom: -20, left: -10,
          width: 80, height: 80,
          borderRadius: '50%',
          background: 'rgba(0,180,255,0.10)',
          pointerEvents: 'none'
        }} />

        {/* Left: Logo + Title */}
        <Box display="flex" alignItems="center" gap={1.5} sx={{ position: 'relative', zIndex: 1 }}>
          <Box
              sx={{
                width: 40,
                height: 40,
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
          >
            <Box
                component="img"
                src="/images/Logo-MoMo.png"
                alt="MoMo"
                sx={{ width: 28, height: 28, objectFit: 'contain' }}
            />
          </Box>

          <Box>
            <Typography
                sx={{
                  fontFamily: '"Sora", "DM Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'white',
                  lineHeight: 1.2,
                }}
            >
              MoMo Payment
            </Typography>
            <Typography
                sx={{
                  fontFamily: '"Sora", "DM Sans", sans-serif',
                  fontWeight: 300,
                  fontSize: '0.68rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.6)',
                  mt: 0.2,
                }}
            >
              Secure & Instant
            </Typography>
          </Box>
        </Box>

        {/* Right: Close button */}
        <IconButton
            onClick={onClose}
            size="small"
            disabled={loading}
            sx={{
              position: 'relative',
              zIndex: 1,
              color: 'rgba(255,255,255,0.8)',
              backgroundColor: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.22)',
                color: 'white',
              },
              '&.Mui-disabled': {
                color: 'rgba(255,255,255,0.3)',
                backgroundColor: 'rgba(255,255,255,0.06)',
              },
              transition: 'all 0.2s ease',
            }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
  );
};

export default PaymentHeader;