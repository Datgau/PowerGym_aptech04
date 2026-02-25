import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useGymServices } from '../../hooks/useGymServices';

const ServiceImageDebug: React.FC = () => {
  const { services, loading, error } = useGymServices();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Service Image Debug
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        Total services: {services.length}
      </Typography>

      {services.map((service, index) => (
        <Card key={service.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{service.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {service.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Category: {service.category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Images array length: {service.images?.length || 0}
            </Typography>
            
            {service.images && service.images.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Images:</Typography>
                {service.images.map((imageUrl, imgIndex) => (
                  <Box key={imgIndex} sx={{ mt: 1 }}>
                    <Typography variant="caption" display="block">
                      [{imgIndex}]: {imageUrl}
                    </Typography>
                    <img 
                      src={imageUrl} 
                      alt={`${service.name} - ${imgIndex}`}
                      style={{ 
                        width: '100px', 
                        height: '60px', 
                        objectFit: 'cover',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        marginTop: '4px'
                      }}
                      onError={(e) => {
                        console.error(`Failed to load image: ${imageUrl}`);
                        e.currentTarget.style.border = '2px solid red';
                      }}
                      onLoad={() => {
                        console.log(`Successfully loaded image: ${imageUrl}`);
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                No images available
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ServiceImageDebug;