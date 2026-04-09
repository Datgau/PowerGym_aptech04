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
import ProductList from './Tabs/Products/ProductList.tsx';
import ImportReceiptList from './Tabs/ImportReceipts/ImportReceiptList.tsx';
import { OrderList } from './Tabs/Orders';
import InventoryDashboard from './Tabs/Dashboard/InventoryDashboard.tsx';
import FinancialPage from './Tabs/Financial/FinancialPage.tsx';

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
const ProductsTab: React.FC = () => <ProductList />;
const ImportReceiptsTab: React.FC = () => <ImportReceiptList />;
const OrdersTab: React.FC = () => <OrderList />;
const InventoryDashboardTab: React.FC = () => <InventoryDashboard />;
const FinancialTab: React.FC = () => <FinancialPage />;

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
    <DashboardTab key="dashboard" />,              // 0 - Overview
    <InventoryDashboardTab key="inventory-dashboard" />, // 1 - Inventory Dashboard
    <MembersTab key="members" />,                  // 2 - Members
    <StaffTab key="staff" />,                      // 3 - Staff
    <TrainersTab key="trainers" />,                // 4 - Trainers
    <CategoriesTab key="categories" />,            // 5 - Categories
    <ServicesTab key="services" />,                // 6 - Services
    <ServiceRegistrationsTab key="service-registrations" />, // 7 - Service Registrations
    <MembershipTab key="membership" />,            // 8 - Membership
    <ProductsTab key="products" />,                // 9 - Products
    <ImportReceiptsTab key="import-receipts" />,   // 10 - Import Receipts
    <OrdersTab key="orders" />,                    // 11 - Orders
    <FinancialTab key="financial" />,              // 12 - Financial
    <StoriesTab key="stories" />,                  // 13 - Stories
    <PromotionsTab key="promotions" />,            // 14 - Promotions
    <RewardsTab key="rewards" />,                  // 15 - Rewards
    <SettingsTab key="settings" />                 // 16 - Settings
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