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
  ImageList,
  ImageListItem,
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import type { GymServiceDto } from '../../../../services/gymService.ts';

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      
      // Create previews
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData: any = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        isActive: formData.isActive
      };

      if (formData.duration) submitData.duration = parseInt(formData.duration);
      if (formData.maxParticipants) submitData.maxParticipants = parseInt(formData.maxParticipants);
      if (mode === 'create' && images.length > 0) submitData.images = images;

      await onSubmit(submitData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
          {mode === 'create' ? 'Thêm Service Mới' : 'Chỉnh Sửa Service'}
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Tên service"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            
            <TextField
              label="Mô tả"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
            
            <TextField
              select
              label="Danh mục"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              fullWidth
            >
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </TextField>
            
            <Box display="flex" gap={2}>
              <TextField
                label="Giá (VNĐ)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                fullWidth
              />
              
              <TextField
                label="Thời lượng (phút)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                fullWidth
              />
            </Box>
            
            <TextField
              label="Số người tối đa"
              name="maxParticipants"
              type="number"
              value={formData.maxParticipants}
              onChange={handleChange}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleChange}
                  name="isActive"
                />
              }
              label="Active"
            />
            
            {mode === 'create' && (
              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  fullWidth
                >
                  Upload Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                
                {imagePreviews.length > 0 && (
                  <ImageList cols={3} gap={8} sx={{ mt: 2 }}>
                    {imagePreviews.map((preview, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          loading="lazy"
                          style={{ height: 100, objectFit: 'cover', borderRadius: 8 }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </Box>
            )}

            {mode === 'edit' && service?.images && service.images.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Images hiện tại:
                </Typography>
                <ImageList cols={3} gap={8}>
                  {service.images.map((img, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={img}
                        alt={`Service ${index + 1}`}
                        loading="lazy"
                        style={{ height: 100, objectFit: 'cover', borderRadius: 8 }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading}
            sx={{ 
              background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
              minWidth: 100
            }}
          >
            {loading ? <CircularProgress size={24} /> : (mode === 'create' ? 'Thêm' : 'Lưu')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ServiceFormModal;
