import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  InputAdornment,
  Stack,
  IconButton,
  Button,
} from '@mui/material';
import { Search, ShoppingCart, Clear, Visibility } from '@mui/icons-material';
import dayjs from 'dayjs';
import { getProductOrders } from '../../../../services/productOrderService';
import type { ProductOrder } from '../../../../types/productOrder';
import { PaymentStatus, DeliveryStatus, SaleType } from '../../../../types/productOrder';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';
import OrderDetailModal from './OrderDetailModal';
import {
  PageWrapper,
  HeaderSection,
  HeaderLeft,
  HeaderIconBox,
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
      placeholder="Search by customer..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      size="small"
      sx={{ 
        flexGrow: 1, 
        maxWidth: 300,
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

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<ProductOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | ''>('');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<DeliveryStatus | ''>('');
  const [saleTypeFilter, setSaleTypeFilter] = useState<SaleType | ''>('');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const {
    paginationState,
    setPaginationData,
    handleChangePage,
    handleChangeRowsPerPage,
  } = usePagination(10);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadOrders();
  }, [paginationState.page, paginationState.rowsPerPage, debouncedSearch, paymentStatusFilter, deliveryStatusFilter, saleTypeFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const filters: any = {
        page: paginationState.page,
        size: paginationState.rowsPerPage,
      };

      if (debouncedSearch) filters.customerName = debouncedSearch;
      if (paymentStatusFilter) filters.paymentStatus = paymentStatusFilter;
      if (deliveryStatusFilter) filters.deliveryStatus = deliveryStatusFilter;
      if (saleTypeFilter) filters.saleType = saleTypeFilter;

      const response = await getProductOrders(filters);
      setOrders(response.content);
      setPaginationData(response.totalPages, response.totalElements);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load orders');
      }
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

  const handleViewDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleOrderUpdated = () => {
    loadOrders();
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

  if (loading && orders.length === 0) {
    return (
      <PageWrapper display="flex" justifyContent="center" alignItems="center" minHeight={360}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
          <Typography color="text.secondary" fontSize={14}>Loading orders...</Typography>
        </Stack>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <HeaderSection>
        <HeaderLeft>
          <HeaderIconBox>
            <ShoppingCart sx={{ fontSize: 22 }} />
          </HeaderIconBox>
          <Box>
            <Typography fontWeight={700} fontSize={20} color="#0f172a" lineHeight={1.3}>
              Orders Management
            </Typography>
            <Typography fontSize={13.5} color="#64748b" mt={0.3}>
              Track and manage product orders
            </Typography>
          </Box>
        </HeaderLeft>
      </HeaderSection>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontSize: 13.5 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <ContentSection>
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <SearchInput
            searchTerm={search}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />

          <TextField
            select
            label="Payment Status"
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value as PaymentStatus | '')}
            size="small"
            sx={{ 
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8fafc',
              },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </TextField>

          <TextField
            select
            label="Delivery Status"
            value={deliveryStatusFilter}
            onChange={(e) => setDeliveryStatusFilter(e.target.value as DeliveryStatus | '')}
            size="small"
            sx={{ 
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8fafc',
              },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="PROCESSING">Processing</MenuItem>
            <MenuItem value="SHIPPED">Shipped</MenuItem>
            <MenuItem value="DELIVERED">Delivered</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </TextField>

          <TextField
            select
            label="Sale Type"
            value={saleTypeFilter}
            onChange={(e) => setSaleTypeFilter(e.target.value as SaleType | '')}
            size="small"
            sx={{ 
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8fafc',
              },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="ONLINE">Online</MenuItem>
            <MenuItem value="COUNTER">Counter</MenuItem>
          </TextField>
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
                <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Order Date</TableCell>
                <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Customer</TableCell>
                <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Total Amount</TableCell>
                <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Payment</TableCell>
                <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Delivery</TableCell>
                <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Type</TableCell>
                <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover sx={{ '&:hover': { backgroundColor: '#f8faff' } }}>
                  <TableCell>
                    <Typography>
                      {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600}>
                      {order.customerName || 'Counter Sale'}
                    </Typography>
                    {order.customerPhone && (
                      <Typography variant="caption" color="text.secondary">
                        {order.customerPhone}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600} color="primary">
                      {order.totalAmount.toLocaleString()} VNĐ
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.paymentStatus} 
                      color={getPaymentStatusColor(order.paymentStatus)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.deliveryStatus} 
                      color={getDeliveryStatusColor(order.deliveryStatus)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.saleType} 
                      variant="outlined"
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewDetails(order.id)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      View Details
                    </Button>
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
            labelRowsPerPage="Orders per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} orders`
            }
          />
        </Box>

        {orders.length === 0 && !loading && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              No orders found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Orders will appear here once customers make purchases
            </Typography>
          </Box>
        )}
      </ContentSection>

      <OrderDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        orderId={selectedOrderId}
        onOrderUpdated={handleOrderUpdated}
      />
    </PageWrapper>
  );
};

export default OrderList;
