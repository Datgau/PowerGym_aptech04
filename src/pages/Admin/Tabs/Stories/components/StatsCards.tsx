import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Assessment, HourglassEmpty, CheckCircle } from '@mui/icons-material';
import type {StoryStats, StoryStatus} from '../types';

/* ─── Styled Components ─────────────────────────────────── */

const StatsBar = styled(Box)({
  display: 'flex',
  gap: 12,
  marginBottom: 24,
});

const StatPill = styled(Box)<{ active?: boolean }>(({ active }) => ({
  background: '#ffffff',
  border: active ? '2px solid #0066ff' : '1px solid #eaeef8',
  borderRadius: 12,
  padding: '12px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flex: 1,
  boxShadow: active ? '0 4px 20px rgba(0,102,255,0.15)' : '0 1px 4px rgba(0,0,0,0.04)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  transform: active ? 'translateY(-2px)' : 'translateY(0)',
  '&:hover': {
    borderColor: '#0066ff40',
    boxShadow: '0 6px 24px rgba(0,102,255,0.1)',
    transform: 'translateY(-2px)',
  },
}));

interface StatsCardsProps {
  stats: StoryStats;
  activeFilter?: string;
  onFilterClick?: (filter: StoryStatus) => void;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, activeFilter = 'ALL', onFilterClick }) => {
  const statCards = [
    { 
      label: 'Total', 
      value: stats.total, 
      color: '#0066ff', 
      bgcolor: '#eff6ff',
      filter: 'ALL',
      icon: Assessment
    },
    { 
      label: 'Pending', 
      value: stats.pending, 
      color: '#f59e0b', 
      bgcolor: '#fef3c7',
      filter: 'PENDING',
      icon: HourglassEmpty
    },
    { 
      label: 'Approved', 
      value: stats.approved, 
      color: '#10b981', 
      bgcolor: '#d1fae5',
      filter: 'APPROVED',
      icon: CheckCircle
    },
  ];

  return (
    <StatsBar>
      {statCards.map((card) => {
        const IconComponent = card.icon;
        const isActive = activeFilter === card.filter;
        
        return (
          <StatPill
            key={card.filter}
            active={isActive}
            onClick={() => onFilterClick?.(card.filter as StoryStatus)}
          >
            <Box sx={{ 
              width: 36, 
              height: 36, 
              borderRadius: '10px', 
              background: card.bgcolor,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: `1px solid ${card.color}30`
            }}>
              <IconComponent sx={{ fontSize: 18, color: card.color }} />
            </Box>
            <Box>
              <Typography fontSize={12} color="#94a3b8" fontWeight={500} lineHeight={1}>
                {card.label}
              </Typography>
              <Typography fontSize={20} fontWeight={700} color={isActive ? card.color : '#0f172a'}>
                {card.value}
              </Typography>
            </Box>
          </StatPill>
        );
      })}
    </StatsBar>
  );
};

export default StatsCards;