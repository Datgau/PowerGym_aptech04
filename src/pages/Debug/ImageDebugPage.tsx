import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import ServiceImageDebug from '../../components/Debug/ServiceImageDebug';
import { gymServiceApi } from '../../services/gymService';

const ImageDebugPage: React.FC = () => {
  const [rawApiData, setRawApiData] = React.useState<any>(null);

  const fetchRawData = async () => {
    try {
      const response = await gymServiceApi.getServicesActive();
      console.log('Raw API Response:', response);
      setRawApiData(response);
    } catch (error) {
      console.error('Error fetching raw data:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Image Debug Page
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Button variant="contained" onClick={fetchRawData}>
          Fetch Raw API Data
        </Button>
      </Box>

      {rawApiData && (
        <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Raw API Response:
          </Typography>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(rawApiData, null, 2)}
          </pre>
        </Box>
      )}

      <ServiceImageDebug />
    </Container>
  );
};

export default ImageDebugPage;