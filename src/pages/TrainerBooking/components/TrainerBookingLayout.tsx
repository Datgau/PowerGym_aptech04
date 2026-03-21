import React from 'react';
import { Box, Container } from '@mui/material';
import PowerGymLayout from '../../../components/PowerGym/Layout/PowerGymLayout';

interface TrainerBookingLayoutProps {
  children: React.ReactNode;
}

const TrainerBookingLayout: React.FC<TrainerBookingLayoutProps> = ({ children }) => {
  return (
    <PowerGymLayout>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          py: 4
        }}
      >
        {children}
      </Box>
    </PowerGymLayout>
  );
};

export default TrainerBookingLayout;