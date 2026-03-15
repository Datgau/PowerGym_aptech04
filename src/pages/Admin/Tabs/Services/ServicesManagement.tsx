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
  Avatar
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Info } from '@mui/icons-material';
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
  } = usePagination(10);

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
        await gymServiceApi.updateService(parseInt(selectedService.id), data);
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
        await gymServiceApi.deleteService(parseInt(selectedService.id));
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

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      PERSONAL_TRAINER: 'Personal Trainer',
      BOXING: 'Boxing',
      YOGA: 'Yoga',
      CARDIO: 'Cardio',
      OTHER: 'Khác'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, any> = {
      PERSONAL_TRAINER: 'primary',
      BOXING: 'error',
      YOGA: 'success',
      CARDIO: 'warning',
      OTHER: 'default'
    };
    return colors[category] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
          Service Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreate}
          sx={{ 
            background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          Add Service
        </Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: { xs: 650, md: 750 } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Service</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Category</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, display: { xs: 'none', sm: 'table-cell' } }}>Price</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, display: { xs: 'none', md: 'table-cell' } }}>Duration</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Registrations</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Status</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
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
                    label={getCategoryLabel(service.category)} 
                    color={getCategoryColor(service.category)}
                    size="small"
                    sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' } }}
                  />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                  {service.price?.toLocaleString('vi-VN')} VNĐ
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                  {service.duration} phút
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
                      người
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
                    <IconButton size="small" onClick={() => handleOpenDetail(service)} title="View Service Details">
                      <Info fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleOpenRegistrations(service)} title="View Registrations">
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleOpenEdit(service)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleOpenDelete(service)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        count={paginationState.totalElements}
        page={paginationState.page}
        rowsPerPage={paginationState.rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {services.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">Chưa có service nào</Typography>
        </Box>
      )}

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
        title="Xóa Service"
        message={`Bạn có chắc chắn muốn xóa service "${selectedService?.name}"? Service có người đăng ký sẽ không thể xóa.`}
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
    </Box>
  );
};

export default ServicesManagement;
