import React from 'react';
import { Box, Container, Typography, Button, Fade, Zoom } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { TOKEN, gradientBtnSx } from '../constants';

interface HeroSectionProps {
  show: boolean;
  scrolled: boolean;
  onNavigate: (path: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ show, scrolled, onNavigate }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '60vh', md: '80vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: TOKEN.gradientDark,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          transform: scrolled ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.5s ease-out',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          opacity: 0.5,
          pointerEvents: 'none',
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
      >
        <Fade in={show} timeout={900}>
          <Typography
            variant="h1"
            sx={{
              fontFamily: TOKEN.fontDisplay,
              fontWeight: 900,
              fontSize: { xs: '2.8rem', md: '5rem' },
              color: 'white',
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textShadow: '0 4px 24px rgba(0,0,0,0.5)',
            }}
          >

              About Us
          </Typography>
        </Fade>

        <Fade in={show} timeout={1300}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: TOKEN.fontBody,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.88)',
              mb: 5,
              maxWidth: 680,
              mx: 'auto',
              lineHeight: 1.8,
              letterSpacing: '0.02em',
            }}
          >
              PowerGym — Join us in exploring a journey of strength, resilience, and community. Here, we don’t just build muscles; we build lasting relationships and a healthy lifestyle. Let’s push beyond limits and achieve your goals together!          </Typography>
        </Fade>

        <Zoom in={show} timeout={1700}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => onNavigate('/pricing')}
            sx={gradientBtnSx}
          >
            Join now
          </Button>
        </Zoom>
      </Container>
    </Box>
  );
};

export default HeroSection;
