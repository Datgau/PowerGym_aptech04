import React from 'react';
import { IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

interface CarouselNavigationProps {
  readonly currentIndex: number;
  readonly maxIndex: number;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  currentIndex,
  maxIndex,
  onPrevious,
  onNext
}) => {
  const buttonStyles = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    color: '#667eea',
    width: { xs: 40, sm: 48 },
    height: { xs: 40, sm: 48 },
    border: '2px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '&:hover': {
      background: 'white',
      transform: 'translateY(-50%) scale(1.15)',
      boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
      border: '2px solid rgba(255, 255, 255, 0.5)',
    },
    '&:disabled': {
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'rgba(255, 255, 255, 0.4)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      boxShadow: 'none'
    }
  };

  return (
    <>
      <IconButton
        onClick={onPrevious}
        disabled={currentIndex === 0}
        sx={{
          ...buttonStyles,
          left: { xs: -12, sm: -20 }
        }}
      >
        <ArrowBackIos sx={{ fontSize: { xs: 16, sm: 20 } }} />
      </IconButton>

      <IconButton
        onClick={onNext}
        disabled={currentIndex >= maxIndex}
        sx={{
          ...buttonStyles,
          right: { xs: -12, sm: -20 }
        }}
      >
        <ArrowForwardIos sx={{ fontSize: { xs: 16, sm: 20 } }} />
      </IconButton>
    </>
  );
};

export default CarouselNavigation;