import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Close,
  Add,
  Remove,
  Delete,
  Search,
  ShoppingCart,
  Person,
  Phone,
  PointOfSale,
  CheckCircle,
  Print,
  ArrowBack,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getProducts } from '../../../../services/productService';
import { createProductOrder, downloadOrderInvoice } from '../../../../services/productOrderService';
import type { Product } from '../../../../types/product';
import { SaleType } from '../../../../types/productOrder';
import type { ProductOrder } from '../../../../types/productOrder';
interface CartItem {
  product: Product;
  quantity: number;
}

interface CounterSaleModalProps {
  open: boolean;
  onClose: () => void;
  /** Called after order is created so OrderList can refresh */
  onOrderCreated?: (orderId: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

// ─── Component ────────────────────────────────────────────────────────────────

const CounterSaleModal: React.FC<CounterSaleModalProps> = ({ open, onClose, onOrderCreated }) => {
  type Step = 'products' | 'customer' | 'done';
  const [step, setStep] = useState<Step>('products');

  // Product search & list
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState<ProductOrder | null>(null);
  const [printingInvoice, setPrintingInvoice] = useState(false);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep('products');
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setNotes('');
      setNameError('');
      setPhoneError('');
      setError('');
      setCreatedOrder(null);
      setSearch('');
      setDebouncedSearch('');
    }
  }, [open]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Load products
  useEffect(() => {
    if (open) loadProducts();
  }, [open, debouncedSearch]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await getProducts(0, 50, debouncedSearch || undefined, 'in_stock');
      setProducts(res.content);
    } catch {
      // silent
    } finally {
      setLoadingProducts(false);
    }
  };

  // ── Cart helpers ──────────────────────────────────────────────────────────

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.warning(`Only ${product.stock} unit(s) left in stock`);
          return prev;
        }
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const updateQty = useCallback((productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.product.id !== productId) return i;
          const next = i.quantity + delta;
          if (next <= 0) return null as unknown as CartItem;
          if (next > i.product.stock) {
            toast.warning(`Only ${i.product.stock} unit(s) left in stock`);
            return i;
          }
          return { ...i, quantity: next };
        })
        .filter(Boolean)
    );
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const totalAmount = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  // ── Validation ────────────────────────────────────────────────────────────

  const validateCustomer = () => {
    let valid = true;
    if (!customerName.trim()) {
      setNameError('Customer name is required');
      valid = false;
    } else {
      setNameError('');
    }
    if (!customerPhone.trim()) {
      setPhoneError('Phone number is required');
      valid = false;
    } else if (!/^[0-9]{9,11}$/.test(customerPhone.replace(/\s/g, ''))) {
      setPhoneError('Invalid phone number (9–11 digits)');
      valid = false;
    } else {
      setPhoneError('');
    }
    return valid;
  };
  
  const handleSubmit = async () => {
    if (!validateCustomer()) return;
    try {
      setSubmitting(true);
      setError('');
      const order = await createProductOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        saleType: SaleType.COUNTER,
        notes: notes.trim() || undefined,
        items: cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      });
      setCreatedOrder(order);
      setStep('done');
      onOrderCreated?.(order.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Invoice ───────────────────────────────────────────────────────────────

  const handlePrintInvoice = async () => {
    if (!createdOrder) return;
    try {
      setPrintingInvoice(true);
      const blob = await downloadOrderInvoice(createdOrder.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-order-${createdOrder.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download invoice');
    } finally {
      setPrintingInvoice(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  const stepLabel = step === 'products' ? '1' : step === 'customer' ? '2' : '3';
  const stepTitle =
    step === 'products'
      ? 'Select Products'
      : step === 'customer'
      ? 'Customer Information'
      : 'Order Created';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 8px 40px rgba(0,0,0,0.14)', height: '90vh' } }}
    >
      {/* ── Title ── */}
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #00b4ff22, #0066ff22)',
        borderBottom: '1px solid #eaeef8', pb: 2, flexShrink: 0,
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <PointOfSale sx={{ color: '#0066ff', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" fontWeight={700} color="#0f172a">{stepTitle}</Typography>
              {step !== 'done' && (
                <Typography fontSize={12} color="#64748b">Counter Sale · Step {stepLabel} / 2</Typography>
              )}
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* ── Content ── */}
      <DialogContent sx={{ p: 0, display: 'flex', overflow: 'hidden', flex: 1 }}>

        {/* ════ Step 1: Products ════ */}
        {step === 'products' && (
          <Box display="flex" width="100%" overflow="hidden">

            {/* Left: product list */}
            <Box flex={1} display="flex" flexDirection="column" borderRight="1px solid #eaeef8" overflow="hidden">
              <Box p={2} borderBottom="1px solid #eaeef8" flexShrink={0}>
                <TextField
                  fullWidth size="small"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#64748b', fontSize: 18 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, background: '#f8fafc' } }}
                />
              </Box>

              <Box flex={1} overflow="auto" p={2}>
                {loadingProducts ? (
                  <Box display="flex" justifyContent="center" pt={4}>
                    <CircularProgress size={32} sx={{ color: '#0066ff' }} />
                  </Box>
                ) : products.length === 0 ? (
                  <Box textAlign="center" py={6} color="#94a3b8">
                    <Typography>No products found</Typography>
                  </Box>
                ) : (
                  <Box display="flex" flexDirection="column" gap={1}>
                    {products.map((product) => {
                      const inCart = cart.find((i) => i.product.id === product.id);
                      return (
                        <Box
                          key={product.id}
                          onClick={() => !product.outOfStock && addToCart(product)}
                          sx={{
                            display: 'flex', alignItems: 'center', gap: 2,
                            p: 1.5, borderRadius: 2,
                            border: inCart ? '2px solid #0066ff' : '1px solid #eaeef8',
                            background: inCart ? '#f0f7ff' : '#fff',
                            cursor: product.outOfStock ? 'not-allowed' : 'pointer',
                            opacity: product.outOfStock ? 0.5 : 1,
                            transition: 'all 0.15s',
                            '&:hover': !product.outOfStock ? { borderColor: '#0066ff', background: '#f8faff' } : {},
                          }}
                        >
                          <Avatar src={product.imageUrl} variant="rounded" sx={{ width: 44, height: 44 }}>
                            {product.name.charAt(0)}
                          </Avatar>
                          <Box flex={1} minWidth={0}>
                            <Typography fontWeight={600} fontSize={14} noWrap>{product.name}</Typography>
                            <Typography fontSize={12} color="#64748b">
                              Stock: {product.stock} · {formatCurrency(product.price)}
                            </Typography>
                          </Box>
                          {inCart ? (
                            <Chip
                              label={`×${inCart.quantity}`}
                              size="small"
                              sx={{ background: '#0066ff', color: '#fff', fontWeight: 700 }}
                            />
                          ) : (
                            <Add sx={{ color: '#0066ff', fontSize: 20 }} />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Right: cart */}
            <Box width={340} display="flex" flexDirection="column" overflow="hidden">
              <Box p={2} borderBottom="1px solid #eaeef8" flexShrink={0}
                display="flex" alignItems="center" gap={1}>
                <Badge badgeContent={totalItems} color="primary">
                  <ShoppingCart sx={{ color: '#0066ff' }} />
                </Badge>
                <Typography fontWeight={700} fontSize={15} color="#0f172a">Cart</Typography>
              </Box>

              <Box flex={1} overflow="auto" p={2}>
                {cart.length === 0 ? (
                  <Box textAlign="center" py={6} color="#94a3b8">
                    <ShoppingCart sx={{ fontSize: 40, mb: 1, opacity: 0.3 }} />
                    <Typography fontSize={13}>No items added yet</Typography>
                    <Typography fontSize={12}>Click a product to add it</Typography>
                  </Box>
                ) : (
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    {cart.map((item) => (
                      <Box key={item.product.id} sx={{
                        p: 1.5, borderRadius: 2, border: '1px solid #eaeef8', background: '#f8faff',
                      }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Avatar src={item.product.imageUrl} variant="rounded"
                            sx={{ width: 32, height: 32, fontSize: 12 }}>
                            {item.product.name.charAt(0)}
                          </Avatar>
                          <Typography fontWeight={600} fontSize={13} flex={1} noWrap>
                            {item.product.name}
                          </Typography>
                          <IconButton size="small" onClick={() => removeFromCart(item.product.id)}
                            sx={{ color: '#ef4444', p: 0.3 }}>
                            <Delete sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <IconButton size="small" onClick={() => updateQty(item.product.id, -1)}
                              sx={{ border: '1px solid #eaeef8', p: 0.3 }}>
                              <Remove sx={{ fontSize: 14 }} />
                            </IconButton>
                            <Typography fontWeight={700} fontSize={14} minWidth={24} textAlign="center">
                              {item.quantity}
                            </Typography>
                            <IconButton size="small" onClick={() => updateQty(item.product.id, 1)}
                              sx={{ border: '1px solid #eaeef8', p: 0.3 }}>
                              <Add sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                          <Typography fontWeight={700} fontSize={13} color="#0066ff">
                            {formatCurrency(item.product.price * item.quantity)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              {/* Total */}
              {cart.length > 0 && (
                <Box p={2} borderTop="1px solid #eaeef8" flexShrink={0}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography fontSize={13} color="#64748b">Quantity</Typography>
                    <Typography fontSize={13} fontWeight={600}>{totalItems} item(s)</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={700} fontSize={15}>Total</Typography>
                    <Typography fontWeight={700} fontSize={15} color="#0066ff">
                      {formatCurrency(totalAmount)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* ════ Step 2: Customer info ════ */}
        {step === 'customer' && (
          <Box p={3} width="100%" overflow="auto">
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Order summary */}
            <Box sx={{ background: '#f8faff', borderRadius: 2, border: '1px solid #eaeef8', p: 2, mb: 3 }}>
              <Typography fontWeight={700} fontSize={14} color="#0f172a" mb={1.5}>
                Order Summary
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #eaeef8' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: '#f1f5f9' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Product</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, fontSize: 12 }}>Qty</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: 12 }}>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.product.id}>
                        <TableCell sx={{ fontSize: 13 }}>{item.product.name}</TableCell>
                        <TableCell align="center" sx={{ fontSize: 13 }}>{item.quantity}</TableCell>
                        <TableCell align="right" sx={{ fontSize: 13, fontWeight: 600, color: '#0066ff' }}>
                          {formatCurrency(item.product.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} sx={{ fontWeight: 700, fontSize: 14, borderTop: '2px solid #eaeef8' }}>
                        Total
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: 15, color: '#0066ff', borderTop: '2px solid #eaeef8' }}>
                        {formatCurrency(totalAmount)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Customer fields */}
            <Typography fontWeight={700} fontSize={14} color="#0f172a" mb={2}>
              Customer Information
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Customer Name *"
                value={customerName}
                onChange={(e) => { setCustomerName(e.target.value); setNameError(''); }}
                error={!!nameError}
                helperText={nameError}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#64748b', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                label="Phone Number *"
                value={customerPhone}
                onChange={(e) => { setCustomerPhone(e.target.value); setPhoneError(''); }}
                error={!!phoneError}
                helperText={phoneError}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: '#64748b', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                label="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline rows={2} fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>
          </Box>
        )}

        {/* ════ Step 3: Done ════ */}
        {step === 'done' && createdOrder && (
          <Box width="100%" overflow="auto" p={4}>
            {/* Success header */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
              <CheckCircle sx={{ fontSize: 64, color: '#22c55e', mb: 1.5 }} />
              <Typography variant="h5" fontWeight={700} color="#0f172a" mb={0.5}>
                Order Created Successfully!
              </Typography>
              <Typography color="#64748b" textAlign="center">
                Order <strong>#{createdOrder.id}</strong> for <strong>{createdOrder.customerName}</strong> has been saved.
              </Typography>
            </Box>

            {/* Two-column layout: order info + items */}
            <Box display="flex" gap={3} flexWrap="wrap">

              {/* Left: order info */}
              <Box sx={{
                flex: '0 0 280px',
                background: '#f8faff', borderRadius: 2, border: '1px solid #eaeef8', p: 2.5,
                alignSelf: 'flex-start',
              }}>
                <Typography fontWeight={700} fontSize={13} color="#64748b" mb={1.5} textTransform="uppercase" letterSpacing={0.5}>
                  Order Details
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography fontSize={13} color="#64748b">Order ID</Typography>
                  <Typography fontSize={13} fontWeight={700}>#{createdOrder.id}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography fontSize={13} color="#64748b">Customer</Typography>
                  <Typography fontSize={13} fontWeight={600}>{createdOrder.customerName}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography fontSize={13} color="#64748b">Phone</Typography>
                  <Typography fontSize={13}>{createdOrder.customerPhone}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography fontSize={13} color="#64748b">Sale Type</Typography>
                  <Chip label="Counter" size="small" sx={{ fontSize: 11, height: 20, background: '#f0f7ff', color: '#0066ff', border: '1px solid #0066ff33' }} />
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography fontSize={13} color="#64748b">Payment</Typography>
                  <Chip label="Paid" size="small" color="success" sx={{ fontSize: 11, height: 20 }} />
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={14} fontWeight={700}>Total Amount</Typography>
                  <Typography fontSize={14} fontWeight={700} color="#0066ff">
                    {formatCurrency(createdOrder.totalAmount)}
                  </Typography>
                </Box>
              </Box>

              {/* Right: purchased items */}
              <Box flex={1} minWidth={300}>
                <Typography fontWeight={700} fontSize={13} color="#64748b" mb={1.5} textTransform="uppercase" letterSpacing={0.5}>
                  Items Purchased ({cart.length})
                </Typography>
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #eaeef8' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: '#f1f5f9' }}>
                        <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>Product</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, fontSize: 13 }}>Unit Price</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, fontSize: 13 }}>Qty</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: 13 }}>Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow key={item.product.id} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1.5}>
                              <Avatar
                                src={item.product.imageUrl}
                                variant="rounded"
                                sx={{ width: 40, height: 40 }}
                              >
                                {item.product.name.charAt(0)}
                              </Avatar>
                              <Typography fontWeight={600} fontSize={14}>{item.product.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center" sx={{ fontSize: 13 }}>
                            {formatCurrency(item.product.price)}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`×${item.quantity}`}
                              size="small"
                              sx={{ fontWeight: 700, background: '#f0f7ff', color: '#0066ff', border: '1px solid #0066ff33' }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, fontSize: 14, color: '#0066ff' }}>
                            {formatCurrency(item.product.price * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Total row */}
                      <TableRow sx={{ background: '#f8faff' }}>
                        <TableCell colSpan={3} sx={{ fontWeight: 700, fontSize: 14, borderTop: '2px solid #eaeef8' }}>
                          Total
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: 15, color: '#0066ff', borderTop: '2px solid #eaeef8' }}>
                          {formatCurrency(totalAmount)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>

            {/* Action buttons */}
            <Box display="flex" justifyContent="center" gap={2} mt={4}>
              <Button
                variant="outlined"
                startIcon={printingInvoice ? <CircularProgress size={16} /> : <Print />}
                onClick={handlePrintInvoice}
                disabled={printingInvoice}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
              >
                {printingInvoice ? 'Downloading...' : 'Print Invoice'}
              </Button>
              <Button
                variant="contained"
                onClick={onClose}
                sx={{
                  borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3,
                  background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                  '&:hover': { background: 'linear-gradient(135deg, #00c6ff, #0077ff)' },
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* ── Actions ── */}
      {step !== 'done' && (
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, borderTop: '1px solid #eaeef8', gap: 1, flexShrink: 0 }}>
          {step === 'customer' && (
            <Button
              onClick={() => setStep('products')}
              startIcon={<ArrowBack />}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, color: '#64748b' }}
            >
              Back
            </Button>
          )}
          <Box flex={1} />
          <Button
            onClick={onClose}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, color: '#64748b' }}
          >
            Cancel
          </Button>

          {step === 'products' && (
            <Tooltip title={cart.length === 0 ? 'Add at least 1 product' : ''}>
              <span>
                <Button
                  variant="contained"
                  disabled={cart.length === 0}
                  onClick={() => setStep('customer')}
                  endIcon={<Person />}
                  sx={{
                    borderRadius: 2, textTransform: 'none', fontWeight: 600,
                    background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                    '&:hover': { background: 'linear-gradient(135deg, #00c6ff, #0077ff)' },
                  }}
                >
                  Next ({cart.length} item(s) · {formatCurrency(totalAmount)})
                </Button>
              </span>
            </Tooltip>
          )}

          {step === 'customer' && (
            <Button
              variant="contained"
              disabled={submitting}
              onClick={handleSubmit}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <CheckCircle />}
              sx={{
                borderRadius: 2, textTransform: 'none', fontWeight: 600,
                background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                boxShadow: '0 4px 12px rgba(0,102,255,0.24)',
                '&:hover': { background: 'linear-gradient(135deg, #00c6ff, #0077ff)' },
              }}
            >
              {submitting ? 'Creating order...' : 'Confirm & Create Order'}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CounterSaleModal;
