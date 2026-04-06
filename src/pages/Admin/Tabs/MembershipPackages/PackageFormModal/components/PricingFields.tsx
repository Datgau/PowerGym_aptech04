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
          label="Current Price (After Discount)"
          type="text"
          inputMode="numeric"
          value={price}
          onChange={(e) => onChange('price', parseFloat(e.target.value) || 0)}
          error={!!errors.price}
          helperText={errors.price || 'Final price customers will pay'}
          required
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">VND</InputAdornment>,
            },
            htmlInput: { min: 0, step: 1000 }
          }}
        />

        <TextField
          sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}
          label="Duration (days)"
          type="text"
          inputMode="numeric"
          value={duration}
          onChange={(e) => onChange('duration', parseInt(e.target.value) || 0)}
          error={!!errors.duration}
          helperText={errors.duration}
          required
          slotProps={{
            htmlInput: { min: 1 }
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}
          label="Original Price (Before Discount)"
          type="text"
          inputMode="numeric"
          value={originalPrice || ''}
          onChange={(e) => onChange('originalPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
          error={!!errors.originalPrice}
          helperText={errors.originalPrice || 'Auto-calculated when you enter discount %'}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">VND</InputAdornment>,
            },
            htmlInput: { min: 0, step: 1000 }
          }}
        />

        <TextField
          sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}
          label="Discount Percentage"
          type="text"
          inputMode="numeric"
          value={discount || ''}
          onChange={(e) => onChange('discount', e.target.value ? parseInt(e.target.value) : undefined)}
          error={!!errors.discount}
          helperText={errors.discount || 'Auto-calculated when you enter original price'}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            },
            htmlInput: { min: 0, max: 100 }
          }}
        />
      </Box>
    </Box>
  );
};

export default PricingFields;
