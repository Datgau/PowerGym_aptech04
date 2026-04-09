import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { AttachMoney, TrendingUp, AccountBalance } from '@mui/icons-material';
import type { TrainerSalaryResponse } from '../../../../../../services/trainerSalaryService';

interface SalaryTabProps {
  loading: boolean;
  salaryData: TrainerSalaryResponse | null;
  currentBalance?: number;
}

const SalaryTab: React.FC<SalaryTabProps> = ({ loading, salaryData, currentBalance }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, overflowY: 'auto', flexGrow: 1 }}>
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AccountBalance sx={{ fontSize: 36 }} />
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Current Balance
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {formatCurrency(currentBalance || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp sx={{ fontSize: 36 }} />
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Calculated
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {formatCurrency(salaryData?.totalSalary || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AttachMoney sx={{ fontSize: 36 }} />
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Students
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {salaryData?.serviceBreakdown.reduce((sum, detail) => sum + detail.studentCount, 0) || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Salary Breakdown by Service
        </Typography>

        {salaryData && salaryData.serviceBreakdown.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Students</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>%</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Salary</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salaryData.serviceBreakdown.map((detail, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{detail.serviceName}</TableCell>
                    <TableCell align="center">{detail.studentCount}</TableCell>
                    <TableCell align="right">{formatCurrency(detail.servicePrice)}</TableCell>
                    <TableCell align="center">{(detail.trainerPercentage * 100).toFixed(0)}%</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#4caf50' }}>
                      {formatCurrency(detail.salaryAmount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell colSpan={4} align="right" sx={{ fontWeight: 700 }}>
                    Total:
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: '1rem', color: '#2196f3' }}>
                    {formatCurrency(salaryData.totalSalary)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">No salary data available</Alert>
        )}
      </Paper>
    </Box>
  );
};

export default SalaryTab;
