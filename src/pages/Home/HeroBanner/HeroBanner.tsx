import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Launch, Star, LocalFireDepartment } from '@mui/icons-material';
import type { BannerPromotion } from "../../../@type/powergym.ts";

interface HeroBannerProps {
  readonly promotion: BannerPromotion;
  readonly onRegisterClick: () => void;
}


const HeroBanner: React.FC<HeroBannerProps> = ({ promotion, onRegisterClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (!promotion.isActive) return null;

  return (
      <Box
          component="section"
          sx={{
            backgroundImage: "url('/images/banner.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            overflow: 'hidden',
            minHeight: { xs: '100vh', md: '88vh' },
            display: 'flex',
            alignItems: 'center',
          }}
      >
        {/* ── Decorative layers ── */}
        {/* Grid texture */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 8, md: 10 } }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 6, md: 8 },
          }}>

            {/* ── Left: Text Content ── */}
            <Box
                sx={{
                  flex: 1,
                  animationName: 'fadeInUp',
                  animationDuration: '0.9s',
                  animationFillMode: 'both',
                  '@keyframes fadeInUp': {
                    from: { opacity: 0, transform: 'translateY(32px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
            >
              {/* Eyebrow badge */}
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1,
                px: 2.5, py: 0.8, mb: 3,
                background: 'rgba(69,68,68,0.34)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '50px',
              }}>
                <LocalFireDepartment sx={{ color: '#00b4ff', fontSize: 16 }} />
                <Typography variant="overline" sx={{
                  color: '#00b5ff', fontWeight: 700,
                  letterSpacing: '0.12em', fontSize: '0.72rem',
                }}>
                  POWERGYM PREMIUM
                </Typography>
              </Box>

              {/* Title */}
              <Typography
                  component="h1"
                  sx={{
                    fontSize: isMobile ? '2.2rem' : isTablet ? '3rem' : '4rem',
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: '-1.5px',
                    color: '#3bc0ff',
                    mb: 1.5,
                    textShadow: '0 4px 24px rgba(0,0,0,0.2)',
                  }}
              >
                {promotion.title}
              </Typography>

              <Typography
                  component="h2"
                  sx={{
                    fontSize: isMobile ? '1.8rem' : isTablet ? '2.4rem' : '3.2rem',
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: '-1px',
                    color: 'rgba(5,96,133,0.85)',
                    mb: 4,
                  }}
              >
                Passion and{' '}
                <Box component="span" sx={{
                  color: 'rgba(0,209,255,0.9)',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4, left: 0, right: 0,
                    height: 3,
                    background: 'rgb(0,180,255)',
                    borderRadius: 2,
                  },
                }}>
                  Fire
                </Box>
              </Typography>

              {/* Feature cards */}
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                mb: 5,
              }}>
                {promotion.features.map((feature, index) => (
                    <Tooltip key={feature.id} title={feature.title || ''} arrow placement="top">
                      <Card
                          elevation={0}
                          sx={{
                            background: 'rgba(44,44,44,0.7)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '14px',
                            transition: 'transform 0.25s ease, background 0.25s ease',
                            animationName: 'fadeInUp',
                            animationDuration: '0.7s',
                            animationFillMode: 'both',
                            animationDelay: `${0.2 + index * 0.1}s`,
                            cursor: 'default',
                            '&:hover': {
                                background: 'rgba(44,44,44,0.72)',
                              transform: 'translateY(-3px)',
                            },
                          }}
                      >
                        <CardContent sx={{ p: '12px 16px !important', display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          {feature.icon && (
                              <Box sx={{
                                width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                                  background: 'rgba(69,68,68,0.77)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff',
                                '& svg': { fontSize: 20 },
                              }}>
                                <feature.icon />
                              </Box>
                          )}
                          <Box>
                            <Typography sx={{
                              color: '#fff',
                              fontWeight: feature.highlight ? 800 : 600,
                              fontSize: feature.highlight ? '0.95rem' : '0.88rem',
                              lineHeight: 1.3,
                            }}>
                              {feature.title}
                            </Typography>
                            {feature.description && (
                                <Typography variant="body2" sx={{
                                  color: 'rgb(255,255,255)',
                                  fontSize: '0.95rem',
                                  mt: 0.3, lineHeight: 1.4,
                                }}>
                                  {feature.description}
                                </Typography>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Tooltip>
                ))}
              </Box>

              {/* Actions */}
              <Box
                  sx={{
                    display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2,
                    animationName: 'fadeInUp',
                    animationDuration: '0.7s',
                    animationFillMode: 'both',
                    animationDelay: '0.8s',
                  }}
              >
                <Button
                    variant="contained"
                    size="large"
                    onClick={onRegisterClick}
                    startIcon={<Launch />}
                    endIcon={<Star />}
                    sx={{
                      background: '#fff',
                      color: '#00b4ff',
                      fontWeight: 800,
                      fontSize: '1rem',
                      px: 4, py: 1.6,
                      borderRadius: '50px',
                      textTransform: 'none',
                      boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      '&:hover': {
                        background: '#fff',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 14px 36px rgba(0,0,0,0.28)',
                      },
                      '& .MuiButton-startIcon svg': { color: '#00b4ff' },
                      '& .MuiButton-endIcon svg': { color: '#ff5026' },
                    }}
                >
                  {promotion.ctaText}
                </Button>

                {promotion.validUntil && (
                    <Chip
                        label={`Valid until ${new Date(promotion.validUntil).toLocaleDateString('en-US')}`}
                        sx={{
                            background: 'rgba(69,68,68,0.34)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255,255,255,0.25)',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                        }}
                    />
                )}
              </Box>
            </Box>

            {/* ── Right: Image ── */}
            {!isMobile && (
                <Box
                    sx={{
                      flex: { md: '0 0 42%', lg: '0 0 46%' },
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      animationName: 'fadeInRight',
                      animationDuration: '1s',
                      animationFillMode: 'both',
                      animationDelay: '0.5s',
                      '@keyframes fadeInRight': {
                        from: { opacity: 0, transform: 'translateX(48px)' },
                        to: { opacity: 1, transform: 'translateX(0)' },
                      },
                    }}
                >
                  {/* Glow behind image */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '80%', height: '60%',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    filter: 'blur(48px)',
                    pointerEvents: 'none',
                  }} />

                  <Box
                      component="img"
                      src="/images/imagebanner.jpg"
                      alt="PowerGym Members"
                      loading="lazy"
                      sx={{
                        width: '100%',
                        maxHeight: { md: '70vh', lg: '75vh' },
                        objectFit: 'contain',
                        objectPosition: 'bottom',
                        position: 'relative',
                        zIndex: 1,
                        borderRadius: '150px',
                        filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.25))',
                      }}
                  />
                </Box>
            )}
          </Box>
        </Container>
      </Box>
  );
};

export default HeroBanner;