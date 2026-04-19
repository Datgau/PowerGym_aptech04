import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Alert, CircularProgress,
  Chip, Stack, Divider, Collapse, IconButton, Avatar
} from '@mui/material';
import { 
  PendingActions, Person, CalendarToday, AccessTime, 
  Payment, ExpandMore, ExpandLess, ErrorOutline, CheckCircle
} from '@mui/icons-material';
import type { TrainerBookingInfo } from '../../../../../../services/trainerManagementService';
import SectionHeader from './SectionHeader';
import { sectionCard } from '../constants';
import { formatTime } from '../helpers';

interface Props {
  loading: boolean;
  pendingRequests: TrainerBookingInfo[];
}

interface BookingCardProps {
  request: TrainerBookingInfo;
}

const getStatusChip = (status?: string) => {
  switch (status) {
    case 'PENDING':
      return <Chip label="Pending" color="warning" size="small" sx={{ fontWeight: 600 }} />;
    case 'CONFIRMED':
      return <Chip label="Confirmed" color="success" size="small" icon={<CheckCircle />} sx={{ fontWeight: 600 }} />;
    case 'REJECTED':
      return <Chip label="Rejected" color="error" size="small" icon={<ErrorOutline />} sx={{ fontWeight: 600 }} />;
    case 'COMPLETED':
      return <Chip label="Completed" color="primary" size="small" sx={{ fontWeight: 600 }} />;
    default:
      return <Chip label="Unknown" size="small" />;
  }
};

const getPaymentStatusChip = (paymentStatus?: string) => {
  switch (paymentStatus) {
    case 'PAID':
      return <Chip label="Paid" color="success" size="small" variant="outlined" />;
    case 'UNPAID':
      return <Chip label="Unpaid" color="error" size="small" variant="outlined" />;
    case 'PENDING':
      return <Chip label="Pending" color="warning" size="small" variant="outlined" />;
    case 'REFUNDED':
      return <Chip label="Refunded" color="info" size="small" variant="outlined" />;
    default:
      return <Chip label="Unknown" size="small" variant="outlined" />;
  }
};

