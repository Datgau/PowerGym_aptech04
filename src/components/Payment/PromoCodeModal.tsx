import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogTitle,
  Box, Button, Typography, IconButton,
  TextField, Chip, CircularProgress, Alert,
} from '@mui/material';
import { Close, LocalOffer, Check, ArrowForward } from '@mui/icons-material';
import promotionService from '../../services/promotionService';
import type { ApplyPromotionResponse } from '../../@type/reward';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

interface PromoCodeModalProps {
  open: boolean;
  onClose: () => void;
  /** The order amount to validate against minPurchaseAmount */
  orderAmount: number;
  serviceName?: string;
  /** Called when user confirms (with or without promo) */
  onConfirm: (promoData: ApplyPromotionResponse | null) => void;
}

const PromoCodeModal: React.FC<PromoCodeModalProps> = ({
  open, onClose, orderAmount, serviceName, onConfirm,
}) => {
  const [code, setCode] = useState('');
  const [applying, setApplying] = useState(false);
  const [promoData, setPromoData] = useState<ApplyPromotionResponse | null>(null);
  const [error, setError] = useState('');

  const reset = () => {
    setCode('');
    setPromoData(null);
    setError('');
  };

  const handleClose = () => { reset(); onClose(); };

  const handleApply = async () => {
    if (!code.trim()) { setError('Please enter a promotion code'); return; }
    setApplying(true);
    setError('');
    try {
      const res = await promotionService.applyPromotion({
        promotionCode: code.trim().toUpperCase(),
        orderAmount,
      });
      if (res.success) {
        setPromoData(res);
        setError('');
      } else {
        // Build a helpful error message from debugInfo
        let msg = res.message || 'Invalid promotion code';
        if (res.debugInfo?.minPurchaseAmount && res.debugInfo.orderAmount !== undefined) {
          if (res.debugInfo.orderAmount < res.debugInfo.minPurchaseAmount) {
            msg = `Minimum purchase amount is ${res.debugInfo.minPurchaseAmount.toLocaleString('vi-VN')}đ (your order: ${res.debugInfo.orderAmount.toLocaleString('vi-VN')}đ)`;
          }
        }
        if (res.debugInfo?.usageLimit && res.debugInfo.usageCount !== undefined) {
          if (res.debugInfo.usageCount >= res.debugInfo.usageLimit) {
            msg = 'This promotion code has reached its usage limit';
          }
        }
        if (res.debugInfo?.failureReason) {
          msg = res.debugInfo.failureReason;
        }
        setError(msg);
        setPromoData(null);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to apply promotion code');
      setPromoData(null);
    } finally {
      setApplying(false);
    }
  };

  const handleRemove = () => {
    setPromoData(null);
    setCode('');
    setError('');
  };

  const handleConfirm = () => {
    onConfirm(promoData);
    reset();
  };

  const discount = promoData?.discountAmount ?? 0;
  const finalAmount = promoData?.finalAmount ?? orderAmount;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden' } }}
      BackdropProps={{ sx: { backdropFilter: 'blur(6px)', backgroundColor: 'rgba(4,30,50,0.45)' } }}
    >
      {/* Header */}
      <Box sx={{ background: BRAND_GRADIENT, px: 3, pt: 3, pb: 3.5, position: 'relative' }}>
        <Box sx={{
          position: 'absolute', top: -30, right: -30, width: 120, height: 120,
          borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
        }} />
        <IconButton onClick={handleClose} size="small" sx={{
          position: 'absolute', top: 12, right: 12,
          color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.12)',
          '&:hover': { background: 'rgba(255,255,255,0.22)' },
        }}>
          <Close fontSize="small" />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LocalOffer sx={{ color: 'rgba(255,255,255,0.9)', fontSize: 28 }} />
          <Box>
            <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>
              Promotion Code
            </Typography>
            {serviceName && (
              <Typography sx={{ fontFamily: '"Sora", sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)' }}>
                {serviceName}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Typography sx={{ fontFamily: '"Sora", sans-serif', fontSize: '0.85rem', color: '#64748b', mb: 2 }}>
          Do you have a promotion or referral code? Enter it below to get a discount.
        </Typography>

        {/* Code input */}
        {!promoData ? (
          <Box sx={{ display: 'flex', gap: 1, mb: error ? 0 : 2 }}>
            <TextField
              size="small"
              placeholder="e.g. SUMMER2026"
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              disabled={applying}
              error={!!error}
              helperText={error}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: '"Sora", sans-serif', fontSize: '0.9rem', letterSpacing: '0.05em' } }}
            />
            <Button
              variant="contained"
              onClick={handleApply}
              disabled={applying || !code.trim()}
              sx={{
                textTransform: 'none', fontWeight: 700, borderRadius: '10px',
                background: BRAND_GRADIENT, minWidth: 80, flexShrink: 0,
                fontFamily: '"Sora", sans-serif',
              }}
            >
              {applying ? <CircularProgress size={18} color="inherit" /> : 'Apply'}
            </Button>
          </Box>
        ) : (
          <Box sx={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            p: 2, borderRadius: '12px', mb: 2,
            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
            border: '1px solid #81c784',
          }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Chip
                  icon={<Check sx={{ fontSize: '14px !important' }} />}
                  label={promoData.promotionCode}
                  size="small"
                  sx={{ background: '#4caf50', color: '#fff', fontWeight: 700, fontSize: '0.72rem' }}
                />
                <Typography sx={{ fontFamily: '"Sora", sans-serif', fontSize: '0.82rem', fontWeight: 700, color: '#2e7d32' }}>
                  {promoData.promotionName}
                </Typography>
              </Box>
              {discount > 0 && (
                <Typography sx={{ fontFamily: '"Sora", sans-serif', fontSize: '0.78rem', color: '#388e3c' }}>
                  Discount: <strong>-{discount.toLocaleString('vi-VN')}đ</strong>
                </Typography>
              )}
            </Box>
            <Button size="small" onClick={handleRemove}
              sx={{ textTransform: 'none', fontSize: '0.72rem', color: '#d32f2f', fontWeight: 600, minWidth: 0, flexShrink: 0 }}>
              Remove
            </Button>
          </Box>
        )}

        {/* Price summary */}
        <Box sx={{ p: 2, borderRadius: '12px', background: '#f8faff', border: '1px solid #eaeef8', mb: 3 }}>
          {promoData && discount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography sx={{ fontFamily: '"Sora", sans-serif', fontSize: '0.82rem', color: '#94a3b8' }}>Original</Typography>
              <Typography sx={{ fontFamily: '"Sora", sans-serif', fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                {orderAmount.toLocaleString('vi-VN')}đ
              </Typography>
            </Box>
          )}
          {promoData && discount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography sx={{ fontFamily: '"Sora", sans-serif', fontSize: '0.82rem', color: '#4caf50', fontWeight: 600 }}>Discount</Typography>
              <Typography sx={{ fontFamily: '"Sora", sans-serif', fontSize: '0.82rem', color: '#4caf50', fontWeight: 700 }}>
                -{discount.toLocaleString('vi-VN')}đ
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700, color: '#0f172a' }}>Total</Typography>
            <Typography sx={{
              fontFamily: '"Sora", sans-serif', fontWeight: 900, fontSize: '1.2rem',
              background: BRAND_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {finalAmount.toLocaleString('vi-VN')}đ
            </Typography>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => { onConfirm(null); reset(); }}
            sx={{
              textTransform: 'none', fontWeight: 600, borderRadius: '12px',
              borderColor: '#dde3ea', color: '#64748b', fontFamily: '"Sora", sans-serif',
              '&:hover': { borderColor: '#c5cdd8', background: '#f1f5f9' },
            }}
          >
            Skip
          </Button>
          <Button
            fullWidth
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={handleConfirm}
            sx={{
              textTransform: 'none', fontWeight: 700, borderRadius: '12px',
              background: BRAND_GRADIENT, fontFamily: '"Sora", sans-serif',
              boxShadow: '0 4px 14px rgba(4,86,104,0.3)',
              '&:hover': { boxShadow: '0 6px 20px rgba(4,86,104,0.45)' },
            }}
          >
            {promoData ? 'Apply & Continue' : 'Continue'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PromoCodeModal;
