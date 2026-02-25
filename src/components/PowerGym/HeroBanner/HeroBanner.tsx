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
  useMediaQuery
} from '@mui/material';
import { Launch, Star } from '@mui/icons-material';
import styles from './HeroBanner.module.css';
import type { BannerPromotion } from "../../../@type/powergym";

interface HeroBannerProps {
  readonly promotion: BannerPromotion;
  readonly onRegisterClick: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ promotion, onRegisterClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (!promotion.isActive) {
    return null;
  }

  return (
    <Box className={styles.heroBanner} component="section">
      <Container maxWidth="xl" className={styles.container}>
        <Box className={styles.bannerContent}>
          <Box
            className={styles.bannerText}
            sx={{
              animation: 'fadeInUp 1s ease-out',
              '@keyframes fadeInUp': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(30px)'
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
              }
            }}
          >
            <Typography
                sx={{
                    fontSize: isMobile ? '1.5rem' : isTablet ? '2.5rem' : '3rem',
                    fontWeight: 'bold',
                    mb: 3
                }}
              className={styles.bannerTitle}
              gutterBottom
            >
              {promotion.title}
              <br />
              <Box
                component="span"
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  marginBottom: 4,
                }}
              >
                Đam mê và rực cháy
              </Box>
            </Typography>

            {/* Features */}
            <Box className={styles.bannerFeatures}>
              {promotion.features.map((feature, index) => (
                <Tooltip
                  key={feature.id}
                  title={feature.title || ''}
                  arrow
                  placement="top"
                >
                  <Card
                    elevation={0}
                    className={styles.featureCard}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      animation: `fadeInUp 1s ease-out ${0.2 + index * 0.1}s both`
                    }}
                  >
                    <CardContent className={styles.featureContent}>
                      {feature.icon && (
                        <Box className={styles.featureIcon}>
                          <feature.icon />
                        </Box>
                      )}
                      <Box>
                        {feature.highlight ? (
                          <Typography
                            component="h3"
                            className={styles.featureTitle}
                          >
                            {feature.title}
                            {feature.description && (
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                  display: 'block',
                                  color: 'rgba(255,255,255,0.8)',
                                  fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
                                  mt: 0.5
                                }}
                              >
                                {feature.description}
                              </Typography>
                            )}
                          </Typography>
                        ) : (
                          <Typography
                            className={styles.featureText}
                          >
                            {feature.title}
                            {feature.description && (
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                  display: 'block',
                                  color: 'rgba(255,255,255,0.7)',
                                  fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)',
                                  mt: 0.3
                                }}
                              >
                                {feature.description}
                              </Typography>
                            )}
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
              className={styles.bannerActions}
              sx={{
                animation: 'fadeInUp 1s ease-out 0.8s both'
              }}
            >
              {promotion.validUntil && (
                  <Chip
                      label={`Có hiệu lực đến ${new Date(promotion.validUntil).toLocaleDateString('vi-VN')}`}
                      color="warning"
                      className={styles.validityChip}
                  />
              )}
              <Button
                variant="contained"
                size="large"
                className={styles.registerButton}
                onClick={onRegisterClick}
                startIcon={<Launch />}
                endIcon={<Star />}
              >
                {promotion.ctaText}
              </Button>


            </Box>
          </Box>

          {/* Image - Ẩn trên mobile như CityGym */}
          {!isMobile && (
            <Box
              className={styles.bannerImage}
              sx={{
                animation: 'fadeInRight 1s ease-out 1.2s both',
                '@keyframes fadeInRight': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateX(50px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateX(0)'
                  }
                }
              }}
            >
              <img
                src="/images/power-gym.png"
                alt="PowerGym Members"
                loading="lazy"
              />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HeroBanner;