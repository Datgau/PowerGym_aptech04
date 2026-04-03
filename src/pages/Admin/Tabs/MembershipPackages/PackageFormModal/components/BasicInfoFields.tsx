import React from 'react';
import { TextField, Alert, Box } from '@mui/material';
import type { BasicInfoFieldsProps } from '../types';

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  name,
  description,
  packageId,
  isEdit,
  errors,
  onChange
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {isEdit && packageId && (
        <TextField
          fullWidth
          label="Package ID"
          value={packageId}
          disabled
          helperText="Package ID cannot be changed"
        />
      )}

      {!isEdit && (
        <Alert severity="info">
          Please provide engaging and detailed information.
        </Alert>
      )}

      <TextField
        fullWidth
        label="Package Name"
        value={name}
        onChange={(e) => onChange('name', e.target.value)}
        error={!!errors.name}
        helperText={errors.name}
        required
      />

      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => onChange('description', e.target.value)}
        multiline
        rows={2}
      />
    </Box>
  );
};

export default BasicInfoFields;
