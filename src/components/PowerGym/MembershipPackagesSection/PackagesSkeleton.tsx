import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';

const PackagesSkeleton: React.FC = () => {
  return (
    <Box>
      {/* Header Skeleton */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Skeleton 
          variant="text" 
          width={300} 
          height={60} 
          sx={{ 
            mx: 'auto', 
            mb: 2,
            backgroundColor: 'rgba(255,255,255,0.2)'
          }} 
        />
        <Skeleton 
          variant="text" 
          width={500} 
          height={30} 
          sx={{ 
            mx: 'auto',
            backgroundColor: 'rgba(255,255,255,0.1)'
          }} 
        />
      </Box>
      
      {/* Cards Skeleton */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          },
          gap: { xs: 3, md: 4 },
          maxWidth: '1200px',
          mx: 'auto'
        }}
      >
        {[1, 2, 3].map((item) => (
          <Card 
            key={item}
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Skeleton variant="circular" width={56} height={56} sx={{ mx: 'auto', mb: 2 }} />
              <Skeleton variant="text" width="80%" height={32} sx={{ mx: 'auto', mb: 1 }} />
              <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto', mb: 2 }} />
              <Skeleton variant="text" width="40%" height={48} sx={{ mx: 'auto', mb: 3 }} />
              
              {[1, 2, 3, 4].map((feature) => (
                <Box key={feature} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Skeleton variant="circular" width={18} height={18} sx={{ mr: 2 }} />
                  <Skeleton variant="text" width="80%" height={20} />
                </Box>
              ))}
              
              <Skeleton variant="rectangular" width="100%" height={48} sx={{ mt: 3, borderRadius: 2 }} />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default PackagesSkeleton;