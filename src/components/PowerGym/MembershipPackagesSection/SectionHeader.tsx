import React from 'react';
import { Box, Typography } from '@mui/material';

const SectionHeader: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
          color: 'white',
          mb: 2,
          textTransform: 'uppercase',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        MEMBERSHIP PACKAGES
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: { xs: '1rem', md: '1.2rem' },
          lineHeight: 1.6,
          maxWidth: '600px',
          mx: 'auto',
          textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
          fontWeight: 400
        }}
      >
        Choose a package that suits your needs and goals
      </Typography>
    </Box>
  );
};

export default SectionHeader;