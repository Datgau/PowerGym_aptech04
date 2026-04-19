import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Alert, CircularProgress,
  Chip, Stack, Button, IconButton, Divider
} from '@mui/material';
import { 
  EventBusy, CheckCircle, Cancel, Schedule, CalendarToday,
  AccessTime, ErrorOutline, PendingActions
} from '@mui/icons-material';
import type { LeaveRequestResponse } from '../../../../../../services/trainerLeaveRequestService';
import SectionHeader from './SectionHeader';
import { sectionCard } from '../constants';

interface Props {
  loading: boolean;
  leaveRequests: LeaveRequestResponse[];
  onReview: (requestId: number, approved: boolean, notes?: string) => void;
}

const getStatusChip = (status: string) => {
  switch (status) {
    case 'PENDING':
      return <Chip label="Chờ duyệt" color="warning" size="small" icon={<PendingActions />} sx={{ fontWeight: 600 }} />;
    case 'APPROVED':
      return <Chip label="Đã duyệt" color="success" size="small" icon={<CheckCircle />} sx={{ fontWeight: 600 }} />;
    case 'REJECTED':
      return <Chip label="Từ chối" color="error" size="small" icon={<Cancel />} sx={{ fontWeight: 600 }} />;
    default:
      return <Chip label="Unknown" size="small" />;
  }
};

const getLeaveTypeLabel = (type: string) => {
  return type === 'FULL_DAY' ? 'Nghỉ cả ngày' : 'Nghỉ theo giờ';
};

const LeaveRequestCard: React.FC<{
  request: LeaveRequestResponse;
  onReview: (approved: boolean, notes?: string) => void;
}> = ({ request, onReview }) => {
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const isPending = request.status === 'PENDING';

  return (
    <Card 
      sx={{ 
        mb: 2,
        border: '1px solid',
        borderColor: request.status === 'REJECTED' ? 'error.light' : 
                     request.status === 'APPROVED' ? 'success.light' : 'divider',
        bgcolor: request.status === 'REJECTED' ? 'error.lighter' : 
                 request.status === 'APPROVED' ? 'success.lighter' : 'background.paper',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={2}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                <EventBusy color="primary" />
                <Typography variant="body1" fontWeight={700}>
                  {getLeaveTypeLabel(request.leaveType)}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Tạo lúc: {new Date(request.createdAt).toLocaleString('vi-VN')}
              </Typography>
            </Box>
            {getStatusChip(request.status)}
          </Stack>

          <Divider />

          {/* Date & Time Info */}
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" fontWeight={600}>
                {new Date(request.leaveDate).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </Typography>
            </Stack>

            {request.leaveType === 'TIME_SLOT' && request.startTime && request.endTime && (
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTime sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {request.startTime} - {request.endTime}
                </Typography>
              </Stack>
            )}
          </Stack>

          {/* Reason */}
          {request.reason && (
            <Box sx={{ 
              p: 1.5, 
              bgcolor: 'grey.50', 
              borderRadius: 1,
              borderLeft: '3px solid',
              borderColor: 'primary.main'
            }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Lý do:
              </Typography>
              <Typography variant="body2" mt={0.5}>
                {request.reason}
              </Typography>
            </Box>
          )}

          {/* Admin Notes (if reviewed) */}
          {request.status !== 'PENDING' && request.adminNotes && (
            <Alert 
              severity={request.status === 'APPROVED' ? 'success' : 'error'}
              icon={request.status === 'APPROVED' ? <CheckCircle /> : <ErrorOutline />}
            >
              <Typography variant="caption" fontWeight={600}>
                Ghi chú từ admin:
              </Typography>
              <Typography variant="body2" mt={0.5}>
                {request.adminNotes}
              </Typography>
              {request.reviewedByName && request.reviewedAt && (
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  Duyệt bởi {request.reviewedByName} lúc {new Date(request.reviewedAt).toLocaleString('vi-VN')}
                </Typography>
              )}
            </Alert>
          )}

          {/* Action Buttons (for pending requests) */}
          {isPending && (
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Cancel />}
                onClick={() => {
                  const adminNotes = prompt('Lý do từ chối (tùy chọn):');
                  onReview(false, adminNotes || undefined);
                }}
                sx={{ fontWeight: 600 }}
              >
                Từ chối
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<CheckCircle />}
                onClick={() => {
                  const adminNotes = prompt('Ghi chú (tùy chọn):');
                  onReview(true, adminNotes || undefined);
                }}
                sx={{ fontWeight: 600 }}
              >
                Duyệt
              </Button>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const LeaveRequestsTab: React.FC<Props> = ({ loading, leaveRequests, onReview }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  const pendingRequests = leaveRequests.filter(r => r.status === 'PENDING');
  const reviewedRequests = leaveRequests.filter(r => r.status !== 'PENDING');

  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, sm: 3 } }}>
      <Card sx={sectionCard}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <SectionHeader
            icon={<EventBusy />}
            title="Yêu cầu nghỉ"
            count={leaveRequests.length}
          />

          {/* Summary Chips */}
          {leaveRequests.length > 0 && (
            <Box sx={{ mb: 3, display: 'flex', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
              <Chip 
                label={`${pendingRequests.length} Chờ duyệt`} 
                color="warning" 
                size="medium"
                sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
              />
              <Chip 
                label={`${reviewedRequests.filter(r => r.status === 'APPROVED').length} Đã duyệt`} 
                color="success" 
                size="medium"
                sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
              />
              <Chip 
                label={`${reviewedRequests.filter(r => r.status === 'REJECTED').length} Từ chối`} 
                color="error" 
                size="medium"
                sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
              />
            </Box>
          )}

          {/* Leave Request Cards */}
          {leaveRequests.length > 0 ? (
            <Box>
              {/* Pending Requests First */}
              {pendingRequests.length > 0 && (
                <>
                  <Typography variant="subtitle2" fontWeight={700} color="warning.main" mb={2}>
                    Chờ duyệt ({pendingRequests.length})
                  </Typography>
                  {pendingRequests.map((request) => (
                    <LeaveRequestCard 
                      key={request.id} 
                      request={request}
                      onReview={(approved, notes) => onReview(request.id, approved, notes)}
                    />
                  ))}
                </>
              )}

              {/* Reviewed Requests */}
              {reviewedRequests.length > 0 && (
                <>
                  {pendingRequests.length > 0 && <Divider sx={{ my: 3 }} />}
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={2}>
                    Đã xử lý ({reviewedRequests.length})
                  </Typography>
                  {reviewedRequests.map((request) => (
                    <LeaveRequestCard 
                      key={request.id} 
                      request={request}
                      onReview={(approved, notes) => onReview(request.id, approved, notes)}
                    />
                  ))}
                </>
              )}
            </Box>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              Chưa có yêu cầu nghỉ nào
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LeaveRequestsTab;
