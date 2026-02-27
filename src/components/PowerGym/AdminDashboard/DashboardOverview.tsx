import React from 'react';
import { Box, Grid } from '@mui/material';
import { People, MonetizationOn, PersonAdd, FitnessCenter } from '@mui/icons-material';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import ExpensesPieChart from './ExpensesPieChart';
import { adminMockData } from '../../../data/adminMockData';

const COLORS = ['#00b4ff', '#0066ff', '#ff5026', '#4caf50', '#ff9800', '#9c27b0'];

interface DashboardOverviewProps {
  formatCurrency: (amount: number) => string;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ formatCurrency }) => {
  const statsData = [
    {
      value: adminMockData.stats.totalMembers,
      label: 'Total Members',
      icon: <People sx={{ fontSize: 50 }} />,
      gradient: 'linear-gradient(135deg, #00b4ff, #0066ff)',
      hoverColor: 'rgba(0,180,255,0.4)'
    },
    {
      value: formatCurrency(adminMockData.stats.monthlyRevenue),
      label: 'Monthly Revenue',
      icon: <MonetizationOn sx={{ fontSize: 50 }} />,
      gradient: 'linear-gradient(135deg, #4caf50, #2e7d32)',
      hoverColor: 'rgba(76,175,80,0.4)'
    },
    {
      value: adminMockData.stats.newMembersThisMonth,
      label: 'New Members',
      icon: <PersonAdd sx={{ fontSize: 50 }} />,
      gradient: 'linear-gradient(135deg, #ff9800, #f57c00)',
      hoverColor: 'rgba(255,152,0,0.4)'
    },
    {
      value: adminMockData.stats.trainersCount,
      label: 'Trainers',
      icon: <FitnessCenter sx={{ fontSize: 50 }} />,
      gradient: 'linear-gradient(135deg, #9c27b0, #7b1fa2)',
      hoverColor: 'rgba(156,39,176,0.4)'
    }
  ];

  return (
    <Box>
      {/* Stats Cards - 4 columns */}
      <Box sx={{ mb: 4 }}>
        <Grid 
          container 
          spacing={3}
        >
          {statsData.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }} key={index}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Charts - Two charts side by side, each 50% width, centered */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: 3,
        flexWrap: 'wrap'
      }}>
        {/* Revenue Chart - 50% width */}
        <Box sx={{ 
          width: { xs: '100%', lg: 'calc(50% - 12px)' },
          minWidth: { xs: '100%', lg: '500px' }
        }}>
          <RevenueChart
            data={adminMockData.financial.monthlyRevenue}
            formatCurrency={formatCurrency}
          />
        </Box>

        {/* Expenses Pie Chart - 50% width */}
        <Box sx={{ 
          width: { xs: '100%', lg: 'calc(50% - 12px)' },
          minWidth: { xs: '100%', lg: '500px' }
        }}>
          <ExpensesPieChart
            data={adminMockData.financial.expenses}
            colors={COLORS}
            formatCurrency={formatCurrency}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardOverview;
