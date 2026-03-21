import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Stack,
  Tooltip,
  Avatar,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ToggleOn,
  ToggleOff,
  Category,
  GridView,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
  getAllServiceCategoriesNoPaging,
  toggleServiceCategoryStatus,
  deleteServiceCategory,
  type ServiceCategoryResponse
} from '../../../../services/serviceCategoryService';
import CreateServiceCategoryModal from './CreateServiceCategoryModal';
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

const StatsBar = styled(Box)({
  display: 'flex',
  gap: 12,
  marginBottom: 24,
});

const StatPill = styled(Box)({
  background: '#ffffff',
  border: '1px solid #eaeef8',
  borderRadius: 12,
  padding: '10px 18px',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  flex: 1,
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
});

const StyledCard = styled(Card)({
  borderRadius: 18,
  border: '1px solid #eaeef8',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  background: '#ffffff',
  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
  overflow: 'visible',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    borderColor: '#0066ff40',
    boxShadow: '0 8px 32px rgba(0,102,255,0.1)',
    transform: 'translateY(-3px)',
  },
});

const CardTopAccent = styled(Box)<{ color?: string }>(({ color }) => ({
  position: 'absolute',
  top: 0,
  left: 24,
  right: 24,
  height: 3,
  borderRadius: '0 0 6px 6px',
  background: color || 'linear-gradient(90deg, #00b4ff, #0066ff)',
  opacity: 0.7,
}));

const CategoryAvatar = styled(Avatar)<{ categorycolor?: string }>(({ categorycolor }) => ({
  width: 44,
  height: 44,
  borderRadius: 13,
  background: categorycolor ? `${categorycolor}18` : 'linear-gradient(135deg, #00b4ff18, #0066ff18)',
  border: `1.5px solid ${categorycolor ? categorycolor + '40' : '#0066ff30'}`,
  color: categorycolor || '#0066ff',
  fontSize: 20,
  flexShrink: 0,
}));

const ActionButton = styled(IconButton)<{ actiontype?: 'toggle-on' | 'toggle-off' | 'edit' | 'delete' }>(({ actiontype }) => {
  const styles: Record<string, { color: string; hoverBg: string }> = {
    'toggle-on':  { color: '#22c55e', hoverBg: '#f0fdf4' },
    'toggle-off': { color: '#94a3b8', hoverBg: '#f1f5f9' },
    'edit':       { color: '#0066ff', hoverBg: '#eff6ff' },
    'delete':     { color: '#ef4444', hoverBg: '#fff5f5' },
  };
  const s = styles[actiontype || 'edit'];
  return {
    width: 34,
    height: 34,
    borderRadius: 9,
    color: s.color,
    border: `1px solid ${s.color}22`,
    '&:hover': {
      background: s.hoverBg,
      borderColor: `${s.color}55`,
      transform: 'scale(1.08)',
    },
    transition: 'all 0.15s ease',
  };
});

const StatusChip = styled(Chip)<{ active?: string }>(({ active }) => ({
  height: 24,
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 7,
  flexShrink: 0,
  ...(active === 'true'
      ? { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }
      : { background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }),
}));

const EmptyStateCard = styled(Box)({
  background: '#ffffff',
  borderRadius: 20,
  border: '1.5px dashed #d1daf5',
  padding: '64px 32px',
  textAlign: 'center',
});

/* ─── Component ─────────────────────────────────────────── */

