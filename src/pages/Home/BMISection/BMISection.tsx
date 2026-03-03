import React from 'react';
import { Box, Container } from '@mui/material';
import BMICalculator from './BMICalculator.tsx';
import BMIChart from './BMIChart.tsx';

const BMISection: React.FC = () => {
  return (
    <Box 
      component="section" 
      sx={{
        py: { xs: 6, md: 8 },
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        zIndex: 1,
        width: '100%'
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 3, md: 4 },
            alignItems: 'stretch',
            minHeight: { xs: 'auto', md: '400px' }
          }}
        >
          {/* BMI Calculator - Bên trái */}
          <Box 
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <BMICalculator />
          </Box>

          {/* BMI Chart - Bên phải */}
          <Box 
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <BMIChart />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BMISection;