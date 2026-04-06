import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import { LocalOffer, Star } from '@mui/icons-material';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout.tsx';
import { usePromotion } from '../../hooks/usePromotion';
import PromotionCard from '../../components/Promotion/PromotionCard';
import {toast} from "react-toastify";

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const Promotions: React.FC = () => {
  const { promotions, featuredPromotions, loading, error } = usePromotion();
  const [tabValue, setTabValue] = useState(0);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied to clipboard: ${code}`);
  };

  const displayPromotions = tabValue === 0 ? featuredPromotions : promotions;

  return (
    <PowerGymLayout>
      {/* ── Hero Banner ── */}
      <Box
        sx={{
          background: BRAND_GRADIENT,
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{
          position: 'absolute', top: -80, right: -80, width: 360, height: 360,
          borderRadius: '50%', background: 'rgb(19,102,186)', pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -60, left: -60, width: 260, height: 260,
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', top: '30%', left: '25%', width: 180, height: 180,
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />

        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography
              variant="overline"
              sx={{
                color: 'rgba(255,255,255,0.75)',
                letterSpacing: 5,
                fontSize: '0.7rem',
                fontWeight: 600,
                display: 'block',
                mb: 2,
              }}
            >
              PowerGym Premium
            </Typography>

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.4rem', md: '3.8rem' },
                color: '#fff',
                lineHeight: 1.15,
                mb: 2,
                letterSpacing: '-0.5px',
              }}
            >
              Promotions
            </Typography>

            <Box sx={{
              width: 56, height: 3,
              background: 'rgba(255,255,255,0.5)',
              borderRadius: 2, mx: 'auto', mb: 3,
            }} />

            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.78)',
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                lineHeight: 1.8,
                maxWidth: 520,
                mx: 'auto',
              }}
            >
              Get special offers for our services and membership packages
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ── Content Section ── */}
      <Box sx={{ background: '#f4f6f9', py: { xs: 6, md: 9 } }}>
        <Container maxWidth="xl">
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress size={60} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ borderRadius: 3 }}>
              {error}
            </Alert>
          ) : (
            <>
              {/* Section header with tabs */}
              <Stack direction="row" alignItems="flex-end" justifyContent="space-between" mb={5}>
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ color: '#1366ba', fontWeight: 700, letterSpacing: 4, fontSize: '0.68rem' }}
                  >
                    Special Offers
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="text.primary" mt={0.5}>
                    {displayPromotions.length} Promotion{displayPromotions.length !== 1 ? 's' : ''} Available
                  </Typography>
                </Box>
              </Stack>

              {/* Tabs */}
              <Box sx={{ mb: 4 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={(_, newValue) => setTabValue(newValue)}
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                    },
                  }}
                >
                  <Tab
                    icon={<Star />}
                    iconPosition="start"
                    label={`Featured (${featuredPromotions.length})`}
                  />
                  <Tab
                    icon={<LocalOffer />}
                    iconPosition="start"
                    label={`All Promotions (${promotions.length})`}
                  />
                </Tabs>
              </Box>

              {/* Grid */}
              {displayPromotions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary" mb={2}>
                    No promotions available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check back later for special offers
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)' },
                    gap: 3,
                  }}
                >
                  {displayPromotions.map((promotion, idx) => (
                    <Box
                      key={promotion.id}
                      sx={{
                        animationName: 'fadeUp',
                        animationDuration: '0.5s',
                        animationFillMode: 'both',
                        animationDelay: `${idx * 0.07}s`,
                        '@keyframes fadeUp': {
                          from: { opacity: 0, transform: 'translateY(24px)' },
                          to: { opacity: 1, transform: 'translateY(0)' },
                        },
                      }}
                    >
                      <PromotionCard promotion={promotion} onUse={handleCopyCode} />
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
    </PowerGymLayout>
  );
};

export default Promotions;
