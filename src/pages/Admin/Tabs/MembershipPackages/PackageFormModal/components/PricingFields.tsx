import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import type { PricingFieldsProps } from '../types';

const PricingFields: React.FC<PricingFieldsProps> = ({
  duration,
  price,
  originalPrice,
  discount,
  errors,
  onChange
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}
          label="Duration (days)"
          type="number"
          value={duration}
          onChange={(e) => onChange('duration', parseInt(e.target.value) || 0)}
          error={!!errors.duration}
          helperText={errors.duration}
          required
          InputProps={{
            inputProps: { min: 1 }
          }}
        />

        <TextField
          sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}
          label="Price"
          type="number"
          value={price}
          onChange={(e) => onChange('price', parseFloat(e.target.value) || 0)}
          error={!!errors.price}
          helperText={errors.price}
          required
          InputProps={{
            endAdornment: <InputAdornment position="end">VND</InputAdornment>,
            inputProps: { min: 0, step: 1000 }
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}
          label="Original Price (Optional)"
          type="number"
          value={originalPrice || ''}
          onChange={(e) => onChange('originalPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
          error={!!errors.originalPrice}
          helperText={errors.originalPrice || 'For showing discount'}
          InputProps={{
            endAdornment: <InputAdornment position="end">VND</InputAdornment>,
            inputProps: { min: 0, step: 1000 }
          }}
        />

        <TextField
          sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}
          label="Discount %"
          type="number"
          value={discount || ''}
          onChange={(e) => onChange('discount', e.target.value ? parseInt(e.target.value) : undefined)}
          error={!!errors.discount}
          helperText={errors.discount || 'Discount percentage (0-100)'}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            inputProps: { min: 0, max: 100 }
          }}
        />
      </Box>
    </Box>
  );
};

export default PricingFields;
