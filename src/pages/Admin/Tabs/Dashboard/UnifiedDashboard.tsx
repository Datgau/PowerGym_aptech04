import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Typography, CircularProgress, Alert, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Avatar, Divider, Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  People, MonetizationOn, PersonAdd, FitnessCenter,
  Inventory, ShoppingCart, CheckCircle, Warning, LocalShipping,
  AttachMoney, Dashboard as DashboardIcon,
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import dayjs from 'dayjs';
import { getProductStatistics, getOrderStatistics } from '../../../../services/statisticsService';
import type { ProductStatistics, OrderStatistics } from '../../../../types/statistics';
import { adminMockData } from '../../../../data/adminMockData';
import { getUserCounts } from '../../../../services/adminService';
import { getAllTrainers } from '../../../../services/trainerService';

// ── Styled components (same pattern as MembersTable) ─────────
const PageWrapper = styled(Box)({
  minHeight: '100%',
  background: '#f8faff',
  padding: '32px',
});

const HeaderSection = styled(Box)({
  background: '#ffffff',
  borderRadius: 20,
  border: '1px solid #eaeef8',
  padding: '28px 32px',
  marginBottom: 28,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
});

const HeaderLeft = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
});

const HeaderIconBox = styled(Box)({
  width: 48,
  height: 48,
  borderRadius: 14,
  background: 'linear-gradient(135deg, #00b4ff22, #0066ff22)',
  border: '1px solid #0066ff33',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#0066ff',
});

const ContentSection = styled(Box)({
  background: '#ffffff',
  borderRadius: 20,
  border: '1px solid #eaeef8',
  padding: '28px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  marginBottom: 24,
});

