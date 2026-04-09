import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { createProduct, updateProduct, uploadProductImage } from '../../../../services/productService';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../../../../types/product';

interface ProductFormModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Product name is required')
    .max(255, 'Name must be at most 255 characters'),
  description: Yup.string()
    .max(1000, 'Description must be at most 1000 characters'),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive')
    .min(0.01, 'Price must be at least 0.01'),
  stock: Yup.number()
    .required('Stock is required')
    .integer('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),
  lowStockThreshold: Yup.number()
    .integer('Threshold must be an integer')
    .min(0, 'Threshold cannot be negative'),
});

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  open,
  product,
  onClose,
  onSuccess,
}) => {
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);
  const [uploading, setUploading] = useState(false);

  const isEditMode = !!product;

  const initialValues = {
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    lowStockThreshold: product?.lowStockThreshold || 10,
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must not exceed 5MB');
        return;
      }
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    try {
      setError('');
      
      let savedProduct: Product;
      
      if (isEditMode && product) {
        // Update existing product
        const updateData: UpdateProductRequest = {
          name: values.name,
          description: values.description,
          price: values.price,
          lowStockThreshold: values.lowStockThreshold,
          imageUrl: product.imageUrl,
        };
        savedProduct = await updateProduct(product.id, updateData);
      } else {
        // Create new product
        const createData: CreateProductRequest = {
          name: values.name,
          description: values.description,
          price: values.price,
          stock: values.stock,
          lowStockThreshold: values.lowStockThreshold,
        };
        savedProduct = await createProduct(createData);
      }
      
      // Upload image if selected
      if (imageFile) {
        setUploading(true);
        await uploadProductImage(savedProduct.id, imageFile);
      }
      
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save product');
      }
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setImageFile(null);
    setImagePreview(product?.imageUrl || null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {isEditMode ? 'Edit Product' : 'Create Product'}
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting, values }) => (
          <Form>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Box display="flex" flexDirection="column" gap={2}>
                {/* Image Upload */}
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <Avatar
                    src={imagePreview || undefined}
                    sx={{ width: 120, height: 120 }}
                    variant="rounded"
                  >
                    {values.name.charAt(0)}
                  </Avatar>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCamera />}
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

                {/* Name */}
                <Field
                  as={TextField}
                  name="name"
                  label="Product Name"
                  fullWidth
                  required
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />

                {/* Description */}
                <Field
                  as={TextField}
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  error={touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                />

                {/* Price */}
                <Field
                  as={TextField}
                  name="price"
                  label="Price (VNĐ)"
                  type="number"
                  fullWidth
                  required
                  error={touched.price && !!errors.price}
                  helperText={touched.price && errors.price}
                />

                {/* Stock (only for create mode) */}
                {!isEditMode && (
                  <Field
                    as={TextField}
                    name="stock"
                    label="Initial Stock"
                    type="number"
                    fullWidth
                    required
                    error={touched.stock && !!errors.stock}
                    helperText={touched.stock && errors.stock}
                  />
                )}

                {/* Low Stock Threshold */}
                <Field
                  as={TextField}
                  name="lowStockThreshold"
                  label="Low Stock Threshold"
                  type="number"
                  fullWidth
                  error={touched.lowStockThreshold && !!errors.lowStockThreshold}
                  helperText={touched.lowStockThreshold && errors.lowStockThreshold}
                />
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} disabled={isSubmitting || uploading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || uploading}
                startIcon={isSubmitting || uploading ? <CircularProgress size={20} /> : null}
              >
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ProductFormModal;
