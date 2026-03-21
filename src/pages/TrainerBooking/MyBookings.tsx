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
  getUserBookings,
  getUpcomingUserBookings,
  cancelTrainerBooking,
  type TrainerBookingResponse,
  formatBookingDate,
  formatBookingTime,
  getBookingStatusColor,
  getBookingStatusText,
  canCancelBooking
} from '../../services/trainerBookingService';
import { useAuth } from '../../hooks/useAuth';
import TrainerBookingLayout from './components/TrainerBookingLayout';
import { message } from '../../utils/message';

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
  const [allBookings, setAllBookings] = useState<TrainerBookingResponse[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<TrainerBookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<TrainerBookingResponse | null>(null);
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
      const [allResponse, upcomingResponse] = await Promise.all([
        getUserBookings(user.id),
        getUpcomingUserBookings(user.id)
      ]);

      if (allResponse.success) {
        setAllBookings(allResponse.data);
      }

      if (upcomingResponse.success) {
        setUpcomingBookings(upcomingResponse.data);
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
      const response = await cancelTrainerBooking(
        selectedBooking.id,
        user.id,
        cancelReason.trim() || undefined
      );

      if (response.success) {
        message.success('Hủy lịch thành công');
        fetchBookings(); // Refresh bookings
        handleCloseCancelModal();
      } else {
        message.error(response.message || 'Không thể hủy lịch');
      }
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
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

  const renderBookingCard = (booking: TrainerBookingResponse) => (
    <Card 
      key={booking.id}
      sx={{ 
        height: '100%',
        border: booking.upcoming ? '2px solid' : '1px solid',
        borderColor: booking.upcoming ? 'primary.main' : 'divider',
        position: 'relative'
      }}
    >
        {booking.upcoming && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bgcolor: 'primary.main',
              color: 'white',
              px: 1,
              py: 0.5,
              borderBottomLeftRadius: 8,
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}
          >
            SẮP TỚI
          </Box>
        )}

        <CardContent>
          {/* Trainer Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={booking.trainerAvatar}
              sx={{ width: 50, height: 50, mr: 2 }}
            >
              <PersonIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{booking.trainerName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {booking.trainerEmail}
              </Typography>
            </Box>
            <Chip
              label={getBookingStatusText(booking.status)}
              color={getBookingStatusColor(booking.status) as any}
              size="small"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Booking Details */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2">
                {formatBookingDate(booking.bookingDate)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimeIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2">
                {formatBookingTime(booking.startTime, booking.endTime)}
              </Typography>
            </Box>

            {booking.sessionType && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ScheduleIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {booking.sessionType}
                </Typography>
              </Box>
            )}

            {booking.notes && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <NoteIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary', mt: 0.2 }} />
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {booking.notes}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Actions */}
          {canCancelBooking(booking) && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<CancelIcon />}
                onClick={() => handleCancelBooking(booking)}
                fullWidth
              >
                Hủy Lịch
              </Button>
            </Box>
          )}

          {/* Booking ID */}
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ display: 'block', mt: 2, textAlign: 'right' }}
          >
            ID: {booking.bookingId}
          </Typography>
        </CardContent>
      </Card>
  );

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
                Bạn có chắc chắn muốn hủy lịch đặt với <strong>{selectedBooking.trainerName}</strong> 
                vào ngày <strong>{formatBookingDate(selectedBooking.bookingDate)}</strong> 
                lúc <strong>{formatBookingTime(selectedBooking.startTime, selectedBooking.endTime)}</strong>?
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