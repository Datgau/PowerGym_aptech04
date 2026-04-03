import React from 'react';
import { Box, TextField, MenuItem, CircularProgress } from '@mui/material';
import type { ServiceCategoryResponse } from '../../../../../services/serviceCategoryService';

interface BasicInfoFieldsProps {
  name: string;
  categoryId: string;
  categories: ServiceCategoryResponse[];
  categoriesLoading: boolean;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  name,
  categoryId,
  categories,
  categoriesLoading,
  loading,
  onChange
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Service Name"
        name="name"
        value={name}
        onChange={onChange}
        required
        fullWidth
        disabled={loading}
        placeholder="Enter service name..."
      />

      <TextField
        select
        label="Category"
        name="categoryId"
        value={categoryId}
        onChange={onChange}
        required
        fullWidth
        disabled={loading || categoriesLoading}
      >
        {categoriesLoading ? (
          <MenuItem disabled>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            Loading categories...
          </MenuItem>
        ) : (
          categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id.toString()}>
              {cat.displayName}
            </MenuItem>
          ))
        )}
      </TextField>
    </Box>
  );
};

export default BasicInfoFields;
