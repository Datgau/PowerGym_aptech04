import React, { useState, useEffect } from 'react';
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
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { GymServiceDto } from '../../../../services/gymService.ts';
import RichTextEditor from '../../../../components/Common/RichTextEditor.tsx';
import ImageUpload from '../../../../components/Common/ImageUpload.tsx';

interface ServiceFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  service?: GymServiceDto | null;
  mode: 'create' | 'edit';
}

const categories = [
  { value: 'PERSONAL_TRAINER', label: 'Personal Trainer' },
  { value: 'BOXING', label: 'Boxing' },
  { value: 'YOGA', label: 'Yoga' },
  { value: 'CARDIO', label: 'Cardio' },
  { value: 'OTHER', label: 'Khác' }
];

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
    category: '',
    price: '',
    duration: '',
    maxParticipants: '',
    isActive: true
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (service && mode === 'edit') {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        category: service.category || '',
        price: service.price?.toString() || '',
        duration: service.duration?.toString() || '',
        maxParticipants: service.maxParticipants?.toString() || '',
        isActive: service.isActive ?? true
      });
      setImagePreviews(service.images || []);
      setImages([]);
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        duration: '',
        maxParticipants: '',
        isActive: true
      });
      setImages([]);
      setImagePreviews([]);
    }
    setError('');
  }, [service, mode, open]);

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

  const handleImagesChange = (files: File[], previews: string[]) => {
    setImages(files);
    setImagePreviews(previews);
    setImageError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setImageError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Tên service không được để trống');
      }
      
      if (!formData.description.trim()) {
        throw new Error('Mô tả không được để trống');
      }

      if (mode === 'create' && images.length === 0) {
        setImageError('Vui lòng upload ít nhất 1 hình ảnh');
        return;
      }

      const submitData: any = {
        name: formData.name.trim(),
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        isActive: formData.isActive
      };

      if (formData.duration) submitData.duration = parseInt(formData.duration);
      if (formData.maxParticipants) submitData.maxParticipants = parseInt(formData.maxParticipants);
      if (mode === 'create' && images.length > 0) submitData.images = images;

      await onSubmit(submitData);
      handleClose();
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    
    // Clean up object URLs
    imagePreviews.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      duration: '',
      maxParticipants: '',
      isActive: true
    });
    setImages([]);
    setImagePreviews([]);
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
          <DialogTitle sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 600,
            fontSize: '1.25rem',
            pb: 1
          }}>
            {mode === 'create' ? 'Add New Service' : 'Edit Service'}
            <IconButton
                onClick={handleClose}
                size="small"
                disabled={loading}
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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Basic Info */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Basic Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                      label="Service Name *"
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
                      label="Category *"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      fullWidth
                      disabled={loading}
                  >
                    {categories.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Box>

              {/* Description */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Detailed Description *
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
                {mode === 'create' ? (
                    <ImageUpload
                        images={images}
                        imagePreviews={imagePreviews}
                        onImagesChange={handleImagesChange}
                        maxImages={5}
                        maxSizePerImage={5}
                        disabled={loading}
                        error={imageError}
                        helperText="Upload high-quality images to attract customers"
                    />
                ) : (
                    service?.images && service.images.length > 0 && (
                        <Box>
                          <Typography variant="body2" color="text.secondary" mb={2}>
                            Current images (image editing will be supported in a future version):
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            {service.images.map((img, index) => (
                                <Box
                                    key={index}
                                    component="img"
                                    src={img}
                                    alt={`Service ${index + 1}`}
                                    sx={{
                                      width: 120,
                                      height: 120,
                                      objectFit: 'cover',
                                      borderRadius: 2,
                                      border: '1px solid #e0e0e0'
                                    }}
                                />
                            ))}
                          </Box>
                        </Box>
                    )
                )}
              </Box>

              {/* Pricing & Details */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Pricing & Details
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box display="flex" gap={2}>
                    <TextField
                        label="Price (VND) *"
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
