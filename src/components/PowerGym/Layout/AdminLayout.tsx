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
    useTheme,
    Tooltip,
} from '@mui/material';

import AnalyticsIcon from '@mui/icons-material/Analytics';
import WebStoriesIcon from '@mui/icons-material/WebStories';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import {
    Menu as MenuIcon,
    People,
    FitnessCenter,
    Build,
    Assignment,
    CardMembership,
    Settings,
    Logout,
    AccountCircle,
    Category,
    KeyboardArrowRight,
} from '@mui/icons-material';
import GlobalNotification from '../../Notifications/GlobalNotification.tsx';
import { useTokenRefresh } from '../../../hooks/useTokenRefresh.ts';
import { useAuth } from '../../../hooks/useAuth.ts';
import { useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 260;

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab?: number;
    onTabChange?: (tabIndex: number) => void;
}

const menuItems = [
    { text: 'Overview',   icon: <AnalyticsIcon  /> },
    { text: 'Members',    icon: <People /> },
    { text: 'Trainers',   icon: <FitnessCenter /> },
    { text: 'Categories', icon: <Category /> },
    { text: 'Services',   icon: <Assignment /> },
    { text: 'Stories',    icon: <WebStoriesIcon/> },
    { text: 'Equipment',  icon: <Build /> },
    { text: 'Membership', icon: <CardMembership /> },
    { text: 'Financial',  icon: <AccountBalanceWalletIcon  /> },
    { text: 'Settings',   icon: <Settings /> },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab = 0, onTabChange }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { logout } = useAuth();
    const navigate = useNavigate();

    useTokenRefresh();

    const handleDrawerToggle = () => setMobileOpen((v) => !v);

    const handleMenuClick = (index: number) => {
        onTabChange?.(index);
        if (isMobile) setMobileOpen(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error:any) {
            console.error('Logout failed:', error);
        }
        navigate('/login', { replace: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /* ── Sidebar content ─────────────────────────────────────── */
    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>

            {/* Logo */}
            <Box
                sx={{
                    px: 3,
                    py: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    background: 'linear-gradient(135deg, #00b4ff 0%, #0066ff 100%)',
                }}
            >
                <Box
                    sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <FitnessCenter sx={{ color: '#fff', fontSize: 22 }} />
                </Box>
                <Box>
                    <Typography variant="h6" fontWeight={800} color="#fff" lineHeight={1.1} letterSpacing={-0.3}>
                        PowerGym
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 500, letterSpacing: 0.5 }}>
                        Admin Panel
                    </Typography>
                </Box>
            </Box>

            {/* Section label */}
            <Box sx={{ px: 3, pt: 2.5, pb: 0.5 }}>
                <Typography variant="caption" fontWeight={700} letterSpacing={1.2} color="text.disabled" textTransform="uppercase">
                    Navigation
                </Typography>
            </Box>

            {/* Nav items */}
            <List sx={{ flex: 1, px: 1.5, py: 1 }}>
                {menuItems.map((item, index) => {
                    const isActive = activeTab === index;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleMenuClick(index)}
                                sx={{
                                    borderRadius: 2,
                                    px: 1.5,
                                    py: 1,
                                    position: 'relative',
                                    bgcolor: isActive ? 'rgba(0,180,255,0.1)' : 'transparent',
                                    border: '1px solid',
                                    borderColor: isActive ? 'rgba(0,180,255,0.3)' : 'transparent',
                                    '&:hover': {
                                        bgcolor: isActive ? 'rgba(0,180,255,0.15)' : 'rgba(0,0,0,0.035)',
                                        borderColor: isActive ? 'rgba(0,180,255,0.4)' : 'transparent',
                                    },
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {/* Active indicator bar */}
                                {isActive && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: 0,
                                            top: '20%',
                                            height: '60%',
                                            width: 3,
                                            borderRadius: '0 3px 3px 0',
                                            bgcolor: '#00b4ff',
                                        }}
                                    />
                                )}

                                <ListItemIcon
                                    sx={{
                                        minWidth: 36,
                                        color: isActive ? '#00b4ff' : 'text.secondary',
                                        '& svg': { fontSize: 20 },
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: '0.9rem',
                                        color: isActive ? '#00b4ff' : 'text.primary',
                                    }}
                                />

                                {isActive && (
                                    <KeyboardArrowRight sx={{ fontSize: 16, color: '#00b4ff', opacity: 0.6 }} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider sx={{ mx: 2 }} />

            {/* User profile */}
            <Box sx={{ p: 2 }}>
                <Tooltip title="Account options" placement="top">
                    <Box
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: 2.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            '&:hover': {
                                bgcolor: 'rgba(0,180,255,0.06)',
                                borderColor: 'rgba(0,180,255,0.3)',
                            },
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 34,
                                height: 34,
                                fontSize: 14,
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                            }}
                        >
                            A
                        </Avatar>
                        <Box flex={1} minWidth={0}>
                            <Typography variant="body2" fontWeight={700} noWrap>
                                Admin
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                                admin@gmail.com
                            </Typography>
                        </Box>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#22c55e', flexShrink: 0 }} />
                    </Box>
                </Tooltip>
            </Box>
        </Box>
    );

    /* ── Render ───────────────────────────────────────────────── */
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>

            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none', boxShadow: '4px 0 24px rgba(0,0,0,0.1)' },
                }}
            >
                {drawer}
            </Drawer>

            {/* Desktop drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        border: 'none',
                        boxShadow: '2px 0 12px rgba(0,0,0,0.06)',
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    bgcolor: '#f5f7fa',
                    width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Top bar */}
                <Box
                    sx={{
                        px: { xs: 2, md: 3 },
                        py: 1.5,
                        bgcolor: '#fff',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                    }}
                >
                    {/* Left: mobile menu toggle + breadcrumb */}
                    <Box display="flex" alignItems="center" gap={1.5}>
                        {isMobile && (
                            <IconButton size="small" onClick={handleDrawerToggle} sx={{ color: 'text.secondary' }}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Box>
                            <Typography variant="caption" color="text.disabled" fontWeight={600} letterSpacing={0.5}>
                                ADMIN PANEL
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.1} letterSpacing={-0.2}>
                                {menuItems[activeTab]?.text ?? 'Dashboard'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Right: notifications */}
                    <GlobalNotification />
                </Box>

                {/* Page content */}
                <Box sx={{ p: { xs: 2, md: 3 }, flex: 1 }}>
                    {children}
                </Box>
            </Box>

            {/* Profile dropdown */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                PaperProps={{
                    sx: {
                        borderRadius: 2.5,
                        minWidth: 180,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        border: '1px solid',
                        borderColor: 'divider',
                        mt: -1,
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="body2" fontWeight={700}>Admin User</Typography>
                    <Typography variant="caption" color="text.secondary">admin@powergym.com</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => setAnchorEl(null)} sx={{ gap: 1.5, py: 1 }}>
                    <AccountCircle fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" fontWeight={500}>Profile</Typography>
                </MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)} sx={{ gap: 1.5, py: 1 }}>
                    <Settings fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" fontWeight={500}>Settings</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1 }}>
                    <Logout fontSize="small" sx={{ color: 'error.main' }} />
                    <Typography variant="body2" fontWeight={500} color="error.main">Logout</Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default AdminLayout;