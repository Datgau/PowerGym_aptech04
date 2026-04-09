import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  TextField,
  Alert,
  Divider,
} from '@mui/material';
import { Close, Add, Remove, ShoppingCart, Inventory2 } from '@mui/icons-material';
import type { Product } from '../../../types/product';
import { useCart } from '../../../context/CartContext';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

interface ProductDetailModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  open,
  product,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const { addToCart, getItemQuantity } = useCart();

  if (!product) return null;

  const inCart = getItemQuantity(product.id);
  const maxQuantity = product.stock - inCart;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      setQuantity(1);
    } else if (newQuantity > maxQuantity) {
      setQuantity(maxQuantity);
      setError(`Only ${maxQuantity} units available`);
    } else {
      setQuantity(newQuantity);
      setError('');
    }
  };

  const handleAddToCart = () => {
    try {
      setError('');
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
      }, quantity);
      
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleClose = () => {
    setQuantity(1);
    setError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      {/* Header with gradient background */}
      <Box
        sx={{
          background: BRAND_GRADIENT,
          p: 3,
          position: 'relative',
          color: '#fff',
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: '#fff',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            '&:hover': {
              background: 'rgba(255,255,255,0.2)',
            },
          }}
        >
          <Close />
        </IconButton>
        
        <Typography variant="h5" fontWeight={700}>
          Product Details
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          View product information and add to cart
        </Typography>
      </Box>
      
      <DialogContent sx={{ p: 0 }}>
        {error && (
          <Alert severity="error" sx={{ m: 3, mb: 0, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={0}>
          {/* Product Image */}
          <Box
            sx={{
              width: { xs: '100%', md: '45%' },
              position: 'relative',
              overflow: 'hidden',
              background: '#f8faff',
            }}
          >
            <Box
              component="img"
              src={product.imageUrl || '/placeholder-product.png'}
              alt={product.name}
              sx={{
                width: '100%',
                height: { xs: 300, md: 400 },
                objectFit: 'cover',
              }}
            />
            
            {/* Status Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
              }}
            >
              {product.outOfStock ? (
                <Chip 
                  label="Out of Stock" 
                  sx={{
                    background: 'rgba(220,38,38,0.9)',
                    color: '#fff',
                    fontWeight: 600,
                    backdropFilter: 'blur(8px)',
                  }}
                />
              ) : product.lowStock ? (
                <Chip 
                  label="Low Stock" 
                  sx={{
                    background: 'rgba(245,158,11,0.9)',
                    color: '#fff',
                    fontWeight: 600,
                    backdropFilter: 'blur(8px)',
                  }}
                />
              ) : (
                <Chip 
                  label="In Stock" 
                  sx={{
                    background: 'rgba(34,197,94,0.9)',
                    color: '#fff',
                    fontWeight: 600,
                    backdropFilter: 'blur(8px)',
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Product Info */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              p: 4,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom color="text.primary">
              {product.name}
            </Typography>

            <Box 
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
                p: 2,
                borderRadius: 2,
                background: 'rgba(4,86,104,0.05)',
                border: '1px solid rgba(4,86,104,0.1)',
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Price
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ 
                  background: BRAND_GRADIENT,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {product.price.toLocaleString()} VNĐ
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
              {product.description}
            </Typography>

            <Box 
              sx={{
                display: 'flex',
                gap: 3,
                mb: 3,
                p: 2,
                borderRadius: 2,
                background: '#f8faff',
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Inventory2 sx={{ color: '#045668', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Available Stock
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {product.stock} units
                  </Typography>
                </Box>
              </Box>
              
              {inCart > 0 && (
                <>
                  <Divider orientation="vertical" flexItem />
                  <Box display="flex" alignItems="center" gap={1}>
                    <ShoppingCart sx={{ color: '#045668', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        In Your Cart
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color="primary">
                        {inCart} units
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Box>

            {/* Quantity Selector */}
            {!product.outOfStock && maxQuantity > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom color="text.primary">
                  Select Quantity
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
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
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      sx={{
                        borderRadius: 0,
                        px: 2,
                        '&:hover': {
                          background: 'rgba(4,86,104,0.05)',
                        },
                      }}
                    >
                      <Remove />
                    </IconButton>
                    
                    <TextField
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      size="small"
                      sx={{ 
                        width: 80,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: 'none' },
                        },
                        '& input': {
                          textAlign: 'center',
                          fontWeight: 600,
                          fontSize: '1.1rem',
                        },
                      }}
                      inputProps={{
                        min: 1,
                        max: maxQuantity,
                      }}
                    />
                    
                    <IconButton
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= maxQuantity}
                      sx={{
                        borderRadius: 0,
                        px: 2,
                        '&:hover': {
                          background: 'rgba(4,86,104,0.05)',
                        },
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary">
                    Max: {maxQuantity} units
                  </Typography>
                </Box>
              </Box>
            )}

            {product.outOfStock && (
              <Alert 
                severity="warning" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: '#f59e0b',
                  },
                }}
              >
                This product is currently out of stock
              </Alert>
            )}

            {maxQuantity === 0 && !product.outOfStock && (
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                }}
              >
                You have reached the maximum available quantity in your cart
              </Alert>
            )}

            {/* Action Buttons */}
            <Box display="flex" gap={2} mt="auto">
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  flex: 1,
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
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={product.outOfStock || maxQuantity === 0}
                sx={{
                  flex: 2,
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
                  '&.Mui-disabled': {
                    background: '#ccc',
                    boxShadow: 'none',
                  },
                }}
              >
                Add {quantity > 1 ? `${quantity} items` : ''} to Cart
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
