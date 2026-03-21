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
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Avatar,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { gymServiceApi, type GymServiceDto } from '../../../../services/gymService';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';
import RichTextDisplay from '../../../../components/Common/RichTextDisplay';
import AdminServiceDetailModal from './AdminServiceDetailModal';

const ServicesTable: React.FC = () => {
  const [services, setServices] = useState<GymServiceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState<GymServiceDto | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(10);

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load services");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    // TODO: Implement create service modal
    console.log('Create service');
  };

  const handleEdit = (service: GymServiceDto) => {
    // TODO: Implement edit service modal
    console.log('Edit service:', service);
  };

  const handleDelete = (service: GymServiceDto) => {
    // TODO: Implement delete confirmation
    console.log('Delete service:', service);
  };

  const handleView = (service: GymServiceDto) => {
    setSelectedService(service);
    setDetailModalOpen(true);
  };

  const getCategoryColor = (category: any) => {
    // Handle both old string format and new object format
    let categoryName = '';
    if (typeof category === 'string') {
      categoryName = category;
    } else if (category && typeof category === 'object') {
      categoryName = category.name || category.displayName || '';
    }

    switch (categoryName) {
      case 'PERSONAL_TRAINER':
        return 'primary';
      case 'BOXING':
        return 'error';
      case 'YOGA':
        return 'success';
      case 'CARDIO':
        return 'warning';
      default:
        return 'default';
    }
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

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Services Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          sx={{ 
            background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
          }}
        >
          Add Service
        </Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Max Participants</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar 
                      src={service.images?.[0]} 
                      sx={{ width: 40, height: 40 }}
                      variant="rounded"
                    >
                      {service.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>
                        {service.name}
                      </Typography>
                      <Box sx={{ maxWidth: 300 }}>
                        <RichTextDisplay 
                          content={service.description}
                          maxLines={2}
                          variant="body2"
                        />
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={service.category?.displayName || service.category?.name || 'Unknown'} 
                    color={getCategoryColor(service.category) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {service.price.toLocaleString()} VNĐ
                </TableCell>
                <TableCell>
                  {service.duration ? `${service.duration} phút` : '-'}
                </TableCell>
                <TableCell>
                  {service.maxParticipants || 'Unlimited'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={service.isActive ? 'Active' : 'Inactive'} 
                    color={service.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5}>
                    <IconButton size="small" onClick={() => handleView(service)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEdit(service)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(service)}>
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
          <Typography color="text.secondary">No services available</Typography>
        </Box>
      )}

      <AdminServiceDetailModal
        open={detailModalOpen}
        service={selectedService}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedService(null);
        }}
        onEdit={(service) => {
          setDetailModalOpen(false);
          // TODO: Implement edit functionality
          console.log('Edit service:', service);
        }}
      />
    </Box>
  );
};

export default ServicesTable;