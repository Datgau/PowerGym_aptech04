import React from 'react';
import {
  Box, Card, CardContent, Typography, Alert, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip
} from '@mui/material';
import { PendingActions } from '@mui/icons-material';
import type { TrainerBookingInfo } from '../../../../../../services/trainerManagementService';
import SectionHeader from './SectionHeader';
import { sectionCard } from '../constants';
import { formatTime } from '../helpers';

interface Props {
  loading: boolean;
  pendingRequests: TrainerBookingInfo[];
}

const getStatusChip = (status?: string) => {
  switch (status) {
    case 'PENDING':
      return <Chip label="Pending" color="warning" size="small" />;
    case 'CONFIRMED':
      return <Chip label="Confirmed" color="success" size="small" />;
    case 'REJECTED':
      return <Chip label="Rejected" color="error" size="small" />;
    case 'COMPLETED':
      return <Chip label="Completed" color="primary" size="small" />;
    default:
      return <Chip label="Unknown" size="small" />;
  }
};

const getPaymentStatusChip = (paymentStatus?: string) => {
  switch (paymentStatus) {
    case 'PAID':
      return <Chip label="Paid" color="success" size="small" />;
    case 'UNPAID':
      return <Chip label="Unpaid" color="error" size="small" />;
    case 'PENDING':
      return <Chip label="Pending" color="warning" size="small" />;
    case 'REFUNDED':
      return <Chip label="Refunded" color="info" size="small" />;
    default:
      return <Chip label="Unknown" size="small" />;
  }
};

const PendingRequestsTab: React.FC<Props> = ({ loading, pendingRequests }) => {
  if (loading) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
    );
  }

  return (
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        <Card sx={sectionCard}>
          <CardContent sx={{ p: 3 }}>
            <SectionHeader
                icon={<PendingActions />}
                title="Pending Booking Requests"
                count={pendingRequests.length}
            />

            {pendingRequests.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Booking Code</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>Service</TableCell>
                        <TableCell>Date & Time</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Payment Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingRequests.map((request) => (
                          <TableRow key={request.bookingId} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {request.bookingId || 'N/A'}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography variant="body2">
                                {request.clientName || 'Unknown Client'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {request.clientEmail || 'No email'}
                              </Typography>
                              {request.clientPhone && (
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    {request.clientPhone}
                                  </Typography>
                              )}
                            </TableCell>

                            <TableCell>
                              <Typography variant="body2">
                                {request.serviceName || 'Unknown Service'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {request.serviceCategory || 'Unknown Category'}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {request.startTime ? formatTime(request.startTime) : 'N/A'} -{' '}
                                {request.endTime ? formatTime(request.endTime) : 'N/A'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {request.bookingDate
                                  ? new Date(request.bookingDate).toLocaleDateString('vi-VN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
                                  : 'N/A'}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {request.createdAt
                                    ? new Date(request.createdAt).toLocaleDateString('vi-VN', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                    : 'N/A'}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              {getStatusChip(request.status)}
                            </TableCell>

                            <TableCell>
                              {getPaymentStatusChip(request.paymentStatus)}
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            ) : (
                <Alert severity="info">No pending booking requests</Alert>
            )}
          </CardContent>
        </Card>
      </Box>
  );
};

export default PendingRequestsTab;