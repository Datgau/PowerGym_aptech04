import React, { useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { useWebSocket } from '../../hooks/useWebSocket';

const WebSocketTest: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);

  const { isConnected } = useWebSocket({
    topics: ['/topic/global', '/topic/service_registration', '/topic/user'],
    autoConnect: true,
    onMessage: (message) => {
      console.log('🔔 WebSocket message received:', message);
      setMessages(prev => [message, ...prev].slice(0, 20));
    }
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        WebSocket Test Dashboard
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Connection Status
        </Typography>
        <Chip 
          label={isConnected ? 'Connected' : 'Disconnected'}
          color={isConnected ? 'success' : 'error'}
          sx={{ fontWeight: 600 }}
        />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Messages ({messages.length})
        </Typography>
        
        {messages.length === 0 ? (
          <Typography color="text.secondary">
            Waiting for messages... Try creating a user or registering a service.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((msg, index) => (
              <Paper 
                key={index} 
                variant="outlined" 
                sx={{ p: 2, bgcolor: 'grey.50' }}
              >
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip label={msg.entityName} size="small" color="primary" />
                  <Chip label={msg.action} size="small" color="secondary" />
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {msg.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(msg.timestamp).toLocaleString()}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default WebSocketTest;
