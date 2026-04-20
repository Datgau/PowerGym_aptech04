import React, {useEffect, useState} from 'react';
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
    Tooltip, Collapse,
} from '@mui/material';

import AnalyticsIcon from '@mui/icons-material/Analytics';
import WebStoriesIcon from '@mui/icons-material/WebStories';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import {
    Menu as MenuIcon,
    People,
    FitnessCenter,
    Assignment,
    CardMembership,
    Settings,
    Logout,
    AccountCircle,
    Category,
    ListAlt,
    SupervisorAccount,
    LocalOffer,
    EmojiEvents,
    Inventory,
    ShoppingCart,
    Receipt,
} from '@mui/icons-material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GlobalNotification from '../../Notification/GlobalNotification.tsx';
import { useTokenRefresh } from '../../../hooks/useTokenRefresh.ts';
import { useAuth } from '../../../hooks/useAuth.ts';
import { useNavigate } from 'react-router-dom';
import { getCurrentProfile } from '../../../services/userService';
import type { UserResponse } from '../../../types/user';
import {toast} from "react-toastify";

const DRAWER_WIDTH = 260;

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab?: number;
    onTabChange?: (tabIndex: number) => void;
}

const menuGroups = [
    {
        title: 'Dashboard',
        items: [
            { text: 'Overview', icon: <AnalyticsIcon /> },
        ],
    },
    {
        title: 'User Management',
        items: [
            { text: 'Members', icon: <People /> },
            { text: 'Staff', icon: <SupervisorAccount /> },
            { text: 'Trainers', icon: <FitnessCenter /> },
        ],
    },
    {
        title: 'Services',
        items: [
            { text: 'Categories', icon: <Category /> },
            { text: 'Services', icon: <Assignment /> },
            { text: 'Service Registrations', icon: <ListAlt /> },
            { text: 'Membership', icon: <CardMembership /> },
        ],
    },
    {
        title: 'Business',
        items: [
            { text: 'Products', icon: <Inventory /> },
            { text: 'Import Receipts', icon: <Receipt /> },
            { text: 'Orders', icon: <ShoppingCart /> },
        ],
    },
    {
        title: 'Marketing',
        items: [
            { text: 'Stories', icon: <WebStoriesIcon /> },
            { text: 'Promotions', icon: <LocalOffer /> },
            { text: 'Rewards', icon: <EmojiEvents /> },
        ],
    },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab = 0, onTabChange }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [userProfile, setUserProfile] = useState<UserResponse | null>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});
    useTokenRefresh();

    // Load user profile
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await getCurrentProfile();
                setUserProfile(profile);
            } catch (error) {
                toast.error('Failed to load user profile !');
            }
        };
        loadProfile();
    }, []);

    const handleToggleGroup = (title: string) => {
        setOpenGroups((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };
    useEffect(() => {
        const newOpenGroups: any = {};
        let flatIndex = 0;
        for (const group of menuGroups) {
            for (let i = 0; i < group.items.length; i++) {
                if (flatIndex === activeTab) {
                    newOpenGroups[group.title] = true;
                    break;
                }
                flatIndex++;
            }
        }
        setOpenGroups(newOpenGroups);
    }, [activeTab]);
    const handleDrawerToggle = () => setMobileOpen((v) => !v);

    const handleMenuClick = (index: number) => {
        onTabChange?.(index);
        if (isMobile) setMobileOpen(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (e :any) {
            toast.error('Logout failed !', e);
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
                {(() => {
                    let flatIndex = 0;
                    return menuGroups.map((group, groupIndex) => (
                        <Box key={group.title} sx={{ mb: 1 }}>

                            {/* GROUP TITLE */}
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() => handleToggleGroup(group.title)}
                                    sx={{
                                        borderRadius: 2,
                                        px: 1.5,
                                        py: 1,
                                    }}
                                >
                                    <ListItemText
                                        primary={group.title}
                                        primaryTypographyProps={{
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                            color: 'text.secondary',
                                        }}
                                    />
                                    {openGroups[group.title] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </ListItemButton>
                            </ListItem>

                            {/* CHILD ITEMS */}
                            <Collapse in={openGroups[group.title]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {group.items.map((item, index) => {
                                        const currentIndex = flatIndex++;
                                        const isActive = activeTab === currentIndex;

                                        return (
                                            <ListItem key={item.text} disablePadding sx={{ pl: 2 }}>
                                                <ListItemButton
                                                    onClick={() => handleMenuClick(currentIndex)}
                                                    sx={{
                                                        borderRadius: 2,
                                                        px: 1.5,
                                                        py: 1,
                                                        bgcolor: isActive ? 'rgba(0,180,255,0.1)' : 'transparent',
                                                    }}
                                                >
                                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                                        {item.icon}
                                                    </ListItemIcon>

                                                    <ListItemText
                                                        primary={item.text}
                                                        primaryTypographyProps={{
                                                            fontWeight: isActive ? 700 : 500,
                                                            fontSize: '0.9rem',
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Collapse>
                        </Box>
                    ));
                })()}
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
                            src={userProfile?.avatar || undefined}
                            sx={{
                                width: 34,
                                height: 34,
                                fontSize: 14,
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                            }}
                        >
                            {!userProfile?.avatar && userProfile?.fullName?.charAt(0)}
                        </Avatar>

                        <Box flex={1} minWidth={0}>
                            <Typography variant="body2" fontWeight={700} noWrap>
                                {userProfile?.fullName || 'Admin User'}
                            </Typography>

                            <Typography variant="caption" color="text.secondary" noWrap>
                                {userProfile?.email || 'admin@gmail.com'}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: '#22c55e',
                                flexShrink: 0,
                            }}
                        />
                    </Box>
                </Tooltip>
            </Box>
        </Box>
    );

    /* ── Render ───────────────────────────────────────────────── */
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>

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
                                {(() => {
                                    let flatIndex = 0;
                                    for (const group of menuGroups) {
                                        for (const item of group.items) {
                                            if (flatIndex === activeTab) {
                                                return item.text;
                                            }
                                            flatIndex++;
                                        }
                                    }
                                    return 'Dashboard';
                                })()}
                            </Typography>
                        </Box>
                    </Box>
                    <GlobalNotification 
                        userId={user?.id}
                    />
                </Box>

                {/* Page content */}
                <Box sx={{ p: { xs: 2, md: 3 }, flex: 1 }}>
                    {children}
                </Box>
            </Box>
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
                    <Typography variant="body2" fontWeight={700}>
                        {userProfile?.fullName || 'Admin User'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {userProfile?.email || 'admin@gmail.com'}
                    </Typography>
                </Box>
                <Divider />
                <MenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        onTabChange?.(14);
                    }}
                    sx={{ gap: 1.5, py: 1 }}
                >
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