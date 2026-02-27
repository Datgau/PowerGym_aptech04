import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import type { Trainer } from '../../../data/adminMockData';

interface TrainersGridProps {
  trainers: Trainer[];
  onOpenDialog: (type: 'add' | 'edit' | 'view', item?: any) => void;
}

const TrainersGrid: React.FC<TrainersGridProps> = ({ trainers, onOpenDialog }) => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Trainer Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => onOpenDialog('add')}
          sx={{ background: 'linear-gradient(135deg, #4caf50, #2e7d32)' }}
        >
          Add Trainer
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {trainers.map((trainer) => (
          <Grid item xs={12} md={6} lg={4} key={trainer.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar src={trainer.avatar} sx={{ width: 60, height: 60 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700}>{trainer.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {trainer.specialization}
                    </Typography>
                  </Box>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Experience</Typography>
                  <Typography fontWeight={600}>{trainer.experience}</Typography>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Rating</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontWeight={600}>{trainer.rating}/5</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={trainer.rating * 20} 
                      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">
                    {trainer.clients} clients
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => onOpenDialog('edit', trainer)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TrainersGrid;
