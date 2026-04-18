import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogContent,
  Box, Typography, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert, Stepper, Step, StepLabel,
  Avatar, IconButton, Stack,
} from '@mui/material';
import { Close, LocalShipping, CheckCircle, Inventory, HourglassEmpty, Cancel } from '@mui/icons-material';
import dayjs from 'dayjs';
import { getProductOrderById } from '../../../services/productOrderService';
import type { ProductOrderDetail } from '../../../types/productOrder';
import { PaymentStatus, DeliveryStatus, SaleType } from '../../../types/productOrder';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

interface Props {
  open: boolean;
  orderId: number | null;
  onClose: () => void;
}

const DELIVERY_STEPS = [
  { label: 'Pending',    status: DeliveryStatus.PENDING,    icon: <HourglassEmpty /> },
  { label: 'Processing', status: DeliveryStatus.PROCESSING, icon: <Inventory /> },
  { label: 'Shipped',    status: DeliveryStatus.SHIPPED,    icon: <LocalShipping /> },
  { label: 'Delivered',  status: DeliveryStatus.DELIVERED,  icon: <CheckCircle /> },
];

const paymentColor = (s: PaymentStatus) =>
  s === PaymentStatus.PAID ? 'success' : s === PaymentStatus.PENDING ? 'warning' : 'error';

const deliveryColor = (s: DeliveryStatus) => {
  if (s === DeliveryStatus.DELIVERED) return 'success';
  if (s === DeliveryStatus.SHIPPED || s === DeliveryStatus.PROCESSING) return 'info';
  if (s === DeliveryStatus.PENDING) return 'warning';
  return 'error';
};

