import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AdminLayout from '../../components/PowerGym/Layout/AdminLayout';
import DashboardOverview from './Tabs/Overview/DashboardOverview.tsx';
import MembersTable from './Tabs/Members/MembersTable.tsx';
import TrainersGrid from './Tabs/Trainer/TrainersGrid.tsx';
import AdminStoriesManagement from './Tabs/Stories/AdminStoriesManagement.tsx';
import ServicesManagement from './Tabs/Service/ServicesManagement.tsx';
import MembershipPackagesPage from './Tabs/MembershipPackages/MembershipPackagesPage.tsx';

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Tab Components - Defined outside to avoid re-creation on each render
const DashboardTab: React.FC = () => <DashboardOverview formatCurrency={formatCurrency} />;
const MembersTab: React.FC = () => <MembersTable />;
const TrainersTab: React.FC = () => <TrainersGrid />;
const StoriesTab: React.FC = () => <AdminStoriesManagement />;
const ServicesTab: React.FC = () => <ServicesManagement />;
const MembershipTab: React.FC = () => <MembershipPackagesPage />;

const EquipmentTab: React.FC = () => (
  <Box>
    <Typography variant="h5" fontWeight={600} mb={2}>Equipment Management</Typography>
    <Typography color="text.secondary">Coming Soon</Typography>
  </Box>
);

const FinancialTab: React.FC = () => (
  <Box>
    <Typography variant="h5" fontWeight={600} mb={2}>Financial Reports</Typography>
    <Typography color="text.secondary">Coming Soon</Typography>
  </Box>
);

const SettingsTab: React.FC = () => (
  <Box>
    <Typography variant="h5" fontWeight={600} mb={2}>System Settings</Typography>
    <Typography color="text.secondary">Coming Soon</Typography>
  </Box>
);

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
  };

  const tabComponents = [
    <DashboardTab key="dashboard" />,
    <MembersTab key="members" />,
    <TrainersTab key="trainers" />,
    <StoriesTab key="stories" />,
    <ServicesTab key="services" />,
    <EquipmentTab key="equipment" />,
    <MembershipTab key="membership" />,
    <FinancialTab key="financial" />,
    <SettingsTab key="settings" />
  ];

  return (
    <AdminLayout activeTab={activeTab} onTabChange={handleTabChange}>
      <Box sx={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        p: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        minHeight: '500px'
      }}>
        {tabComponents[activeTab]}
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard;