import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import DashboardOverview from './Tabs/Overview/DashboardOverview.tsx';
import MembersTable from './Tabs/Members/MembersTable.tsx';
import StaffTable from './Tabs/Staff/StaffTable.tsx';
import TrainersGrid from './Tabs/Trainer/TrainersGrid.tsx';
import ServiceCategoryGrid from './Tabs/ServiceCategory/ServiceCategoryGrid.tsx';
import AdminStoriesManagement from './Tabs/Stories/AdminStoriesManagement.tsx';
import ServicesManagement from './Tabs/Services/ServicesManagement.tsx';
import ServiceRegistrationsGrid from './Tabs/ServiceRegistrations/ServiceRegistrationsGrid.tsx';
import MembershipPackagesPage from './Tabs/MembershipPackages/MembershipPackagesPage.tsx';
import PromotionsPage from './Tabs/Promotions/PromotionsPage.tsx';
import RewardsPage from './Tabs/Rewards/RewardsPage.tsx';
import AdminLayout from "../../components/PowerGym/Layout/AdminLayout.tsx";

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
const StaffTab: React.FC = () => <StaffTable />;
const TrainersTab: React.FC = () => <TrainersGrid />;
const CategoriesTab: React.FC = () => <ServiceCategoryGrid />;
const ServicesTab: React.FC = () => <ServicesManagement />;
const ServiceRegistrationsTab: React.FC = () => <ServiceRegistrationsGrid />;
const StoriesTab: React.FC = () => <AdminStoriesManagement />;
const MembershipTab: React.FC = () => <MembershipPackagesPage />;
const PromotionsTab: React.FC = () => <PromotionsPage />;
const RewardsTab: React.FC = () => <RewardsPage />;

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
    <StaffTab key="staff" />,
    <TrainersTab key="trainers" />,
    <CategoriesTab key="categories" />,
    <ServicesTab key="services" />,
    <ServiceRegistrationsTab key="service-registrations" />,
    <StoriesTab key="stories" />,
    <MembershipTab key="membership" />,
    <PromotionsTab key="promotions" />,
    <RewardsTab key="rewards" />,
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