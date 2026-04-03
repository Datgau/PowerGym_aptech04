import React, { useState, useEffect, useRef } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useWebSocket, type NotificationMessage } from '../../hooks/useWebSocket';
import { toast } from 'react-toastify';

interface Notification {
  id: number;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'BOOKING' | 'PAYMENT' | 'SYSTEM' | 'SERVICE_REGISTRATION';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedEntityId?: number;
  relatedEntityType?: string;
  registrationType?: 'ONLINE' | 'COUNTER';
}

interface GlobalNotificationProps {
  userId?: number;
}

const GlobalNotification: React.FC<GlobalNotificationProps> = ({ userId }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const processedMessagesRef = useRef<Set<string>>(new Set());
  const open = Boolean(anchorEl);

  useEffect(() => {
    console.log('GlobalNotification mounted for userId:', userId);
    return () => {
      console.log('GlobalNotification unmounted for userId:', userId);
    };
  }, [userId]);

  useWebSocket({
    topics: ['/topic/admin'],
    autoConnect: !!userId,
    onMessage: (message: NotificationMessage) => {
      console.log('Received WebSocket notification:', message);
      handleWebSocketMessage(message);
    },
  });

  const handleWebSocketMessage = (message: NotificationMessage) => {
    const messageKey = `${message.entityName}_${message.action}_${message.entityId}_${message.timestamp}`;
    
    if (processedMessagesRef.current.has(messageKey)) {
      console.log('Duplicate message detected, skipping:', messageKey);
      return;
    }
    
    processedMessagesRef.current.add(messageKey);
    
    if (processedMessagesRef.current.size > 100) {
      const entries = Array.from(processedMessagesRef.current);
      processedMessagesRef.current = new Set(entries.slice(-100));
    }

    const notification: Notification = {
      id: Date.now() + Math.random(),
      type: mapEntityToNotificationType(message.entityName, message.action),
      title: formatNotificationTitle(message.entityName, message.action),
      message: message.message || formatNotificationMessage(message),
      read: false,
      createdAt: message.timestamp || new Date().toISOString(),
      relatedEntityId: message.entityId || undefined,
      relatedEntityType: message.entityName,
      registrationType: message.data?.registrationType,
    };

    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    toast.info(notification.message, {
      position: 'top-right',
      autoClose: 5000,
    });
  };

  const mapEntityToNotificationType = (entityName: string, action: string): Notification['type'] => {
    if (entityName === 'SERVICE_REGISTRATION') return 'SERVICE_REGISTRATION';
    if (entityName === 'BOOKING') return 'BOOKING';
    if (entityName === 'PAYMENT') return 'PAYMENT';
    if (entityName === 'USER') return 'INFO';
    if (action === 'ERROR') return 'ERROR';
    if (action === 'WARNING') return 'WARNING';
    if (action === 'SUCCESS' || action === 'REGISTERED' || action === 'CONFIRMED' || action === 'ACTIVATED') return 'SUCCESS';
    if (action === 'DEACTIVATED') return 'WARNING';
    return 'INFO';
  };

  const formatNotificationTitle = (entityName: string, action: string): string => {
    const titles: Record<string, string> = {
      'SERVICE_REGISTRATION_REGISTERED': 'New Service Registration',
      'SERVICE_REGISTRATION_ACTIVATED': 'Service Activated',
      'SERVICE_REGISTRATION_CANCELLED': 'Service Cancelled',
      'BOOKING_CREATED': 'New Booking',
      'BOOKING_CONFIRMED': 'Booking Confirmed',
      'BOOKING_REJECTED': 'Booking Rejected',
      'BOOKING_CANCELLED': 'Booking Cancelled',
      'PAYMENT_SUCCESS': 'Payment Successful',
      'PAYMENT_FAILED': 'Payment Failed',
      'USER_ACTIVATED': 'User Activated',
      'USER_DEACTIVATED': 'User Deactivated',
      'USER_CREATED': 'New User Created',
      'USER_UPDATED': 'User Updated',
      'USER_DELETED': 'User Deleted',
    };
    return titles[`${entityName}_${action}`] || `${entityName} ${action}`;
  };

  const formatNotificationMessage = (message: NotificationMessage): string => {
    const { entityName, action, data } = message;

    if (entityName === 'SERVICE_REGISTRATION' && action === 'REGISTERED') {
      const regType = data?.registrationType === 'COUNTER' ? 'at counter' : 'online';
      return `New service registration ${regType}: ${data?.serviceName || 'Service'}`;
    }

    if (entityName === 'USER') {
      const userName = data?.userName || 'User';
      if (action === 'ACTIVATED') return `${userName} has been activated`;
      if (action === 'DEACTIVATED') return `${userName} has been deactivated`;
      if (action === 'CREATED') return `New user ${userName} created`;
      if (action === 'UPDATED') return `${userName} has been updated`;
    }

    if (entityName === 'BOOKING' && action === 'CREATED') {
      return `New booking request from ${data?.userName || 'User'}`;
    }

    if (entityName === 'PAYMENT' && action === 'SUCCESS') {
      return `Payment of ${data?.amount || '0'} processed successfully`;
    }

    return message.message || `${entityName} ${action}`;
  };

  const fetchNotifications = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'SUCCESS':
      case 'PAYMENT':
        return <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />;
      case 'WARNING':
        return <WarningIcon sx={{ color: '#ff9800', fontSize: 20 }} />;
      case 'ERROR':
        return <ErrorIcon sx={{ color: '#f44336', fontSize: 20 }} />;
      case 'SERVICE_REGISTRATION':
        return <InfoIcon sx={{ color: '#9c27b0', fontSize: 20 }} />;
      case 'BOOKING':
      case 'INFO':
      case 'SYSTEM':
      default:
        return <InfoIcon sx={{ color: '#2196f3', fontSize: 20 }} />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    handleClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (notifications.length === 0) {
      fetchNotifications();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  if (!userId) return null;

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: '#045668',
          '&:hover': {
            backgroundColor: 'rgba(4, 86, 104, 0.08)',
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: 380,
              maxHeight: 500,
              mt: 1.5,
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={markAllAsRead}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  color: '#1366ba',
                }}
              >
                Mark all as read
              </Button>
            )}
          </Box>
        </Box>

        {/* Notifications List */}
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <NotificationsNoneIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No notifications yet
              </Typography>
            </Box>
          ) : (
            notifications.flatMap((notification, index) => {
              const items = [
                <MenuItem
                  key={`notification-${notification.id}`}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    px: 2,
                    py: 1.5,
                    backgroundColor: notification.read ? 'transparent' : 'rgba(19, 102, 186, 0.05)',
                    '&:hover': {
                      backgroundColor: notification.read ? 'rgba(0,0,0,0.04)' : 'rgba(19, 102, 186, 0.1)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
                    <Box sx={{ flexShrink: 0, mt: 0.5 }}>
                      {getNotificationIcon(notification.type)}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="body2"
                          fontWeight={notification.read ? 400 : 600}
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                          }}
                        >
                          {notification.title}
                        </Typography>
                        {notification.type === 'SERVICE_REGISTRATION' && notification.registrationType && (
                          <Box
                            sx={{
                              px: 0.75,
                              py: 0.25,
                              borderRadius: 1,
                              bgcolor: notification.registrationType === 'ONLINE' ? '#e3f2fd' : '#fff3e0',
                              border: '1px solid',
                              borderColor: notification.registrationType === 'ONLINE' ? '#2196f3' : '#ff9800',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                color: notification.registrationType === 'ONLINE' ? '#1976d2' : '#f57c00',
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                              }}
                            >
                              {notification.registrationType}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.4,
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          color: '#999',
                          fontSize: '0.7rem',
                        }}
                      >
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </Typography>
                    </Box>
                    {!notification.read && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#1366ba',
                          flexShrink: 0,
                          mt: 1,
                        }}
                      />
                    )}
                  </Box>
                </MenuItem>
              ];
              
              if (index < notifications.length - 1) {
                items.push(<Divider key={`divider-${notification.id}`} />);
              }
              
              return items;
            })
          )}
        </Box>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button
                fullWidth
                size="small"
                sx={{
                  textTransform: 'none',
                  color: '#1366ba',
                  fontWeight: 600,
                }}
                onClick={() => {
                  handleClose();
                }}
              >
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default GlobalNotification;
