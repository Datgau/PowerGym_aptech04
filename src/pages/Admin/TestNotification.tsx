import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useWebSocket } from '../../hooks/useWebSocket';

const TestNotification: React.FC = () => {
  const { isConnected, lastMessage, sendMessage } = useWebSocket({
    topics: ['/topic/global'],
    autoConnect: true,
    onMessage: (message) => {
      console.log('✅ Test received message:', message);
      alert(`Received: ${message.message}`);
    }
  });

  const handleTestSend = () => {
    sendMessage('/app/test', {
      message: 'Test notification from frontend'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        WebSocket Test Page
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography>
          Connection Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleTestSend}
          disabled={!isConnected}
        >
          Send Test Message
        </Button>
      </Box>

      {lastMessage && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="subtitle2">Last Message:</Typography>
          <pre>{JSON.stringify(lastMessage, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
};

export default TestNotification;
