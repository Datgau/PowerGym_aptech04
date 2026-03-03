import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

interface StatCardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  hoverColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon, gradient, hoverColor }) => {
  return (
    <Card 
      sx={{ 
        background: gradient,
        color: 'white',
        height: '140px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 8px 24px ${hoverColor}`
        }
      }}
    >
      <CardContent sx={{ width: '100%' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
              {value}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {label}
            </Typography>
          </Box>
          <Box sx={{ fontSize: 50, opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
