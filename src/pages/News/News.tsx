import React from 'react';
import {
  Container,
  Box,
  Typography,
} from '@mui/material';

import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout';
import NewsGrid from '../../components/News/NewsGrid';
import { useNews } from '../../hooks/useNews';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const News: React.FC = () => {
  const {
    articles,
    loading,
    error,
    refresh,
  } = useNews();

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
                Fitness News
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
                  Stay updated with the latest news about sports, health, and fitness
                  from trusted sources around the world.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ── News Section ── */}
      <Box sx={{ background: '#f4f6f9', py: { xs: 6, md: 9 } }}>
        <Container maxWidth="xl">
          {/* Main News Section */}
          <NewsGrid
            articles={articles}
            loading={loading}
            error={error}
            onRefresh={refresh}
            title="News Gym & Fitness"
          />
        </Container>
      </Box>
    </PowerGymLayout>
  );
};

export default News;