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
        gap: 1,
        mt: 4
      }}
    >
      {Array.from({ length: maxIndex + 1 }).map((_, index) => (
        <Box
          key={index}
          onClick={() => onDotClick(index)}
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: currentIndex === index ? 'white' : 'rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'white',
              transform: 'scale(1.2)'
            }
          }}
        />
      ))}
    </Box>
  );
};

export default DotsIndicator;