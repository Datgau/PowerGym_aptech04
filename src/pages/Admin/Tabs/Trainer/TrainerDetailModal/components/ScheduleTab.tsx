import React, { useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Alert, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import { Schedule } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import {PickersDay, type PickersDayProps} from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import SectionHeader from './SectionHeader';
import StatCell from './StatCell';
import { sectionCard } from '../constants';
import { getStatusColor, formatTime, formatDate } from '../helpers';
import type {TrainerScheduleResponse} from "../../../../../../services/trainerManagementService.ts";

const ACCENT = '#FF6B35';

interface Props {
  loading: boolean;
  schedule: TrainerScheduleResponse | null;
}

const ScheduleTab: React.FC<Props> = ({ loading, schedule }) => {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs());

  // Tạo set các ngày có booking
  const datesWithBookings = useMemo(() => {
    if (!schedule?.dailySchedules) return new Set<string>();
    return new Set(
      schedule.dailySchedules
        .filter(day => (day.totalBookings || 0) > 0)
        .map(day => dayjs(day.date).format('YYYY-MM-DD'))
    );
  }, [schedule]);

  const CustomDay = (props: PickersDayProps) => {
    const day = props.day as Dayjs;
    const dateStr = day.format('YYYY-MM-DD');
    const hasBooking = datesWithBookings.has(dateStr);

    return (
        <PickersDay
            {...props}
            sx={{
              ...(hasBooking && {
                backgroundColor: `${ACCENT}30`,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: `${ACCENT}50`,
                },
                '&.Mui-selected': {
                  backgroundColor: ACCENT,
                  '&:hover': {
                    backgroundColor: ACCENT,
                  },
                },
              }),
            }}
        />
    );
  };
  const selectedDaySchedule = useMemo(() => {
    if (!selectedDate || !schedule?.dailySchedules) return null;
    const dateStr = selectedDate.format('YYYY-MM-DD');
    return schedule.dailySchedules.find(day => dayjs(day.date).format('YYYY-MM-DD') === dateStr);
  }, [selectedDate, schedule]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (!schedule) return <Alert severity="info">No schedule data available</Alert>;

  const minDate = schedule.fromDate ? dayjs(schedule.fromDate) : undefined;
  const maxDate = schedule.toDate ? dayjs(schedule.toDate) : undefined;

  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
      <Card sx={sectionCard}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader
            icon={<Schedule />}
            title={`Schedule (${formatDate(schedule.fromDate)} - ${formatDate(schedule.toDate)})`}
            count={schedule.totalBookings}
          />

          <Box display="flex" gap={2} mb={3} flexWrap="wrap">
            <Box flex={1} minWidth={120}><StatCell label="Total Bookings" value={(schedule.totalBookings || 0).toString()} /></Box>
            <Box flex={1} minWidth={120}><StatCell label="Confirmed" value={(schedule.confirmedBookings || 0).toString()} /></Box>
            <Box flex={1} minWidth={120}><StatCell label="Pending" value={(schedule.pendingBookings || 0).toString()} /></Box>
            <Box flex={1} minWidth={120}><StatCell label="Avg/Day" value={(schedule.averageBookingsPerDay || 0).toFixed(1)} /></Box>
          </Box>

          {/* Date Picker */}
          <Box display="flex" gap={3} mb={3} flexWrap="wrap">
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  minDate={minDate}
                  maxDate={maxDate}
                  slots={{
                    day: CustomDay,
                  }}
                  sx={{
                    '& .MuiPickersDay-root.Mui-selected': { background: ACCENT },
                    '& .MuiPickersDay-root:hover': { background: `${ACCENT}20` },
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    border: '1.5px solid rgba(0,0,0,0.07)',
                  }}
                />
              </LocalizationProvider>
            </Box>

            {/* Selected Day Details */}
            <Box flex={1} minWidth={300}>
              {selectedDaySchedule ? (
                <Card variant="outlined">
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight={600}>
                        {formatDate(selectedDaySchedule.date)} ({selectedDaySchedule.dayOfWeek})
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Chip label={`${selectedDaySchedule.totalBookings || 0} bookings`} size="small"
                          color={(selectedDaySchedule.totalBookings || 0) > 0 ? 'primary' : 'default'} />
                        {selectedDaySchedule.hasConflicts && <Chip label="Conflicts" size="small" color="error" />}
                      </Box>
                    </Box>

                    {selectedDaySchedule.bookings?.length ? (
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Time</TableCell>
                              <TableCell>Client</TableCell>
                              <TableCell>Service</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedDaySchedule.bookings.map((booking) => (
                              <TableRow key={booking.bookingId}>
                                <TableCell>
                                  <Typography variant="body2" fontWeight={600}>
                                    {booking.startTime ? formatTime(booking.startTime) : 'N/A'} - {booking.endTime ? formatTime(booking.endTime) : 'N/A'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">{booking.clientName || 'Unknown Client'}</Typography>
                                  <Typography variant="caption" color="text.secondary">{booking.clientEmail || 'No email'}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">{booking.serviceName || 'Unknown Service'}</Typography>
                                  <Typography variant="caption" color="text.secondary">{booking.serviceCategory || 'Unknown Category'}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip label={booking.status || 'UNKNOWN'} size="small"
                                    color={getStatusColor(booking.status || 'UNKNOWN')} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Alert severity="info">No bookings for this day</Alert>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Alert severity="info">Select a date to view bookings</Alert>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
export default ScheduleTab;