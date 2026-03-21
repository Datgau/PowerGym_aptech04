import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Stack
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Info, Build } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { gymServiceApi, type GymServiceDto } from '../../../../services/gymService.ts';
import ServiceFormModal from './ServiceFormModal.tsx';
import DeleteConfirmModal from '../DeleteConfirmModal.tsx';
import ServiceRegistrationsModal from './ServiceRegistrationsModal.tsx';
import AdminServiceDetailModal from './AdminServiceDetailModal.tsx';
import { useWebSocket } from '../../../../hooks/useWebSocket.ts';
import { getAccessToken } from '../../../../services/authStorage.ts';
import TablePagination from '../../../../components/Common/TablePagination.tsx';
import { usePagination } from '../../../../hooks/usePagination.ts';
import RichTextDisplay from '../../../../components/Common/RichTextDisplay.tsx';

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

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<GymServiceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRegistrations, setOpenRegistrations] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedService, setSelectedService] = useState<GymServiceDto | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(5);

  // Listen to WebSocket for real-time updates
  const { lastMessage } = useWebSocket({
    topics: ['/topic/service_registration'],
    autoConnect: true,
  });

  useEffect(() => {
    if (lastMessage?.action === 'REGISTERED') {
      loadData(paginationState.page, paginationState.rowsPerPage);
    }
  }, [lastMessage, paginationState.page, paginationState.rowsPerPage]);

  useEffect(() => {
    loadData(paginationState.page, paginationState.rowsPerPage);
  }, [paginationState.page, paginationState.rowsPerPage]);

  const loadData = async (page: number = 0, size: number = 10) => {
    try {
      setLoading(true);
      const response = await gymServiceApi.getAllServices(page, size);
      
      if (response.success) {
        const pageData = response.data;
        setServices(pageData.content);
        setPaginationData(pageData.totalPages, pageData.totalElements);
      }
    } catch (err: any) {
      setError(err.message || 'Data not found');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedService(null);
    setFormMode('create');
    setOpenForm(true);
  };

  const handleOpenEdit = (service: GymServiceDto) => {
    setSelectedService(service);
    setFormMode('edit');
    setOpenForm(true);
  };

  const handleOpenDelete = (service: GymServiceDto) => {
    setSelectedService(service);
    setOpenDelete(true);
  };

  const handleOpenRegistrations = (service: GymServiceDto) => {
    setSelectedService(service);
    setOpenRegistrations(true);
  };

  const handleOpenDetail = (service: GymServiceDto) => {
    setSelectedService(service);
    setOpenDetail(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      const token = getAccessToken();

      if (!token) {
        console.error('No token found! User needs to log in.');
        setError('Your session has expired. Please log in again.');
        return;
      }

      if (formMode === 'create') {
        await gymServiceApi.createService(data);
      } else if (selectedService) {
        await gymServiceApi.updateService(parseInt(String(selectedService.id)), data);
      }

      await loadData(paginationState.page, paginationState.rowsPerPage);
      setOpenForm(false);

    } catch (err: any) {
      console.error('Submit error:', err);

      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Unable to save the service.');
      }
    }
  };

  const handleDelete = async () => {
    if (selectedService) {
      try {
        await gymServiceApi.deleteService(parseInt(String(selectedService.id)));
        await loadData(paginationState.page, paginationState.rowsPerPage);
      } catch (err: any) {
        console.error('Delete error:', err);
        const errorMessage =
            err.response?.data?.message || 'Unable to delete the service';
        setError(errorMessage);
        throw err;
      }
    }
  };
  const getCategoryColor = (category: any) => {
    let categoryName = '';
    if (typeof category === 'string') {
      categoryName = category;
    } else if (category && typeof category === 'object') {
      categoryName = category.name;
    }
    
    const colors: Record<string, any> = {
      PERSONAL_TRAINER: 'primary',
      BOXING: 'error',
      YOGA: 'success',
      CARDIO: 'warning',
      OTHER: 'default'
    };
    return colors[categoryName] || 'default';
  };

  if (loading) {
    return (
      <PageWrapper display="flex" justifyContent="center" alignItems="center" minHeight={360}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
          <Typography color="text.secondary" fontSize={14}>Loading services...</Typography>
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
            <Build sx={{ fontSize: 22 }} />
          </HeaderIconBox>
          <Box>
            <Typography fontWeight={700} fontSize={20} color="#0f172a" lineHeight={1.3}>
              Service Management
            </Typography>
            <Typography fontSize={13.5} color="#64748b" mt={0.3}>
              Manage gym services and registrations
            </Typography>
          </Box>
        </HeaderLeft>
        <AddButton variant="contained" startIcon={<Add sx={{ fontSize: 18 }} />} onClick={handleOpenCreate}>
          Add Service
        </AddButton>
      </HeaderSection>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontSize: 13.5 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <ContentSection>
        <TableContainer component={Paper} sx={{ 
          overflowX: 'auto',
          borderRadius: 3,
          border: '1px solid #eaeef8',
          boxShadow: 'none'
        }}>
          <Table sx={{ minWidth: { xs: 650, md: 750 } }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8faff' }}>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Service</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Category</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, display: { xs: 'none', sm: 'table-cell' }, fontWeight: 600, color: '#0f172a' }}>Price</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, display: { xs: 'none', md: 'table-cell' }, fontWeight: 600, color: '#0f172a' }}>Duration</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Registrations</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Status</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                  <TableRow key={service.id} hover sx={{ '&:hover': { backgroundColor: '#f8faff' } }}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            src={service.images?.[0]}
                            sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }}
                            variant="rounded"
                        >
                          {service.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                            {service.name}
                          </Typography>
                          <Box sx={{ maxWidth: 300 }}>
                            <RichTextDisplay
                                content={service.description || ''}
                                maxLines={2}
                                variant="body2"
                            />
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                          label={service.category?.name}
                          color={getCategoryColor(service.category)}
                          size="small"
                          sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' } }}
                      />
                    </TableCell>

                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                      {service.price?.toLocaleString('en-US')} $
                    </TableCell>

                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                      {service.duration} days
                    </TableCell>

                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                            label={service.registrationCount || 0}
                            color="info"
                            size="small"
                            sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' }, fontWeight: 600 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          users
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                          label={service.isActive ? 'Active' : 'Inactive'}
                          color={service.isActive ? 'success' : 'default'}
                          size="small"
                          sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' } }}
                      />
                    </TableCell>

                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        <IconButton
                            size="small"
                            onClick={() => handleOpenDetail(service)}
                            title="View Service Details"
                            sx={{
                              color: '#0066ff',
                              '&:hover': { backgroundColor: 'rgba(0,102,255,0.1)' }
                            }}
                        >
                          <Info fontSize="small" />
                        </IconButton>

                        <IconButton
                            size="small"
                            onClick={() => handleOpenRegistrations(service)}
                            title="View Registrations"
                            sx={{
                              color: '#0066ff',
                              '&:hover': { backgroundColor: 'rgba(0,102,255,0.1)' }
                            }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>

                        <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(service)}
                            title="Edit Service"
                            sx={{
                              color: '#0066ff',
                              '&:hover': { backgroundColor: 'rgba(0,102,255,0.1)' }
                            }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>

                        <IconButton
                            size="small"
                            onClick={() => handleOpenDelete(service)}
                            title="Delete Service"
                            sx={{
                              color: '#ef4444',
                              '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' }
                            }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={3}>
          <TablePagination
            count={paginationState.totalElements}
            page={paginationState.page}
            rowsPerPage={paginationState.rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Services per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} services`
            }
          />
        </Box>

        {services.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              No services found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Create your first service to get started
            </Typography>
            <AddButton variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
              Add Service
            </AddButton>
          </Box>
        )}
      </ContentSection>

      <ServiceFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        service={selectedService}
        mode={formMode}
      />

      <DeleteConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${selectedService?.name}"? This service cannot be deleted if it has active subscriptions.`}
      />

      <ServiceRegistrationsModal
        open={openRegistrations}
        onClose={() => setOpenRegistrations(false)}
        service={selectedService}
      />

      <AdminServiceDetailModal
        open={openDetail}
        service={selectedService}
        onClose={() => {
          setOpenDetail(false);
          setSelectedService(null);
        }}
        onEdit={(service) => {
          setOpenDetail(false);
          handleOpenEdit(service);
        }}
      />
    </PageWrapper>
  );
};

export default ServicesManagement;
