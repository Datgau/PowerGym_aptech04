import React from 'react';
import { Box, Container } from '@mui/material';
import { TOKEN } from '../constants';
import StatItem from '../components/StatItem';
import type { StatItemData } from '../types';

interface StatisticsSectionProps {
  stats: StatItemData[];
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ stats }) => {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, background: TOKEN.gradientSurface }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {stats.map((s) => (
            <Box key={s.label} sx={{ flex: { xs: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 12px)' } }}>
              <StatItem value={s.value} label={s.label} suffix={s.suffix} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default StatisticsSection;
