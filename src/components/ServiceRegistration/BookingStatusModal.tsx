import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Alert,
} from '@mui/material';
import {
  Cancel,
  CheckCircle,
  HourglassEmpty,
  Block,
  EventBusy,
} from '@mui/icons-material';
import type { TrainerBooking } from '../../services/serviceRegistrationService';

interface BookingStatusModalProps {
  open: boolean;
  onClose: () => void;
  booking: TrainerBooking | null;
  registrationId: number;
  onSelectNewTrainer?: () => void;
}

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const BookingStatusModal: React.FC<BookingStatusModalProps> = ({
                                                                 open,
                                                                 onClose,
                                                                 booking,
                                                                 registrationId,
                                                                 onSelectNewTrainer,
                                                               }) => {
  if (!booking) return null;

  const getStatusIcon = () => {
    switch (booking.status) {
      case 'PENDING':
        return <HourglassEmpty sx={{ fontSize: 48, color: '#ff9800' }} />;
      case 'CONFIRMED':
        return <CheckCircle sx={{ fontSize: 48, color: '#4caf50' }} />;
      case 'REJECTED':
        return <Block sx={{ fontSize: 48, color: '#f44336' }} />;
      case 'CANCELLED':
        return <Cancel sx={{ fontSize: 48, color: '#9e9e9e' }} />;
      case 'NO_SHOW':
        return <EventBusy sx={{ fontSize: 48, color: '#d32f2f' }} />;
      default:
        return <CheckCircle sx={{ fontSize: 48, color: '#2196f3' }} />;
    }
  };

  const getStatusColor = () => {
    switch (booking.status) {
      case 'PENDING':
        return '#ff9800';
      case 'CONFIRMED':
        return '#4caf50';
      case 'REJECTED':
        return '#f44336';
      case 'CANCELLED':
        return '#9e9e9e';
      case 'NO_SHOW':
        return '#d32f2f';
      default:
        return '#2196f3';
    }
  };

  const getStatusLabel = () => {
    switch (booking.status) {
      case 'PENDING':
        return 'Pending';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'REJECTED':
        return 'Rejected';
      case 'CANCELLED':
        return 'Cancelled';
      case 'COMPLETED':
        return 'Completed';
      case 'NO_SHOW':
        return 'No Show';
      case 'RESCHEDULED':
        return 'Rescheduled';
      default:
        return booking.status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:mm
  };

  return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            {getStatusIcon()}
            <Typography variant="h5" fontWeight={700}>
              Booking Status
            </Typography>
            <Chip
                label={getStatusLabel()}
                sx={{
                  background: getStatusColor(),
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  px: 2,
                  py: 0.5,
                }}
            />
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Booking Info */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Booking ID
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {booking.bookingId}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Time
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {formatDate(booking.bookingDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </Typography>
            </Box>

            {/* Rejection Info */}
            {booking.status === 'REJECTED' && booking.rejectionReason && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Rejection Reason:
                  </Typography>
                  <Typography variant="body2">{booking.rejectionReason}</Typography>
                  {booking.rejectedAt && (
                      <Typography variant="caption" display="block" mt={1} color="text.secondary">
                        Rejected at: {new Date(booking.rejectedAt).toLocaleString('en-US')}
                      </Typography>
                  )}
                </Alert>
            )}

            {/* Notes */}
            {booking.notes && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body2">{booking.notes}</Typography>
                </Box>
            )}

            {/* Action for rejected bookings */}
            {booking.status === 'REJECTED' && onSelectNewTrainer && (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    The trainer has rejected your booking. You can choose another trainer to continue.
                  </Typography>
                </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
            Close
          </Button>
          {booking.status === 'REJECTED' && onSelectNewTrainer && (
              <Button
                  onClick={() => {
                    onClose();
                    onSelectNewTrainer();
                  }}
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    background: BRAND_GRADIENT,
                    '&:hover': {
                      background: BRAND_GRADIENT,
                      opacity: 0.9,
                    },
                  }}
              >
                Choose Another Trainer
              </Button>
          )}
        </DialogActions>
      </Dialog>
  );
};

export default BookingStatusModal;