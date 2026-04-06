import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { usePromotion } from '../../hooks/usePromotion';
import { useReward } from '../../hooks/useReward';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  itemName: string;
  originalAmount: number;
  onCheckout: (data: {
    promotionCode?: string;
    rewardPointsToUse?: number;
    finalAmount: number;
  }) => void;
}

const CheckoutModal = ({ open, onClose, itemName, originalAmount, onCheckout }: CheckoutModalProps) => {
  const { applyPromotion, applyLoading } = usePromotion();
  const { reward } = useReward();

  const [promotionCode, setPromotionCode] = useState('');
  const [promotionDiscount, setPromotionDiscount] = useState(0);
  const [promotionApplied, setPromotionApplied] = useState(false);
  const [promotionError, setPromotionError] = useState('');

  const [useRewardPoints, setUseRewardPoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [rewardDiscount, setRewardDiscount] = useState(0);

  const [loading, setLoading] = useState(false);

  // Calculate final amount
  const finalAmount = Math.max(0, originalAmount - promotionDiscount - rewardDiscount);

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setPromotionCode('');
      setPromotionDiscount(0);
      setPromotionApplied(false);
      setPromotionError('');
      setUseRewardPoints(false);
      setPointsToUse(0);
      setRewardDiscount(0);
    }
  }, [open]);

  // Update reward discount when points change
  useEffect(() => {
    if (useRewardPoints && pointsToUse > 0) {
      const discount = pointsToUse * 1000; // 1 point = 1000 VND
      const maxDiscount = originalAmount - promotionDiscount;
      setRewardDiscount(Math.min(discount, maxDiscount));
    } else {
      setRewardDiscount(0);
    }
  }, [useRewardPoints, pointsToUse, originalAmount, promotionDiscount]);

  const handleApplyPromotion = async () => {
    if (!promotionCode.trim()) {
      setPromotionError('Vui lòng nhập mã khuyến mãi');
      return;
    }

    try {
      setPromotionError('');
      const response = await applyPromotion({
        promotionCode: promotionCode.trim(),
        orderAmount: originalAmount,
      });

      if (response.success && response.discountAmount) {
        setPromotionDiscount(response.discountAmount);
        setPromotionApplied(true);
        setPromotionError('');
      } else {
        setPromotionError(response.message || 'Không thể áp dụng mã khuyến mãi');
        setPromotionDiscount(0);
        setPromotionApplied(false);
      }
    } catch (error: any) {
      setPromotionError(error.message || 'Có lỗi xảy ra');
      setPromotionDiscount(0);
      setPromotionApplied(false);
    }
  };

  const handleRemovePromotion = () => {
    setPromotionCode('');
    setPromotionDiscount(0);
    setPromotionApplied(false);
    setPromotionError('');
  };

  const handleUseRewardToggle = (checked: boolean) => {
    setUseRewardPoints(checked);
    if (!checked) {
      setPointsToUse(0);
      setRewardDiscount(0);
    } else if (reward) {
      // Auto-fill max points
      const maxPoints = Math.min(
        reward.totalPoints,
        Math.floor((originalAmount - promotionDiscount) / 1000)
      );
      setPointsToUse(maxPoints);
    }
  };

  const handlePointsChange = (value: number) => {
    if (!reward) return;

    const maxPoints = Math.min(
      reward.totalPoints,
      Math.floor((originalAmount - promotionDiscount) / 1000)
    );

    setPointsToUse(Math.min(Math.max(0, value), maxPoints));
  };

  const handleCheckout = () => {
    setLoading(true);
    onCheckout({
      promotionCode: promotionApplied ? promotionCode : undefined,
      rewardPointsToUse: useRewardPoints ? pointsToUse : undefined,
      finalAmount,
    });
  };

  const maxPointsAvailable = reward
    ? Math.min(reward.totalPoints, Math.floor((originalAmount - promotionDiscount) / 1000))
    : 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Thanh toán
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Item Info */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Dịch vụ
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {itemName}
            </Typography>
          </Box>

          <Divider />

          {/* Promotion Code */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocalOfferIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Mã khuyến mãi
              </Typography>
            </Box>

            {!promotionApplied ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập mã khuyến mãi"
                  value={promotionCode}
                  onChange={(e) => setPromotionCode(e.target.value.toUpperCase())}
                  error={!!promotionError}
                  helperText={promotionError}
                />
                <Button
                  variant="contained"
                  onClick={handleApplyPromotion}
                  disabled={applyLoading || !promotionCode.trim()}
                  sx={{ minWidth: 100 }}
                >
                  {applyLoading ? <CircularProgress size={24} /> : 'Áp dụng'}
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'success.light',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Mã: {promotionCode}
                  </Typography>
                  <Typography variant="body2" color="success.dark">
                    Giảm {promotionDiscount.toLocaleString()} VNĐ
                  </Typography>
                </Box>
                <Button size="small" onClick={handleRemovePromotion}>
                  Xóa
                </Button>
              </Box>
            )}
          </Box>

          <Divider />

          {/* Reward Points */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CardGiftcardIcon color="secondary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Sử dụng điểm thưởng
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={useRewardPoints}
                    onChange={(e) => handleUseRewardToggle(e.target.checked)}
                    disabled={!reward || reward.totalPoints === 0 || maxPointsAvailable === 0}
                  />
                }
                label=""
              />
            </Box>

            {reward && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Điểm khả dụng: {reward.totalPoints.toLocaleString()} điểm (
                  {(reward.totalPoints * 1000).toLocaleString()} VNĐ)
                </Typography>
              </Box>
            )}

            {useRewardPoints && (
              <Box>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  label="Số điểm sử dụng"
                  value={pointsToUse}
                  onChange={(e) => handlePointsChange(parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0, max: maxPointsAvailable }}
                  helperText={`Tối đa: ${maxPointsAvailable.toLocaleString()} điểm`}
                />
                {rewardDiscount > 0 && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    Giảm {rewardDiscount.toLocaleString()} VNĐ
                  </Alert>
                )}
              </Box>
            )}
          </Box>

          <Divider />

          {/* Price Summary */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Giá gốc
              </Typography>
              <Typography variant="body2">{originalAmount.toLocaleString()} VNĐ</Typography>
            </Box>

            {promotionDiscount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="success.main">
                  Khuyến mãi
                </Typography>
                <Typography variant="body2" color="success.main">
                  -{promotionDiscount.toLocaleString()} VNĐ
                </Typography>
              </Box>
            )}

            {rewardDiscount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="secondary.main">
                  Điểm thưởng
                </Typography>
                <Typography variant="body2" color="secondary.main">
                  -{rewardDiscount.toLocaleString()} VNĐ
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Tổng thanh toán
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {finalAmount.toLocaleString()} VNĐ
              </Typography>
            </Box>

            {/* Points to earn */}
            <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Bạn sẽ nhận được{' '}
                <Chip
                  label={`+${Math.floor(finalAmount / 1000)} điểm`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                />{' '}
                sau khi thanh toán
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button variant="contained" onClick={handleCheckout} disabled={loading} sx={{ minWidth: 120 }}>
          {loading ? <CircularProgress size={24} /> : 'Thanh toán'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutModal;
