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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#1e3c72',
    width: 48,
    height: 48,
    '&:hover': {
      backgroundColor: 'white',
      transform: 'translateY(-50%) scale(1.1)'
    },
    '&:disabled': {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      color: 'rgba(0, 0, 0, 0.3)'
    },
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  };

  return (
    <>
      <IconButton
        onClick={onPrevious}
        disabled={currentIndex === 0}
        sx={{
          ...buttonStyles,
          left: -20
        }}
      >
        <ArrowBackIos />
      </IconButton>

      <IconButton
        onClick={onNext}
        disabled={currentIndex >= maxIndex}
        sx={{
          ...buttonStyles,
          right: -20
        }}
      >
        <ArrowForwardIos />
      </IconButton>
    </>
  );
};

export default CarouselNavigation;