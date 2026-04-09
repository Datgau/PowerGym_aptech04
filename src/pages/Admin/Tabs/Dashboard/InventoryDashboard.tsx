import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Inventory,
  ShoppingCart,
  TrendingUp,
  Warning,
  CheckCircle,
  LocalShipping,
  AttachMoney,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { getProductStatistics, getOrderStatistics } from '../../../../services/statisticsService';
import type { ProductStatistics, OrderStatistics } from '../../../../types/statistics';
import StatCard from '../StatCard';

const InventoryDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productStats, setProductStats] = useState<ProductStatistics | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStatistics | null>(null);
  
  // Default to last 30 days
  const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productData, orderData] = await Promise.all([
        getProductStatistics(startDate, endDate),
        getOrderStatistics(startDate, endDate),
      ]);
      
      setProductStats(productData);
      setOrderStats(orderData);
    } catch (err) {
      setError('Failed to load statistics. Please try again.');
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Inventory Dashboard
      </Typography>

      {/* Date Range Picker */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" mb={2}>
          Date Range
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
        </Box>
      </Paper>

      {/* Product Statistics Cards */}
      <Typography variant="h5" fontWeight={600} mb={2}>
        Product Inventory
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            value={productStats?.totalProducts || 0}
            label="Total Products"
            icon={<Inventory />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            hoverColor="rgba(102, 126, 234, 0.4)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            value={productStats?.inStockProducts || 0}
            label="In Stock"
            icon={<CheckCircle />}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            hoverColor="rgba(240, 147, 251, 0.4)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            value={productStats?.lowStockProducts || 0}
            label="Low Stock"
            icon={<Warning />}
            gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
            hoverColor="rgba(252, 182, 159, 0.4)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            value={productStats?.outOfStockProducts || 0}
            label="Out of Stock"
            icon={<Warning />}
            gradient="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
            hoverColor="rgba(255, 154, 158, 0.4)"
          />
        </Grid>
      </Grid>

      {/* Order Statistics Cards */}
      <Typography variant="h5" fontWeight={600} mb={2}>
        Order Statistics
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            value={`$${orderStats?.totalRevenue.toFixed(2) || '0.00'}`}
            label="Total Revenue"
            icon={<AttachMoney />}
            gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
            hoverColor="rgba(168, 237, 234, 0.4)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            value={orderStats?.totalOrders || 0}
            label="Total Orders"
            icon={<ShoppingCart />}
            gradient="linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"
            hoverColor="rgba(251, 194, 235, 0.4)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            value={orderStats?.pendingOrders || 0}
            label="Pending Orders"
            icon={<ShoppingCart />}
            gradient="linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)"
            hoverColor="rgba(253, 203, 241, 0.4)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            value={orderStats?.paidOrders || 0}
            label="Paid Orders"
            icon={<CheckCircle />}
            gradient="linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)"
            hoverColor="rgba(161, 196, 253, 0.4)"
          />
        </Grid>
      </Grid>

      {/* Delivery Statistics Cards */}
      <Typography variant="h5" fontWeight={600} mb={2}>
        Delivery Status
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            value={orderStats?.pendingDeliveries || 0}
            label="Pending Deliveries"
            icon={<LocalShipping />}
            gradient="linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
            hoverColor="rgba(210, 153, 194, 0.4)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            value={orderStats?.processingDeliveries || 0}
            label="Processing"
            icon={<LocalShipping />}
            gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
            hoverColor="rgba(255, 236, 210, 0.4)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            value={orderStats?.shippedDeliveries || 0}
            label="Shipped"
            icon={<LocalShipping />}
            gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
            hoverColor="rgba(168, 237, 234, 0.4)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            value={orderStats?.deliveredOrders || 0}
            label="Delivered"
            icon={<CheckCircle />}
            gradient="linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"
            hoverColor="rgba(251, 194, 235, 0.4)"
          />
        </Grid>
      </Grid>

      {/* Low Stock Products Section */}
      {productStats && productStats.lowStockProductList.length > 0 && (
        <>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Low Stock Products
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Product Name</strong></TableCell>
                  <TableCell align="center"><strong>Current Stock</strong></TableCell>
                  <TableCell align="center"><strong>Threshold</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productStats.lowStockProductList.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell align="center">{product.stock}</TableCell>
                    <TableCell align="center">{product.lowStockThreshold}</TableCell>
                    <TableCell align="center">
                      {product.stock === 0 ? (
                        <Chip 
                          label="Out of Stock" 
                          color="error" 
                          size="small"
                          icon={<Warning />}
                        />
                      ) : (
                        <Chip 
                          label="Low Stock" 
                          color="warning" 
                          size="small"
                          icon={<Warning />}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Top Selling Products Section */}
      {productStats && productStats.topSellingProducts.length > 0 && (
        <>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Top Selling Products
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Rank</strong></TableCell>
                  <TableCell><strong>Product Name</strong></TableCell>
                  <TableCell align="center"><strong>Quantity Sold</strong></TableCell>
                  <TableCell align="right"><strong>Total Revenue</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productStats.topSellingProducts.map((product, index) => (
                  <TableRow key={product.productId}>
                    <TableCell>
                      <Chip 
                        label={`#${index + 1}`} 
                        color={index === 0 ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {product.productImageUrl && (
                          <img 
                            src={product.productImageUrl} 
                            alt={product.productName}
                            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                          />
                        )}
                        <Typography>{product.productName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={product.totalQuantitySold} 
                        color="primary" 
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={600} color="success.main">
                        ${product.totalRevenue.toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default InventoryDashboard;