import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Dashboard,
  People,
  FitnessCenter,
  Build,
  Assignment,
  CardMembership,
  AttachMoney,
  CalendarToday,
  Assessment,
  Settings,
  Add,
  Edit,
  Delete,
  Visibility,
  TrendingUp,
  TrendingDown,
  PersonAdd,
  MonetizationOn
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { adminMockData, type Member, type Trainer, type Equipment, type Service } from '../../data/adminMockData';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type: 'add' | 'edit' | 'view', item?: any) => {
    setDialogType(type);
    setSelectedItem(item || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const COLORS = ['#00b4ff', '#0066ff', '#ff5026', '#4caf50', '#ff9800', '#9c27b0'];

  // Dashboard Overview Tab
  const DashboardTab = () => (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #00b4ff, #0066ff)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {adminMockData.stats.totalMembers}
                  </Typography>
                  <Typography variant="body2">Tổng thành viên</Typography>
                </Box>
                <People sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4caf50, #2e7d32)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {formatCurrency(adminMockData.stats.monthlyRevenue)}
                  </Typography>
                  <Typography variant="body2">Doanh thu tháng</Typography>
                </Box>
                <MonetizationOn sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ff9800, #f57c00)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {adminMockData.stats.newMembersThisMonth}
                  </Typography>
                  <Typography variant="body2">Thành viên mới</Typography>
                </Box>
                <PersonAdd sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {adminMockData.stats.trainersCount}
                  </Typography>
                  <Typography variant="body2">Huấn luyện viên</Typography>
                </Box>
                <FitnessCenter sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Doanh thu theo tháng</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={adminMockData.financial.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="revenue" fill="#00b4ff" />
                  <Bar dataKey="expenses" fill="#ff5026" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Chi phí theo danh mục</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={adminMockData.financial.expenses}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    label={({ category, percentage }) => `${category}: ${percentage}%`}
                  >
                    {adminMockData.financial.expenses.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Members Tab
  const MembersTab = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Quản lý thành viên</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog('add')}
          sx={{ background: 'linear-gradient(135deg, #00b4ff, #0066ff)' }}
        >
          Thêm thành viên
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thành viên</TableCell>
              <TableCell>Gói tập</TableCell>
              <TableCell>Ngày tham gia</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Lần cuối tập</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminMockData.members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={member.avatar} />
                    <Box>
                      <Typography fontWeight={600}>{member.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={member.membershipType} 
                    color={member.membershipType === 'VIP' ? 'secondary' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(member.joinDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <Chip 
                    label={member.status === 'active' ? 'Hoạt động' : 'Hết hạn'} 
                    color={member.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(member.lastVisit).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog('view', member)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDialog('edit', member)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Trainers Tab
  const TrainersTab = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Quản lý huấn luyện viên</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog('add')}
          sx={{ background: 'linear-gradient(135deg, #4caf50, #2e7d32)' }}
        >
          Thêm HLV
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {adminMockData.trainers.map((trainer) => (
          <Grid item xs={12} md={6} lg={4} key={trainer.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar src={trainer.avatar} sx={{ width: 60, height: 60 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700}>{trainer.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {trainer.specialization}
                    </Typography>
                  </Box>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Kinh nghiệm</Typography>
                  <Typography fontWeight={600}>{trainer.experience}</Typography>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Đánh giá</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontWeight={600}>{trainer.rating}/5</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={trainer.rating * 20} 
                      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">
                    {trainer.clients} khách hàng
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenDialog('edit', trainer)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Equipment Tab
  const EquipmentTab = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Quản lý thiết bị</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog('add')}
          sx={{ background: 'linear-gradient(135deg, #ff9800, #f57c00)' }}
        >
          Thêm thiết bị
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên thiết bị</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Thương hiệu</TableCell>
              <TableCell>Vị trí</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Bảo trì cuối</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminMockData.equipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Typography fontWeight={600}>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.model}
                  </Typography>
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>
                  <Chip 
                    label={item.status === 'active' ? 'Hoạt động' : 'Bảo trì'} 
                    color={item.status === 'active' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(item.maintenanceDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog('edit', item)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Services Tab
  const ServicesTab = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Quản lý dịch vụ</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog('add')}
          sx={{ background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)' }}
        >
          Thêm dịch vụ
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {adminMockData.services.map((service) => (
          <Grid item xs={12} md={6} key={service.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>{service.name}</Typography>
                    <Chip label={service.category} size="small" sx={{ mt: 1 }} />
                  </Box>
                  <Typography variant="h6" color="primary" fontWeight={700}>
                    {formatCurrency(service.price)}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {service.description}
                </Typography>
                
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2">
                    Thời lượng: {service.duration} phút
                  </Typography>
                  <Typography variant="body2">
                    Tối đa: {service.maxParticipants} người
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {service.bookings} lượt đặt
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(service.revenue)}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleOpenDialog('edit', service)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Membership Packages Tab
  const MembershipTab = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Gói thành viên</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog('add')}
          sx={{ background: 'linear-gradient(135deg, #00b4ff, #0066ff)' }}
        >
          Thêm gói
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {adminMockData.membershipPackages.map((pkg) => (
          <Grid item xs={12} md={4} key={pkg.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" fontWeight={700} mb={1}>{pkg.name}</Typography>
                <Typography variant="h4" color="primary" fontWeight={700} mb={2}>
                  {formatCurrency(pkg.price)}
                  <Typography component="span" variant="body2" color="text.secondary">
                    /{pkg.duration} ngày
                  </Typography>
                </Typography>
                
                <Box mb={3}>
                  {pkg.features.map((feature, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                      ✓ {feature}
                    </Typography>
                  ))}
                </Box>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    {pkg.subscribers} người đăng ký
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    Doanh thu: {formatCurrency(pkg.revenue)}
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Button variant="outlined" onClick={() => handleOpenDialog('edit', pkg)}>
                    Chỉnh sửa
                  </Button>
                  <Button variant="outlined" color="error">
                    Xóa
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Financial Tab
  const FinancialTab = () => (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Báo cáo tài chính</Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp color="success" />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {formatCurrency(adminMockData.stats.totalRevenue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng doanh thu
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingDown color="error" />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {formatCurrency(185000000)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng chi phí
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AttachMoney color="primary" />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {formatCurrency(adminMockData.stats.totalRevenue - 185000000)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lợi nhuận
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Assessment color="info" />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    24.5%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tỷ suất lợi nhuận
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>Xu hướng doanh thu và chi phí</Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={adminMockData.financial.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line type="monotone" dataKey="revenue" stroke="#00b4ff" strokeWidth={3} />
              <Line type="monotone" dataKey="expenses" stroke="#ff5026" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );

  // Settings Tab
  const SettingsTab = () => (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Cài đặt hệ thống</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Thông tin phòng gym</Typography>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Tên phòng gym"
                  defaultValue={adminMockData.settings.gymInfo.name}
                  fullWidth
                />
                <TextField
                  label="Địa chỉ"
                  defaultValue={adminMockData.settings.gymInfo.address}
                  fullWidth
                  multiline
                  rows={2}
                />
                <TextField
                  label="Số điện thoại"
                  defaultValue={adminMockData.settings.gymInfo.phone}
                  fullWidth
                />
                <TextField
                  label="Email"
                  defaultValue={adminMockData.settings.gymInfo.email}
                  fullWidth
                />
                <Box display="flex" gap={2}>
                  <TextField
                    label="Giờ mở cửa"
                    type="time"
                    defaultValue={adminMockData.settings.gymInfo.openTime}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Giờ đóng cửa"
                    type="time"
                    defaultValue={adminMockData.settings.gymInfo.closeTime}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Lưu thay đổi
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Cài đặt thông báo</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked={adminMockData.settings.notifications.emailNotifications} />}
                  label="Thông báo email"
                />
                <FormControlLabel
                  control={<Switch defaultChecked={adminMockData.settings.notifications.smsNotifications} />}
                  label="Thông báo SMS"
                />
                <FormControlLabel
                  control={<Switch defaultChecked={adminMockData.settings.notifications.pushNotifications} />}
                  label="Thông báo đẩy"
                />
                <TextField
                  label="Nhắc nhở hết hạn (ngày)"
                  type="number"
                  defaultValue={adminMockData.settings.notifications.membershipExpiry}
                  fullWidth
                />
                <TextField
                  label="Nhắc nhở thanh toán (ngày)"
                  type="number"
                  defaultValue={adminMockData.settings.notifications.paymentReminder}
                  fullWidth
                />
                <Button variant="contained" sx={{ mt: 2 }}>
                  Lưu cài đặt
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const tabs = [
    { label: 'Tổng quan', icon: <Dashboard />, component: <DashboardTab /> },
    { label: 'Thành viên', icon: <People />, component: <MembersTab /> },
    { label: 'Huấn luyện viên', icon: <FitnessCenter />, component: <TrainersTab /> },
    { label: 'Thiết bị', icon: <Build />, component: <EquipmentTab /> },
    { label: 'Dịch vụ', icon: <Assignment />, component: <ServicesTab /> },
    { label: 'Gói thành viên', icon: <CardMembership />, component: <MembershipTab /> },
    { label: 'Tài chính', icon: <AttachMoney />, component: <FinancialTab /> },
    { label: 'Cài đặt', icon: <Settings />, component: <SettingsTab /> }
  ];

  return (
    <PowerGymLayout>
      <Box sx={{ background: '#f5f5f5', minHeight: '100vh', py: 3 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight={700} mb={3} color="primary">
            Admin Dashboard - PowerGym
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minWidth: 120,
                  fontWeight: 600,
                  textTransform: 'none',
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Box>

          {tabs[activeTab].component}
        </Container>
      </Box>

      {/* Generic Dialog for Add/Edit/View */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'add' && 'Thêm mới'}
          {dialogType === 'edit' && 'Chỉnh sửa'}
          {dialogType === 'view' && 'Xem chi tiết'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Dialog content for {dialogType} - {selectedItem?.name || 'New Item'}
          </Typography>
          {/* Add form fields based on dialogType and selectedItem */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          {dialogType !== 'view' && (
            <Button variant="contained" onClick={handleCloseDialog}>
              {dialogType === 'add' ? 'Thêm' : 'Lưu'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </PowerGymLayout>
  );
};

export default AdminDashboard;