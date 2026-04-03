import React, { useState } from 'react';
import { Box, Card, Typography } from '@mui/material';
import { TOKEN } from '../constants';
import type { ValueItem } from '../types';

interface ValueCardProps {
  value: ValueItem;
}

const ValueCard: React.FC<ValueCardProps> = ({ value }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      elevation={0}
      sx={{
        height: '100%',
        textAlign: 'center',
        p: 3.5,
        borderRadius: TOKEN.radiusMd,
        border: `2px solid ${hovered ? value.color : 'transparent'}`,
        boxShadow: hovered
          ? `0 20px 60px ${value.color}28`
          : '0 2px 20px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-12px)' : 'translateY(0)',
        transition: TOKEN.transition,
        position: 'relative',
        overflow: 'hidden',
        background: 'white',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: TOKEN.gradientMain,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: TOKEN.transition,
        },
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          p: 2,
          borderRadius: '50%',
          background: `${value.color}14`,
          color: value.color,
          mb: 2.5,
          transform: hovered ? 'scale(1.2) rotate(10deg)' : 'scale(1) rotate(0deg)',
          transition: '0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: hovered ? `0 4px 20px ${value.color}40` : 'none',
        }}
      >
        {value.icon}
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontFamily: TOKEN.fontDisplay,
          fontWeight: 600,
          fontSize: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          mb: 1.5,
        }}
      >
        {value.title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontFamily: TOKEN.fontBody,
          fontSize: '0.9rem',
          lineHeight: 1.75,
          color: 'text.secondary',
        }}
      >
        {value.description}
      </Typography>
    </Card>
  );
};

export default ValueCard;
