import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import { CheckCircle, ShoppingBag, Receipt } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { getProductOrderById } from '../../../services/productOrderService';
import type { ProductOrderDetail } from '../../../types/productOrder';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<ProductOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await getProductOrderById(parseInt(orderId));
      setOrder(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load order details');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'SHIPPED':
      case 'PROCESSING':
        return 'info';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Order not found'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      {/* Success Header */}
      <Paper sx={{ p: 4, mb: 3, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
        <CheckCircle sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Order Placed Successfully!
        </Typography>
        <Typography variant="h6">
          Order ID: #{order.id}
        </Typography>
      </Paper>

      {/* Order Details */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Order Information
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Order Date:</Typography>
            <Typography fontWeight={600}>
              {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Customer Name:</Typography>
            <Typography fontWeight={600}>{order.customerName}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Phone:</Typography>
            <Typography fontWeight={600}>{order.customerPhone}</Typography>
          </Box>

          {order.customerAddress && (
            <Box display="flex" justifyContent="space-between">
              <Typography color="text.secondary">Delivery Address:</Typography>
              <Typography fontWeight={600} textAlign="right" maxWidth="60%">
                {order.customerAddress}
              </Typography>
            </Box>
          )}

          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Order Type:</Typography>
            <Chip 
              label={order.saleType === 'ONLINE' ? 'Online (Delivery)' : 'Counter (Pick up)'} 
              size="small"
            />
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Payment Status:</Typography>
            <Chip 
              label={order.paymentStatus} 
              color={getPaymentStatusColor(order.paymentStatus) as any}
              size="small"
            />
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Delivery Status:</Typography>
            <Chip 
              label={order.deliveryStatus} 
              color={getDeliveryStatusColor(order.deliveryStatus) as any}
              size="small"
            />
          </Box>
        </Box>
      </Paper>

      {/* Order Items */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Order Items
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Typography fontWeight={600}>
                      {item.productName}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {item.quantity}
                  </TableCell>
                  <TableCell align="right">
                    {item.unitPrice.toLocaleString()} VNĐ
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={600}>
                      {item.subtotal.toLocaleString()} VNĐ
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="flex-end">
          <Box textAlign="right">
            <Typography variant="h6" fontWeight={700}>
              Total Amount
            </Typography>
            <Typography variant="h4" fontWeight={700} color="primary">
              {order.totalAmount.toLocaleString()} VNĐ
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Action Buttons */}
      <Box display="flex" gap={2} justifyContent="center">
        <Button
          variant="outlined"
          size="large"
          startIcon={<ShoppingBag />}
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
        <Button
          variant="contained"
          size="large"
          startIcon={<Receipt />}
          onClick={() => navigate('/orders')}
        >
          View Order History
        </Button>
      </Box>
    </Box>
  );
};

export default OrderConfirmation;
