import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { createProductOrder } from '../../../services/productOrderService';
import { SaleType } from '../../../types/productOrder';

const validationSchema = Yup.object({
  customerName: Yup.string()
    .required('Customer name is required')
    .max(255, 'Name must be at most 255 characters'),
  customerPhone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10,11}$/, 'Phone number must be 10-11 digits'),
  saleType: Yup.string()
    .required('Sale type is required')
    .oneOf(['ONLINE', 'COUNTER'], 'Invalid sale type'),
  customerAddress: Yup.string()
    .when('saleType', {
      is: 'ONLINE',
      then: (schema) => schema.required('Address is required for online orders'),
      otherwise: (schema) => schema.notRequired(),
    })
    .max(500, 'Address must be at most 500 characters'),
  notes: Yup.string()
    .max(1000, 'Notes must be at most 1000 characters'),
});

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const [error, setError] = useState('');

  const initialValues = {
    customerName: '',
    customerPhone: '',
    saleType: 'ONLINE' as SaleType,
    customerAddress: '',
    notes: '',
  };

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    try {
      setError('');
      
      const orderData = {
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        saleType: values.saleType,
        customerAddress: values.saleType === 'ONLINE' ? values.customerAddress : undefined,
        notes: values.notes,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };
      
      const order = await createProductOrder(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to order confirmation
      navigate(`/order-confirmation/${order.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create order');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" p={3}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Your cart is empty
        </Typography>
        <Button variant="contained" onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
        {/* Checkout Form */}
        <Box flexGrow={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              Customer Information
            </Typography>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, values }) => (
                <Form>
                  <Box display="flex" flexDirection="column" gap={2}>
                    {/* Customer Name */}
                    <Field
                      as={TextField}
                      name="customerName"
                      label="Full Name"
                      fullWidth
                      required
                      error={touched.customerName && !!errors.customerName}
                      helperText={touched.customerName && errors.customerName}
                    />

                    {/* Customer Phone */}
                    <Field
                      as={TextField}
                      name="customerPhone"
                      label="Phone Number"
                      fullWidth
                      required
                      error={touched.customerPhone && !!errors.customerPhone}
                      helperText={touched.customerPhone && errors.customerPhone}
                    />

                    {/* Sale Type */}
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Order Type</FormLabel>
                      <Field name="saleType">
                        {({ field }: any) => (
                          <RadioGroup {...field}>
                            <FormControlLabel
                              value="ONLINE"
                              control={<Radio />}
                              label="Online Order (Delivery)"
                            />
                            <FormControlLabel
                              value="COUNTER"
                              control={<Radio />}
                              label="Counter Order (Pick up at gym)"
                            />
                          </RadioGroup>
                        )}
                      </Field>
                    </FormControl>

                    {/* Customer Address (conditional) */}
                    {values.saleType === 'ONLINE' && (
                      <Field
                        as={TextField}
                        name="customerAddress"
                        label="Delivery Address"
                        fullWidth
                        required
                        multiline
                        rows={2}
                        error={touched.customerAddress && !!errors.customerAddress}
                        helperText={touched.customerAddress && errors.customerAddress}
                      />
                    )}

                    {/* Notes */}
                    <Field
                      as={TextField}
                      name="notes"
                      label="Notes (Optional)"
                      fullWidth
                      multiline
                      rows={3}
                      error={touched.notes && !!errors.notes}
                      helperText={touched.notes && errors.notes}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    >
                      Place Order
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </Box>

        {/* Order Summary */}
        <Box width={{ xs: '100%', md: 400 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Order Summary
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {item.quantity}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {(item.price * item.quantity).toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>
                Total Items:
              </Typography>
              <Typography fontWeight={600}>
                {items.reduce((sum, item) => sum + item.quantity, 0)} items
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight={700}>
                Total:
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                {getCartTotal().toLocaleString()} VNĐ
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              Payment will be processed after order confirmation
            </Alert>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
