import React from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Alert, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import { Schedule } from '@mui/icons-material';
import SectionHeader from './SectionHeader';
import StatCell from './StatCell';
import { sectionCard } from '../constants';
import { getStatusColor, formatTime, formatDate } from '../helpers';
import type {TrainerScheduleResponse} from "../../../../../../services/trainerManagementService.ts";

interface Props {
  loading: boolean;
  schedule: TrainerScheduleResponse | null;
}

const ScheduleTab: React.FC<Props> = ({ loading, schedule }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (!schedule) return <Alert severity="info">No schedule data available</Alert>;

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

          {schedule.dailySchedules?.map((day, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    {formatDate(day.date)} ({day.dayOfWeek})
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Chip label={`${day.totalBookings || 0} bookings`} size="small"
                      color={(day.totalBookings || 0) > 0 ? 'primary' : 'default'} />
                    {day.hasConflicts && <Chip label="Conflicts" size="small" color="error" />}
                  </Box>
                </Box>

                {day.bookings?.length ? (
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
                        {day.bookings.map((booking) => (
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
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ScheduleTab;
