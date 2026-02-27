import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  FitnessCenter,
  Build,
  Assignment,
  CardMembership,
  AttachMoney,
  Settings,
  Logout,
  AccountCircle,
  Article
} from '@mui/icons-material';

const drawerWidth = 260;

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: number;
  onTabChange?: (tabIndex: number) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab = 0, onTabChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Overview', icon: <Dashboard /> },
    { text: 'Members', icon: <People /> },
    { text: 'Trainers', icon: <FitnessCenter /> },
    { text: 'Stories', icon: <Article /> },
    { text: 'Equipment', icon: <Build /> },
    { text: 'Services', icon: <Assignment /> },
    { text: 'Membership', icon: <CardMembership /> },
    { text: 'Financial', icon: <AttachMoney /> },
    { text: 'Settings', icon: <Settings /> }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (index: number) => {
    if (onTabChange) {
      onTabChange(index);
    }
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ 
        p: 2.5, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
        color: 'white'
      }}>
        <FitnessCenter sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            PowerGym
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            Admin Panel
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flex: 1, py: 2 }}>
        {menuItems.map((item, index) => {
          const isActive = activeTab === index;
          return (
            <ListItem key={item.text} disablePadding sx={{ px: 1.5, mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleMenuClick(index)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? 'rgba(0, 180, 255, 0.15)' : 'transparent',
                  color: isActive ? '#00b4ff' : 'inherit',
                  border: isActive ? '1px solid rgba(0, 180, 255, 0.3)' : '1px solid transparent',
                  '&:hover': {
                    backgroundColor: isActive ? 'rgba(0, 180, 255, 0.2)' : 'rgba(0, 0, 0, 0.04)',
                    border: isActive ? '1px solid rgba(0, 180, 255, 0.4)' : '1px solid transparent'
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#00b4ff' : 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 400,
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* User Profile Section */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
          onClick={handleProfileMenuOpen}
        >
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#00b4ff' }}>
            A
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              Admin User
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              admin@powergym.com
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            border: 'none'
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer - Fixed (always visible) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            border: 'none',
            boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: '#f5f7fa',
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {/* Mobile Menu Button */}
        {isMobile && (
          <Box sx={{ 
            p: 2, 
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={600}>
              Admin Dashboard
            </Typography>
          </Box>
        )}
        
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminLayout;
