import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Typography,
  IconButton,
  Paper,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import type { GymServiceDto } from '../../../../services/gymService.ts';
import { getAllServiceCategoriesNoPaging, type ServiceCategoryResponse } from '../../../../services/serviceCategoryService.ts';
import RichTextEditor from '../../../../components/Common/RichTextEditor.tsx';

interface ServiceFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  service?: GymServiceDto | null;
  mode: 'create' | 'edit';
}

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  service,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    duration: '',
    maxParticipants: '',
    isActive: true
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');
  const [categories, setCategories] = useState<ServiceCategoryResponse[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await getAllServiceCategoriesNoPaging();
        if (response.success) {
          setCategories(response.data);
        } else {
          setError('Failed to load service categories');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load service categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (open) {
      loadCategories();
    }
  }, [open]);

  useEffect(() => {
    if (service && mode === 'edit') {
      // For edit mode, extract categoryId from the category object
      let categoryId = '';
      if (service.category) {
        if (typeof service.category === 'object' && service.category.id) {
          categoryId = service.category.id.toString();
        }
      }
      
      setFormData({
        name: service.name || '',
        description: service.description || '',
        categoryId: categoryId,
        price: service.price?.toString() || '',
        duration: service.duration?.toString() || '',
        maxParticipants: service.maxParticipants?.toString() || '',
        isActive: service.isActive ?? true
      });
      
      // Set existing images for edit mode
      setExistingImages(service.images || []);
      setDeletedImages([]);
      setImagePreviews([]);
      setImages([]);
    } else {
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        price: '',
        duration: '',
        maxParticipants: '',
        isActive: true
      });
      setExistingImages([]);
      setDeletedImages([]);
      setImages([]);
      setImagePreviews([]);
    }
    setError('');
  }, [service, mode, open, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDescriptionChange = (value: string) => {
    setFormData({
      ...formData,
      description: value
    });
  };

  const handleDeleteExistingImage = (imageUrl: string) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
    setDeletedImages(prev => [...prev, imageUrl]);
  };

  const getTotalImageCount = () => {
    return existingImages.length + images.length;
  };

  const canAddMoreImages = () => {
    return getTotalImageCount() < 5;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of newFiles) {
      if (!file.type.startsWith('image/')) {
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        continue;
      }
      if (getTotalImageCount() + validFiles.length >= 5) {
        break;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...images, ...validFiles];
      const updatedPreviews = [...imagePreviews, ...newPreviews];
      setImages(updatedFiles);
      setImagePreviews(updatedPreviews);
      setImageError('');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveNewImage = (index: number) => {
    const updatedFiles = images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setImageError('');
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        throw new Error('Service name is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (!formData.categoryId) {
        throw new Error('Please select a category');
      }
      if (mode === 'create' && images.length === 0) {
        setImageError('Please upload at least one image');
        return;
      }
      if (mode === 'edit' && getTotalImageCount() === 0) {
        setImageError('A service must have at least one image');
        return;
      }

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
    imagePreviews.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      price: '',
      duration: '',
      maxParticipants: '',
      isActive: true
    });
    setImages([]);
    setImagePreviews([]);
    setExistingImages([]);
    setDeletedImages([]);
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

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                  onClick={handleClose}
                  sx={{ color: 'white' }}
                  size="small"
                  disabled={loading}
                  title="Close"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>



          <DialogContent dividers>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                  {error}
                </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                      label="Service Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      fullWidth
                      disabled={loading}
                      placeholder="Enter service name..."
                  />

                  <TextField
                      select
                      label="Category"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
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
              </Box>

              {/* Description */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Detailed Description
                </Typography>
                <RichTextEditor
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    placeholder="Describe the service in detail, benefits, process..."
                    disabled={loading}
                    maxLength={2000}
                    minHeight={150}
                    helperText="Use rich text to create an engaging description"
                />
              </Box>

              {/* Images */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Images {mode === 'create' && '*'}
                </Typography>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  disabled={loading}
                />

                {/* Image Error */}
                {imageError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {imageError}
                  </Alert>
                )}

                {/* Existing Images (Edit Mode) */}
                {mode === 'edit' && existingImages.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Current Images:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {existingImages.map((imageUrl, index) => (
                        <Box key={`existing-${index}`} sx={{ width: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 11px)', md: 'calc(25% - 12px)' } }}>
                          <Paper
                            sx={{
                              position: 'relative',
                              borderRadius: 2,
                              overflow: 'hidden',
                              '&:hover .delete-button': {
                                opacity: 1
                              }
                            }}
                          >
                            <Avatar
                              src={imageUrl}
                              variant="rounded"
                              sx={{
                                width: '100%',
                                height: 120,
                                objectFit: 'cover'
                              }}
                            />
                            <IconButton
                              className="delete-button"
                              onClick={() => handleDeleteExistingImage(imageUrl)}
                              disabled={loading}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                '&:hover': {
                                  bgcolor: 'rgba(0,0,0,0.9)'
                                }
                              }}
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Paper>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* New Images */}
                {imagePreviews.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {mode === 'edit' && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        New Images to Add:
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {imagePreviews.map((preview, index) => (
                        <Box key={`new-${index}`} sx={{ width: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 11px)', md: 'calc(25% - 12px)' } }}>
                          <Paper
                            sx={{
                              position: 'relative',
                              borderRadius: 2,
                              overflow: 'hidden',
                              '&:hover .delete-button': {
                                opacity: 1
                              }
                            }}
                          >
                            <Avatar
                              src={preview}
                              variant="rounded"
                              sx={{
                                width: '100%',
                                height: 120,
                                objectFit: 'cover'
                              }}
                            />
                            <IconButton
                              className="delete-button"
                              onClick={() => handleRemoveNewImage(index)}
                              disabled={loading}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                '&:hover': {
                                  bgcolor: 'rgba(0,0,0,0.9)'
                                }
                              }}
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Paper>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Upload Button */}
                {canAddMoreImages() && (
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<UploadIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    sx={{
                      height: 120,
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      borderColor: imageError ? 'error.main' : 'divider',
                      color: imageError ? 'error.main' : 'text.secondary',
                      '&:hover': {
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        borderColor: imageError ? 'error.dark' : 'primary.main',
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <Box textAlign="center">
                      <Typography variant="body1" gutterBottom>
                        {getTotalImageCount() === 0 ? 'Click to upload images' : 'Add more images'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Max 5 images • Max 5MB each
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {getTotalImageCount()}/5 images
                      </Typography>
                    </Box>
                  </Button>
                )}

                {/* Helper Text */}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Upload high-quality images to attract customers. You can delete and replace images anytime.
                </Typography>
              </Box>

              {/* Pricing & Details */}
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
                        value={formData.price}
                        onChange={handleChange}
                        required
                        fullWidth
                        disabled={loading}
                        inputProps={{ min: 0 }}
                    />

                    <TextField
                        label="Duration (days)"
                        name="duration"
                        type="number"
                        value={formData.duration}
                        onChange={handleChange}
                        fullWidth
                        disabled={loading}
                        inputProps={{ min: 0 }}
                    />
                  </Box>

                  <TextField
                      label="Maximum Participants"
                      name="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      fullWidth
                      disabled={loading}
                      inputProps={{ min: 1 }}
                      helperText="Leave empty if there is no participant limit"
                  />

                  <FormControlLabel
                      control={
                        <Switch
                            checked={formData.isActive}
                            onChange={handleChange}
                            name="isActive"
                            disabled={loading}
                        />
                      }
                      label="Activate service"
                  />
                </Box>
              </Box>
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
