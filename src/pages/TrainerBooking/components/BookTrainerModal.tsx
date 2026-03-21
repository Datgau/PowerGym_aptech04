import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import {
  type TrainerInfo,
  type CreateTrainerBookingRequest,
  createTrainerBooking,
  getTrainerAvailability,
  type TrainerAvailabilityResponse,
  SESSION_TYPES
} from '../../../services/trainerBookingService';
import { useAuth } from '../../../hooks/useAuth';
import { message } from '../../../utils/message';

interface BookTrainerModalProps {
  open: boolean;
  trainer: TrainerInfo;
  onClose: () => void;
  onSuccess: () => void;
}

const BookTrainerModal: React.FC<BookTrainerModalProps> = ({
  open,
  trainer,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [notes, setNotes] = useState('');
  const [availability, setAvailability] = useState<TrainerAvailabilityResponse | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability();
    }
  }, [selectedDate]);

  const fetchAvailability = async () => {
    if (!selectedDate) return;

    try {
      setAvailabilityLoading(true);
      const response = await getTrainerAvailability(trainer.id, selectedDate);
      
      if (response.success) {
        setAvailability(response.data);
      } else {
        message.error('Không thể tải lịch trống của trainer');
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      message.error('Có lỗi xảy ra khi tải lịch trống');
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedDate) {
      newErrors.date = 'Vui lòng chọn ngày';
    } else if (new Date(selectedDate) < new Date(new Date().setHours(0, 0, 0, 0))) {
      newErrors.date = 'Không thể đặt lịch trong quá khứ';
    }

    if (!startTime) {
      newErrors.startTime = 'Vui lòng chọn giờ bắt đầu';
    }

    if (!endTime) {
      newErrors.endTime = 'Vui lòng chọn giờ kết thúc';
    }

    if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = 'Giờ kết thúc phải sau giờ bắt đầu';
    }

    if (!sessionType) {
      newErrors.sessionType = 'Vui lòng chọn loại buổi tập';
    }

    // Check for time conflicts
    if (availability && startTime && endTime && selectedDate) {
      const hasConflict = availability.bookedSlots.some(slot => {
        return (startTime < slot.endTime) && (endTime > slot.startTime);
      });

      if (hasConflict) {
        newErrors.time = 'Thời gian đã chọn bị trung với lịch đã đặt';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user || !selectedDate || !startTime || !endTime) {
      return;
    }

    try {
      setLoading(true);

      const bookingRequest: CreateTrainerBookingRequest = {
        trainerId: trainer.id,
        bookingDate: selectedDate,
        startTime: startTime,
        endTime: endTime,
        sessionType,
        notes: notes.trim() || undefined
      };

      const response = await createTrainerBooking(user.id, bookingRequest);

      if (response.success) {
        onSuccess();
      } else {
        message.error(response.message || 'Không thể đặt lịch');
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt lịch');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDate('');
    setStartTime('');
    setEndTime('');
    setSessionType('');
    setNotes('');
    setAvailability(null);
    setErrors({});
    onClose();
  };

  const formatTimeSlots = (slots: any[]) => {
    return slots.map(slot => `${slot.startTime} - ${slot.endTime}`).join(', ');
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="div">
            Đặt Lịch Với Trainer
          </Typography>
          <Button
            onClick={handleClose}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Trainer Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={trainer.avatar}
              sx={{ width: 60, height: 60, mr: 2 }}
            >
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{trainer.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {trainer.totalExperienceYears ? `${trainer.totalExperienceYears} năm kinh nghiệm` : 'Trainer'}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {trainer.specialties.map((specialty) => (
              <Chip
                key={specialty.specialtyId}
                label={specialty.specialtyName}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
          {/* Date Selection */}
          <TextField
            fullWidth
            type="date"
            label="Chọn ngày"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: new Date().toISOString().split('T')[0],
              max: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }}
          />

          {/* Session Type */}
          <FormControl fullWidth error={!!errors.sessionType}>
            <InputLabel>Loại buổi tập</InputLabel>
            <Select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              label="Loại buổi tập"
            >
              {SESSION_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {errors.sessionType && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                {errors.sessionType}
              </Typography>
            )}
          </FormControl>

          {/* Time Selection */}
          <TextField
            fullWidth
            type="time"
            label="Giờ bắt đầu"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            error={!!errors.startTime}
            helperText={errors.startTime}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: "08:00",
              max: "19:00"
            }}
          />

          <TextField
            fullWidth
            type="time"
            label="Giờ kết thúc"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            error={!!errors.endTime || !!errors.time}
            helperText={errors.endTime || errors.time}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: startTime || "09:00",
              max: "20:00"
            }}
          />
        </Box>

        {/* Notes */}
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Ghi chú (tùy chọn)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Mục tiêu tập luyện, yêu cầu đặc biệt..."
          />
        </Box>

        {/* Availability Display */}
        {selectedDate && (
          <Box sx={{ mt: 3 }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Lịch trống ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
              </Typography>
              
              {availabilityLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : availability ? (
                <Box>
                  {availability.availableSlots.length > 0 ? (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      <strong>Khung giờ trống:</strong> {formatTimeSlots(availability.availableSlots)}
                    </Alert>
                  ) : (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Trainer không có lịch trống trong ngày này
                    </Alert>
                  )}
                  
                  {availability.bookedSlots.length > 0 && (
                    <Alert severity="info">
                      <strong>Đã đặt:</strong> {formatTimeSlots(availability.bookedSlots)}
                    </Alert>
                  )}
                </Box>
              ) : null}
            </Box>
          )}
        </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !selectedDate || availability?.availableSlots.length === 0}
          startIcon={loading ? <CircularProgress size={20} /> : <ScheduleIcon />}
        >
          {loading ? 'Đang đặt lịch...' : 'Đặt Lịch'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookTrainerModal;