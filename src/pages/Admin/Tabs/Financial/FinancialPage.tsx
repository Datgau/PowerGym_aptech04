import React from 'react';
import { Box, Typography } from '@mui/material';
import { Assessment } from '@mui/icons-material';
import {
  PageWrapper,
  HeaderSection,
  HeaderLeft,
  HeaderIconBox,
  ContentSection,
} from '../shared/StyledComponents';

const FinancialPage: React.FC = () => {
  return (
    <PageWrapper>
      {/* Header */}
      <HeaderSection>
        <HeaderLeft>
          <HeaderIconBox>
            <Assessment sx={{ fontSize: 22 }} />
          </HeaderIconBox>
          <Box>
            <Typography fontWeight={700} fontSize={20} color="#0f172a" lineHeight={1.3}>
              Financial Reports
            </Typography>
            <Typography fontSize={13.5} color="#64748b" mt={0.3}>
              View revenue, expenses, and financial analytics
            </Typography>
          </Box>
        </HeaderLeft>
      </HeaderSection>

      {/* Content */}
      <ContentSection>
        <Box textAlign="center" py={8}>
          <Assessment sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={1}>
            Financial Reports Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This feature is under development
          </Typography>
        </Box>
      </ContentSection>
    </PageWrapper>
  );
};

export default FinancialPage;
