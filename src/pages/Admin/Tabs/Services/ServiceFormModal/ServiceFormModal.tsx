import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { ServiceFormModalProps } from './types';
import { VALIDATION_MESSAGES } from './constants';
import { useServiceForm } from './hooks/useServiceForm';
import { useImageManagement } from './hooks/useImageManagement';
import { useServiceCategories } from './hooks/useServiceCategories';
import BasicInfoFields from './components/BasicInfoFields';
import DescriptionField from './components/DescriptionField';
import ImageManagement from './components/ImageManagement';
import PricingFields from './components/PricingFields';

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  service,
  mode
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');

  const { formData, handleChange, handleDescriptionChange, resetForm } = useServiceForm(service, mode, open);
  
  const {
    images,
    imagePreviews,
    existingImages,
    deletedImages,
    fileInputRef,
    getTotalImageCount,
    handleFileSelect,
    handleRemoveNewImage,
    handleDeleteExistingImage,
    resetImages
  } = useImageManagement(service, mode, open);

  const { categories, loading: categoriesLoading, error: categoriesError } = useServiceCategories(open);

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError(VALIDATION_MESSAGES.NAME_REQUIRED);
      return false;
    }
    if (!formData.description.trim()) {
      setError(VALIDATION_MESSAGES.DESCRIPTION_REQUIRED);
      return false;
    }
    if (!formData.categoryId) {
      setError(VALIDATION_MESSAGES.CATEGORY_REQUIRED);
      return false;
    }
    if (mode === 'create' && images.length === 0) {
      setImageError(VALIDATION_MESSAGES.IMAGE_REQUIRED_CREATE);
      return false;
    }
    if (mode === 'edit' && getTotalImageCount() === 0) {
      setImageError(VALIDATION_MESSAGES.IMAGE_REQUIRED_EDIT);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setImageError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const submitData: any = {
        name: formData.name.trim(),
        description: formData.description,
        categoryId: parseInt(formData.categoryId),
        price: parseFloat(formData.price),
        isActive: formData.isActive
      };

      if (formData.duration) submitData.duration = parseInt(formData.duration);
      if (formData.maxParticipants) submitData.maxParticipants = parseInt(formData.maxParticipants);
      
      if (mode === 'create' && images.length > 0) {
        submitData.images = images;
      } else if (mode === 'edit') {
        if (images.length > 0) {
          submitData.images = images;
        }
        if (deletedImages.length > 0) {
          submitData.deletedImages = deletedImages;
        }
      }

      await onSubmit(submitData);
      handleClose();
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Error network');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    
    resetImages();
    resetForm();
    setError('');
    setImageError('');
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
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
            background: 'linear-gradient(135deg, #00b4ff 0%, #0066ff 100%)',
            color: 'white',
            flexShrink: 0,
            top: 0,
            zIndex: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              {mode === 'create' ? 'Add New Service' : 'Edit Service'}
            </Typography>
          </Box>

          <IconButton
            onClick={handleClose}
            sx={{ color: 'white' }}
            size="small"
            disabled={loading}
            title="Close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {categoriesError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {categoriesError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <BasicInfoFields
              name={formData.name}
              categoryId={formData.categoryId}
              categories={categories}
              categoriesLoading={categoriesLoading}
              loading={loading}
              onChange={handleChange}
            />

            <DescriptionField
              value={formData.description}
              onChange={handleDescriptionChange}
              loading={loading}
            />

            <ImageManagement
              images={images}
              imagePreviews={imagePreviews}
              existingImages={existingImages}
              deletedImages={deletedImages}
              loading={loading}
              imageError={imageError}
              mode={mode}
              onFileSelect={handleFileSelect}
              onRemoveNewImage={handleRemoveNewImage}
              onDeleteExistingImage={handleDeleteExistingImage}
              fileInputRef={fileInputRef}
            />

            <PricingFields
              price={formData.price}
              duration={formData.duration}
              maxParticipants={formData.maxParticipants}
              isActive={formData.isActive}
              loading={loading}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
              minWidth: 120
            }}
          >
            {loading ? 'Processing...' : (mode === 'create' ? 'Create Service' : 'Update')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ServiceFormModal;
