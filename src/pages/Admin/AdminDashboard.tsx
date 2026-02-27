import React, { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import AdminLayout from '../../components/PowerGym/Layout/AdminLayout';
import DashboardOverview from '../../components/PowerGym/AdminDashboard/DashboardOverview';
import MembersTable from '../../components/PowerGym/AdminDashboard/MembersTable';
import TrainersGrid from '../../components/PowerGym/AdminDashboard/TrainersGrid';
import PendingStories from '../../components/PowerGym/AdminDashboard/PendingStories';
import { adminMockData } from '../../data/adminMockData';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type: 'add' | 'edit' | 'view', item?: any) => {
    setDialogType(type);
    setSelectedItem(item || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Tab Components
  const DashboardTab = () => <DashboardOverview formatCurrency={formatCurrency} />;
  
  const MembersTab = () => (
    <MembersTable 
      members={adminMockData.members}
      onOpenDialog={handleOpenDialog}
    />
  );
  
  const TrainersTab = () => (
    <TrainersGrid 
      trainers={adminMockData.trainers}
      onOpenDialog={handleOpenDialog}
    />
  );

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

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e0e0e0',
          fontWeight: 600,
          fontSize: '1.25rem'
        }}>
          {dialogType === 'add' && 'Add New'}
          {dialogType === 'edit' && 'Edit'}
          {dialogType === 'view' && 'View Details'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>
            Dialog content for {dialogType} - {selectedItem?.name || 'New Item'}
          </Typography>
          {/* Add form fields based on dialogType and selectedItem */}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          {dialogType !== 'view' && (
            <Button 
              variant="contained" 
              onClick={handleCloseDialog}
              sx={{ 
                textTransform: 'none',
                background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0099dd, #0055dd)'
                }
              }}
            >
              {dialogType === 'add' ? 'Add' : 'Save'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDashboard;