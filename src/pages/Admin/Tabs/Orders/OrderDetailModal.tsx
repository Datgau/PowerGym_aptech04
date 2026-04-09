import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import {
  Close,
  LocalShipping,
  CheckCircle,
  Person,
  Phone,
  LocationOn,
  Notes as NotesIcon,
  ShoppingCart,
  Payment,
  FlightTakeoff,
  Print,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { getProductOrderById, updateDeliveryStatus, downloadOrderInvoice } from '../../../../services/productOrderService';
import type { ProductOrderDetail, PaymentStatus } from '../../../../types/productOrder';
import { DeliveryStatus } from '../../../../types/productOrder';
import { toast } from 'react-toastify';

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  orderId: number | null;
  onOrderUpdated?: () => void;
}

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  open,
  onClose,
  orderId,
  onOrderUpdated,
}) => {
  const [order, setOrder] = useState<ProductOrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && orderId) {
      loadOrderDetail();
    }
  }, [open, orderId]);

  const loadOrderDetail = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError('');
      const data = await getProductOrderById(orderId);
      setOrder(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDeliveryStatus = async (newStatus: DeliveryStatus) => {
    if (!orderId) return;

    try {
      setUpdating(true);
      await updateDeliveryStatus(orderId, newStatus);
      toast.success(`Delivery status updated to ${newStatus}`);
      await loadOrderDetail();
      onOrderUpdated?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update delivery status');
    } finally {
      setUpdating(false);
    }
  };

  const handleHandoverToShipping = async () => {
    await handleUpdateDeliveryStatus(DeliveryStatus.PROCESSING);
  };

  const handleMarkAsShipped = async () => {
    await handleUpdateDeliveryStatus(DeliveryStatus.SHIPPED);
  };

  const handleMarkAsDelivered = async () => {
    await handleUpdateDeliveryStatus(DeliveryStatus.DELIVERED);
  };

  const handlePrintInvoice = async () => {
    if (!orderId) return;

    try {
      setPrinting(true);
      
      // Use service function which handles authentication automatically
      const blob = await downloadOrderInvoice(orderId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-order-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Invoice downloaded successfully');
    } catch (err: any) {
      console.error('Error downloading invoice:', err);
      toast.error(err.response?.data?.message || 'Failed to download invoice');
    } finally {
      setPrinting(false);
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const getDeliveryStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'SHIPPED': return 'info';
      case 'PROCESSING': return 'info';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const canHandoverToShipping = order?.deliveryStatus === DeliveryStatus.PENDING && order?.saleType === 'ONLINE';
  const canMarkAsShipped = order?.deliveryStatus === DeliveryStatus.PROCESSING && order?.saleType === 'ONLINE';
  const canMarkAsDelivered = order?.deliveryStatus === DeliveryStatus.SHIPPED && order?.saleType === 'ONLINE';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: BRAND_GRADIENT,
          color: 'white',
          position: 'relative',
          py: 3,
          px: 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <ShoppingCart sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Order Details
            </Typography>
            {order && (
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Order #{order.id} • {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
              </Typography>
            )}
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress size={40} />
              <Typography color="text.secondary">Loading order details...</Typography>
            </Stack>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        ) : order ? (
          <Box>
            {/* Status Section */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #eaeef8' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    Payment Status
                  </Typography>
                  <Chip
                    label={order.paymentStatus}
                    color={getPaymentStatusColor(order.paymentStatus)}
                    icon={<Payment />}
                    sx={{ fontWeight: 600 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    Delivery Status
                  </Typography>
                  <Chip
                    label={order.deliveryStatus}
                    color={getDeliveryStatusColor(order.deliveryStatus)}
                    icon={<LocalShipping />}
                    sx={{ fontWeight: 600 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    Sale Type
                  </Typography>
                  <Chip
                    label={order.saleType}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Customer Information */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #eaeef8' }}>
              <Typography variant="h6" fontWeight={700} mb={2} display="flex" alignItems="center" gap={1}>
                <Person /> Customer Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Person sx={{ fontSize: 20, color: '#64748b' }} />
                    <Typography variant="body2" color="text.secondary">
                      Name
                    </Typography>
                  </Box>
                  <Typography fontWeight={600}>{order.customerName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Phone sx={{ fontSize: 20, color: '#64748b' }} />
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                  </Box>
                  <Typography fontWeight={600}>{order.customerPhone}</Typography>
                </Grid>
                {order.customerAddress && (
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <LocationOn sx={{ fontSize: 20, color: '#64748b' }} />
                      <Typography variant="body2" color="text.secondary">
                        Delivery Address
                      </Typography>
                    </Box>
                    <Typography fontWeight={600}>{order.customerAddress}</Typography>
                  </Grid>
                )}
                {order.notes && (
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <NotesIcon sx={{ fontSize: 20, color: '#64748b' }} />
                      <Typography variant="body2" color="text.secondary">
                        Notes
                      </Typography>
                    </Box>
                    <Typography>{order.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Order Items */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #eaeef8' }}>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Order Items
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8faff' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Unit Price</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Quantity</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            {item.productImageUrl && (
                              <Box
                                component="img"
                                src={item.productImageUrl}
                                alt={item.productName}
                                sx={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 1,
                                  objectFit: 'cover',
                                }}
                              />
                            )}
                            <Typography fontWeight={600}>{item.productName}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {item.unitPrice.toLocaleString()} VNĐ
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={item.quantity} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={600} color="primary">
                            {item.subtotal.toLocaleString()} VNĐ
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="h6" fontWeight={700}>
                          Total Amount:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" fontWeight={700} color="primary">
                          {order.totalAmount.toLocaleString()} VNĐ
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Close
        </Button>

        {order && (
          <Button
            onClick={handlePrintInvoice}
            variant="outlined"
            disabled={printing}
            startIcon={printing ? <CircularProgress size={16} /> : <Print />}
            sx={{
              borderRadius: 2,
              borderColor: '#045668',
              color: '#045668',
              '&:hover': {
                borderColor: '#034556',
                backgroundColor: 'rgba(4, 86, 104, 0.04)',
              },
            }}
          >
            Print Invoice
          </Button>
        )}

        {order && canHandoverToShipping && (
          <Button
            onClick={handleHandoverToShipping}
            variant="contained"
            disabled={updating}
            startIcon={updating ? <CircularProgress size={16} /> : <LocalShipping />}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
              },
            }}
          >
            Handover to Shipping
          </Button>
        )}

        {order && canMarkAsShipped && (
          <Button
            onClick={handleMarkAsShipped}
            variant="contained"
            disabled={updating}
            startIcon={updating ? <CircularProgress size={16} /> : <FlightTakeoff />}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              },
            }}
          >
            Mark as Shipped
          </Button>
        )}

        {order && canMarkAsDelivered && (
          <Button
            onClick={handleMarkAsDelivered}
            variant="contained"
            disabled={updating}
            startIcon={updating ? <CircularProgress size={16} /> : <CheckCircle />}
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              },
            }}
          >
            Mark as Delivered
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailModal;
