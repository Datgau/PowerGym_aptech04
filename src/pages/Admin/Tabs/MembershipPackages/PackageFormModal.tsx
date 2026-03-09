import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Close,
  Add,
  Delete,
  Palette
} from '@mui/icons-material';
import membershipPackageService from '../../../../services/membershipPackageService';
import type { MembershipPackageDTO, MembershipPackageResponse } from '../../../../services/membershipPackageService';

interface PackageFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  package: MembershipPackageResponse | null;
}

const PRESET_COLORS = [
  '#1976d2', '#2196F3', '#FF4444', '#FF6B6B', 
  '#4ECDC4', '#FFD93D', '#6BCF7F', '#9B59B6'
];

const PackageFormModal: React.FC<PackageFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  package: editPackage
}) => {
  const [formData, setFormData] = useState<MembershipPackageDTO>({
    packageId: '',
    name: '',
    description: '',
    duration: 30,
    price: 0,
    originalPrice: undefined,
    discount: undefined,
    features: [''],
    isPopular: false,
    isActive: true,
    color: '#1976d2'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (editPackage) {
      setFormData({
        packageId: editPackage.packageId,
        name: editPackage.name,
        description: editPackage.description || '',
        duration: editPackage.duration,
        price: editPackage.price,
        originalPrice: editPackage.originalPrice,
        discount: editPackage.discount,
        features: editPackage.features.length > 0 ? editPackage.features : [''],
        isPopular: editPackage.isPopular,
        isActive: editPackage.isActive,
        color: editPackage.color || '#1976d2'
      });
    } else {
      resetForm();
    }
    setErrors({});
    setSubmitError('');
  }, [editPackage, open]);

  const resetForm = () => {
    setFormData({
      packageId: '',
      name: '',
      description: '',
      duration: 30,
      price: 0,
      originalPrice: undefined,
      discount: undefined,
      features: [''],
      isPopular: false,
      isActive: true,
      color: '#1976d2'
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.packageId.trim()) {
      newErrors.packageId = 'Package ID is required';
    } else if (formData.packageId.length > 50) {
      newErrors.packageId = 'Package ID must not exceed 50 characters';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Package name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Package name must not exceed 100 characters';
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.originalPrice && formData.originalPrice <= formData.price) {
      newErrors.originalPrice = 'Original price must be greater than current price';
    }

    if (formData.discount !== undefined && (formData.discount < 0 || formData.discount > 100)) {
      newErrors.discount = 'Discount must be between 0 and 100';
    }

    const validFeatures = formData.features.filter(f => f.trim());
    if (validFeatures.length === 0) {
      newErrors.features = 'At least one feature is required';
    } else if (validFeatures.length > 20) {
      newErrors.features = 'Maximum 20 features allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError('');

    try {
      const submitData = {
        ...formData,
        features: formData.features.filter(f => f.trim())
      };

      if (editPackage) {
        await membershipPackageService.updatePackage(editPackage.id, submitData);
      } else {
        await membershipPackageService.createPackage(submitData);
      }

      onSubmit();
      onClose();
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData({ ...formData, features: newFeatures });
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700
        }}
      >
        {editPackage ? 'Edit Package' : 'Create New Package'}
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Package ID"
            value={formData.packageId}
            onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
            error={!!errors.packageId}
            helperText={errors.packageId || 'Unique identifier (e.g., BASIC_MONTHLY)'}
            required
            disabled={!!editPackage}
          />

          <TextField
            fullWidth
            label="Package Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            required
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={2}
          />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}
              label="Duration (days)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
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
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
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
              value={formData.originalPrice || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                originalPrice: e.target.value ? parseFloat(e.target.value) : undefined 
              })}
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
              value={formData.discount || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                discount: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              error={!!errors.discount}
              helperText={errors.discount || 'Discount percentage (0-100)'}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputProps: { min: 0, max: 100 }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
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
                {PRESET_COLORS.map((color) => (
                  <Box
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: color,
                      cursor: 'pointer',
                      border: formData.color === color ? '3px solid #000' : '2px solid #ddd',
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
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                color="primary"
              />
            }
            label="Mark as Popular Package"
          />

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Features *
              </Typography>
              <Button
                size="small"
                startIcon={<Add />}
                onClick={addFeature}
                variant="outlined"
              >
                Add Feature
              </Button>
            </Box>

            {errors.features && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {errors.features}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {formData.features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={`Feature ${index + 1}`}
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeFeature(index)}
                    disabled={formData.features.length === 1}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
            }
          }}
        >
          {loading ? 'Saving...' : editPackage ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PackageFormModal;
