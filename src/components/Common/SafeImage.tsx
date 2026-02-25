import React, { useState } from 'react';
import { Box } from '@mui/material';

interface SafeImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  style?: React.CSSProperties;
  sx?: any;
  onError?: () => void;
  onLoad?: () => void;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc = '/images/default-service.jpg',
  style,
  sx,
  onError,
  onLoad,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    console.error(`Failed to load image: ${currentSrc}`);
    if (currentSrc !== fallbackSrc) {
      console.log(`Falling back to: ${fallbackSrc}`);
      setCurrentSrc(fallbackSrc);
      setHasError(true);
    }
    onError?.();
  };

  const handleLoad = () => {
    console.log(`Successfully loaded image: ${currentSrc}`);
    onLoad?.();
  };

  return (
    <Box
      component="img"
      src={currentSrc}
      alt={alt}
      style={style}
      sx={{
        ...sx,
        border: hasError ? '2px solid orange' : undefined,
      }}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

export default SafeImage;