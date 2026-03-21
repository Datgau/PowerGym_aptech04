import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Chip,
  Avatar
} from '@mui/material';
import { Email, Phone, CalendarToday } from '@mui/icons-material';
import { getServiceRegistrationsLegacy, type ServiceRegistrationResponse } from '../../../../services/serviceRegistrationService.ts';
import type { GymServiceDto } from '../../../../services/gymService.ts';

interface ServiceRegistrationsModalProps {
  open: boolean;
  onClose: () => void;
  service: GymServiceDto | null;
}

const ServiceRegistrationsModal: React.FC<ServiceRegistrationsModalProps> = ({
  open,
  onClose,
  service
}) => {
  const [registrations, setRegistrations] = useState<ServiceRegistrationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && service) {
      loadRegistrations();
    }
  }, [open, service]);

  const loadRegistrations = async () => {
    if (!service) return;
    try {
      setLoading(true);
      setError('');
      const response = await getServiceRegistrationsLegacy(parseInt(service.id));

      if (response.success) {
        setRegistrations(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Data not found');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'COMPLETED':
        return 'info';
      case 'EXPIRED':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'CANCELLED':
        return 'Cancelled';
      case 'COMPLETED':
        return 'Completed';
      case 'EXPIRED':
        return 'Expried';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
      <Dialog
          open={open}
          onClose={onClose}
          maxWidth="xl"
          fullWidth
          slotProps={{
            paper: {
              sx: { borderRadius: 3 }
            }
          }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem', borderBottom: '1px solid #e0e0e0' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
                src={service?.images?.[0]}
                sx={{ width: 48, height: 48 }}
                variant="rounded"
            >
              {service?.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {service?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Registrations
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
          )}

          {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
              </Box>
          ) : registrations.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  No users have registered for this service yet
                </Typography>
              </Box>
          ) : (
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Registration Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Expiration Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {registrations.map((registration) => (
                        <TableRow key={registration.id} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1.5}>
                              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                                {registration.user.fullName.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography fontWeight={600} fontSize="0.95rem">
                                  {registration.user.fullName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {registration.user.id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <Email fontSize="small" color="action" />
                              <Typography variant="body2">
                                {registration.user.email}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell>
                            {registration.user.phoneNumber ? (
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <Phone fontSize="small" color="action" />
                                  <Typography variant="body2">
                                    {registration.user.phoneNumber}
                                  </Typography>
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                  N/A
                                </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <CalendarToday fontSize="small" color="action" />
                              <Typography variant="body2">
                                {formatDate(registration.registrationDate)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <CalendarToday fontSize="small" color="action" />
                              <Typography variant="body2">
                                {registration.expirationDate ? formatDate(registration.expirationDate) : 'N/A'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                                label={getStatusLabel(registration.status)}
                                color={getStatusColor(registration.status)}
                                size="small"
                            />
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
          )}

          {registrations.length > 0 && (
              <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Total Registrations: {registrations.length} users
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Members: {registrations.filter(r => r.status === 'ACTIVE').length}
                </Typography>
              </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
  );
};


export default ServiceRegistrationsModal;
