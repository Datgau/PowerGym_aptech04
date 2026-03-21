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
  CircularProgress,
  Stack
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Star,
  CardMembership
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import membershipPackageService from '../../../../services/membershipPackageService';
import type { MembershipPackageResponse } from '../../../../services/membershipPackageService';
import PackageFormModal from './PackageFormModal.tsx';
import DeleteConfirmModal from '../DeleteConfirmModal';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';

/* ─── Styled Components ─────────────────────────────────── */

const PageWrapper = styled(Box)({
  minHeight: '100%',
  background: '#f8faff',
  padding: '32px',
});

const HeaderSection = styled(Box)({
  background: '#ffffff',
  borderRadius: 20,
  border: '1px solid #eaeef8',
  padding: '28px 32px',
  marginBottom: 28,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
});

const HeaderLeft = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
});

const HeaderIconBox = styled(Box)({
  width: 48,
  height: 48,
  borderRadius: 14,
  background: 'linear-gradient(135deg, #00b4ff22, #0066ff22)',
  border: '1px solid #0066ff33',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#0066ff',
});

const AddButton = styled(Button)({
  background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 14,
  padding: '10px 22px',
  color: '#fff',
  boxShadow: '0 4px 16px rgba(0,102,255,0.28)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #00c6ff, #0077ff)',
    boxShadow: '0 6px 24px rgba(0,102,255,0.38)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 8px rgba(0,102,255,0.3)',
  },
});

const ContentSection = styled(Box)({
  background: '#ffffff',
  borderRadius: 20,
  border: '1px solid #eaeef8',
  padding: '24px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
});

