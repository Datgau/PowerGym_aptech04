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

const PaymentHeader: React.FC<PaymentHeaderProps> = ({
  onClose,
  loading
}) => {
  return (
    <DialogTitle sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      pb: 1
    }}>
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          component="img"
          src="/images/Logo-MoMo.png"
          alt="MoMo"
          sx={{ width: 32, height: 32 }}
        />
        <Typography variant="h6" fontWeight={600}>
          Payment Method MoMo
        </Typography>
      </Box>
      <IconButton 
        onClick={onClose} 
        size="small"
        disabled={loading}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};

export default PaymentHeader;