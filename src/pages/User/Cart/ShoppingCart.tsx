import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  IconButton,
  Avatar,
  TextField,
  Divider,
  Container,
  Stack,
  Checkbox,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart as CartIcon, ShoppingBag, ArrowBack, LocalOffer, Check } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import PowerGymLayout from '../../../components/PowerGym/Layout/PowerGymLayout';
import { useCart } from '../../../context/CartContext';
import BankPaymentModal from '../../../components/Payment/BankPaymentModal';
import { useAuth } from '../../../hooks/useAuth';
import TablePagination from '../../../components/Common/TablePagination';
import promotionService from '../../../services/promotionService';
import type { ApplyPromotionResponse } from '../../../@type/reward';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const ShoppingCart: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const [bankPaymentModalOpen, setBankPaymentModalOpen] = useState(false);
  // If navigated via "Buy Now", pre-select only that product; otherwise select all
  const buyNowProductId: number | undefined = (location.state as any)?.buyNowProductId;
  const [selectedItems, setSelectedItems] = useState<Set<number>>(
    buyNowProductId
      ? new Set([buyNowProductId])
      : new Set(items.map(item => item.productId))
  );
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart');
  const [cartPage, setCartPage] = useState(0);
  const CART_PAGE_SIZE = 5;

  // Promotion code
  const [promoCode, setPromoCode] = useState('');
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [promoData, setPromoData] = useState<ApplyPromotionResponse | null>(null);
  const [promoError, setPromoError] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState({
    customerName: user?.fullName ?? '',
    customerPhone: user?.phoneNumber ?? '',
    customerAddress: '',
    notes: ''
  });
  const [deliveryErrors, setDeliveryErrors] = useState({
    customerName: !user?.fullName ? 'Customer name is required' : '',
    customerPhone: !user?.phoneNumber ? 'Phone number is required' : '',
    customerAddress: 'Delivery address is required'
  });

  const handleQuantityChange = (productId: number, newQuantity: number, stock: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > stock) {
      alert(`Cannot add more than ${stock} items`);
      return;
    }
    
    try {
      updateQuantity(productId, newQuantity);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleToggleItem = (productId: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleToggleAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.productId)));
    }
  };

  const selectedTotal = useMemo(() => {
    return items
      .filter(item => selectedItems.has(item.productId))
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items, selectedItems]);

  const selectedCount = useMemo(() => {
    return items
      .filter(item => selectedItems.has(item.productId))
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [items, selectedItems]);

  const pagedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0));
    const start = cartPage * CART_PAGE_SIZE;
    return sorted.slice(start, start + CART_PAGE_SIZE);
  }, [items, cartPage]);

  const discountAmount = promoData?.discountAmount ?? 0;
  const finalTotal = promoData?.finalAmount ?? selectedTotal;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) { setPromoError('Please enter a promotion code'); return; }
    setApplyingPromo(true);
    setPromoError('');
    try {
      const res = await promotionService.applyPromotion({
        promotionCode: promoCode.trim().toUpperCase(),
        orderAmount: selectedTotal,
      });
      if (res.success) {
        setPromoData(res);
      } else {
        setPromoError(res.message || 'Invalid promotion code');
        setPromoData(null);
      }
    } catch (err: any) {
      setPromoError(err?.response?.data?.message || 'Failed to apply promotion code');
      setPromoData(null);
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoData(null);
    setPromoError('');
  };

  const selectedCartItems = useMemo(() => {
    return items
      .filter(item => selectedItems.has(item.productId))
      .map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
  }, [items, selectedItems]);

  const selectedProductsInfo = useMemo(() => {
    return items
      .filter(item => selectedItems.has(item.productId))
      .map(item => `${item.name} (x${item.quantity})`)
      .join(', ');
  }, [items, selectedItems]);

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      alert('Please select at least one item to checkout');
      return;
    }
    if (!user) {
      alert('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    // Sync delivery info from current session
    const name = user.fullName ?? '';
    const phone = user.phoneNumber ?? '';
    setDeliveryInfo(prev => ({
      ...prev,
      customerName: prev.customerName || name,
      customerPhone: prev.customerPhone || phone,
    }));
    setDeliveryErrors({
      customerName: !name && !deliveryInfo.customerName ? 'Customer name is required' : '',
      customerPhone: !phone && !deliveryInfo.customerPhone ? 'Phone number is required' : '',
      customerAddress: !deliveryInfo.customerAddress ? 'Delivery address is required' : '',
    });
    setCheckoutStep('checkout');
  };

  const handleBackToCart = () => {
    setCheckoutStep('cart');
  };

  const validateDeliveryInfo = () => {
    const errors = {
      customerName: '',
      customerPhone: '',
      customerAddress: ''
    };
    let isValid = true;

    if (!deliveryInfo.customerName.trim()) {
      errors.customerName = 'Customer name is required';
      isValid = false;
    }

    if (!deliveryInfo.customerPhone.trim()) {
      errors.customerPhone = 'Phone number is required';
      isValid = false;
    } else if (!/^[0-9]{10,11}$/.test(deliveryInfo.customerPhone.trim())) {
      errors.customerPhone = 'Phone number must be 10-11 digits';
      isValid = false;
    }

    if (!deliveryInfo.customerAddress.trim()) {
      errors.customerAddress = 'Delivery address is required';
      isValid = false;
    }

    setDeliveryErrors(errors);
    return isValid;
  };

  const handleProceedToPayment = () => {
    if (!validateDeliveryInfo()) {
      return;
    }
    // Skip payment method selection — go straight to bank payment (QR)
    setBankPaymentModalOpen(true);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleBankPaymentSuccess = () => {
    // Clear selected items from cart after successful payment
    const selectedProductIds = Array.from(selectedItems);
    selectedProductIds.forEach(productId => {
      removeFromCart(productId);
    });
    setSelectedItems(new Set());
    setBankPaymentModalOpen(false);
  };

  if (items.length === 0) {
    return (
      <PowerGymLayout>
        {/* Hero Banner */}
        <Box
          sx={{
            background: BRAND_GRADIENT,
            py: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{
            position: 'absolute', top: -80, right: -80, width: 360, height: 360,
            borderRadius: '50%', background: 'rgb(19,102,186)', pointerEvents: 'none',
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
                Shopping Cart
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Empty State */}
        <Box sx={{ background: '#f4f6f9', py: { xs: 6, md: 9 } }}>
          <Container maxWidth="xl">
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              py={8}
              sx={{
                background: '#fff',
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.07)',
              }}
            >
              <CartIcon sx={{ fontSize: 100, color: '#cbd5e1', mb: 3 }} />
              <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
                Your cart is empty
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={4}>
                Add some products to get started
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                startIcon={<ShoppingBag />}
                onClick={handleContinueShopping}
                sx={{
                  background: BRAND_GRADIENT,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 4px 16px rgba(4,86,104,0.3)',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(4,86,104,0.45)',
                    background: BRAND_GRADIENT,
                  },
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Container>
        </Box>
      </PowerGymLayout>
    );
  }

  return (
    <PowerGymLayout>
      {/* Hero Banner */}
      <Box
        sx={{
          background: BRAND_GRADIENT,
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{
          position: 'absolute', top: -80, right: -80, width: 360, height: 360,
          borderRadius: '50%', background: 'rgb(19,102,186)', pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -60, left: -60, width: 260, height: 260,
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
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
              Shopping Cart
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
              Review your items and proceed to checkout
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Content */}
      <Box sx={{ background: '#f4f6f9', py: { xs: 6, md: 9 } }}>
        <Container maxWidth="xl">
          {checkoutStep === 'cart' ? (
            <>
              {/* Header */}
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Checkbox
                    checked={selectedItems.size === items.length && items.length > 0}
                    indeterminate={selectedItems.size > 0 && selectedItems.size < items.length}
                    onChange={handleToggleAll}
                    sx={{
                      color: '#1366ba',
                      '&.Mui-checked': { color: '#1366ba' },
                      '&.MuiCheckbox-indeterminate': { color: '#1366ba' },
                    }}
                  />
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{ color: '#1366ba', fontWeight: 700, letterSpacing: 4, fontSize: '0.68rem' }}
                    >
                      Your Cart
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="text.primary" mt={0.5}>
                      {items.reduce((sum, item) => sum + item.quantity, 0)} Items
                      {selectedItems.size > 0 && selectedItems.size < items.length && (
                        <Typography component="span" variant="body2" color="text.secondary" ml={1}>
                          ({selectedItems.size} selected)
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={clearCart}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    '&:hover': {
                      borderColor: '#dc2626',
                      background: 'rgba(239,68,68,0.05)',
                    },
                  }}
                >
                  Clear Cart
                </Button>
              </Stack>

              <Box display="flex" flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
            {/* Cart Items */}
            <Box flex={1}>
              <Stack spacing={2}>
                {pagedItems.map((item, idx) => (
                  <Card
                    key={item.productId}
                    sx={{
                      borderRadius: 3,
                      border: selectedItems.has(item.productId) 
                        ? '2px solid #1366ba' 
                        : '1px solid rgba(0,0,0,0.07)',
                      overflow: 'hidden',
                      animationName: 'fadeUp',
                      animationDuration: '0.5s',
                      animationFillMode: 'both',
                      animationDelay: `${idx * 0.05}s`,
                      transition: 'all 0.2s ease',
                      '@keyframes fadeUp': {
                        from: { opacity: 0, transform: 'translateY(24px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                      },
                    }}
                  >
                    <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} p={3}>
                      {/* Checkbox */}
                      <Box display="flex" alignItems="center">
                        <Checkbox
                          checked={selectedItems.has(item.productId)}
                          onChange={() => handleToggleItem(item.productId)}
                          sx={{
                            color: '#1366ba',
                            '&.Mui-checked': { color: '#1366ba' },
                          }}
                        />
                      </Box>
                      
                      {/* Product Image */}
                      <Avatar
                        src={item.imageUrl}
                        variant="rounded"
                        sx={{ 
                          width: { xs: '100%', sm: 120 }, 
                          height: { xs: 200, sm: 120 },
                          borderRadius: 2,
                        }}
                      >
                        {item.name.charAt(0)}
                      </Avatar>

                      {/* Product Info */}
                      <Box flex={1} display="flex" flexDirection="column">
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Box>
                            <Typography variant="h6" fontWeight={700} color="text.primary">
                              {item.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Available: {item.stock} units
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => removeFromCart(item.productId)}
                            sx={{
                              color: '#ef4444',
                              '&:hover': {
                                background: 'rgba(239,68,68,0.1)',
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>

                        <Box 
                          display="flex" 
                          flexDirection={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between" 
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                          gap={2}
                          mt="auto"
                        >
                          {/* Price */}
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Unit Price
                            </Typography>
                            <Typography variant="h6" fontWeight={700} color="primary">
                              {item.price.toLocaleString()} VNĐ
                            </Typography>
                          </Box>

                          {/* Quantity Selector */}
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                              Quantity
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '2px solid',
                                borderColor: 'rgba(4,86,104,0.2)',
                                borderRadius: 2,
                                overflow: 'hidden',
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1, item.stock)}
                                disabled={item.quantity <= 1}
                                sx={{
                                  borderRadius: 0,
                                  px: 1.5,
                                  '&:hover': {
                                    background: 'rgba(4,86,104,0.05)',
                                  },
                                }}
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              
                              <TextField
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 1;
                                  handleQuantityChange(item.productId, value, item.stock);
                                }}
                                size="small"
                                sx={{ 
                                  width: 60,
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': { border: 'none' },
                                  },
                                  '& input': {
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    p: 0.5,
                                  },
                                }}
                                slotProps={{
                                  htmlInput: {
                                    min: 1,
                                    max: item.stock,
                                  }
                                }}
                              />
                              
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1, item.stock)}
                                disabled={item.quantity >= item.stock}
                                sx={{
                                  borderRadius: 0,
                                  px: 1.5,
                                  '&:hover': {
                                    background: 'rgba(4,86,104,0.05)',
                                  },
                                }}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Box>
                            {item.quantity >= item.stock && (
                              <Typography variant="caption" color="warning.main" display="block" mt={0.5}>
                                Max quantity reached
                              </Typography>
                            )}
                          </Box>

                          {/* Subtotal */}
                          <Box textAlign={{ xs: 'left', sm: 'right' }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Subtotal
                            </Typography>
                            <Typography variant="h6" fontWeight={700} sx={{
                              background: BRAND_GRADIENT,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                            }}>
                              {(item.price * item.quantity).toLocaleString()} VNĐ
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Stack>

              {/* Pagination */}
              {items.length > CART_PAGE_SIZE && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <TablePagination
                    count={items.length}
                    page={cartPage}
                    rowsPerPage={CART_PAGE_SIZE}
                    onPageChange={(_e, newPage) => setCartPage(newPage)}
                    onRowsPerPageChange={() => {}}
                    rowsPerPageOptions={[]}
                    labelRowsPerPage=""
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count} items`}
                  />
                </Box>
              )}
            </Box>

            {/* Order Summary */}
            <Box sx={{ width: { xs: '100%', lg: 380 } }}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(0,0,0,0.07)',
                  position: { lg: 'sticky' },
                  top: { lg: 24 },
                }}
              >
                <Box
                  sx={{
                    background: BRAND_GRADIENT,
                    p: 3,
                    color: '#fff',
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    Order Summary
                  </Typography>
                </Box>

                <Box p={3}>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body1" color="text.secondary">
                      Selected Items:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedCount} items
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="space-between" mb={3}>
                    <Typography variant="h6" fontWeight={700}>Total:</Typography>
                    <Typography variant="h5" fontWeight={700} sx={{
                      background: BRAND_GRADIENT,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {selectedTotal.toLocaleString()} VNĐ
                    </Typography>
                  </Box>
                  
                  {selectedItems.size === 0 && (
                    <Typography 
                      variant="caption" 
                      color="warning.main" 
                      display="block" 
                      mb={2}
                      textAlign="center"
                    >
                      Please select at least one item
                    </Typography>
                  )}

                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleCheckout}
                      disabled={selectedItems.size === 0}
                      sx={{
                        background: BRAND_GRADIENT,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 700,
                        py: 1.5,
                        boxShadow: '0 4px 16px rgba(4,86,104,0.3)',
                        '&:hover': {
                          boxShadow: '0 8px 24px rgba(4,86,104,0.45)',
                          background: BRAND_GRADIENT,
                        },
                        '&:disabled': {
                          background: '#cbd5e1',
                          color: '#94a3b8',
                        },
                      }}
                    >
                      Proceed to Checkout
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      startIcon={<ArrowBack />}
                      onClick={handleContinueShopping}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5,
                        borderColor: 'rgba(4,86,104,0.3)',
                        color: '#045668',
                        '&:hover': {
                          borderColor: '#045668',
                          background: 'rgba(4,86,104,0.05)',
                        },
                      }}
                    >
                      Continue Shopping
                    </Button>
                  </Stack>
                </Box>
              </Card>
            </Box>
          </Box>
            </>
          ) : (
            <>
              {/* Checkout Form */}
              <Box mb={4}>
                <Button
                  variant="text"
                  startIcon={<ArrowBack />}
                  onClick={handleBackToCart}
                  sx={{
                    color: '#045668',
                    textTransform: 'none',
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  Back to Cart
                </Button>
                <Typography
                  variant="overline"
                  sx={{ color: '#1366ba', fontWeight: 700, letterSpacing: 4, fontSize: '0.68rem', display: 'block' }}
                >
                  Checkout
                </Typography>
                <Typography variant="h5" fontWeight={700} color="text.primary" mt={0.5}>
                  Delivery Information
                </Typography>
              </Box>

              <Box display="flex" flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
                {/* Delivery Form */}
                <Box flex={1}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: '1px solid rgba(0,0,0,0.07)',
                      p: 4,
                    }}
                  >
                    <Stack spacing={3}>
                      <TextField
                        label="Customer Name"
                        required
                        fullWidth
                        value={deliveryInfo.customerName}
                        onChange={(e) => {
                          setDeliveryInfo({ ...deliveryInfo, customerName: e.target.value });
                          setDeliveryErrors({ ...deliveryErrors, customerName: '' });
                        }}
                        error={!!deliveryErrors.customerName}
                        helperText={deliveryErrors.customerName}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />

                      <TextField
                        label="Phone Number"
                        required
                        fullWidth
                        value={deliveryInfo.customerPhone}
                        onChange={(e) => {
                          setDeliveryInfo({ ...deliveryInfo, customerPhone: e.target.value });
                          setDeliveryErrors({ ...deliveryErrors, customerPhone: '' });
                        }}
                        error={!!deliveryErrors.customerPhone}
                        helperText={deliveryErrors.customerPhone || 'Enter 10-11 digit phone number'}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />

                      <TextField
                        label="Delivery Address"
                        required
                        fullWidth
                        multiline
                        rows={3}
                        value={deliveryInfo.customerAddress}
                        onChange={(e) => {
                          setDeliveryInfo({ ...deliveryInfo, customerAddress: e.target.value });
                          setDeliveryErrors({ ...deliveryErrors, customerAddress: '' });
                        }}
                        error={!!deliveryErrors.customerAddress}
                        helperText={deliveryErrors.customerAddress}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />

                      <TextField
                        label="Notes (Optional)"
                        fullWidth
                        multiline
                        rows={2}
                        value={deliveryInfo.notes}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, notes: e.target.value })}
                        placeholder="Any special instructions for delivery..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Stack>
                  </Card>
                </Box>

                {/* Order Summary */}
                <Box sx={{ width: { xs: '100%', lg: 380 } }}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: '1px solid rgba(0,0,0,0.07)',
                      position: { lg: 'sticky' },
                      top: { lg: 24 },
                    }}
                  >
                    <Box
                      sx={{
                        background: BRAND_GRADIENT,
                        p: 3,
                        color: '#fff',
                      }}
                    >
                      <Typography variant="h6" fontWeight={700}>
                        Order Summary
                      </Typography>
                    </Box>

                    <Box p={3}>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="body1" color="text.secondary">
                          Selected Items:
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {selectedCount} items
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />

                      {/* Promotion Code — shown in checkout step */}
                      <Box mb={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocalOffer sx={{ color: '#00b4ff', fontSize: 18 }} />
                          <Typography variant="body2" fontWeight={700} color="#045668">
                            Promotion Code
                          </Typography>
                        </Box>
                        {!promoData ? (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                              size="small"
                              placeholder="Enter code"
                              value={promoCode}
                              onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                              onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                              disabled={applyingPromo}
                              error={!!promoError}
                              helperText={promoError}
                              sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.85rem' } }}
                            />
                            <Button
                              variant="contained"
                              onClick={handleApplyPromo}
                              disabled={applyingPromo || !promoCode.trim()}
                              sx={{
                                textTransform: 'none', fontWeight: 600, borderRadius: 2,
                                background: 'linear-gradient(135deg, #045668 0%, #00b4ff 100%)',
                                minWidth: 72,
                              }}
                            >
                              {applyingPromo ? <CircularProgress size={18} color="inherit" /> : 'Apply'}
                            </Button>
                          </Box>
                        ) : (
                          <Box sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            p: 1.5, borderRadius: 2,
                            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                            border: '1px solid #81c784',
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                icon={<Check sx={{ fontSize: '14px !important' }} />}
                                label={promoData.promotionCode}
                                size="small"
                                sx={{ background: '#4caf50', color: '#fff', fontWeight: 700, fontSize: '0.72rem' }}
                              />
                              <Typography fontSize="0.78rem" fontWeight={600} color="#2e7d32">
                                {promoData.promotionName}
                              </Typography>
                            </Box>
                            <Button size="small" onClick={handleRemovePromo}
                              sx={{ textTransform: 'none', fontSize: '0.72rem', color: '#d32f2f', fontWeight: 600, minWidth: 0 }}>
                              Remove
                            </Button>
                          </Box>
                        )}
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Price breakdown */}
                      {promoData && discountAmount > 0 && (
                        <>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                              {selectedTotal.toLocaleString()} VNĐ
                            </Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="#4caf50" fontWeight={600}>Discount:</Typography>
                            <Typography variant="body2" color="#4caf50" fontWeight={700}>
                              -{discountAmount.toLocaleString()} VNĐ
                            </Typography>
                          </Box>
                        </>
                      )}
                      
                      <Box display="flex" justifyContent="space-between" mb={3}>
                        <Typography variant="h6" fontWeight={700}>
                          Total:
                        </Typography>
                        <Typography variant="h5" fontWeight={700} sx={{
                          background: BRAND_GRADIENT,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}>
                          {finalTotal.toLocaleString()} VNĐ
                        </Typography>
                      </Box>

                      <Stack spacing={2}>
                        <Button
                          variant="contained"
                          size="large"
                          fullWidth
                          onClick={handleProceedToPayment}
                          sx={{
                            background: BRAND_GRADIENT,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 700,
                            py: 1.5,
                            boxShadow: '0 4px 16px rgba(4,86,104,0.3)',
                            '&:hover': {
                              boxShadow: '0 8px 24px rgba(4,86,104,0.45)',
                              background: BRAND_GRADIENT,
                            },
                          }}
                        >
                          Proceed to Payment
                        </Button>
                      </Stack>
                    </Box>
                  </Card>
                </Box>
              </Box>
            </>
          )}
        </Container>
      </Box>

      {/* Bank Payment Modal */}
      <BankPaymentModal
        open={bankPaymentModalOpen}
        onClose={() => setBankPaymentModalOpen(false)}
        onSuccess={handleBankPaymentSuccess}
        serviceName={`Products: ${selectedProductsInfo}`}
        amount={finalTotal}
        serviceId={Array.from(selectedItems).join(',')}
        itemType="PRODUCT"
        itemName={selectedProductsInfo}
        deliveryInfo={deliveryInfo}
        cartItems={selectedCartItems}
      />
    </PowerGymLayout>
  );
};

export default ShoppingCart;
