import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Typography,
  Avatar
} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import {type CreateEquipmentDto, type Equipment, equipmentService} from '../../../../services/equipmentService';
import { useEquipmentCategories } from '../../../../hooks/useEquipments';

interface EquipmentFormModalProps {
  open: boolean;
  equipment: Equipment | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EquipmentFormModal: React.FC<EquipmentFormModalProps> = ({
  open,
  equipment,
  onClose,
  onSuccess
}) => {
  const { categories } = useEquipmentCategories(true); // Only active categories
  const [formData, setFormData] = useState<CreateEquipmentDto>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    image: '',
    categoryId: 0,
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
        description: equipment.description || '',
        price: equipment.price,
        quantity: equipment.quantity,
        image: equipment.image || '',
        categoryId: equipment.category.id,
        isActive: equipment.isActive
      });
      setPreviewUrl(equipment.image || '');
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        image: '',
        categoryId: categories.length > 0 ? categories[0].id : 0,
        isActive: true
      });
      setPreviewUrl('');
    }
    setErrors({});
    setSelectedFile(null);
  }, [equipment, open, categories]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Equipment name is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity must be at least 0';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };



  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      if (equipment) {
        await equipmentService.updateEquipment(equipment.id, formData, selectedFile || undefined);
      } else {
        await equipmentService.createEquipment(formData, selectedFile || undefined);
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving equipment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save equipment';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateEquipmentDto) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    let value: any = event.target.value;
    
    if (field === 'isActive') {
      value = (event.target as HTMLInputElement).checked;
    } else if (field === 'price' || field === 'quantity') {
      value = parseFloat(value) || 0;
    } else if (field === 'categoryId') {
      value = parseInt(value as string) || 0;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {equipment ? 'Edit Equipment' : 'Create New Equipment'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Equipment Name"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={handleChange('description')}
            error={!!errors.description}
            helperText={errors.description}
            margin="normal"
            multiline
            rows={3}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              label="Price"
              value={formData.price}
              onChange={handleChange('price')}
              error={!!errors.price}
              helperText={errors.price}
              type="number"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">₫</InputAdornment>,
              }}
              sx={{ flex: 1 }}
            />

            <TextField
              label="Quantity"
              value={formData.quantity}
              onChange={handleChange('quantity')}
              error={!!errors.quantity}
              helperText={errors.quantity}
              type="number"
              required
              InputProps={{
                inputProps: { min: 0 }
              }}
              sx={{ flex: 1 }}
            />

            <FormControl sx={{ flex: 1 }} error={!!errors.categoryId}>
              <InputLabel>Category *</InputLabel>
              <Select
                value={formData.categoryId}
                onChange={handleChange('categoryId')}
                label="Category *"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryId && (
                <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                  {errors.categoryId}
                </Box>
              )}
            </FormControl>
          </Box>
          
          
          {/* Image Upload Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Equipment Image
            </Typography>
            
            {previewUrl && (
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={previewUrl}
                  sx={{ width: 80, height: 80 }}
                  variant="rounded"
                />
                <Button
                  onClick={handleRemoveImage}
                  color="error"
                  startIcon={<Delete />}
                  size="small"
                >
                  Remove Image
                </Button>
              </Box>
            )}
            
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              disabled={loading}
              sx={{ mb: 1 }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileSelect}
              />
            </Button>
            
            {errors.image && (
              <Typography color="error" variant="caption" display="block">
                {errors.image}
              </Typography>
            )}
          </Box>
          
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleChange('isActive')}
              />
            }
            label="Active"
            sx={{ mt: 2 }}
          />

          {errors.submit && (
            <Box sx={{ mt: 2, color: 'error.main', fontSize: '0.875rem' }}>
              {errors.submit}
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {equipment ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EquipmentFormModal;