import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Star
} from '@mui/icons-material';
import membershipPackageService from '../../../../services/membershipPackageService';
import type { MembershipPackageResponse } from '../../../../services/membershipPackageService';
import PackageFormModal from './PackageFormModal.tsx';
import DeleteConfirmModal from '../DeleteConfirmModal';
import styles from './MembershipPackagesPage.module.css';

const MembershipPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<MembershipPackageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<MembershipPackageResponse | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await membershipPackageService.getAllPackages();
      setPackages(data);
    } catch (error: any) {
      console.error('Load packages error:', error);
      
      // Extract detailed error message
      let errorMessage = 'Failed to load packages';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Log full error for debugging
      console.error('Full error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  const handleCreate = () => {
    setSelectedPackage(null);
    setFormOpen(true);
  };

  const handleEdit = (pkg: MembershipPackageResponse) => {
    setSelectedPackage(pkg);
    setFormOpen(true);
  };

  const handleDeleteClick = (pkg: MembershipPackageResponse) => {
    setSelectedPackage(pkg);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPackage) return;

    try {
      await membershipPackageService.deletePackage(selectedPackage.id);
      showNotification('Package deleted successfully', 'success');
      loadPackages();
    } catch (error: any) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete package';
      showNotification(errorMessage, 'error');
    } finally {
      setDeleteOpen(false);
      setSelectedPackage(null);
    }
  };

  const handleFormSubmit = async () => {
    setFormOpen(false);
    await loadPackages();
    showNotification(
      selectedPackage ? 'Package updated successfully' : 'Package created successfully',
      'success'
    );
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading packages...</Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          Membership Packages
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          sx={{
            background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
          }}
        >
          Create Package
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
        {packages.map((pkg) => (
          <Box key={pkg.id} sx={{ flex: '1 1 calc(33.333% - 24px)', minWidth: '300px' }}>
            <Card
              className={styles.packageCard}
              sx={{
                border: pkg.isPopular ? '2px solid #FFD700' : '1px solid #e0e0e0',
                position: 'relative'
              }}
            >
              {pkg.isPopular && (
                <Chip
                  icon={<Star />}
                  label="POPULAR"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#000',
                    fontWeight: 700
                  }}
                />
              )}

              <CardContent>
                <Typography variant="h5" className={styles.packageName}>
                  {pkg.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {pkg.description || 'No description'}
                </Typography>

                <Box className={styles.priceSection}>
                  {pkg.originalPrice && (
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: 'line-through',
                        color: '#999',
                        mr: 1
                      }}
                    >
                      {pkg.originalPrice.toLocaleString('vi-VN')}đ
                    </Typography>
                  )}
                  <Typography
                    variant="h4"
                    sx={{
                      color: pkg.color || '#1976d2',
                      fontWeight: 700
                    }}
                  >
                    {pkg.price.toLocaleString('vi-VN')}đ
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Duration: {pkg.duration} days
                </Typography>

                <Box className={styles.featuresSection}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Features:
                  </Typography>
                  <Box className={styles.featuresList}>
                    {pkg.features.slice(0, 3).map((feature, index) => (
                      <Typography key={index} variant="body2" className={styles.featureItem}>
                        • {feature}
                      </Typography>
                    ))}
                    {pkg.features.length > 3 && (
                      <Typography variant="body2" color="text.secondary">
                        +{pkg.features.length - 3} more...
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box className={styles.actions}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(pkg)}
                    sx={{ color: '#1976d2' }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(pkg)}
                    sx={{ color: '#d32f2f' }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {packages.length === 0 && (
        <Box className={styles.emptyState}>
          <Typography variant="h6" color="text.secondary">
            No packages found. Create your first package!
          </Typography>
        </Box>
      )}

      <PackageFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        package={selectedPackage}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Package"
        message={`Are you sure you want to delete "${selectedPackage?.name}"? This action cannot be undone.`}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MembershipPackagesPage;
