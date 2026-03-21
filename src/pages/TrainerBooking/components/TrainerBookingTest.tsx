import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { getAllActiveTrainers } from '../../../services/trainerBookingService';

const TrainerBookingTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const testSystem = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      // Test API connection
      const response = await getAllActiveTrainers();
      
      if (response.success) {
        setResult(`✅ System working! Found ${response.data.length} trainers`);
      } else {
        setError('❌ API returned error: ' + response.message);
      }
    } catch (err: any) {
      setError('❌ Connection failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Trainer Booking System Test
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={testSystem}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={20} /> : 'Test System'}
      </Button>

      {result && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {result}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default TrainerBookingTest;