import React from 'react';
import {
  Box, Card, CardContent, Typography, Alert, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import { Assessment, TrendingUp, Star } from '@mui/icons-material';
import SectionHeader from './SectionHeader';
import StatCell from './StatCell';
import { sectionCard } from '../constants';
import { formatDate } from '../helpers';
import type {TrainerStatisticsResponse} from "../../../../../../services/trainerManagementService.ts";

interface Props {
  loading: boolean;
  statistics: TrainerStatisticsResponse | null;
}

const StatisticsTab: React.FC<Props> = ({ loading, statistics }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (!statistics) return <Alert severity="info">No statistics data available</Alert>;

  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
      <Box display="flex" flexDirection="column" gap={3}>
        {/* Overview */}
        <Card sx={sectionCard}>
          <CardContent sx={{ p: 3 }}>
            <SectionHeader
              icon={<Assessment />}
              title={`Statistics (${formatDate(statistics.fromDate)} - ${formatDate(statistics.toDate)})`}
            />
            <Box display="flex" gap={2} flexWrap="wrap">
              <Box flex={1} minWidth={120}><StatCell label="Total Bookings" value={(statistics.totalBookings || 0).toString()} /></Box>
              <Box flex={1} minWidth={120}><StatCell label="Completed" value={(statistics.completedBookings || 0).toString()} /></Box>
              <Box flex={1} minWidth={120}><StatCell label="Completion Rate" value={`${(statistics.completionRate || 0).toFixed(1)}%`} /></Box>
              <Box flex={1} minWidth={120}><StatCell label="Average Rating" value={`${(statistics.averageRating || 0).toFixed(1)} ⭐`} /></Box>
              <Box flex={1} minWidth={120}><StatCell label="Total Revenue" value={`${(statistics.totalRevenue || 0).toLocaleString('vi-VN')} VNĐ`} /></Box>
              <Box flex={1} minWidth={120}><StatCell label="Avg Revenue/Session" value={`${(statistics.averageRevenuePerSession || 0).toLocaleString('vi-VN')} VNĐ`} /></Box>
              <Box flex={1} minWidth={120}><StatCell label="New Clients" value={(statistics.newClientsCount || 0).toString()} /></Box>
              <Box flex={1} minWidth={120}><StatCell label="Client Retention" value={`${(statistics.clientRetentionRate || 0).toFixed(1)}%`} /></Box>
            </Box>
          </CardContent>
        </Card>

        {/* Service Breakdown */}
        {statistics.serviceBreakdown?.length > 0 && (
          <Card sx={sectionCard}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader icon={<TrendingUp />} title="Service Performance" count={statistics.serviceBreakdown.length} />
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Service</TableCell>
                      <TableCell align="right">Bookings</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Avg Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {statistics.serviceBreakdown.map((service, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{service.serviceName || 'Unknown Service'}</Typography>
                          <Typography variant="caption" color="text.secondary">{service.serviceCategory || 'Unknown Category'}</Typography>
                        </TableCell>
                        <TableCell align="right">{service.bookingCount || 0}</TableCell>
                        <TableCell align="right">{(service.revenue || 0).toLocaleString('vi-VN')} VNĐ</TableCell>
                        <TableCell align="right">
                          <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                            <Star sx={{ fontSize: 16, color: '#ffc107' }} />
                            <Typography variant="body2">{(service.averageRating || 0).toFixed(1)}</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default StatisticsTab;
