import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

interface Props {
  icon: React.ReactNode;
  title: string;
  count?: number;
}

const SectionHeader: React.FC<Props> = ({ icon, title, count }) => (
  <Box display="flex" alignItems="center" gap={1} mb={2} pb={1.5}
    sx={{ borderBottom: '2px solid', borderColor: 'primary.main' }}>
    <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>{icon}</Box>
    <Typography variant="h6" fontWeight={700} letterSpacing={-0.3}>{title}</Typography>
    {count !== undefined && (
      <Chip label={count} size="small"
        sx={{ ml: 'auto', fontWeight: 700, bgcolor: 'primary.main', color: '#fff', height: 22, fontSize: 12 }} />
    )}
  </Box>
);

export default SectionHeader;
