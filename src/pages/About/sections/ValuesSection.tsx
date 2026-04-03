import React from 'react';
import { Box, Container, Typography, Zoom } from '@mui/material';
import { TOKEN } from '../constants';
import SectionLabel from '../components/SectionLabel';
import ValueCard from '../components/ValueCard';
import type { ValueItem } from '../types';

interface ValuesSectionProps {
  show: boolean;
  values: ValueItem[];
}

const ValuesSection: React.FC<ValuesSectionProps> = ({ show, values }) => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <SectionLabel>Our Principles</SectionLabel>
        <Typography
          variant="h2"
          sx={{
            fontFamily: TOKEN.fontDisplay,
            fontWeight: 800,
            fontSize: { xs: '2rem', md: '3rem' },
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            mt: 2,
          }}
        >
            What We Stand For
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {values.map((v, i) => (
          <Box key={i} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <Zoom in={show} timeout={900 + i * 150}>
              <Box>
                <ValueCard value={v} />
              </Box>
            </Zoom>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default ValuesSection;