const MembershipPackagesPage: React.FC = () => {
  const [allPackages, setAllPackages] = useState<MembershipPackageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<MembershipPackageResponse | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(6); // 6 packages per page for grid layout

  // Client-side pagination
  const packages = React.useMemo(() => {
    const startIndex = paginationState.page * paginationState.rowsPerPage;
    const endIndex = startIndex + paginationState.rowsPerPage;
    return allPackages.slice(startIndex, endIndex);
  }, [allPackages, paginationState.page, paginationState.rowsPerPage]);

  // Update pagination data when packages change
  React.useEffect(() => {
    const totalPages = Math.ceil(allPackages.length / paginationState.rowsPerPage);
    setPaginationData(totalPages, allPackages.length);
  }, [allPackages.length, paginationState.rowsPerPage, setPaginationData]);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await membershipPackageService.getAllPackages();
      setAllPackages(data);
    } catch (error: any) {
      console.error('Load packages error:', error);

      let errorMessage = 'Failed to load packages';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

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
        <PageWrapper display="flex" justifyContent="center" alignItems="center" minHeight={360}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
            <Typography color="text.secondary" fontSize={14}>Loading packages...</Typography>
          </Stack>
        </PageWrapper>
    );
  }

  return (
      <PageWrapper>
        {/* Header */}
        <HeaderSection>
          <HeaderLeft>
            <HeaderIconBox>
              <CardMembership sx={{ fontSize: 22 }} />
            </HeaderIconBox>
            <Box>
              <Typography fontWeight={700} fontSize={20} color="#0f172a" lineHeight={1.3}>
                Membership Packages
              </Typography>
              <Typography fontSize={13.5} color="#64748b" mt={0.3}>
                Manage gym membership packages and pricing
              </Typography>
            </Box>
          </HeaderLeft>
          <AddButton variant="contained" startIcon={<Add sx={{ fontSize: 18 }} />} onClick={handleCreate}>
            Create Package
          </AddButton>
        </HeaderSection>

        {/* Package Grid */}
        <ContentSection>
          {packages.length > 0 ? (
            <>
              <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)',
                    },
                    gap: 3,
                    mb: 4,
                  }}
              >
                {packages.map((pkg) => (
                    <Card
                        key={pkg.id}
                        elevation={0}
                        sx={{
                          border: pkg.isPopular
                              ? '2px solid #FFD700'
                              : '1.5px solid #ebebeb',
                          borderRadius: '16px',
                          position: 'relative',
                          overflow: 'visible',
                          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                          '&:hover': {
                            boxShadow: pkg.isPopular
                                ? '0 12px 40px rgba(255, 215, 0, 0.2)'
                                : '0 12px 40px rgba(0, 0, 0, 0.08)',
                            transform: 'translateY(-3px)',
                          },
                        }}
                    >
                      {/* Top-right badges: Status + Popular */}
                      <Box
                          sx={{
                            position: 'absolute',
                            top: -12,
                            right: 16,
                            display: 'flex',
                            gap: 0.75,
                            alignItems: 'center',
                          }}
                      >
                        {/* Status Chip */}
                        <Chip
                            label={pkg.isActive ? 'Active' : 'Inactive'}
                            size="small"
                            sx={{
                              height: 24,
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.65rem',
                              letterSpacing: '0.06em',
                              ...(pkg.isActive
                                  ? {
                                    bgcolor: '#e6f9f0',
                                    color: '#1a9e5c',
                                    border: '1px solid #a3e6c5',
                                  }
                                  : {
                                    bgcolor: '#f5f5f5',
                                    color: '#999',
                                    border: '1px solid #e0e0e0',
                                  }),
                            }}
                        />

                        {/* Popular Chip */}
                        {pkg.isPopular && (
                            <Chip
                                icon={<Star sx={{ fontSize: '14px !important', color: '#000 !important' }} />}
                                label="POPULAR"
                                size="small"
                                sx={{
                                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                  color: '#000',
                                  fontWeight: 700,
                                  fontSize: '0.65rem',
                                  letterSpacing: '0.08em',
                                  height: 24,
                                  borderRadius: '6px',
                                  boxShadow: '0 2px 8px rgba(255, 165, 0, 0.4)',
                                }}
                            />
                        )}
                      </Box>

                      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                        {/* Package Name */}
                        <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              fontSize: '1.1rem',
                              color: '#111',
                              mb: 0.75,
                              letterSpacing: '-0.01em',
                            }}
                        >
                          {pkg.name}
                        </Typography>

                        {/* Description */}
                        <Typography
                            variant="body2"
                            sx={{
                              color: '#888',
                              fontSize: '0.825rem',
                              lineHeight: 1.55,
                              mb: 2.5,
                              minHeight: 36,
                            }}
                        >
                          {pkg.description || 'No description'}
                        </Typography>

                        {/* Price Section */}
                        <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'baseline',
                              gap: 1,
                              mb: 0.5,
                            }}
                        >
                          {pkg.originalPrice && (
                              <Typography
                                  variant="body2"
                                  sx={{
                                    textDecoration: 'line-through',
                                    color: '#bbb',
                                    fontSize: '0.85rem',
                                  }}
                              >
                                {pkg.originalPrice.toLocaleString('vi-VN')}đ
                              </Typography>
                          )}
                          <Typography
                              variant="h5"
                              sx={{
                                color: pkg.color || '#1976d2',
                                fontWeight: 800,
                                fontSize: '1.5rem',
                                letterSpacing: '-0.02em',
                              }}
                          >
                            {pkg.price.toLocaleString('vi-VN')}đ
                          </Typography>
                        </Box>

                        {/* Duration */}
                        <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              bgcolor: '#f5f7ff',
                              borderRadius: '6px',
                              px: 1.25,
                              py: 0.4,
                              mb: 2.5,
                            }}
                        >
                          <Typography
                              variant="caption"
                              sx={{ color: '#555', fontWeight: 600, fontSize: '0.75rem' }}
                          >
                            {pkg.duration} days
                          </Typography>
                        </Box>

                        {/* Divider */}
                        <Box sx={{ borderTop: '1px solid #f2f2f2', mb: 2 }} />

                        {/* Features */}
                        <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              fontWeight: 700,
                              color: '#444',
                              mb: 1,
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              fontSize: '0.7rem',
                            }}
                        >
                          Features
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, mb: 2.5 }}>
                          {pkg.features.slice(0, 3).map((feature, index) => (
                              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                    sx={{
                                      width: 5,
                                      height: 5,
                                      borderRadius: '50%',
                                      bgcolor: pkg.color || '#1976d2',
                                      flexShrink: 0,
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#555', fontSize: '0.82rem', lineHeight: 1.4 }}
                                >
                                  {feature}
                                </Typography>
                              </Box>
                          ))}
                          {pkg.features.length > 3 && (
                              <Typography
                                  variant="caption"
                                  sx={{ color: '#aaa', pl: 2, fontStyle: 'italic' }}
                              >
                                +{pkg.features.length - 3} more features
                              </Typography>
                          )}
                        </Box>

                        {/* Action Buttons */}
                        <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              gap: 0.5,
                              borderTop: '1px solid #f2f2f2',
                              pt: 2,
                            }}
                        >
                          <IconButton
                              size="small"
                              onClick={() => handleEdit(pkg)}
                              sx={{
                                color: '#1976d2',
                                bgcolor: '#f0f6ff',
                                borderRadius: '8px',
                                width: 34,
                                height: 34,
                                '&:hover': {
                                  bgcolor: '#dbeaff',
                                  transform: 'scale(1.05)',
                                },
                                transition: 'all 0.15s ease',
                              }}
                          >
                            <Edit sx={{ fontSize: 16 }} />
                          </IconButton>
                          <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(pkg)}
                              sx={{
                                color: '#d32f2f',
                                bgcolor: '#fff5f5',
                                borderRadius: '8px',
                                width: 34,
                                height: 34,
                                '&:hover': {
                                  bgcolor: '#ffd6d6',
                                  transform: 'scale(1.05)',
                                },
                                transition: 'all 0.15s ease',
                              }}
                          >
                            <Delete sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                ))}
              </Box>

              <Box mt={3}>
                <TablePagination
                  count={paginationState.totalElements}
                  page={paginationState.page}
                  rowsPerPage={paginationState.rowsPerPage}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[6, 12, 18, 24]}
                  labelRowsPerPage="Packages per page:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} packages`
                  }
                />
              </Box>
            </>
          ) : (
            /* Empty State */
            <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 12,
                  px: 4,
                  borderRadius: '16px',
                  border: '2px dashed #e8e8e8',
                  bgcolor: '#fafafa',
                }}
            >
              <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #e8f4ff, #dbeaff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
              >
                <Add sx={{ fontSize: 28, color: '#0066ff' }} />
              </Box>
              <Typography
                  variant="h6"
                  sx={{ color: '#555', fontWeight: 600, mb: 0.5 }}
              >
                No packages yet
              </Typography>
              <Typography
                  variant="body2"
                  sx={{ color: '#aaa', mb: 3 }}
              >
                Create your first membership package to get started.
              </Typography>
              <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleCreate}
                  sx={{
                    borderColor: '#0066ff',
                    color: '#0066ff',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#f0f6ff', borderColor: '#0055dd' },
                  }}
              >
                Create Package
              </Button>
            </Box>
          )}
        </ContentSection>

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
      </PageWrapper>
  );
};

export default MembershipPackagesPage;