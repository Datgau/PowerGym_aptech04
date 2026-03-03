import React from 'react';
import { Box, Typography } from '@mui/material';

const SectionHeader: React.FC = () => {
  return (
    <Box textAlign="center" mb={6}>
      <Typography
        variant="h2"
        component="h2"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '2rem', md: '2.5rem' },
          color: 'white',
          mb: 2,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        MEMBER STORIES
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: { xs: '1rem', md: '1.1rem' },
          lineHeight: 1.6,
          maxWidth: '600px',
          mx: 'auto',
          textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
        }}
      >
        POWERGYM always creates the best conditions to help members succeed and progress every day
      </Typography>
    </Box>
  );
};

export default SectionHeader;