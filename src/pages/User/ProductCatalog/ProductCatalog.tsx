import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Badge,
  Container,
  Stack,
} from '@mui/material';
import { Search, ShoppingCart, Add, Inventory, Clear, FlashOn } from '@mui/icons-material';
import PowerGymLayout from '../../../components/PowerGym/Layout/PowerGymLayout';
import { getProducts } from '../../../services/productService';
import type { Product } from '../../../types/product';
import { useCart } from '../../../context/CartContext';
import TablePagination from '../../../components/Common/TablePagination';
import { usePagination } from '../../../hooks/usePagination';
import ProductDetailModal from './ProductDetailModal';
import { useNavigate } from 'react-router-dom';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  
  const { addToCart, getItemQuantity, getItemCount } = useCart();
  const navigate = useNavigate();
  
  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(12);

  useEffect(() => {
    loadData();
  }, [paginationState.page, paginationState.rowsPerPage, search, minPrice, maxPrice]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Filter products by price range on client side
      const response = await getProducts(
        paginationState.page,
        paginationState.rowsPerPage,
        search || undefined,
        'in_stock'
      );
      
      let filteredProducts = response.content;
      
      // Apply price filters
      if (minPrice) {
        const min = parseFloat(minPrice);
        if (!isNaN(min)) {
          filteredProducts = filteredProducts.filter(p => p.price >= min);
        }
      }
      
      if (maxPrice) {
        const max = parseFloat(maxPrice);
        if (!isNaN(max)) {
          filteredProducts = filteredProducts.filter(p => p.price <= max);
        }
      }
      
      setProducts(filteredProducts);
      setPaginationData(response.totalPages, response.totalElements);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    try {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleBuyNow = (product: Product) => {
    try {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
      });
      navigate('/cart', { state: { buyNowProductId: product.id } });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
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
              Product Catalog
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
              Browse our selection of premium fitness products and supplements
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
          <Stack direction="row" alignItems="flex-end" justifyContent="space-between" mb={5}>
            <Box>
              <Typography
                variant="overline"
                sx={{ color: '#1366ba', fontWeight: 700, letterSpacing: 4, fontSize: '0.68rem' }}
              >
                Product Catalog
              </Typography>
              <Typography variant="h5" fontWeight={700} color="text.primary" mt={0.5}>
                {paginationState.totalElements} Products Available
              </Typography>
            </Box>
            
            
          </Stack>

          {/* Search bar */}
          <Box mb={3}>
            <TextField
              fullWidth
              placeholder="Search by product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearch('')}
                        sx={{ color: '#64748b' }}
                      >
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#fff',
                  },
                },
              }}
            />
          </Box>

          {/* Price Filter */}
          <Box mb={4} display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Filter by Price:
            </Typography>
            <TextField
              size="small"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              type="number"
              sx={{
                width: 150,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#fff',
                  },
                },
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
            <TextField
              size="small"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              type="number"
              sx={{
                width: 150,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#fff',
                  },
                },
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              }}
            />
            {(minPrice || maxPrice) && (
              <Button
                size="small"
                onClick={() => {
                  setMinPrice('');
                  setMaxPrice('');
                }}
                sx={{
                  textTransform: 'none',
                  color: '#64748b',
                  '&:hover': {
                    background: 'rgba(100,116,139,0.1)',
                  },
                }}
              >
                Clear
              </Button>
            )}
          </Box>

          {/* Products Grid */}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <Stack alignItems="center" spacing={2}>
                <CircularProgress size={60} />
                <Typography color="text.secondary">Loading products...</Typography>
              </Stack>
            </Box>
          ) : products.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Inventory sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" mb={1}>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {search ? 'Try adjusting your search' : 'Check back later for new products'}
              </Typography>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)', lg: 'repeat(4,1fr)' },
                  gap: 3,
                }}
              >
                {products.map((product, idx) => {
                  const inCart = getItemQuantity(product.id);
                  
                  return (
                    <Card 
                      key={product.id}
                      elevation={0}
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        cursor: 'pointer',
                        borderRadius: 3,
                        overflow: 'hidden',
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
                          transform: 'translateY(-6px)',
                          boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
                        },
                      }}
                      onClick={() => handleProductClick(product)}
                    >
                      <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={product.imageUrl || '/placeholder-product.png'}
                          alt={product.name}
                          sx={{ 
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            '&:hover': { transform: 'scale(1.06)' },
                          }}
                        />
                        <Box sx={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.45) 100%)',
                        }} />
                        {product.outOfStock ? (
                          <Chip
                            label="Out of Stock"
                            size="small"
                            sx={{
                              position: 'absolute', top: 12, right: 12,
                              background: 'rgba(220,38,38,0.85)',
                              color: '#fff', 
                              fontWeight: 600,
                              fontSize: '0.68rem',
                              letterSpacing: 0.5,
                            }}
                          />
                        ) : product.lowStock ? (
                          <Chip
                            label="Low Stock"
                            size="small"
                            sx={{
                              position: 'absolute', top: 12, right: 12,
                              background: 'rgba(245,158,11,0.85)',
                              color: '#fff', 
                              fontWeight: 600,
                              fontSize: '0.68rem',
                              letterSpacing: 0.5,
                            }}
                          />
                        ) : (
                          <Chip
                            label="In Stock"
                            size="small"
                            sx={{
                              position: 'absolute', top: 12, right: 12,
                              background: 'rgba(34,197,94,0.85)',
                              color: '#fff', 
                              fontWeight: 600,
                              fontSize: '0.68rem',
                              letterSpacing: 0.5,
                            }}
                          />
                        )}
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom noWrap color="text.primary" sx={{ mb: 1.5 }}>
                          {product.name}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            mb: 'auto',
                            minHeight: 40,
                            lineHeight: 1.6,
                            flex: 1,
                          }}
                        >
                          {product.description}
                        </Typography>
                        
                        <Box 
                          sx={{
                            mt: 2,
                            pt: 2,
                            borderTop: '1px solid',
                            borderColor: 'rgba(0,0,0,0.06)',
                          }}
                        >
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block" lineHeight={1}>
                                Price
                              </Typography>
                              <Typography variant="h6" color="primary" fontWeight={700} lineHeight={1.3}>
                                {product.price.toLocaleString()} VNĐ
                              </Typography>
                            </Box>
                            <Box textAlign="right">
                              <Typography variant="caption" color="text.secondary" display="block" lineHeight={1}>
                                Stock
                              </Typography>
                              <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
                                {product.stock} units
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                      
                      <CardActions sx={{ p: 2.5, pt: 0, gap: 1 }}>
                        {inCart > 0 ? (
                          <>
                            <Box 
                              sx={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                p: 1.5,
                                borderRadius: 2,
                                background: 'rgba(4,86,104,0.08)',
                                border: '1px solid rgba(4,86,104,0.15)',
                              }}
                            >
                              <ShoppingCart sx={{ fontSize: 18, color: '#045668' }} />
                              <Typography variant="body2" fontWeight={700} color="#045668">
                                {inCart} in cart
                              </Typography>
                            </Box>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              disabled={product.outOfStock || inCart >= product.stock}
                              sx={{
                                minWidth: 40,
                                width: 40,
                                height: 40,
                                p: 0,
                                background: BRAND_GRADIENT,
                                borderRadius: 2,
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
                              <Add />
                            </Button>
                          </>
                        ) : (
                          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                            <Button
                              variant="outlined"
                              startIcon={<ShoppingCart />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              disabled={product.outOfStock}
                              sx={{
                                flex: 1,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                py: 1.2,
                                borderColor: '#045668',
                                color: '#045668',
                                '&:hover': {
                                  borderColor: '#045668',
                                  background: 'rgba(4,86,104,0.05)',
                                },
                                '&.Mui-disabled': { borderColor: '#ccc', color: '#ccc' },
                              }}
                            >
                              Add to Cart
                            </Button>
                            <Button
                              variant="contained"
                              startIcon={<FlashOn />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuyNow(product);
                              }}
                              disabled={product.outOfStock}
                              sx={{
                                flex: 1,
                                background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                py: 1.2,
                                boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
                                '&:hover': {
                                  boxShadow: '0 6px 20px rgba(239,68,68,0.45)',
                                  background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                                },
                                '&.Mui-disabled': { background: '#ccc', boxShadow: 'none' },
                              }}
                            >
                              Buy Now
                            </Button>
                          </Box>
                        )}
                      </CardActions>
                    </Card>
                  );
                })}
              </Box>

              {/* Pagination */}
              {paginationState.totalElements > paginationState.rowsPerPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <TablePagination
                    count={paginationState.totalElements}
                    page={paginationState.page}
                    rowsPerPage={paginationState.rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[12, 24, 36, 48]}
                    labelRowsPerPage="Products per page:"
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} products`
                    }
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>

      <ProductDetailModal
        open={detailModalOpen}
        product={selectedProduct}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </PowerGymLayout>
  );
};

export default ProductCatalog;
