import React from 'react';
import {
  Container,
  Box,
  Typography,

} from '@mui/material';

import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout';
import NewsGrid from '../../components/News/NewsGrid';
import { useNews } from '../../hooks/useNews';

const News: React.FC = () => {

  const {
    articles,
    loading,
    error,
    refresh,
  } = useNews();


  return (
    <PowerGymLayout>
      <Box
        sx={{
          background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                color: '#1a1a1a',
                mb: 2,
                background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Tin tức Gym & Fitness Quốc tế
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#666',
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.7,
                maxWidth: '600px',
                mx: 'auto',
                mb: 4,
              }}
            >
              Cập nhật những tin tức mới nhất về gym, fitness và sức khỏe từ các nguồn quốc tế uy tín
            </Typography>
          </Box>

          {/* Main News Section */}
          <NewsGrid
            articles={articles}
            loading={loading}
            error={error}
            onRefresh={refresh}
            title="Tin tức Gym & Fitness"
          />
        </Container>
      </Box>
    </PowerGymLayout>
  );
};

export default News;