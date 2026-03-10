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
                                                                 onNext,
                                                               }) => {
  const buttonStyles = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    background: '#fff',
    color: '#1366ba',
    width: { xs: 40, sm: 46 },
    height: { xs: 40, sm: 46 },
    outline: '1.5px solid #1366ba',
    outlineOffset: '-1.5px',
    boxShadow: '0 4px 16px rgba(19,102,186,0.18)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, outline-color 0.3s ease, background 0.3s ease',
    '&:hover': {
      background: '#fff',
      outline: '2px solid #00b4ff',
      outlineOffset: '-2px',
      color: '#00b4ff',
      transform: 'translateY(-50%) scale(1.1)',
      boxShadow: '0 8px 28px rgba(19,102,186,0.28)',
    },
    '&:disabled': {
      background: 'rgba(255,255,255,0.5)',
      color: 'rgba(19,102,186,0.25)',
      outline: '1.5px solid rgba(19,102,186,0.15)',
      outlineOffset: '-1.5px',
      boxShadow: 'none',
    },
  };

  return (
      <>
        <IconButton
            onClick={onPrevious}
            disabled={currentIndex === 0}
            sx={{ ...buttonStyles, left: { xs: -12, sm: -20 } }}
        >
          <ArrowBackIos sx={{ fontSize: { xs: 15, sm: 18 } }} />
        </IconButton>

        <IconButton
            onClick={onNext}
            disabled={currentIndex >= maxIndex}
            sx={{ ...buttonStyles, right: { xs: -12, sm: -20 } }}
        >
          <ArrowForwardIos sx={{ fontSize: { xs: 15, sm: 18 } }} />
        </IconButton>
      </>
  );
};

export default CarouselNavigation;