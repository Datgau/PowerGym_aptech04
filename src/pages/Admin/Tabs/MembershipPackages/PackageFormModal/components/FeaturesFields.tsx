import React from 'react';
import { Box, Typography, Button, Alert, TextField, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import type { FeaturesFieldsProps } from '../types';

const FeaturesFields: React.FC<FeaturesFieldsProps> = ({
  features,
  error,
  onFeatureChange,
  onAddFeature,
  onRemoveFeature
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Features *
        </Typography>
        <Button
          size="small"
          startIcon={<Add />}
          onClick={onAddFeature}
          variant="outlined"
        >
          Add Feature
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {features.map((feature, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={`Feature ${index + 1}`}
              value={feature}
              onChange={(e) => onFeatureChange(index, e.target.value)}
            />
            <IconButton
              size="small"
              onClick={() => onRemoveFeature(index)}
              disabled={features.length === 1}
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FeaturesFields;
