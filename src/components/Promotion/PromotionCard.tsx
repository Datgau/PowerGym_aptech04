import { Card, CardContent, Box, Typography, Chip, Button, Divider } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { Promotion } from "../../@type/reward.ts";

interface PromotionCardProps {
    promotion: Promotion;
    onUse?: (code: string) => void;
}

const PromotionCard = ({ promotion, onUse }: PromotionCardProps) => {
    const getDiscountText = () => {
        if (promotion.discountPercentage) {
            return `-${promotion.discountPercentage}%`;
        }
        if (promotion.discountAmount) {
            return `-${promotion.discountAmount.toLocaleString()} VND`;
        }
        return 'Promotion';
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    return (
        <Card
            sx={{
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: 8,
                    transform: 'translateY(-6px)',
                },
            }}
        >
            {/* HOT badge */}
            {promotion.isFeatured && (
                <Chip
                    label="HOT"
                    color="error"
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        fontWeight: 700,
                        zIndex: 2,
                    }}
                />
            )}

            {/* Header */}
            <Box
                sx={{
                    height: 140,
                    position: 'relative',
                    background: promotion.backgroundImage
                        ? `url(${promotion.backgroundImage})`
                        : 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.25)',
                    }}
                />

                <Typography
                    variant="h3"
                    sx={{
                        position: 'relative',
                        fontWeight: 800,
                        color: '#fff',
                        letterSpacing: 1,
                    }}
                >
                    {getDiscountText()}
                </Typography>
            </Box>

            <CardContent sx={{ p: 2.5 }}>
                {/* Title */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {promotion.title}
                    </Typography>
                    {promotion.subtitle && (
                        <Typography variant="body2" color="text.secondary">
                            {promotion.subtitle}
                        </Typography>
                    )}
                </Box>

                {/* Description */}
                {promotion.description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, lineHeight: 1.5 }}
                    >
                        {promotion.description}
                    </Typography>
                )}

                {/* Features */}
                {promotion.features && promotion.features.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        {promotion.features.map((feature, index) => (
                            <Typography
                                key={index}
                                variant="body2"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 0.5,
                                }}
                            >
                                • {feature}
                            </Typography>
                        ))}
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Code */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1.5,
                    }}
                >
                    <LocalOfferIcon fontSize="small" color="action" />
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            letterSpacing: 1,
                        }}
                    >
                        {promotion.code}
                    </Typography>
                </Box>

                {/* Date */}
                {(promotion.validFrom || promotion.validUntil) && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 1.5,
                        }}
                    >
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                            {promotion.validFrom && `From ${formatDate(promotion.validFrom)}`}
                            {promotion.validFrom && promotion.validUntil && ' - '}
                            {promotion.validUntil && `To ${formatDate(promotion.validUntil)}`}
                        </Typography>
                    </Box>
                )}

                {/* Usage */}
                {promotion.usageLimit && (
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                        Used: {promotion.usageCount}/{promotion.usageLimit}
                    </Typography>
                )}

                {/* Button */}
                {onUse && (
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 1,
                            fontWeight: 600,
                            borderRadius: 2,
                            py: 1,
                        }}
                        onClick={() => onUse(promotion.code)}
                        disabled={
                            !promotion.isActive ||
                            (promotion.usageLimit !== undefined &&
                                promotion.usageCount >= promotion.usageLimit)
                        }
                    >
                        Use Now
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default PromotionCard;