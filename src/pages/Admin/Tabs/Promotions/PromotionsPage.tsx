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
  LocalOffer
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import type { Promotion } from '../../../../@type/reward';
import PromotionFormModal from './PromotionFormModal';
import DeleteConfirmModal from '../DeleteConfirmModal';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';
import {promotionService} from "../../../../services/promotionService.ts";

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
  background: 'linear-gradient(135deg, #ff6b6b22, #ee5a6f22)',
  border: '1px solid #ff6b6b33',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ff6b6b',
});

const AddButton = styled(Button)({
  background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 14,
  padding: '10px 22px',
  color: '#fff',
  boxShadow: '0 4px 16px rgba(255,107,107,0.28)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #ff7b7b, #ff6a7f)',
    boxShadow: '0 6px 24px rgba(255,107,107,0.38)',
    transform: 'translateY(-1px)',
  },
});

const ContentSection = styled(Box)({
  background: '#ffffff',
  borderRadius: 20,
  border: '1px solid #eaeef8',
  padding: '24px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
});

const PromotionsPage: React.FC = () => {
  const [allPromotions, setAllPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
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
  } = usePagination(6);

  const promotions = React.useMemo(() => {
    const startIndex = paginationState.page * paginationState.rowsPerPage;
    const endIndex = startIndex + paginationState.rowsPerPage;
    return allPromotions.slice(startIndex, endIndex);
  }, [allPromotions, paginationState.page, paginationState.rowsPerPage]);

  React.useEffect(() => {
    const totalPages = Math.ceil(allPromotions.length / paginationState.rowsPerPage);
    setPaginationData(totalPages, allPromotions.length);
  }, [allPromotions.length, paginationState.rowsPerPage, setPaginationData]);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await promotionService.getAllPromotions();
      setAllPromotions(data);
    } catch (error: any) {
      console.error('Load promotions error:', error);
      showNotification(error.response?.data?.message || 'Failed to load promotions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  const handleCreate = () => {
    setSelectedPromotion(null);
    setFormOpen(true);
  };

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setFormOpen(true);
  };

  const handleDeleteClick = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPromotion) return;

    try {
      await promotionService.deletePromotion(selectedPromotion.id);
      showNotification('Promotion deleted successfully', 'success');
      loadPromotions();
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to delete promotion', 'error');
    } finally {
      setDeleteOpen(false);
      setSelectedPromotion(null);
    }
  };

  const handleFormSubmit = async () => {
    setFormOpen(false);
    await loadPromotions();
    showNotification(
      selectedPromotion ? 'Promotion updated successfully' : 'Promotion created successfully',
      'success'
    );
  };

  if (loading) {
    return (
      <PageWrapper display="flex" justifyContent="center" alignItems="center" minHeight={360}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={40} thickness={3} sx={{ color: '#ff6b6b' }} />
          <Typography color="text.secondary" fontSize={14}>Loading promotions...</Typography>
        </Stack>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <HeaderSection>
        <HeaderLeft>
          <HeaderIconBox>
            <LocalOffer sx={{ fontSize: 22 }} />
          </HeaderIconBox>
          <Box>
            <Typography fontWeight={700} fontSize={20} color="#0f172a" lineHeight={1.3}>
              Promotions
            </Typography>
            <Typography fontSize={13.5} color="#64748b" mt={0.3}>
              Manage discount codes and promotional offers
            </Typography>
          </Box>
        </HeaderLeft>
        <AddButton variant="contained" startIcon={<Add sx={{ fontSize: 18 }} />} onClick={handleCreate}>
          Create Promotion
        </AddButton>
      </HeaderSection>

      <ContentSection>
        {promotions.length > 0 ? (
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
              {promotions.map((promo) => (
                <Card
                  key={promo.id}
                  elevation={0}
                  sx={{
                    border: promo.isFeatured ? '2px solid #FFD700' : '1.5px solid #ebebeb',
                    borderRadius: '16px',
                    position: 'relative',
                    overflow: 'visible',
                    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                    '&:hover': {
                      boxShadow: promo.isFeatured
                        ? '0 12px 40px rgba(255, 215, 0, 0.2)'
                        : '0 12px 40px rgba(0, 0, 0, 0.08)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
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
                    <Chip
                      label={promo.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        height: 24,
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        ...(promo.isActive
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
                    {promo.isFeatured && (
                      <Chip
                        icon={<Star sx={{ fontSize: '14px !important', color: '#000 !important' }} />}
                        label="FEATURED"
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                          color: '#000',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: 24,
                          borderRadius: '6px',
                        }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        bgcolor: '#fff5f5',
                        borderRadius: '8px',
                        px: 1.5,
                        py: 0.5,
                        mb: 1.5,
                        border: '1px dashed #ff6b6b',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: '#ff6b6b',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {promo.code}
                      </Typography>
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: '#111',
                        mb: 0.75,
                      }}
                    >
                      {promo.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#888',
                        fontSize: '0.825rem',
                        lineHeight: 1.55,
                        mb: 2,
                        minHeight: 36,
                      }}
                    >
                      {promo.description || 'No description'}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          Type:
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {promo.type === 'PERCENTAGE_DISCOUNT' ? 'Percentage' : 'Fixed Amount'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          Discount:
                        </Typography>
                        <Typography variant="caption" fontWeight={600} color="#ff6b6b">
                          {promo.type === 'PERCENTAGE_DISCOUNT'
                            ? `${promo.discountPercentage}%`
                            : `${promo.discountAmount?.toLocaleString('vi-VN')}đ`}
                        </Typography>
                      </Box>
                      {promo.usageLimit && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            Usage:
                          </Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {promo.usageCount}/{promo.usageLimit}
                          </Typography>
                        </Box>
                      )}
                    </Box>

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
                        onClick={() => handleEdit(promo)}
                        sx={{
                          color: '#1976d2',
                          bgcolor: '#f0f6ff',
                          borderRadius: '8px',
                          width: 34,
                          height: 34,
                          '&:hover': { bgcolor: '#dbeaff' },
                        }}
                      >
                        <Edit sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(promo)}
                        sx={{
                          color: '#d32f2f',
                          bgcolor: '#fff5f5',
                          borderRadius: '8px',
                          width: 34,
                          height: 34,
                          '&:hover': { bgcolor: '#ffd6d6' },
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
              />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 12,
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
                background: 'linear-gradient(135deg, #ffe8e8, #ffd6d6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Add sx={{ fontSize: 28, color: '#ff6b6b' }} />
            </Box>
            <Typography variant="h6" sx={{ color: '#555', fontWeight: 600, mb: 0.5 }}>
              No promotions yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#aaa', mb: 3 }}>
              Create your first promotion to get started.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleCreate}
              sx={{
                borderColor: '#ff6b6b',
                color: '#ff6b6b',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: '#fff5f5', borderColor: '#ff5555' },
              }}
            >
              Create Promotion
            </Button>
          </Box>
        )}
      </ContentSection>

      <PromotionFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        promotion={selectedPromotion}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Promotion"
        message={`Are you sure you want to delete "${selectedPromotion?.code}"? This action cannot be undone.`}
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

export default PromotionsPage;
