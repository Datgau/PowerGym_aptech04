import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { Close } from '@mui/icons-material';
import membershipPackageService from '../../../../../services/membershipPackageService';
import type { PackageFormModalProps } from './types';
import { usePackageForm } from './hooks/usePackageForm';
import { usePackageValidation } from './hooks/usePackageValidation';
import BasicInfoFields from './components/BasicInfoFields';
import PricingFields from './components/PricingFields';
import FeaturesFields from './components/FeaturesFields';
import SettingsFields from './components/SettingsFields';

const PackageFormModal: React.FC<PackageFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  package: editPackage
}) => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { formData, updateField, resetForm } = usePackageForm(editPackage, open);
  const { errors, validateForm, clearErrors } = usePackageValidation();

  useEffect(() => {
    if (open) {
      clearErrors();
      setSubmitError('');
    }
  }, [open, clearErrors]);

  const handleFieldChange = (field: string, value: any) => {
    // Auto-calculate logic for pricing fields
    if (field === 'discount' && value !== undefined && value !== '') {
      // When discount changes, calculate original price from current price
      const discountPercent = parseFloat(value);
      if (!isNaN(discountPercent) && discountPercent > 0 && discountPercent <= 100 && formData.price > 0) {
        // Formula: originalPrice = price / (1 - discount/100)
        const calculatedOriginalPrice = Math.round(formData.price / (1 - discountPercent / 100));
        updateField('originalPrice', calculatedOriginalPrice);
      }
      updateField(field, value);
    } else if (field === 'originalPrice' && value !== undefined && value !== '') {
      // When original price changes, calculate discount from current price
      const origPrice = parseFloat(value);
      if (!isNaN(origPrice) && origPrice > formData.price && formData.price > 0) {
        // Formula: discount = (1 - price/originalPrice) * 100
        const calculatedDiscount = Math.round((1 - formData.price / origPrice) * 100);
        updateField('discount', calculatedDiscount);
      }
      updateField(field, value);
    } else if (field === 'price') {
      // When price changes, recalculate based on existing discount or original price
      const newPrice = parseFloat(value) || 0;
      updateField(field, newPrice);
      
      if (formData.discount && formData.discount > 0) {
        // Recalculate original price based on discount
        const calculatedOriginalPrice = Math.round(newPrice / (1 - formData.discount / 100));
        updateField('originalPrice', calculatedOriginalPrice);
      } else if (formData.originalPrice && formData.originalPrice > newPrice) {
        // Recalculate discount based on original price
        const calculatedDiscount = Math.round((1 - newPrice / formData.originalPrice) * 100);
        updateField('discount', calculatedDiscount);
      }
    } else {
      updateField(field, value);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    updateField('features', newFeatures);
  };

  const handleAddFeature = () => {
    updateField('features', [...formData.features, '']);
  };

  const handleRemoveFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      updateField('features', newFeatures);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm(formData)) return;

    setLoading(true);
    setSubmitError('');

    try {
      const validFeatures = formData.features.filter(f => f.trim());
      
      if (editPackage) {
        await membershipPackageService.updatePackage(editPackage.id, {
          ...formData,
          features: validFeatures
        });
      } else {
        const { packageId, ...createData } = formData;
        await membershipPackageService.createPackage({
          ...createData,
          features: validFeatures
        });
      }
      
      onSubmit();
      onClose();
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    clearErrors();
    setSubmitError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #00b4ff 0%, #0066ff 100%)',
          color: 'white',
          fontWeight: 700
        }}
      >
        {editPackage ? 'Edit Package' : 'Create New Package'}
        <IconButton onClick={handleClose} sx={{ color: 'white' }} disabled={loading}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError('')}>
            {submitError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <BasicInfoFields
            name={formData.name}
            description={formData.description}
            packageId={formData.packageId}
            isEdit={!!editPackage}
            errors={errors}
            onChange={handleFieldChange}
          />

          <PricingFields
            duration={formData.duration}
            price={formData.price}
            originalPrice={formData.originalPrice}
            discount={formData.discount}
            errors={errors}
            onChange={handleFieldChange}
          />

          <SettingsFields
            isActive={formData.isActive}
            isPopular={formData.isPopular}
            color={formData.color}
            onChange={handleFieldChange}
          />

          <FeaturesFields
            features={formData.features}
            error={errors.features}
            onFeatureChange={handleFeatureChange}
            onAddFeature={handleAddFeature}
            onRemoveFeature={handleRemoveFeature}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{
            background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
            minWidth: 120
          }}
        >
          {loading ? 'Saving...' : editPackage ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PackageFormModal;