const OrderDetailModal: React.FC<Props> = ({ open, orderId, onClose }) => {
  const [order, setOrder] = useState<ProductOrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && orderId) {
      setOrder(null);
      setError('');
      setLoading(true);
      getProductOrderById(orderId)
        .then(setOrder)
        .catch((err) => setError(err?.message || 'Failed to load order'))
        .finally(() => setLoading(false));
    }
  }, [open, orderId]);

  const activeStep = order
    ? DELIVERY_STEPS.findIndex(s => s.status === order.deliveryStatus)
    : 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '20px', overflow: 'hidden', maxHeight: '92vh' },
      }}
      BackdropProps={{
        sx: { backdropFilter: 'blur(6px)', backgroundColor: 'rgba(4,30,50,0.45)' },
      }}
    >
      {/* ── Header ── */}
      <Box sx={{ background: BRAND_GRADIENT, px: 3, pt: 3, pb: 3.5, position: 'relative' }}>
        <Box sx={{
          position: 'absolute', top: -40, right: -40, width: 160, height: 160,
          borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
        }} />
        <IconButton onClick={onClose} size="small" sx={{
          position: 'absolute', top: 14, right: 14,
          color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          '&:hover': { background: 'rgba(255,255,255,0.22)' },
        }}>
          <Close fontSize="small" />
        </IconButton>

        <Typography sx={{ fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', mb: 0.5 }}>
          PowerGym Store
        </Typography>
        <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#fff', lineHeight: 1.2 }}>
          Order Details
        </Typography>
        {order && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5 }}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 2, py: 0.8, borderRadius: '10px',
              background: 'rgba(255,255,255,0.13)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}>
              <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                #{order.id}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>
              {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Box>
        )}
      </Box>

      <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box p={3}>
            <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
          </Box>
        )}

        {order && !loading && (
          <Box>
            {/* ── Status + Info ── */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #f0f4f8' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography fontWeight={700} fontSize="0.95rem" color="#0f172a">
                  Order Status
                </Typography>
                <Box display="flex" gap={1}>
                  <Chip label={order.paymentStatus} color={paymentColor(order.paymentStatus) as any} size="small" sx={{ fontWeight: 700 }} />
                  <Chip label={order.deliveryStatus} color={deliveryColor(order.deliveryStatus) as any} size="small" sx={{ fontWeight: 700 }} />
                </Box>
              </Box>

              <Box sx={{
                display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 1.5, p: 2, borderRadius: 2, background: '#f8faff', border: '1px solid #eaeef8',
              }}>
                {[
                  { label: 'Customer', value: order.customerName },
                  { label: 'Phone', value: order.customerPhone },
                  ...(order.customerAddress ? [{ label: 'Address', value: order.customerAddress }] : []),
                  { label: 'Order Type', value: order.saleType === SaleType.ONLINE ? 'Online (Delivery)' : 'Counter (Pick up)' },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Typography fontSize="0.7rem" fontWeight={600} color="#94a3b8" textTransform="uppercase" letterSpacing={0.5}>
                      {label}
                    </Typography>
                    <Typography fontSize="0.88rem" fontWeight={600} color="#0f172a" mt={0.2}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* ── Delivery Progress ── */}
            {order.saleType === SaleType.ONLINE && order.deliveryStatus !== DeliveryStatus.CANCELLED && (
              <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #f0f4f8' }}>
                <Typography fontWeight={700} fontSize="0.95rem" color="#0f172a" mb={2}>
                  Delivery Progress
                </Typography>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {DELIVERY_STEPS.map((step, i) => (
                    <Step key={step.status} completed={i < activeStep}>
                      <StepLabel
                        StepIconProps={{
                          sx: {
                            '&.Mui-active': { color: '#00b4ff' },
                            '&.Mui-completed': { color: '#045668' },
                          },
                        }}
                      >
                        <Typography fontSize="0.72rem" fontWeight={600} color={i <= activeStep ? '#045668' : '#aaa'}>
                          {step.label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            )}

            {order.deliveryStatus === DeliveryStatus.CANCELLED && (
              <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f0f4f8' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderRadius: 2, background: '#fef2f2', border: '1px solid #fecaca' }}>
                  <Cancel sx={{ color: '#ef4444', fontSize: 20 }} />
                  <Typography fontSize="0.85rem" fontWeight={600} color="#dc2626">
                    This order has been cancelled
                  </Typography>
                </Box>
              </Box>
            )}

            {/* ── Items ── */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #f0f4f8' }}>
              <Typography fontWeight={700} fontSize="0.95rem" color="#0f172a" mb={2}>
                Order Items ({order.items.length})
              </Typography>

              <Stack spacing={1.5}>
                {order.items.map((item) => (
                  <Box key={item.id} sx={{
                    display: 'flex', alignItems: 'center', gap: 2,
                    p: 1.5, borderRadius: 2, background: '#f8faff', border: '1px solid #eaeef8',
                  }}>
                    <Avatar
                      src={item.productImageUrl}
                      variant="rounded"
                      sx={{ width: 56, height: 56, borderRadius: 2, flexShrink: 0 }}
                    >
                      {item.productName.charAt(0)}
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                      <Typography fontWeight={700} fontSize="0.9rem" color="#0f172a" noWrap>
                        {item.productName}
                      </Typography>
                      <Typography fontSize="0.78rem" color="#64748b">
                        {item.unitPrice.toLocaleString()} VNĐ × {item.quantity}
                      </Typography>
                    </Box>
                    <Typography fontWeight={700} fontSize="0.9rem" color="#045668" flexShrink={0}>
                      {item.subtotal.toLocaleString()} VNĐ
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* ── Total ── */}
            <Box sx={{
              px: 3, py: 2.5,
              background: 'linear-gradient(135deg, #f0fbff, #e6f6ff)',
              borderTop: '2px solid rgba(0,180,255,0.15)',
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={700} fontSize="1rem" color="#0f172a">
                  Total Amount
                </Typography>
                <Typography fontWeight={900} fontSize="1.5rem" sx={{
                  background: BRAND_GRADIENT,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {order.totalAmount.toLocaleString()} VNĐ
                </Typography>
              </Box>

              {order.notes && (
                <Box mt={1.5} p={1.5} borderRadius={2} sx={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,180,255,0.15)' }}>
                  <Typography fontSize="0.72rem" fontWeight={600} color="#64748b" textTransform="uppercase" letterSpacing={0.5} mb={0.3}>
                    Notes
                  </Typography>
                  <Typography fontSize="0.85rem" color="#334155">{order.notes}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