const ServiceCategoryGrid: React.FC = () => {
  const [allCategories, setAllCategories] = useState<ServiceCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(6);

  // Filter categories based on status
  const filteredCategories = statusFilter === 'ALL' 
    ? allCategories 
    : allCategories.filter(c => statusFilter === 'ACTIVE' ? c.isActive : !c.isActive);

  // Client-side pagination
  const categories = React.useMemo(() => {
    const startIndex = paginationState.page * paginationState.rowsPerPage;
    const endIndex = startIndex + paginationState.rowsPerPage;
    return filteredCategories.slice(startIndex, endIndex);
  }, [filteredCategories, paginationState.page, paginationState.rowsPerPage]);

  // Update pagination data when filtered categories change
  React.useEffect(() => {
    const totalPages = Math.ceil(filteredCategories.length / paginationState.rowsPerPage);
    setPaginationData(totalPages, filteredCategories.length);
  }, [filteredCategories.length, paginationState.rowsPerPage, setPaginationData]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllServiceCategoriesNoPaging();
      if (response.success) {
        setAllCategories(response.data.sort((a, b) => a.displayName.localeCompare(b.displayName)));
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load service categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await toggleServiceCategoryStatus(id);
      if (response.success) await loadCategories();
      else setError(response.message);
    } catch (err: any) {
      setError(err.message || 'Failed to toggle category status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this service category?')) return;
    try {
      const response = await deleteServiceCategory(id);
      if (response.success) await loadCategories();
      else setError(response.message);
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    }
  };

  const handleFilterChange = (_event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
    if (newFilter !== null) {
      setStatusFilter(newFilter);
    }
  };

  const activeCount   = allCategories.filter(c => c.isActive).length;
  const inactiveCount = allCategories.length - activeCount;

  if (loading) {
    return (
        <PageWrapper display="flex" justifyContent="center" alignItems="center" minHeight={360}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
            <Typography color="text.secondary" fontSize={14}>Loading service categories...</Typography>
          </Stack>
        </PageWrapper>
    );
  }

  return (
      <PageWrapper>
        {/* ── Header ── */}
        <HeaderSection>
          <HeaderLeft>
            <HeaderIconBox>
              <GridView sx={{ fontSize: 22 }} />
            </HeaderIconBox>
            <Box>
              <Typography fontWeight={700} fontSize={20} color="#0f172a" lineHeight={1.3}>
                Service Categories
              </Typography>
              <Typography fontSize={13.5} color="#64748b" mt={0.3}>
                Manage gym service categories and specialties
              </Typography>
            </Box>
          </HeaderLeft>
          <AddButton variant="contained" startIcon={<Add sx={{ fontSize: 18 }} />} onClick={() => setCreateModalOpen(true)}>
            Add Category
          </AddButton>
        </HeaderSection>

        {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontSize: 13.5 }} onClose={() => setError('')}>
              {error}
            </Alert>
        )}

        {/* ── Stats Bar ── */}
        {allCategories.length > 0 && (
            <StatsBar>
              <StatPill>
                <Box sx={{ width: 32, height: 32, borderRadius: '9px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GridView sx={{ fontSize: 16, color: '#0066ff' }} />
                </Box>
                <Box>
                  <Typography fontSize={11} color="#94a3b8" fontWeight={500} lineHeight={1}>Total</Typography>
                  <Typography fontSize={18} fontWeight={700} color="#0f172a">{allCategories.length}</Typography>
                </Box>
              </StatPill>
              <StatPill>
                <Box sx={{ width: 32, height: 32, borderRadius: '9px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ToggleOn sx={{ fontSize: 16, color: '#22c55e' }} />
                </Box>
                <Box>
                  <Typography fontSize={11} color="#94a3b8" fontWeight={500} lineHeight={1}>Active</Typography>
                  <Typography fontSize={18} fontWeight={700} color="#16a34a">{activeCount}</Typography>
                </Box>
              </StatPill>
              <StatPill>
                <Box sx={{ width: 32, height: 32, borderRadius: '9px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ToggleOff sx={{ fontSize: 16, color: '#94a3b8' }} />
                </Box>
                <Box>
                  <Typography fontSize={11} color="#94a3b8" fontWeight={500} lineHeight={1}>Inactive</Typography>
                  <Typography fontSize={18} fontWeight={700} color="#64748b">{inactiveCount}</Typography>
                </Box>
              </StatPill>
            </StatsBar>
        )}

        {/* ── Filter Bar ── */}
        {allCategories.length > 0 && (
          <Box mb={3}>
            <ToggleButtonGroup
              value={statusFilter}
              exclusive
              onChange={handleFilterChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#0066ff',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#0052cc',
                    },
                  },
                },
              }}
            >
              <ToggleButton sx={{mr:2}} value="ALL">
                All ({allCategories.length})
              </ToggleButton>
              <ToggleButton sx={{mr:2}} value="ACTIVE">
                Active ({activeCount})
              </ToggleButton>
              <ToggleButton sx={{mr:2}} value="INACTIVE">
                Inactive ({inactiveCount})
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {/* ── Grid ── */}
        {categories.length > 0 ? (
          <>
            <Grid container spacing={2.5}>
              {categories.map((category) => (
                  <Grid
                      item
                      xs={12} sm={6} md={4}
                      key={category.id}
                      sx={{ display: 'flex' }}
                  >
                    <StyledCard elevation={0} sx={{ width: '100%' }}>
                      <CardTopAccent color={category.color} />

                      <CardContent sx={{
                        p: '24px',
                        pt: '28px',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        '&:last-child': { pb: '20px' },
                      }}>
                        <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                          <CategoryAvatar categorycolor={category.color}>
                            {category.icon
                                ? <span className="material-icons" style={{ fontSize: 20 }}>{category.icon}</span>
                                : <Category sx={{ fontSize: 20 }} />
                            }
                          </CategoryAvatar>

                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                                fontWeight={700}
                                fontSize={15}
                                color="#0f172a"
                                lineHeight={1.3}
                                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            >
                              {category.displayName}
                            </Typography>
                            <Typography
                                fontSize={12}
                                color="#94a3b8"
                                fontWeight={500}
                                mt={0.25}
                                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            >
                              {category.name}
                            </Typography>
                          </Box>

                          <StatusChip
                              size="small"
                              label={category.isActive ? 'Active' : 'Inactive'}
                              active={String(category.isActive)}
                          />
                        </Stack>

                        {/* Zone 2 — Description: chiều cao CỨNG 44px, clamp 2 dòng, không bao giờ làm phình card */}
                        <Box sx={{ height: 44, overflow: 'hidden', mb: 2 }}>
                          <Typography
                              fontSize={13.5}
                              color={category.description ? '#64748b' : '#cbd5e1'}
                              fontStyle={category.description ? 'normal' : 'italic'}
                              lineHeight={1.57}
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                          >
                            {category.description || 'No description'}
                          </Typography>
                        </Box>

                        {/* Zone 3 — Actions: mt:auto đẩy xuống đáy */}
                        <Box sx={{ mt: 'auto' }}>
                          <Divider sx={{ borderColor: '#f1f5f9', mb: 1.5 }} />
                          <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                            <Tooltip title={category.isActive ? 'Deactivate' : 'Activate'} arrow>
                              <ActionButton
                                  size="small"
                                  actiontype={category.isActive ? 'toggle-on' : 'toggle-off'}
                                  onClick={() => handleToggleStatus(category.id)}
                              >
                                {category.isActive
                                    ? <ToggleOn sx={{ fontSize: 18 }} />
                                    : <ToggleOff sx={{ fontSize: 18 }} />
                                }
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Edit" arrow>
                              <ActionButton size="small" actiontype="edit">
                                <Edit sx={{ fontSize: 16 }} />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                              <ActionButton
                                  size="small"
                                  actiontype="delete"
                                  onClick={() => handleDelete(category.id)}
                              >
                                <Delete sx={{ fontSize: 16 }} />
                              </ActionButton>
                            </Tooltip>
                          </Stack>
                        </Box>

                      </CardContent>
                    </StyledCard>
                  </Grid>
              ))}
            </Grid>

            <Box mt={3}>
              <TablePagination
                count={paginationState.totalElements}
                page={paginationState.page}
                rowsPerPage={paginationState.rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[6, 12, 18, 24]}
                labelRowsPerPage="Categories per page:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} categories`
                }
              />
            </Box>
          </>
        ) : filteredCategories.length === 0 && allCategories.length > 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              No categories found for "{statusFilter.toLowerCase()}" filter
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => setStatusFilter('ALL')}
              sx={{ borderRadius: 2 }}
            >
              Show All Categories
            </Button>
          </Box>
        ) : null}

        {/* ── Empty State ── */}
        {allCategories.length === 0 && !loading && (
            <EmptyStateCard>
              <Box sx={{
                width: 72, height: 72, borderRadius: 20,
                background: 'linear-gradient(135deg, #00b4ff18, #0066ff18)',
                border: '1.5px solid #0066ff20',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', mx: 'auto', mb: 3,
              }}>
                <Category sx={{ fontSize: 34, color: '#0066ff' }} />
              </Box>
              <Typography fontWeight={700} fontSize={18} color="#0f172a" gutterBottom>
                No service categories yet
              </Typography>
              <Typography color="#94a3b8" fontSize={14} mb={4}>
                Create your first service category to get started
              </Typography>
              <AddButton variant="contained" startIcon={<Add />} onClick={() => setCreateModalOpen(true)}>
                Add Category
              </AddButton>
            </EmptyStateCard>
        )}

        {/* ── Create Modal ── */}
        <CreateServiceCategoryModal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSuccess={() => {
              setCreateModalOpen(false);
              loadCategories();
            }}
        />
      </PageWrapper>
  );
};

export default ServiceCategoryGrid;