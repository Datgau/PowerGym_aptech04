import { Badge, IconButton, Box, Typography } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { useWebSocket } from '../../hooks/useWebSocket.ts';
import React, { useState } from 'react';
const GlobalNotification: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const { isConnected } = useWebSocket({
    topics: ['/topic/global'],
    autoConnect: true,
    onMessage: () => {
      // Just update counter, no popup notification
      setUnreadCount(prev => prev + 1);
    }
  });

  const handleNotificationClick = () => {
    setUnreadCount(0);
  };

  const isDevelopment = import.meta.env.DEV;

  return (
    <>
      {/* Notification Icon with Badge */}
      <IconButton 
        color="inherit" 
        onClick={handleNotificationClick}
        sx={{ position: 'relative' }}
        title="Notifications"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Connection Status (only in development) */}
      {isDevelopment && (
        <Box sx={{ position: 'fixed', bottom: 10, right: 10, zIndex: 9999 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              bgcolor: isConnected ? 'success.main' : 'error.main',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1
            }}
          >
            {isConnected ? '🟢 WS' : '🔴 WS'}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default GlobalNotification;