const BookingCard: React.FC<BookingCardProps> = ({ request }) => {
  const [expanded, setExpanded] = useState(false);
  const isRejected = request.status === 'REJECTED';

  return (
    <Card 
      sx={{ 
        mb: 2,
        border: '1px solid',
        borderColor: isRejected ? 'error.light' : 'divider',
        bgcolor: isRejected ? 'error.lighter' : 'background.paper',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 3,
          transform: { xs: 'none', md: 'translateY(-2px)' }
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        {/* Mobile Layout */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          {/* Header: Client + Status */}
          <Stack direction="row" spacing={1.5} alignItems="flex-start" justifyContent="space-between" mb={2}>
            <Stack direction="row" spacing={1.5} alignItems="center" flex={1}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                <Person />
              </Avatar>
              <Box flex={1} minWidth={0}>
                <Typography variant="body2" fontWeight={700} noWrap>
                  {request.clientName || 'Unknown'}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" noWrap>
                  {request.clientEmail}
                </Typography>
                {request.clientPhone && (
                  <Typography variant="caption" color="text.secondary">
                    {request.clientPhone}
                  </Typography>
                )}
              </Box>
            </Stack>
            
            <Stack spacing={0.5} alignItems="flex-end">
              {getStatusChip(request.status)}
              {isRejected && request.rejectionReason && (
                <IconButton 
                  size="small" 
                  onClick={() => setExpanded(!expanded)}
                  sx={{ 
                    bgcolor: 'error.main', 
                    color: 'white',
                    width: 32,
                    height: 32,
                    '&:hover': { bgcolor: 'error.dark' }
                  }}
                >
                  {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </IconButton>
              )}
            </Stack>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* Service Info */}
          <Box mb={1.5}>
            <Typography variant="body2" fontWeight={600} color="primary.main">
              {request.serviceName || 'Unknown Service'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {request.serviceCategory}
            </Typography>
          </Box>

          {/* Date & Time */}
          <Stack spacing={1} mb={1.5}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption">
                {request.bookingDate
                  ? new Date(request.bookingDate).toLocaleDateString('vi-VN', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })
                  : 'N/A'}
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" fontWeight={600}>
                {request.startTime ? formatTime(request.startTime) : 'N/A'} - {request.endTime ? formatTime(request.endTime) : 'N/A'}
              </Typography>
            </Stack>
          </Stack>

          {/* Payment & Code */}
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Payment sx={{ fontSize: 14, color: 'text.secondary' }} />
              {getPaymentStatusChip(request.paymentStatus)}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Code: <strong>{request.bookingId || 'N/A'}</strong>
            </Typography>
          </Stack>
        </Box>

        {/* Desktop Layout */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'flex-start' }}>
          {/* Left: Client Info */}
          <Box sx={{ flex: '0 0 25%', minWidth: 0 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                <Person />
              </Avatar>
              <Box flex={1} minWidth={0}>
                <Typography variant="body1" fontWeight={700} noWrap>
                  {request.clientName || 'Unknown'}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" noWrap>
                  {request.clientEmail}
                </Typography>
                {request.clientPhone && (
                  <Typography variant="caption" color="text.secondary">
                    {request.clientPhone}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>

          {/* Middle: Service & Time */}
          <Box sx={{ flex: '0 0 35%', minWidth: 0 }}>
            <Stack spacing={1}>
              <Box>
                <Typography variant="body2" fontWeight={600} color="primary.main" noWrap>
                  {request.serviceName || 'Unknown Service'}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {request.serviceCategory}
                </Typography>
              </Box>
              
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" noWrap>
                    {request.bookingDate
                      ? new Date(request.bookingDate).toLocaleDateString('vi-VN', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })
                      : 'N/A'}
                  </Typography>
                </Stack>
                
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" fontWeight={600} noWrap>
                    {request.startTime ? formatTime(request.startTime) : 'N/A'} - {request.endTime ? formatTime(request.endTime) : 'N/A'}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>

          {/* Right: Status & Actions */}
          <Box sx={{ flex: '0 0 40%', minWidth: 0, pr: 5 }}>
            <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
              <Stack spacing={1} flex={1} minWidth={0}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" color="text.secondary">Status:</Typography>
                  {getStatusChip(request.status)}
                </Stack>
                
                <Stack direction="row" spacing={1} alignItems="center">
                  <Payment sx={{ fontSize: 16, color: 'text.secondary' }} />
                  {getPaymentStatusChip(request.paymentStatus)}
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  Code: <strong>{request.bookingId || 'N/A'}</strong>
                </Typography>
              </Stack>

              {isRejected && request.rejectionReason && (
                <IconButton 
                  size="small" 
                  onClick={() => setExpanded(!expanded)}
                  sx={{ 
                    bgcolor: 'error.main', 
                    color: 'white',
                    flexShrink: 0,
                    '&:hover': { bgcolor: 'error.dark' },
                    
                  }}
                >
                  {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )}
            </Stack>
          </Box>
        </Box>

        {/* Expandable Rejection Reason */}
        {isRejected && request.rejectionReason && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 2 }} />
            <Alert 
              severity="error" 
              icon={<ErrorOutline />}
              sx={{ 
                bgcolor: 'error.lighter',
                '& .MuiAlert-message': { width: '100%' }
              }}
            >
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Lý do từ chối:
              </Typography>
              <Typography variant="body2">
                {request.rejectionReason}
              </Typography>
              {request.rejectedAt && (
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  Từ chối lúc: {new Date(request.rejectedAt).toLocaleString('vi-VN')}
                </Typography>
              )}
            </Alert>
          </Collapse>
        )}
      </CardContent>
    </Card>
  );
};

const PendingRequestsTab: React.FC<Props> = ({ loading, pendingRequests }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  // Separate pending and rejected requests
  const pendingOnly = pendingRequests.filter(req => req.status === 'PENDING');
  const rejectedOnly = pendingRequests.filter(req => req.status === 'REJECTED');

  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, sm: 3 } }}>
      <Card sx={sectionCard}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <SectionHeader
            icon={<PendingActions />}
            title="Booking Requests"
            count={pendingRequests.length}
          />

          {/* Summary Chips */}
          {pendingRequests.length > 0 && (
            <Box sx={{ mb: 3, display: 'flex', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
              <Chip 
                label={`${pendingOnly.length} Pending`} 
                color="warning" 
                size="medium"
                sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
              />
              <Chip 
                label={`${rejectedOnly.length} Rejected`} 
                color="error" 
                size="medium"
                sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
              />
            </Box>
          )}

          {/* Booking Cards */}
          {pendingRequests.length > 0 ? (
            <Box>
              {pendingRequests.map((request) => (
                <BookingCard key={request.bookingId} request={request} />
              ))}
            </Box>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No booking requests
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PendingRequestsTab;
