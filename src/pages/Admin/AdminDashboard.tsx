import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AdminLayout from '../../components/PowerGym/Layout/AdminLayout';
import DashboardOverview from '../../components/PowerGym/AdminDashboard/DashboardOverview';
import MembersTable from '../../components/PowerGym/AdminDashboard/MembersTable';
import TrainersGrid from '../../components/PowerGym/AdminDashboard/TrainersGrid';
import PendingStories from '../../components/PowerGym/AdminDashboard/PendingStories';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Tab Components
  const DashboardTab = () => <DashboardOverview formatCurrency={formatCurrency} />;
  const MembersTab = () => <MembersTable />;
  const TrainersTab = () => <TrainersGrid />;
  const StoriesTab = () => <PendingStories />;

  // Placeholder tabs
  const EquipmentTab = () => (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={2}>Equipment Management</Typography>
      <Typography color="text.secondary">Coming Soon</Typography>
    </Box>
  );
  
  const ServicesTab = () => (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={2}>Services Management</Typography>
      <Typography color="text.secondary">Coming Soon</Typography>
    </Box>
  );
  
  const MembershipTab = () => (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={2}>Membership Packages</Typography>
      <Typography color="text.secondary">Coming Soon</Typography>
    </Box>
  );
  
  const FinancialTab = () => (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={2}>Financial Reports</Typography>
      <Typography color="text.secondary">Coming Soon</Typography>
    </Box>
  );
  
  const SettingsTab = () => (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={2}>System Settings</Typography>
      <Typography color="text.secondary">Coming Soon</Typography>
    </Box>
  );

  const tabComponents = [
    <DashboardTab />,
    <MembersTab />,
    <TrainersTab />,
    <StoriesTab />,
    <EquipmentTab />,
    <ServicesTab />,
    <MembershipTab />,
    <FinancialTab />,
    <SettingsTab />
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