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

const ServicesTable: React.FC = () => {
  const [services, setServices] = useState<GymServiceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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
    // TODO: Implement view service details
    console.log('View service:', service);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
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
                      <Typography variant="body2" color="text.secondary">
                        {service.description.length > 50 
                          ? service.description.slice(0, 50) + '...'
                          : service.description
                        }
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={service.category} 
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
          <Typography color="text.secondary">Không có service nào</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ServicesTable;