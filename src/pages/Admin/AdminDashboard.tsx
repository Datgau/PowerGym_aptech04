import React, { useState } from 'react';
import { Box } from '@mui/material';
import UnifiedDashboard from './Tabs/Dashboard/UnifiedDashboard.tsx';
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
import AdminLayout from '../../components/PowerGym/Layout/AdminLayout.tsx';
import ProductList from './Tabs/Products/ProductList.tsx';
import ImportReceiptList from './Tabs/ImportReceipts/ImportReceiptList.tsx';
import { OrderList } from './Tabs/Orders';
import Settings from './Tabs/Settings/Settings.tsx';

// Tab Components
const DashboardTab: React.FC = () => <UnifiedDashboard />;
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

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [settingsInitialTab, setSettingsInitialTab] = useState(0);

  const handleTabChange = (newValue: number, settingsTab?: number) => {
    setActiveTab(newValue);
    if (settingsTab !== undefined) {
      setSettingsInitialTab(settingsTab);
    }
  };

  const SettingsTab: React.FC = () => <Settings initialTab={settingsInitialTab} />;

  const tabComponents = [
    <DashboardTab key="dashboard" />,                                        // 0
    <MembersTab key="members" />,                                            // 1
    <StaffTab key="staff" />,                                                // 2
    <TrainersTab key="trainers" />,                                          // 3
    <CategoriesTab key="categories" />,                                      // 4
    <ServicesTab key="services" />,                                          // 5
    <ServiceRegistrationsTab key="service-registrations" />,                 // 6
    <MembershipTab key="membership" />,                                      // 7
    <ProductsTab key="products" />,                                          // 8
    <ImportReceiptsTab key="import-receipts" />,                             // 9
    <OrdersTab key="orders" />,                                              // 10
    <StoriesTab key="stories" />,                                            // 11
    <PromotionsTab key="promotions" />,                                      // 12
    <RewardsTab key="rewards" />,                                            // 13
    <SettingsTab key="settings" />,                                          // 14
  ];

  return (
    <AdminLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {tabComponents[activeTab]}
    </AdminLayout>
  );
};

export default AdminDashboard;