const COLORS = ['#0066ff', '#00b4ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const fmtVND = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

interface StatProps { value: string | number; label: string; icon: React.ReactNode; color: string; bg: string; trend?: string; }
const StatCard: React.FC<StatProps> = ({ value, label, icon, color, bg, trend }) => (
  <Card elevation={0} sx={{ border: '1px solid #eaeef8', borderRadius: 3, height: '100%' }}>
    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
        <Box minWidth={0} flex={1}>
          <Typography sx={{ fontSize: { xs: 10, sm: 11 }, fontWeight: 600, color: '#64748b', letterSpacing: 0.5, textTransform: 'uppercase', mb: 0.5 }}>
            {label}
          </Typography>
          <Typography noWrap sx={{ fontSize: { xs: 15, sm: 19, md: 21 }, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            {value}
          </Typography>
          {trend && (
            <Typography sx={{ fontSize: { xs: 10, sm: 11 }, fontWeight: 600, color: '#10b981', mt: 0.5, display: 'block' }}>
              {trend}
            </Typography>
          )}
        </Box>
        <Box sx={{ width: { xs: 36, sm: 42 }, height: { xs: 36, sm: 42 }, borderRadius: 2, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// ── Section label ─────────────────────────────────────────────
const SLabel: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => (
  <Box mb={2}>
    <Typography sx={{ fontSize: { xs: 13, sm: 15 }, fontWeight: 700, color: '#0f172a' }}>{title}</Typography>
    {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
  </Box>
);

// ── Tooltip ───────────────────────────────────────────────────
const TTip = ({ active, payload, label, fmt }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: '#fff', border: '1px solid #eaeef8', borderRadius: 2, p: 1.5, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
      <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={0.5}>{label}</Typography>
      {payload.map((p: any, i: number) => (
        <Typography key={i} variant="caption" display="block" sx={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {fmt ? fmt(p.value) : p.value}
        </Typography>
      ))}
    </Box>
  );
};

// ── Main ──────────────────────────────────────────────────────
const UnifiedDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productStats, setProductStats] = useState<ProductStatistics | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStatistics | null>(null);

  // Business overview state (real API)
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [totalTrainers, setTotalTrainers] = useState<number>(0);
  const [newMembersThisMonth, setNewMembersThisMonth] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        const start = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
        const end = dayjs().format('YYYY-MM-DD');

        const [p, o, counts, trainersRes] = await Promise.all([
          getProductStatistics(start, end),
          getOrderStatistics(start, end),
          getUserCounts(),
          getAllTrainers(0, 1), // size=1, chỉ cần totalElements
        ]);

        setProductStats(p);
        setOrderStats(o);

        if (counts.success) {
          setTotalMembers(Number(counts.data.USER ?? 0));
        }
        if (trainersRes.success) {
          setTotalTrainers(trainersRes.data.totalElements ?? 0);
        }

        setNewMembersThisMonth(adminMockData.stats.newMembersThisMonth);

      } catch { setError('Failed to load statistics.'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return (
    <PageWrapper display="flex" justifyContent="center" alignItems="center" minHeight={400}>
      <Stack alignItems="center" spacing={2}>
        <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
        <Typography color="text.secondary" fontSize={14}>Loading dashboard...</Typography>
      </Stack>
    </PageWrapper>
  );

  if (error) return (
    <PageWrapper>
      <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
    </PageWrapper>
  );

  const deliveryData = [
    { name: 'Pending', value: orderStats?.pendingDeliveries || 0, color: '#f59e0b' },
    { name: 'Processing', value: orderStats?.processingDeliveries || 0, color: '#0066ff' },
    { name: 'Shipped', value: orderStats?.shippedDeliveries || 0, color: '#8b5cf6' },
    { name: 'Delivered', value: orderStats?.deliveredOrders || 0, color: '#10b981' },
  ];
  const orderStatusData = [
    { name: 'Pending', value: orderStats?.pendingOrders || 0, fill: '#f59e0b' },
    { name: 'Paid', value: orderStats?.paidOrders || 0, fill: '#10b981' },
    { name: 'Cancelled', value: orderStats?.cancelledOrders || 0, fill: '#ef4444' },
  ];
  const inventoryData = [
    { name: 'In Stock', value: productStats?.inStockProducts || 0, color: '#10b981' },
    { name: 'Low Stock', value: productStats?.lowStockProducts || 0, color: '#f59e0b' },
    { name: 'Out of Stock', value: productStats?.outOfStockProducts || 0, color: '#ef4444' },
  ];
  const topSellingData = (productStats?.topSellingProducts || []).slice(0, 5).map(p => ({
    name: p.productName.length > 12 ? p.productName.slice(0, 12) + '…' : p.productName,
    sold: p.totalQuantitySold,
  }));

  const axisProps = { tick: { fontSize: 11, fill: '#64748b' }, axisLine: false as const, tickLine: false as const };
  const legendStyle = { fontSize: 11, paddingTop: 6 };

  return (
    <PageWrapper>
      {/* Header */}
      <HeaderSection sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 }, p: { xs: '20px', sm: '28px 32px' } }}>
        <HeaderLeft>
          <HeaderIconBox>
            <DashboardIcon sx={{ fontSize: 22 }} />
          </HeaderIconBox>
          <Box>
            <Typography fontWeight={700} fontSize={{ xs: 17, sm: 20 }} color="#0f172a" lineHeight={1.3}>
              Dashboard Overview
            </Typography>
            <Typography fontSize={{ xs: 12, sm: 13.5 }} color="#64748b" mt={0.3}>
              Last 30 days · {dayjs().format('MMMM D, YYYY')}
            </Typography>
          </Box>
        </HeaderLeft>
      </HeaderSection>

      {/* ── Business KPIs ── */}
      <ContentSection>
        <SLabel title="Business Overview" sub="Real-time from API" />
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {[
            { value: totalMembers.toLocaleString(), label: 'Total Members', icon: <People fontSize="small" />, color: '#0066ff', bg: '#eff6ff', trend: `+${newMembersThisMonth} this month` },
            { value: newMembersThisMonth, label: 'New Members (30d)', icon: <PersonAdd fontSize="small" />, color: '#10b981', bg: '#f0fdf4' },
            { value: totalTrainers, label: 'Trainers', icon: <FitnessCenter fontSize="small" />, color: '#8b5cf6', bg: '#f5f3ff' },
            { value: fmtVND(orderStats?.totalRevenue || 0), label: 'Revenue (30d)', icon: <MonetizationOn fontSize="small" />, color: '#f59e0b', bg: '#fffbeb' },
          ].map((s, i) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={i}><StatCard {...s} /></Grid>
          ))}
        </Grid>
      </ContentSection>

      {/* ── Revenue & Expenses charts ── */}
      <ContentSection>
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <SLabel title="Monthly Revenue & Expenses" sub="Jan – Jun (mock data)" />
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={adminMockData.financial.monthlyRevenue} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={v => `${(v / 1e6).toFixed(0)}M`} width={38} />
                <Tooltip content={<TTip fmt={fmtVND} />} />
                <Legend wrapperStyle={legendStyle} />
                <Bar dataKey="revenue" name="Revenue" fill="#0066ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <SLabel title="Expenses by Category" />
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={adminMockData.financial.expenses} dataKey="amount" nameKey="category"
                  cx="50%" cy="45%" outerRadius={80} innerRadius={44}
                  label={({ percentage }) => `${percentage}%`} labelLine={false} style={{ fontSize: 11 }}>
                  {adminMockData.financial.expenses.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => fmtVND(Number(v))} />
                <Legend iconType="circle" wrapperStyle={legendStyle} />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </ContentSection>

      {/* ── Member Growth + Popular Services ── */}
      <ContentSection>
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <SLabel title="Member Growth" sub="New vs Cancelled per month" />
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={adminMockData.reports.membershipGrowth}>
                <defs>
                  <linearGradient id="gNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066ff" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0066ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCancel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} width={28} />
                <Tooltip content={<TTip />} />
                <Legend wrapperStyle={legendStyle} />
                <Area type="monotone" dataKey="newMembers" name="New" stroke="#0066ff" strokeWidth={2} fill="url(#gNew)" />
                <Area type="monotone" dataKey="canceledMembers" name="Cancelled" stroke="#ef4444" strokeWidth={2} fill="url(#gCancel)" />
              </AreaChart>
            </ResponsiveContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SLabel title="Popular Services" />
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              {adminMockData.reports.popularServices.map((s, i) => {
                const pct = Math.round((s.bookings / adminMockData.reports.popularServices[0].bookings) * 100);
                return (
                  <Box key={i}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography noWrap sx={{ fontSize: { xs: 12, sm: 13 }, fontWeight: 600, color: '#0f172a', maxWidth: '65%' }}>{s.name}</Typography>
                      <Typography sx={{ fontSize: { xs: 11, sm: 12 }, color: '#64748b' }}>{s.bookings}</Typography>
                    </Box>
                    <Box sx={{ height: 6, borderRadius: 3, background: '#f1f5f9', overflow: 'hidden' }}>
                      <Box sx={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: COLORS[i % COLORS.length], transition: 'width 0.6s ease' }} />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Grid>
        </Grid>
      </ContentSection>

      <Divider sx={{ my: 1 }} />

      {/* ── Inventory KPIs ── */}
      <ContentSection sx={{ mt: 3 }}>
        <SLabel title="Product Inventory" sub="Real-time from API" />
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {[
            { value: productStats?.totalProducts || 0, label: 'Total Products', icon: <Inventory fontSize="small" />, color: '#0066ff', bg: '#eff6ff' },
            { value: productStats?.inStockProducts || 0, label: 'In Stock', icon: <CheckCircle fontSize="small" />, color: '#10b981', bg: '#f0fdf4' },
            { value: productStats?.lowStockProducts || 0, label: 'Low Stock', icon: <Warning fontSize="small" />, color: '#f59e0b', bg: '#fffbeb' },
            { value: productStats?.outOfStockProducts || 0, label: 'Out of Stock', icon: <Warning fontSize="small" />, color: '#ef4444', bg: '#fef2f2' },
          ].map((s, i) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={i}><StatCard {...s} /></Grid>
          ))}
        </Grid>
      </ContentSection>

      {/* ── Order KPIs ── */}
      <ContentSection>
        <SLabel title="Orders & Delivery" sub="Last 30 days" />
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {[
            { value: fmtVND(orderStats?.totalRevenue || 0), label: 'Total Revenue', icon: <AttachMoney fontSize="small" />, color: '#10b981', bg: '#f0fdf4' },
            { value: orderStats?.totalOrders || 0, label: 'Total Orders', icon: <ShoppingCart fontSize="small" />, color: '#0066ff', bg: '#eff6ff' },
            { value: orderStats?.paidOrders || 0, label: 'Paid Orders', icon: <CheckCircle fontSize="small" />, color: '#8b5cf6', bg: '#f5f3ff' },
            { value: orderStats?.deliveredOrders || 0, label: 'Delivered', icon: <LocalShipping fontSize="small" />, color: '#f59e0b', bg: '#fffbeb' },
          ].map((s, i) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={i}><StatCard {...s} /></Grid>
          ))}
        </Grid>
      </ContentSection>

      {/* ── 3 Status charts ── */}
      <ContentSection>
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <SLabel title="Order Status" />
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={orderStatusData} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" {...axisProps} />
                <YAxis type="category" dataKey="name" {...axisProps} width={65} />
                <Tooltip />
                <Bar dataKey="value" name="Orders" radius={[0, 4, 4, 0]}>
                  {orderStatusData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <SLabel title="Delivery Status" />
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={deliveryData} dataKey="value" nameKey="name" cx="50%" cy="42%" outerRadius={60} innerRadius={32}>
                  {deliveryData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={legendStyle} />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <SLabel title="Inventory Status" />
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={inventoryData} dataKey="value" nameKey="name" cx="50%" cy="42%" outerRadius={60} innerRadius={32}>
                  {inventoryData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={legendStyle} />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </ContentSection>

      {/* ── Top Selling ── */}
      {topSellingData.length > 0 && (
        <ContentSection>
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <SLabel title="Top Selling Products" sub="By quantity sold (last 30 days)" />
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topSellingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" {...axisProps} />
                  <YAxis {...axisProps} width={28} />
                  <Tooltip />
                  <Bar dataKey="sold" name="Qty Sold" fill="#0066ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <SLabel title="Revenue by Product" />
              <TableContainer sx={{ borderRadius: 2, border: '1px solid #eaeef8' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: '#f8faff' }}>
                      {['#', 'Product', 'Revenue'].map((h, i) => (
                        <TableCell key={h} align={i === 2 ? 'right' : 'left'}
                          sx={{ fontWeight: 700, color: '#64748b', fontSize: { xs: 11, sm: 12 }, py: 1.5 }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(productStats?.topSellingProducts || []).slice(0, 5).map((p, i) => (
                      <TableRow key={p.productId} hover sx={{ '&:hover': { background: '#f8faff' } }}>
                        <TableCell sx={{ py: 1 }}>
                          <Avatar sx={{ width: 22, height: 22, fontSize: 10, fontWeight: 700, bgcolor: COLORS[i % COLORS.length] }}>{i + 1}</Avatar>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            {p.productImageUrl && (
                              <img src={p.productImageUrl} alt={p.productName} style={{ width: 26, height: 26, objectFit: 'cover', borderRadius: 4 }} />
                            )}
                            <Typography noWrap sx={{ maxWidth: { xs: 90, sm: 130 }, fontSize: { xs: 11, sm: 13 }, fontWeight: 500 }}>
                              {p.productName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1 }}>
                          <Typography sx={{ fontSize: { xs: 11, sm: 13 }, fontWeight: 700, color: '#10b981' }}>
                            {fmtVND(p.totalRevenue)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </ContentSection>
      )}

      {/* ── Low Stock Alert ── */}
      {productStats && productStats.lowStockProductList.length > 0 && (
        <ContentSection sx={{ border: '1px solid #fee2e2 !important' }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Warning sx={{ color: '#ef4444', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography fontWeight={700} color="#0f172a" fontSize={{ xs: 14, sm: 16 }}>Low Stock Alert</Typography>
              <Typography variant="caption" color="text.secondary">{productStats.lowStockProductList.length} products need restocking</Typography>
            </Box>
          </Box>
          <TableContainer sx={{ borderRadius: 2, border: '1px solid #eaeef8' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: '#f8faff' }}>
                  {['Product', 'Stock', 'Threshold', 'Status'].map((h, i) => (
                    <TableCell key={h} align={i === 0 ? 'left' : 'center'}
                      sx={{ fontWeight: 700, color: '#64748b', fontSize: { xs: 11, sm: 12 }, py: 1.5 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {productStats.lowStockProductList.map((p) => (
                  <TableRow key={p.id} hover sx={{ '&:hover': { background: '#fff5f5' } }}>
                    <TableCell sx={{ py: 1 }}>
                      <Typography fontWeight={500} sx={{ fontSize: { xs: 11, sm: 13 } }}>{p.name}</Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1 }}>
                      <Chip label={p.stock} size="small" color={p.stock === 0 ? 'error' : 'warning'} sx={{ fontWeight: 700, fontSize: { xs: 10, sm: 12 } }} />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1 }}>
                      <Typography color="text.secondary" sx={{ fontSize: { xs: 11, sm: 13 } }}>{p.lowStockThreshold}</Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1 }}>
                      <Chip label={p.stock === 0 ? 'Out of Stock' : 'Low Stock'} size="small"
                        color={p.stock === 0 ? 'error' : 'warning'} variant="outlined"
                        sx={{ fontWeight: 600, fontSize: { xs: 10, sm: 12 } }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ContentSection>
      )}
    </PageWrapper>
  );
};

export default UnifiedDashboard;
