import React from 'react';
import { Box } from '@mui/material';

interface DotsIndicatorProps {
  readonly currentIndex: number;
  readonly maxIndex: number;
  readonly onDotClick: (index: number) => void;
}

const DotsIndicator: React.FC<DotsIndicatorProps> = ({
  currentIndex,
  maxIndex,
  onDotClick
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 1.5,
        mt: 5
      }}
    >
      {Array.from({ length: maxIndex + 1 }).map((_, index) => (
        <Box
          key={index}
          onClick={() => onDotClick(index)}
          sx={{
            width: currentIndex === index ? 32 : 12,
            height: 12,
            borderRadius: '6px',
            background: currentIndex === index 
              ? 'rgba(255, 255, 255, 0.95)' 
              : 'rgba(255, 255, 255, 1)',
            backdropFilter: 'blur(4px)',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            border: '1px solid rgba(255, 255, 255, 0.99)',
            boxShadow: currentIndex === index 
              ? '0 4px 12px rgba(0,0,0,0.2)' 
              : 'none',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.97)',
              transform: 'scale(1.2)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }
          }}
        />
      ))}
    </Box>
  );
};

export default DotsIndicator;