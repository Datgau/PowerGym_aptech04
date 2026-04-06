import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Note as NoteIcon
} from '@mui/icons-material';
import {
  cancelBooking,
  getMyBookings,
  type NewTrainerBookingResponse,
} from '../../services/newBookingService';
import { useAuth } from '../../hooks/useAuth';
import TrainerBookingLayout from './components/TrainerBookingLayout';
import { message } from '../../until/message.ts';
import type {TrainerBookingResponse} from "../../services/trainerBookingService.ts";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const [allBookings, setAllBookings] = useState<NewTrainerBookingResponse[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<NewTrainerBookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<NewTrainerBookingResponse | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await getMyBookings(user.id);
      if (res.success && res.data) {
        const all = res.data;
        setAllBookings(all);
        // Upcoming = PENDING hoặc CONFIRMED, ngày trong tương lai
        const now = new Date();
        const upcoming = all.filter(b => {
          const dt = new Date(`${b.bookingDate}T${b.startTime}`);
          return dt > now && (b.status === 'PENDING' || b.status === 'CONFIRMED');
        });
        setUpcomingBookings(upcoming);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      message.error('Có lỗi xảy ra khi tải danh sách đặt lịch');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (booking: TrainerBookingResponse) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };

  const confirmCancelBooking = async () => {
    if (!selectedBooking || !user) return;
    try {
      setCancelLoading(true);
      const response = await cancelBooking(selectedBooking.id, user.id, cancelReason.trim() || undefined);
      if (response.success) {
        message.success('Hủy lịch thành công');
        fetchBookings();
        handleCloseCancelModal();
      } else {
        message.error(response.message || 'Không thể hủy lịch');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi hủy lịch');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCloseCancelModal = () => {
    setCancelModalOpen(false);
    setSelectedBooking(null);
    setCancelReason('');
  };

  const getStatusColor = (status: NewTrainerBookingResponse['status']) => {
    switch (status) {
      case 'CONFIRMED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': case 'REJECTED': return 'error';
      case 'COMPLETED': return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status: NewTrainerBookingResponse['status']) => {
    const map: Record<string, string> = {
      PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận',
      CANCELLED: 'Đã hủy', REJECTED: 'Bị từ chối',
      COMPLETED: 'Hoàn thành', NO_SHOW: 'Không đến', RESCHEDULED: 'Đổi lịch',
    };
    return map[status] ?? status;
  };

  const canCancel = (b: NewTrainerBookingResponse) => {
    if (b.status !== 'PENDING' && b.status !== 'CONFIRMED') return false;
    const dt = new Date(`${b.bookingDate}T${b.startTime}`);
    return dt > new Date(Date.now() + 2 * 60 * 60 * 1000);
  };

  const renderBookingCard = (booking: NewTrainerBookingResponse) => {
    const isUpcoming = upcomingBookings.some(u => u.id === booking.id);
    return (
    <Card
      key={booking.id}
      sx={{
        height: '100%',
        border: isUpcoming ? '2px solid' : '1px solid',
        borderColor: isUpcoming ? 'primary.main' : 'divider',
        position: 'relative'
      }}
    >
        {isUpcoming && (
          <Box sx={{
            position: 'absolute', top: 0, right: 0,
            bgcolor: 'primary.main', color: 'white',
            px: 1, py: 0.5, borderBottomLeftRadius: 8,
            fontSize: '0.75rem', fontWeight: 'bold'
          }}>
            SẮP TỚI
          </Box>
        )}

        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={booking.trainer?.avatar} sx={{ width: 50, height: 50, mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{booking.trainer?.fullName ?? 'Chưa có trainer'}</Typography>
              <Typography variant="body2" color="text.secondary">{booking.trainer?.email}</Typography>
            </Box>
            <Chip label={getStatusText(booking.status)} color={getStatusColor(booking.status) as any} size="small" />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2">{new Date(booking.bookingDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimeIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2">{booking.startTime} - {booking.endTime}</Typography>
            </Box>
            {booking.sessionType && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ScheduleIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2">{booking.sessionType}</Typography>
              </Box>
            )}
            {booking.notes && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <NoteIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary', mt: 0.2 }} />
                <Typography variant="body2">{booking.notes}</Typography>
              </Box>
            )}
            {booking.status === 'PENDING' && (
              <Alert severity="info" sx={{ mt: 1, py: 0.5, fontSize: '0.8rem' }}>
                Đang chờ trainer xác nhận
              </Alert>
            )}
          </Box>

          {canCancel(booking) && (
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" color="error" size="small" startIcon={<CancelIcon />}
                onClick={() => handleCancelBooking(booking)} fullWidth>
                Hủy Lịch
              </Button>
            </Box>
          )}

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'right' }}>
            ID: {booking.bookingId}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <TrainerBookingLayout>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </TrainerBookingLayout>
    );
  }

  return (
    <TrainerBookingLayout>
      <Container maxWidth="lg">
        {/* Header */}
        <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Lịch Đặt Của Tôi
        </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label={`Sắp tới (${upcomingBookings.length})`} />
          <Tab label={`Tất cả (${allBookings.length})`} />
        </Tabs>
      </Box>

      {/* Upcoming Bookings Tab */}
      <TabPanel value={tabValue} index={0}>
        {upcomingBookings.length === 0 ? (
          <Alert severity="info" sx={{ textAlign: 'center' }}>
            Bạn chưa có lịch đặt nào sắp tới
          </Alert>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {upcomingBookings.map(renderBookingCard)}
          </Box>
        )}
      </TabPanel>

      {/* All Bookings Tab */}
      <TabPanel value={tabValue} index={1}>
        {allBookings.length === 0 ? (
          <Alert severity="info" sx={{ textAlign: 'center' }}>
            Bạn chưa có lịch đặt nào
          </Alert>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {allBookings.map(renderBookingCard)}
          </Box>
        )}
      </TabPanel>

      {/* Cancel Booking Modal */}
      <Dialog open={cancelModalOpen} onClose={handleCloseCancelModal} maxWidth="sm" fullWidth>
        <DialogTitle>Hủy Lịch Đặt</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Bạn có chắc chắn muốn hủy lịch đặt với <strong>{selectedBooking.trainer?.fullName ?? 'trainer'}</strong>
                {' '}vào ngày <strong>{new Date(selectedBooking.bookingDate).toLocaleDateString('vi-VN')}</strong>
                {' '}lúc <strong>{selectedBooking.startTime} - {selectedBooking.endTime}</strong>?
              </Alert>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Lý do hủy (tùy chọn)"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do hủy lịch..."
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelModal} disabled={cancelLoading}>
            Không
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmCancelBooking}
            disabled={cancelLoading}
            startIcon={cancelLoading ? <CircularProgress size={20} /> : <CancelIcon />}
          >
            {cancelLoading ? 'Đang hủy...' : 'Xác nhận hủy'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </TrainerBookingLayout>
  );
};

export default MyBookings;