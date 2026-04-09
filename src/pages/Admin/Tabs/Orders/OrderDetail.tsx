import React, { useState } from 'react';
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
  Button,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { updatePaymentStatus, updateDeliveryStatus } from '../../../../services/productOrderService';
import type { ProductOrder } from '../../../../types/productOrder';
import { PaymentStatus, DeliveryStatus, SaleType } from '../../../../types/productOrder';

interface OrderDetailProps {
  order: ProductOrder;
  onBack: () => void;
  onUpdate: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onBack, onUpdate }) => {
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [deliveryStatus, setDeliveryStatus] = useState(order.deliveryStatus);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingPaymentStatus, setPendingPaymentStatus] = useState<PaymentStatus | null>(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

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

  const handlePaymentStatusChange = (newStatus: PaymentStatus) => {
    if (newStatus === PaymentStatus.PAID) {
      // Show confirmation dialog for PAID status (triggers stock deduction)
      setPendingPaymentStatus(newStatus);
      setConfirmDialogOpen(true);
    } else {
      updatePaymentStatusNow(newStatus);
    }
  };

  const updatePaymentStatusNow = async (newStatus: PaymentStatus) => {
    try {
      setUpdating(true);
      setError('');
      await updatePaymentStatus(order.id, newStatus);
      setPaymentStatus(newStatus);
      toast.success('Payment status updated successfully');
      onUpdate();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment status';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
      setConfirmDialogOpen(false);
      setPendingPaymentStatus(null);
    }
  };

  const handleDeliveryStatusChange = async (newStatus: DeliveryStatus) => {
    try {
      setUpdating(true);
      setError('');
      await updateDeliveryStatus(order.id, newStatus);
      setDeliveryStatus(newStatus);
      toast.success('Delivery status updated successfully');
      onUpdate();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update delivery status';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const isCounterOrder = order.saleType === SaleType.COUNTER;

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={onBack}
        sx={{ mb: 2 }}
      >
        Back to Orders
      </Button>

      <Typography variant="h4" fontWeight={700} mb={3}>
        Order Details
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

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
              label={paymentStatus} 
              color={getPaymentStatusColor(paymentStatus) as any}
            />
            <Chip 
              label={deliveryStatus} 
              color={getDeliveryStatusColor(deliveryStatus) as any}
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

      {/* Status Update Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Update Order Status
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            select
            label="Payment Status"
            value={paymentStatus}
            onChange={(e) => handlePaymentStatusChange(e.target.value as PaymentStatus)}
            disabled={updating}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value={PaymentStatus.PENDING}>Pending</MenuItem>
            <MenuItem value={PaymentStatus.PAID}>Paid</MenuItem>
            <MenuItem value={PaymentStatus.CANCELLED}>Cancelled</MenuItem>
          </TextField>

          <TextField
            select
            label="Delivery Status"
            value={deliveryStatus}
            onChange={(e) => handleDeliveryStatusChange(e.target.value as DeliveryStatus)}
            disabled={updating || isCounterOrder}
            sx={{ minWidth: 200 }}
            helperText={isCounterOrder ? 'Cannot change delivery status for counter orders' : ''}
          >
            <MenuItem value={DeliveryStatus.PENDING}>Pending</MenuItem>
            <MenuItem value={DeliveryStatus.PROCESSING}>Processing</MenuItem>
            <MenuItem value={DeliveryStatus.SHIPPED}>Shipped</MenuItem>
            <MenuItem value={DeliveryStatus.DELIVERED}>Delivered</MenuItem>
            <MenuItem value={DeliveryStatus.CANCELLED}>Cancelled</MenuItem>
          </TextField>
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
              {order.items?.map((item) => (
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

      {/* Confirmation Dialog for Payment Status */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Payment Status Update</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Changing payment status to PAID will deduct stock for all items in this order.
            This action cannot be undone automatically.
          </Alert>
          <Typography>
            Are you sure you want to mark this order as PAID?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} disabled={updating}>
            Cancel
          </Button>
          <Button
            onClick={() => pendingPaymentStatus && updatePaymentStatusNow(pendingPaymentStatus)}
            variant="contained"
            color="primary"
            disabled={updating}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetail;
