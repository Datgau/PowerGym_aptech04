import React, { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import CreateTrainerModal from './CreateTrainerModal';

const TrainerDemo: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleSuccess = () => {
    console.log('Trainer created successfully!');
    setOpenModal(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          Trainer Management Demo
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          onClick={() => setOpenModal(true)}
          sx={{
            background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
            px: 4,
            py: 1.5
          }}
        >
          Tạo Trainer Mới
        </Button>
      </Box>

      <CreateTrainerModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleSuccess}
      />
    </Container>
  );
};

export default TrainerDemo;