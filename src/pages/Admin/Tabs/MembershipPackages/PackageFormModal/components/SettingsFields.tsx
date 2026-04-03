import React from 'react';
import { Box, FormControlLabel, Switch, Typography } from '@mui/material';
import { Palette } from '@mui/icons-material';
import type { SettingsFieldsProps } from '../types';
import { PRESET_COLORS } from '../constants';

const SettingsFields: React.FC<SettingsFieldsProps> = ({
  isActive,
  isPopular,
  color,
  onChange
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => onChange('isActive', e.target.checked)}
                color="primary"
              />
            }
            label="Active Package"
          />
        </Box>

        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            <Palette sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
            Theme Color
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {PRESET_COLORS.map((presetColor) => (
              <Box
                key={presetColor}
                onClick={() => onChange('color', presetColor)}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: presetColor,
                  cursor: 'pointer',
                  border: color === presetColor ? '3px solid #000' : '2px solid #ddd',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={isPopular}
            onChange={(e) => onChange('isPopular', e.target.checked)}
            color="primary"
          />
        }
        label="Mark as Popular Package"
      />
    </Box>
  );
};

export default SettingsFields;
