import React from 'react';
import { Box, TextField, FormControlLabel, Switch, Typography } from '@mui/material';

interface PricingFieldsProps {
  price: string;
  duration: string;
  maxParticipants: string;
  isActive: boolean;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PricingFields: React.FC<PricingFieldsProps> = ({
  price,
  duration,
  maxParticipants,
  isActive,
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
            label="Price (USD)"
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
