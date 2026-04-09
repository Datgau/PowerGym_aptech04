import React, { useState, useEffect } from 'react';
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
  IconButton,
  Typography,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Close, Add, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { createImportReceipt, updateImportReceipt, getImportReceiptById } from '../../../../services/importReceiptService';
import { getProducts } from '../../../../services/productService';
import type { Product } from '../../../../types/product';
import type { CreateImportReceiptRequest, ImportReceiptItemRequest, ImportReceiptDetail } from '../../../../types/importReceipt';

interface ImportReceiptFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  receiptId?: number | null;
  initialData?: ImportReceiptDetail | null;
}

const createValidationSchema = (isEditMode: boolean) => Yup.object({
  supplierName: Yup.string()
    .required('Supplier name is required')
    .max(255, 'Supplier name must be at most 255 characters'),
  notes: Yup.string()
    .max(1000, 'Notes must be at most 1000 characters'),
  items: Yup.array()
    .of(
      Yup.object({
        productId: Yup.number().required('Product is required'),
        quantity: Yup.number()
          .required('Quantity is required')
          .positive('Quantity must be positive')
          .integer('Quantity must be an integer'),
        unitPrice: Yup.number()
          .required('Unit price is required')
          .positive('Unit price must be positive'),
      })
    )
    .min(1, 'At least one item is required'),
  password: isEditMode 
    ? Yup.string().required('Password is required for update')
    : Yup.string(),
});

const ImportReceiptFormModal: React.FC<ImportReceiptFormModalProps> = ({
  open,
  onClose,
  onSuccess,
  receiptId = null,
  initialData = null,
}) => {
  const [error, setError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingReceipt, setLoadingReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ImportReceiptDetail | null>(initialData);
  const [showPassword, setShowPassword] = useState(false);

  const isEditMode = !!receiptId;

  useEffect(() => {
    if (open) {
      loadProducts();
      if (receiptId && !initialData) {
        loadReceipt();
      } else if (initialData) {
        setReceiptData(initialData);
      }
    } else {
      // Reset when modal closes
      setReceiptData(null);
      setError('');
      setShowPassword(false);
    }
  }, [open, receiptId, initialData]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await getProducts(0, 1000); // Load all products
      setProducts(response.content);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadReceipt = async () => {
    if (!receiptId) return;
    
    try {
      setLoadingReceipt(true);
      const data = await getImportReceiptById(receiptId);
      setReceiptData(data);
    } catch (err) {
      console.error('Failed to load receipt:', err);
      setError('Failed to load receipt data');
    } finally {
      setLoadingReceipt(false);
    }
  };

  const getInitialValues = () => {
    if (isEditMode && receiptData) {
      return {
        supplierName: receiptData.supplierName,
        notes: receiptData.notes || '',
        items: receiptData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        password: '',
      };
    }
    
    return {
      supplierName: '',
      notes: '',
      items: [
        {
          productId: 0,
          quantity: 1,
          unitPrice: 0,
        },
      ] as ImportReceiptItemRequest[],
      password: '',
    };
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setError('');
      
      if (isEditMode && receiptId) {
        // Update mode
        const data = {
          supplierName: values.supplierName,
          notes: values.notes,
          items: values.items,
          password: values.password,
        };
        
        await updateImportReceipt(receiptId, data);
      } else {
        // Create mode
        const data: CreateImportReceiptRequest = {
          supplierName: values.supplierName,
          notes: values.notes,
          items: values.items,
        };
        
        await createImportReceipt(data);
      }
      
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(isEditMode ? 'Failed to update import receipt' : 'Failed to create import receipt');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const calculateSubtotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateTotal = (items: ImportReceiptItemRequest[]) => {
    return items.reduce((sum, item) => sum + calculateSubtotal(item.quantity, item.unitPrice), 0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {isEditMode ? 'Edit Import Receipt' : 'Create Import Receipt'}
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      {loadingReceipt ? (
        <DialogContent>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </DialogContent>
      ) : (
        <Formik
          initialValues={getInitialValues()}
          validationSchema={createValidationSchema(isEditMode)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
        {({ errors, touched, isSubmitting, values, setFieldValue }) => (
          <Form>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Box display="flex" flexDirection="column" gap={2}>
                {/* Supplier Name */}
                <Field
                  as={TextField}
                  name="supplierName"
                  label="Supplier Name"
                  fullWidth
                  required
                  error={touched.supplierName && !!errors.supplierName}
                  helperText={touched.supplierName && errors.supplierName}
                />

                {/* Notes */}
                <Field
                  as={TextField}
                  name="notes"
                  label="Notes"
                  fullWidth
                  multiline
                  rows={2}
                  error={touched.notes && !!errors.notes}
                  helperText={touched.notes && errors.notes}
                />

                {/* Password field for edit mode */}
                {isEditMode && (
                  <Field
                    as={TextField}
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    required
                    error={touched.password && !!errors.password}
                    helperText={touched.password && errors.password ? errors.password : 'Enter your password to confirm update'}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}

                {/* Items */}
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Items</Typography>
                  </Box>

                  <FieldArray name="items">
                    {({ push, remove }) => (
                      <>
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell width={100}>Quantity</TableCell>
                                <TableCell width={120}>Unit Price</TableCell>
                                <TableCell width={120}>Subtotal</TableCell>
                                <TableCell width={50}></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {values.items.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Autocomplete
                                      options={products}
                                      getOptionLabel={(option) => option.name}
                                      loading={loadingProducts}
                                      value={products.find(p => p.id === item.productId) || null}
                                      onChange={(_, newValue) => {
                                        setFieldValue(`items.${index}.productId`, newValue?.id || 0);
                                        if (newValue) {
                                          setFieldValue(`items.${index}.unitPrice`, newValue.price);
                                        }
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                          error={
                                            touched.items?.[index]?.productId &&
                                            !!(errors.items as any)?.[index]?.productId
                                          }
                                        />
                                      )}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Field
                                      as={TextField}
                                      name={`items.${index}.quantity`}
                                      type="number"
                                      size="small"
                                      fullWidth
                                      error={
                                        touched.items?.[index]?.quantity &&
                                        !!(errors.items as any)?.[index]?.quantity
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Field
                                      as={TextField}
                                      name={`items.${index}.unitPrice`}
                                      type="number"
                                      size="small"
                                      fullWidth
                                      error={
                                        touched.items?.[index]?.unitPrice &&
                                        !!(errors.items as any)?.[index]?.unitPrice
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography fontWeight={600}>
                                      {calculateSubtotal(item.quantity, item.unitPrice).toLocaleString()}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => remove(index)}
                                      disabled={values.items.length === 1}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        <Button
                          startIcon={<Add />}
                          onClick={() => push({ productId: 0, quantity: 1, unitPrice: 0 })}
                          sx={{ mt: 1 }}
                        >
                          Add Item
                        </Button>

                        <Box display="flex" justifyContent="flex-end" mt={2}>
                          <Typography variant="h6">
                            Total: {calculateTotal(values.items).toLocaleString()} VNĐ
                          </Typography>
                        </Box>
                      </>
                    )}
                  </FieldArray>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
      )}
    </Dialog>
  );
};

export default ImportReceiptFormModal;
