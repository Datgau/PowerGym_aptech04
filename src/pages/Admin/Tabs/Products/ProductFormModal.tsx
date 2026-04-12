import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Box,
  CircularProgress,
  IconButton,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import { PhotoCamera, Close, Image as ImageIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { createProduct, updateProduct, uploadProductImage } from '../../../../services/productService';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../../../../types/product';

interface ProductFormModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  open,
  product,
  onClose,
  onSuccess,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');

  const isEditMode = !!product;

  // Update form when product changes
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price?.toString() || '');
      setStock(product.stock?.toString() || '');
      setLowStockThreshold(product.lowStockThreshold?.toString() || '');
      setImagePreview(product.imageUrl || null);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setLowStockThreshold('');
      setImagePreview(null);
    }
    setImageFile(null);
  }, [product, open]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must not exceed 5MB');
        return;
      }
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      toast.error('Valid price is required');
      return;
    }
    if (!isEditMode && (!stock || parseInt(stock) < 0)) {
      toast.error('Valid initial stock is required');
      return;
    }
    
    setSubmitting(true);
    try {
      let savedProduct: Product;
      
      if (isEditMode && product) {
        const updateData: UpdateProductRequest = {
          name: name.trim(),
          description: description.trim(),
          price: parseFloat(price),
          lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : undefined,
          imageUrl: product.imageUrl,
        };
        savedProduct = await updateProduct(product.id, updateData);
      } else {
        // Create new product
        const createData: CreateProductRequest = {
          name: name.trim(),
          description: description.trim(),
          price: parseFloat(price),
          stock: parseInt(stock),
          lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : undefined,
        };
        savedProduct = await createProduct(createData);
      }
      
      if (imageFile) {
        setUploading(true);
        await uploadProductImage(savedProduct.id, imageFile);
      }
      
      toast.success(isEditMode ? 'Product updated successfully' : 'Product created successfully');
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!submitting && !uploading) {
      onClose();
    }
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
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {isEditMode ? 'Edit Product' : 'Create New Product'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {isEditMode ? 'Update product information' : 'Add a new product to your inventory'}
            </Typography>
          </Box>
          <IconButton 
            onClick={handleClose} 
            disabled={submitting || uploading}
            sx={{ 
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <Close />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={3}>
                {/* Image Upload Section */}
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} mb={2} color="#0f172a">
                    Product Image
                  </Typography>
                  
                  {imagePreview ? (
                    <Stack spacing={2} alignItems="center">
                      <Box
                        component="img"
                        src={imagePreview}
                        alt="Preview"
                        sx={{
                          width: '100%',
                          maxWidth: 400,
                          height: 250,
                          objectFit: 'cover',
                          borderRadius: 2,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        }}
                      />
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<PhotoCamera />}
                        size="medium"
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Change Image
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </Button>
                      <Typography variant="caption" color="text.secondary">
                        Supported: JPG, PNG, GIF (Max 5MB)
                      </Typography>
                    </Stack>
                  ) : (
                    <Box
                      sx={{
                        backgroundColor: '#f8fafc',
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                      }}
                    >
                      <Stack spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            backgroundColor: '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ImageIcon sx={{ fontSize: 40, color: '#64748b' }} />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary" mb={1.5}>
                            No image selected
                          </Typography>
                          <Button
                            variant="contained"
                            component="label"
                            startIcon={<PhotoCamera />}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                            }}
                          >
                            Upload Image
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </Button>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Supported: JPG, PNG, GIF (Max 5MB)
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" fontWeight={600} mb={2} color="#0f172a">
                    Product Information
                  </Typography>
                  <Stack spacing={2.5}>
                    <TextField
                      name="name"
                      label="Product Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                      required
                      disabled={submitting || uploading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    <TextField
                      name="description"
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                      disabled={submitting || uploading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    <Stack direction="row" spacing={2}>
                      <TextField
                        name="price"
                        label="Price (VNĐ)"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        fullWidth
                        required
                        placeholder="Enter price..."
                        disabled={submitting || uploading}
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />

                      {!isEditMode && (
                        <TextField
                          name="stock"
                          label="Initial Stock"
                          type="number"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          fullWidth
                          required
                          disabled={submitting || uploading}
                          inputProps={{ min: 0 }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      )}

                      <TextField
                        name="lowStockThreshold"
                        label="Low Stock Alert"
                        type="number"
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(e.target.value)}
                        fullWidth
                        disabled={submitting || uploading}
                        inputProps={{ min: 0 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </DialogContent>

            {/* Footer */}
            <Box
              sx={{
                p: 3,
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
              }}
            >
              <Button 
                onClick={handleClose} 
                disabled={submitting || uploading}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting || uploading}
                startIcon={submitting || uploading ? <CircularProgress size={20} /> : null}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0052cc 0%, #003d99 100%)',
                  }
                }}
              >
                {isEditMode ? 'Update Product' : 'Create Product'}
              </Button>
            </Box>
          </form>
    </Dialog>
  );
};

export default ProductFormModal;
