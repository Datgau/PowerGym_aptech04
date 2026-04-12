import React from 'react';
import { Box, TextField, FormControlLabel, Switch, Typography } from '@mui/material';

interface PricingFieldsProps {
  price: string;
  duration: string;
  maxParticipants: string;
  isActive: boolean;
  trainerPercentage: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PricingFields: React.FC<PricingFieldsProps> = ({
  price,
  duration,
  maxParticipants,
  isActive,
  trainerPercentage,
  loading,
  onChange
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Pricing & Details
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box display="flex" gap={2}>
          <TextField
            label="Price (VND)"
            name="price"
            type="number"
            value={price}
            onChange={onChange}
            required
            fullWidth
            disabled={loading}
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Duration (days)"
            name="duration"
            type="number"
            value={duration}
            onChange={onChange}
            fullWidth
            disabled={loading}
            inputProps={{ min: 0 }}
          />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            label="Maximum Participants"
            name="maxParticipants"
            type="number"
            value={maxParticipants}
            onChange={onChange}
            fullWidth
            disabled={loading}
            inputProps={{ min: 1 }}
            helperText="Leave empty if there is no participant limit"
          />

          <TextField
            label="Trainer Percentage"
            name="trainerPercentage"
            type="number"
            value={trainerPercentage}
            onChange={onChange}
            required
            fullWidth
            disabled={loading}
            inputProps={{ min: 0, max: 1, step: 0.01 }}
            helperText="Trainer's commission rate (0.30 = 30%)"
          />
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={onChange}
              name="isActive"
              disabled={loading}
            />
          }
          label="Activate service"
        />
      </Box>
    </Box>
  );
};

export default PricingFields;
