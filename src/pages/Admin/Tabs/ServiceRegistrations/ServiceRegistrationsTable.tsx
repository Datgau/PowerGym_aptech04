import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import { 
  getAllRegistrations, 
  cancelRegistration,
  type ServiceRegistrationResponse 
} from '../../../../services/serviceRegistrationService';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';

const ServiceRegistrationsTable: React.FC = () => {
  const [registrations, setRegistrations] = useState<ServiceRegistrationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
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
      const response = await getAllRegistrations(page, size);

      if (response.success) {
        const pageData = response.data;
        setRegistrations(pageData.content);
        setPaginationData(pageData.totalPages, pageData.totalElements);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load registrations");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (registrationId: number) => {
    try {
      const response = await cancelRegistration(registrationId);
      if (response.success) {
        await loadData(paginationState.page, paginationState.rowsPerPage);
      }
    } catch (err) {
      setError('Failed to cancel registration');
    }
  };

  const handleFilterChange = (_event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
    if (newFilter !== null) {
      setStatusFilter(newFilter);
    }
  };

  const filteredRegistrations = statusFilter === 'ALL'
    ? registrations 
    : registrations.filter(r => r.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'COMPLETED':
        return 'info';
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
          Service Registrations Management
        </Typography>
      </Box>

      <Box mb={2}>
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={handleFilterChange}
          size="small"
        >
          <ToggleButton value="ALL">
            Tất cả ({registrations.length})
          </ToggleButton>
          <ToggleButton value="ACTIVE">
            Active ({registrations.filter(r => r.status === 'ACTIVE').length})
          </ToggleButton>
          <ToggleButton value="CANCELLED">
            Cancelled ({registrations.filter(r => r.status === 'CANCELLED').length})
          </ToggleButton>
          <ToggleButton value="COMPLETED">
            Completed ({registrations.filter(r => r.status === 'COMPLETED').length})
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRegistrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {registration.user.fullName?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>
                        {registration.user.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {registration.user.email}
                      </Typography>
                      {registration.user.phoneNumber && (
                        <Typography variant="body2" color="text.secondary">
                          {registration.user.phoneNumber}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography fontWeight={600}>
                      {registration.service.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.category?.displayName || service.category?.name || 'Unknown'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {registration.service.price.toLocaleString()} VNĐ
                </TableCell>
                <TableCell>
                  {new Date(registration.registrationDate).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={registration.status} 
                    color={getStatusColor(registration.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {registration.notes || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5}>
                    <IconButton size="small">
                      <Visibility fontSize="small" />
                    </IconButton>
                    {registration.status === 'ACTIVE' && (
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleCancel(registration.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
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

      {filteredRegistrations.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">Không có registration nào</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ServiceRegistrationsTable;