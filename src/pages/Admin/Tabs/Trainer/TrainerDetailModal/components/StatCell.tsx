import React from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  label: string;
  value: string;
}

const StatCell: React.FC<Props> = ({ label, value }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" fontWeight={600}
      textTransform="uppercase" letterSpacing={0.8}>
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={700}>{value}</Typography>
  </Box>
);

export default StatCell;
