import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import type { StoryStats } from '../types';

interface StatsCardsProps {
  stats: StoryStats;
  activeFilter?: string;
  onFilterClick?: (filter: string) => void;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, activeFilter = 'ALL', onFilterClick }) => {
  const statCards = [
    { label: 'Total', value: stats.total, color: '#1976d2', bgcolor: '#e3f2fd', filter: 'ALL' },
    { label: 'Pending', value: stats.pending, color: '#f57c00', bgcolor: '#fff3e0', filter: 'PENDING' },
    { label: 'Approved', value: stats.approved, color: '#2e7d32', bgcolor: '#e8f5e8', filter: 'APPROVED' },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
      {statCards.map((card) => (
        <Paper
          key={card.filter}
          onClick={() => onFilterClick?.(card.filter)}
          sx={{
            p: 2,
            textAlign: 'center',
            bgcolor: card.bgcolor,
            cursor: onFilterClick ? 'pointer' : 'default',
            transition: 'all 0.3s ease',
            border: activeFilter === card.filter ? `3px solid ${card.color}` : '3px solid transparent',
            transform: activeFilter === card.filter ? 'scale(1.05)' : 'scale(1)',
            '&:hover': onFilterClick ? {
              transform: 'scale(1.05)',
              boxShadow: 3
            } : {}
          }}
        >
          <Typography variant="h4" fontWeight={700} color={card.color}>
            {card.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {card.label}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default StatsCards;