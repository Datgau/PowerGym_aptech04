import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  InputAdornment,
  Alert
} from '@mui/material';
import { LocalOffer } from '@mui/icons-material';
import type { Promotion } from '../../../../@type/reward';
import {promotionService} from "../../../../services/promotionService.ts";

interface PromotionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  promotion: Promotion | null;
}

const PromotionFormModal: React.FC<PromotionFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  promotion
}) => {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    type: 'PERCENTAGE_DISCOUNT' as 'PERCENTAGE_DISCOUNT' | 'FIXED_AMOUNT_DISCOUNT',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    validFrom: '',
    validUntil: '',
    usageLimit: '',
    isActive: true,
    isFeatured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (promotion) {
      setFormData({
        code: promotion.code,
        title: promotion.title,
        description: promotion.description || '',
        type: promotion.type,
        discountValue: promotion.type === 'PERCENTAGE_DISCOUNT' 
          ? promotion.discountPercentage?.toString() || ''
          : promotion.discountAmount?.toString() || '',
        minOrderAmount: promotion.minPurchaseAmount?.toString() || '',
        maxDiscountAmount: promotion.maxDiscountAmount?.toString() || '',
        validFrom: promotion.validFrom ? new Date(promotion.validFrom).toISOString().slice(0, 16) : '',
        validUntil: promotion.validUntil ? new Date(promotion.validUntil).toISOString().slice(0, 16) : '',
        usageLimit: promotion.usageLimit?.toString() || '',
        isActive: promotion.isActive,
        isFeatured: promotion.isFeatured
      });
    } else {
      setFormData({
        code: '',
        title: '',
        description: '',
        type: 'PERCENTAGE_DISCOUNT',
        discountValue: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        validFrom: '',
        validUntil: '',
        usageLimit: '',
        isActive: true,
        isFeatured: false
      });
    }
    setError('');
  }, [promotion, open]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Validation
      if (!formData.code || !formData.title || !formData.discountValue) {
        setError('Please fill in all required fields');
        return;
      }

      // Validate date range
      if (formData.validFrom && formData.validUntil) {
        const from = new Date(formData.validFrom);
        const until = new Date(formData.validUntil);
        if (from >= until) {
          setError('Valid From date must be before Valid Until date');
          return;
        }
      }

      const basePayload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
        validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : null,
        validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured
      };

      if (promotion) {
        await promotionService.updatePromotion(promotion.id, basePayload);
      } else {
        await promotionService.createPromotion({ ...basePayload, code: formData.code });
      }

      onSubmit();
    } catch (error: any) {
      console.error('Submit error:', error);
      setError(error.response?.data?.message || 'Failed to save promotion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ff6b6b22, #ee5a6f22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff6b6b',
            }}
          >
            <LocalOffer sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            {promotion ? 'Edit Promotion' : 'Create Promotion'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" flexDirection="column" gap={2.5}>
          {/* Code */}
          <TextField
            label="Promotion Code"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
            disabled={!!promotion}
            required
            fullWidth
            placeholder="SUMMER2024"
            helperText={promotion ? 'Code cannot be changed' : 'Unique code for this promotion'}
          />

          {/* Title */}
          <TextField
            label="Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            fullWidth
            placeholder="Summer Sale 2024"
          />

          {/* Description */}
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            fullWidth
            multiline
            rows={3}
            placeholder="Get amazing discounts this summer..."
          />

          {/* Type */}
          <FormControl fullWidth>
            <InputLabel>Discount Type</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              label="Discount Type"
            >
              <MenuItem value="PERCENTAGE_DISCOUNT">Percentage Discount</MenuItem>
              <MenuItem value="FIXED_AMOUNT_DISCOUNT">Fixed Amount Discount</MenuItem>
            </Select>
          </FormControl>

          {/* Discount Value */}
          <TextField
            label={formData.type === 'PERCENTAGE_DISCOUNT' ? 'Discount Percentage' : 'Discount Amount'}
            value={formData.discountValue}
            onChange={(e) => handleChange('discountValue', e.target.value)}
            required
            fullWidth
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {formData.type === 'PERCENTAGE_DISCOUNT' ? '%' : 'VND'}
                </InputAdornment>
              ),
            }}
          />

          {/* Min Order Amount */}
          <TextField
            label="Minimum Order Amount"
            value={formData.minOrderAmount}
            onChange={(e) => handleChange('minOrderAmount', e.target.value)}
            fullWidth
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">VND</InputAdornment>,
            }}
            helperText="Minimum order value to apply this promotion"
          />

          {/* Max Discount Amount (for percentage) */}
          {formData.type === 'PERCENTAGE_DISCOUNT' && (
            <TextField
              label="Maximum Discount Amount"
              value={formData.maxDiscountAmount}
              onChange={(e) => handleChange('maxDiscountAmount', e.target.value)}
              fullWidth
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">VND</InputAdornment>,
              }}
              helperText="Maximum discount cap for percentage discounts"
            />
          )}

          {/* Valid From */}
          <TextField
            label="Valid From"
            value={formData.validFrom}
            onChange={(e) => handleChange('validFrom', e.target.value)}
            fullWidth
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
          />

          {/* Valid Until */}
          <TextField
            label="Valid Until"
            value={formData.validUntil}
            onChange={(e) => handleChange('validUntil', e.target.value)}
            fullWidth
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
          />

          {/* Usage Limit */}
          <TextField
            label="Usage Limit"
            value={formData.usageLimit}
            onChange={(e) => handleChange('usageLimit', e.target.value)}
            fullWidth
            type="number"
            helperText="Maximum number of times this promotion can be used (leave empty for unlimited)"
          />

          {/* Switches */}
          <Box display="flex" gap={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  color="success"
                />
              }
              label="Active"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  color="warning"
                />
              }
              label="Featured (Public)"
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
            '&:hover': {
              background: 'linear-gradient(135deg, #ff7b7b, #ff6a7f)',
            },
          }}
        >
          {loading ? 'Saving...' : promotion ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromotionFormModal;
