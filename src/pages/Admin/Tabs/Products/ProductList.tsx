import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Avatar,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';
import { Add, Edit, Delete, Search, Inventory, Clear } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getProducts, deleteProduct } from '../../../../services/productService';
import type { Product, StockStatus } from '../../../../types/product';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';
import ProductFormModal from './ProductFormModal';
import DeleteConfirmModal from '../DeleteConfirmModal';
import {
  PageWrapper,
  HeaderSection,
  HeaderLeft,
  HeaderIconBox,
  AddButton,
  ContentSection,
} from '../shared/StyledComponents';

const SearchInput = memo(({ 
  searchTerm, 
  onSearchChange, 
  onClearSearch 
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <TextField
      ref={searchInputRef}
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      size="small"
      sx={{ 
        flexGrow: 1, 
        maxWidth: 400,
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
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#64748b' }} />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={onClearSearch}
                sx={{ color: '#64748b' }}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
});

SearchInput.displayName = 'SearchInput';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [stockStatus, setStockStatus] = useState<StockStatus>('all');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(10);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadData();
  }, [paginationState.page, paginationState.rowsPerPage, debouncedSearch, stockStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getProducts(
        paginationState.page,
        paginationState.rowsPerPage,
        debouncedSearch || undefined,
        stockStatus
      );
      
      setProducts(response.content);
      setPaginationData(response.totalPages, response.totalElements);
    } catch (err: unknown) {
      console.error('Failed to load products:', err);
      // Error toast will be shown by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearch('');
    setDebouncedSearch('');
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedProduct(null);
    setFormModalOpen(true);
  }, []);

  const handleEdit = useCallback((product: Product) => {
    setSelectedProduct(product);
    setFormModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    
    try {
      await deleteProduct(selectedProduct.id);
      toast.success(`Product "${selectedProduct.name}" deleted successfully`);
      setDeleteModalOpen(false);
      setSelectedProduct(null);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
      setDeleteModalOpen(false);
    }
  };

  const handleFormSuccess = () => {
    setFormModalOpen(false);
    setSelectedProduct(null);
    loadData();
  };

  const getStockStatusChip = (product: Product) => {
    if (product.outOfStock) {
      return <Chip label="Out of Stock" color="error" size="small" />;
    }
    if (product.lowStock) {
      return <Chip label="Low Stock" color="warning" size="small" />;
    }
    return <Chip label="In Stock" color="success" size="small" />;
  };

  if (loading && products.length === 0) {
    return (
      <PageWrapper display="flex" justifyContent="center" alignItems="center" minHeight={360}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
          <Typography color="text.secondary" fontSize={14}>Loading products...</Typography>
        </Stack>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <HeaderSection>
        <HeaderLeft>
          <HeaderIconBox>
            <Inventory sx={{ fontSize: 22 }} />
          </HeaderIconBox>
          <Box>
            <Typography fontWeight={700} fontSize={20} color="#0f172a" lineHeight={1.3}>
              Products Management
            </Typography>
            <Typography fontSize={13.5} color="#64748b" mt={0.3}>
              Manage gym products and inventory
            </Typography>
          </Box>
        </HeaderLeft>
        <AddButton variant="contained" startIcon={<Add sx={{ fontSize: 18 }} />} onClick={handleCreate}>
          Add Product
        </AddButton>
      </HeaderSection>

      <ContentSection>
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <SearchInput
            searchTerm={search}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Stock Status</InputLabel>
            <Select
              value={stockStatus}
              label="Stock Status"
              onChange={(e) => setStockStatus(e.target.value as StockStatus)}
              sx={{
                borderRadius: 2,
                backgroundColor: '#f8fafc',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="in_stock">In Stock</MenuItem>
              <MenuItem value="low_stock">Low Stock</MenuItem>
              <MenuItem value="out_of_stock">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <TableContainer component={Paper} sx={{ 
          overflowX: 'auto',
          borderRadius: 3,
          border: '1px solid #eaeef8',
          boxShadow: 'none'
        }}>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8faff' }}>
                <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Product</TableCell>
                <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Price</TableCell>
                <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Stock</TableCell>
                <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Status</TableCell>
                <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} hover sx={{ '&:hover': { backgroundColor: '#f8faff' } }}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar 
                        src={product.imageUrl} 
                        sx={{ width: 50, height: 50 }}
                        variant="rounded"
                      >
                        {product.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                          {product.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600}>
                      {product.price.toLocaleString()} VNĐ
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {product.stock} units
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Threshold: {product.lowStockThreshold}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getStockStatusChip(product)}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEdit(product)}
                        sx={{
                          color: '#0066ff',
                          '&:hover': { backgroundColor: 'rgba(0,102,255,0.1)' }
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteClick(product)}
                        sx={{
                          color: '#ef4444',
                          '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={3}>
          <TablePagination
            count={paginationState.totalElements}
            page={paginationState.page}
            rowsPerPage={paginationState.rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Products per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} products`
            }
          />
        </Box>

        {products.length === 0 && !loading && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Create your first product to get started
            </Typography>
            <AddButton variant="contained" startIcon={<Add />} onClick={handleCreate}>
              Add Product
            </AddButton>
          </Box>
        )}
      </ContentSection>

      <ProductFormModal
        open={formModalOpen}
        product={selectedProduct}
        onClose={() => {
          setFormModalOpen(false);
          setSelectedProduct(null);
        }}
        onSuccess={handleFormSuccess}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </PageWrapper>
  );
};

export default ProductList;
