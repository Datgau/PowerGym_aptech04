import React from 'react';
import { Box, Typography } from '@mui/material';
import { TOKEN } from '../constants';

interface SectionLabelProps {
  children: React.ReactNode;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ children }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography
      variant="overline"
      sx={{
        fontFamily: TOKEN.fontDisplay,
        fontWeight: 700,
        fontSize: '0.82rem',
        letterSpacing: '0.22em',
        background: TOKEN.gradientMain,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline-block',
      }}
    >
      {children}
    </Typography>
    <Box
      sx={{
        mx: 'auto',
        mt: 0.5,
        width: 40,
        height: 2,
        background: TOKEN.gradientMain,
        borderRadius: 1,
      }}
    />
  </Box>
);

export default SectionLabel;
