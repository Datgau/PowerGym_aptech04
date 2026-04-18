import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Receipt, Visibility } from '@mui/icons-material';
import dayjs from 'dayjs';
import PowerGymLayout from '../../../components/PowerGym/Layout/PowerGymLayout';
import { getProductOrders } from '../../../services/productOrderService';
import type { ProductOrder } from '../../../types/productOrder';
import { PaymentStatus, DeliveryStatus } from '../../../types/productOrder';
import TablePagination from '../../../components/Common/TablePagination';
import { usePagination } from '../../../hooks/usePagination';
import OrderDetailModal from './OrderDetailModal';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<ProductOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | ''>('');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<DeliveryStatus | ''>('');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  
  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(10);

  useEffect(() => {
    loadData();
  }, [paginationState.page, paginationState.rowsPerPage, paymentStatusFilter, deliveryStatusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const filters: any = {
        page: paginationState.page,
        size: paginationState.rowsPerPage,
      };
      
      if (paymentStatusFilter) {
        filters.paymentStatus = paymentStatusFilter;
      }
      
      if (deliveryStatusFilter) {
        filters.deliveryStatus = deliveryStatusFilter;
      }
      
      const response = await getProductOrders(filters);
      
      setOrders(response.content);
      setPaginationData(response.totalPages, response.totalElements);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (order: ProductOrder) => {
    setSelectedOrderId(order.id);
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'success';
      case PaymentStatus.PENDING:
        return 'warning';
      case PaymentStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getDeliveryStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.DELIVERED:
        return 'success';
      case DeliveryStatus.SHIPPED:
      case DeliveryStatus.PROCESSING:
        return 'info';
      case DeliveryStatus.PENDING:
        return 'warning';
      case DeliveryStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <PowerGymLayout>
      {/* ── Hero Banner ── */}
      <Box
        sx={{
          background: BRAND_GRADIENT,
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{
          position: 'absolute', top: -80, right: -80, width: 360, height: 360,
          borderRadius: '50%', background: 'rgb(19,102,186)', pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -60, left: -60, width: 260, height: 260,
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', top: '30%', left: '25%', width: 180, height: 180,
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />

        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography
              variant="overline"
              sx={{
                color: 'rgba(255,255,255,0.75)',
                letterSpacing: 5,
                fontSize: '0.7rem',
                fontWeight: 600,
                display: 'block',
                mb: 2,
              }}
            >
              PowerGym Store
            </Typography>

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.4rem', md: '3.8rem' },
                color: '#fff',
                lineHeight: 1.15,
                mb: 2,
                letterSpacing: '-0.5px',
              }}
            >
              Order History
            </Typography>

            <Box sx={{
              width: 56, height: 3,
              background: 'rgba(255,255,255,0.5)',
              borderRadius: 2, mx: 'auto', mb: 3,
            }} />

            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.78)',
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                lineHeight: 1.8,
                maxWidth: 520,
                mx: 'auto',
              }}
            >
              Track and manage your product orders
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ── Content Section ── */}
      <Box sx={{ background: '#f4f6f9', py: { xs: 6, md: 9 } }}>
        <Container maxWidth="xl">
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Section header */}
          <Stack direction="row" alignItems="flex-end" justifyContent="space-between" mb={4}>
            <Box>
              <Typography
                variant="overline"
                sx={{ color: '#1366ba', fontWeight: 700, letterSpacing: 4, fontSize: '0.68rem' }}
              >
                My Orders
              </Typography>
              <Typography variant="h5" fontWeight={700} color="text.primary" mt={0.5}>
                {paginationState.totalElements} Orders
              </Typography>
            </Box>
          </Stack>

          {/* Filters */}
          <Box display="flex" gap={2} mb={4} flexWrap="wrap">
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  background: '#fff',
                  borderRadius: 2,
                },
              }}
            >
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={paymentStatusFilter}
                label="Payment Status"
                onChange={(e) => setPaymentStatusFilter(e.target.value as PaymentStatus | '')}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value={PaymentStatus.PENDING}>Pending</MenuItem>
                <MenuItem value={PaymentStatus.PAID}>Paid</MenuItem>
                <MenuItem value={PaymentStatus.CANCELLED}>Cancelled</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  background: '#fff',
                  borderRadius: 2,
                },
              }}
            >
              <InputLabel>Delivery Status</InputLabel>
              <Select
                value={deliveryStatusFilter}
                label="Delivery Status"
                onChange={(e) => setDeliveryStatusFilter(e.target.value as DeliveryStatus | '')}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value={DeliveryStatus.PENDING}>Pending</MenuItem>
                <MenuItem value={DeliveryStatus.PROCESSING}>Processing</MenuItem>
                <MenuItem value={DeliveryStatus.SHIPPED}>Shipped</MenuItem>
                <MenuItem value={DeliveryStatus.DELIVERED}>Delivered</MenuItem>
                <MenuItem value={DeliveryStatus.CANCELLED}>Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Orders List */}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <Stack alignItems="center" spacing={2}>
                <CircularProgress size={60} />
                <Typography color="text.secondary">Loading orders...</Typography>
              </Stack>
            </Box>
          ) : orders.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Receipt sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" mb={1}>
                No orders found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {paymentStatusFilter || deliveryStatusFilter 
                  ? 'Try adjusting your filters' 
                  : 'You haven\'t placed any orders yet'}
              </Typography>
            </Box>
          ) : (
            <>
              <Stack spacing={2}>
                {orders.map((order, idx) => (
                  <Card
                    key={order.id}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid rgba(0,0,0,0.07)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      animationName: 'fadeUp',
                      animationDuration: '0.5s',
                      animationFillMode: 'both',
                      animationDelay: `${idx * 0.05}s`,
                      '@keyframes fadeUp': {
                        from: { opacity: 0, transform: 'translateY(24px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                      },
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                          <Typography variant="h6" fontWeight={700}>
                            Order #{order.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
                          </Typography>
                        </Box>
                        
                        <Box display="flex" gap={1} alignItems="center">
                          <Chip 
                            label={order.paymentStatus} 
                            color={getPaymentStatusColor(order.paymentStatus) as any}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                          <Chip 
                            label={order.deliveryStatus} 
                            color={getDeliveryStatusColor(order.deliveryStatus) as any}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleOrderClick(order)}
                              sx={{
                                color: '#0066ff',
                                '&:hover': { 
                                  background: 'rgba(0,102,255,0.1)',
                                },
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(4,86,104,0.03)',
                          border: '1px solid rgba(4,86,104,0.1)',
                        }}
                      >
                        <Box>
                          <Typography variant="body2" color="text.secondary" mb={0.5}>
                            {order.itemCount} items • {order.saleType === 'ONLINE' ? 'Online Order' : 'Counter Order'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {order.customerName} • {order.customerPhone}
                          </Typography>
                        </Box>
                        
                        <Box textAlign="right">
                          <Typography variant="caption" color="text.secondary">
                            Total Amount
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color="primary">
                            {order.totalAmount.toLocaleString()} VNĐ
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>

              {/* Pagination */}
              {paginationState.totalElements > paginationState.rowsPerPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <TablePagination
                    count={paginationState.totalElements}
                    page={paginationState.page}
                    rowsPerPage={paginationState.rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[10, 20, 30, 50]}
                    labelRowsPerPage="Orders per page:"
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} orders`
                    }
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
      <OrderDetailModal
        open={selectedOrderId !== null}
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </PowerGymLayout>
  );
};

export default OrderHistory;