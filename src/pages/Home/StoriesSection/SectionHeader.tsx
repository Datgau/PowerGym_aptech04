import React from 'react';
import { Box, Typography } from '@mui/material';

const SectionHeader: React.FC = () => {
  return (
    <Box textAlign="center" mb={6}>
      <Typography
        variant="h2"
        component="h2"
        sx={{
          fontWeight: 900,
          fontSize: { xs: '2.2rem', md: '3rem' },
          color: 'white',
          mb: 2,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          textShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.2)',
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
            borderRadius: '2px',
            boxShadow: '0 0 20px rgba(255,255,255,0.5)'
          }
        }}
      >
        MEMBER STORIES
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: 'rgba(255, 255, 255, 0.95)',
          fontSize: { xs: '1rem', md: '1.15rem' },
          lineHeight: 1.7,
          maxWidth: '700px',
          mx: 'auto',
          fontWeight: 400,
          textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          mt: 3
        }}
      >
        POWERGYM always creates the best conditions to help members succeed and progress every day
      </Typography>
    </Box>
  );
};

export default SectionHeader;