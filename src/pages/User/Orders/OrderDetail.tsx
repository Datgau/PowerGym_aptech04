import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
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
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { getProductOrderById } from '../../../services/productOrderService';
import type { ProductOrderDetail } from '../../../types/productOrder';
import { PaymentStatus, DeliveryStatus, SaleType } from '../../../types/productOrder';

const OrderDetail: React.FC = () => {
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

  const getDeliverySteps = () => {
    return [
      { label: 'Pending', status: DeliveryStatus.PENDING },
      { label: 'Processing', status: DeliveryStatus.PROCESSING },
      { label: 'Shipped', status: DeliveryStatus.SHIPPED },
      { label: 'Delivered', status: DeliveryStatus.DELIVERED },
    ];
  };

  const getActiveStep = (status: DeliveryStatus) => {
    const steps = getDeliverySteps();
    const index = steps.findIndex(step => step.status === status);
    return index >= 0 ? index : 0;
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
        <Button variant="contained" onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/orders')}
        sx={{ mb: 2 }}
      >
        Back to Orders
      </Button>

      <Typography variant="h4" fontWeight={700} mb={3}>
        Order Details
      </Typography>

      {/* Order Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Order #{order.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placed on {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Box>
          
          <Box display="flex" gap={1}>
            <Chip 
              label={order.paymentStatus} 
              color={getPaymentStatusColor(order.paymentStatus) as any}
            />
            <Chip 
              label={order.deliveryStatus} 
              color={getDeliveryStatusColor(order.deliveryStatus) as any}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" flexDirection="column" gap={1}>
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
            <Typography fontWeight={600}>
              {order.saleType === SaleType.ONLINE ? 'Online (Delivery)' : 'Counter (Pick up)'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Delivery Progress (for ONLINE orders only) */}
      {order.saleType === SaleType.ONLINE && order.deliveryStatus !== DeliveryStatus.CANCELLED && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={3}>
            Delivery Progress
          </Typography>
          
          <Stepper activeStep={getActiveStep(order.deliveryStatus)} alternativeLabel>
            {getDeliverySteps().map((step) => (
              <Step key={step.status}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      )}

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
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={item.productImageUrl}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      >
                        {item.productName.charAt(0)}
                      </Avatar>
                      <Typography fontWeight={600}>
                        {item.productName}
                      </Typography>
                    </Box>
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

      {order.notes && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={1}>
            Notes
          </Typography>
          <Typography color="text.secondary">
            {order.notes}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default OrderDetail;
