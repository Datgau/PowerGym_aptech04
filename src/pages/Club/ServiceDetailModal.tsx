import  { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Button,
    Chip,
    IconButton,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    Close,
    FitnessCenter,
    Group,
    Schedule,
    AttachMoney,
} from '@mui/icons-material';
import type {ServiceItem} from "../../@type/powergym.ts";

interface Props {
    open: boolean;
    service: ServiceItem;
    onClose: () => void;
}

const ServiceDetailModal = ({ open, service, onClose }: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!service) return null;

    const images = service.images || ['/images/default-service.jpg'];
    const hasMultipleImages = images.length > 1;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : 3,
                    maxHeight: '90vh',
                    overflow: 'hidden',
                }
            }}
        >
            {/* Header */}
            <DialogTitle 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    pb: 1,
                    background: 'linear-gradient(135deg, #00b4ff 0%, #0066ff 100%)',
                    color: 'white',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FitnessCenter />
                    <Typography variant="h6" fontWeight={700}>
                        {service.name}
                    </Typography>
                </Box>
                <IconButton 
                    onClick={onClose} 
                    sx={{ color: 'white' }}
                    size="small"
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
                {/* Image Carousel */}
                <Box sx={{ position: 'relative', mb: 3 }}>
                    {/* Main Image */}
                    <Box
                        sx={{
                            position: 'relative',
                            height: { xs: 250, sm: 350 },
                            overflow: 'hidden',
                            background: '#f5f5f5',
                        }}
                    >
                        <img
                            src={images[currentImageIndex]}
                            alt={`${service.name} - Image ${currentImageIndex + 1}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        />

                        {/* Navigation Arrows */}
                        {hasMultipleImages && (
                            <>
                                <IconButton
                                    onClick={prevImage}
                                    sx={{
                                        position: 'absolute',
                                        left: 16,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'rgba(0, 0, 0, 0.6)',
                                        color: 'white',
                                        '&:hover': {
                                            background: 'rgba(0, 0, 0, 0.8)',
                                            transform: 'translateY(-50%) scale(1.1)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <ChevronLeft />
                                </IconButton>
                                <IconButton
                                    onClick={nextImage}
                                    sx={{
                                        position: 'absolute',
                                        right: 16,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'rgba(0, 0, 0, 0.6)',
                                        color: 'white',
                                        '&:hover': {
                                            background: 'rgba(0, 0, 0, 0.8)',
                                            transform: 'translateY(-50%) scale(1.1)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <ChevronRight />
                                </IconButton>
                            </>
                        )}

                        {/* Image Counter */}
                        {hasMultipleImages && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    background: 'rgba(0, 0, 0, 0.7)',
                                    color: 'white',
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 2,
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                }}
                            >
                                {currentImageIndex + 1} / {images.length}
                            </Box>
                        )}
                    </Box>

                    {/* Thumbnail Navigation */}
                    {hasMultipleImages && (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                p: 2,
                                overflowX: 'auto',
                                '&::-webkit-scrollbar': {
                                    height: 6,
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: '#f1f1f1',
                                    borderRadius: 3,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: '#00b4ff',
                                    borderRadius: 3,
                                },
                            }}
                        >
                            {images.map((image, index) => (
                                <Box
                                    key={index}
                                    onClick={() => goToImage(index)}
                                    sx={{
                                        minWidth: 80,
                                        height: 60,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: currentImageIndex === index 
                                            ? '3px solid #00b4ff' 
                                            : '2px solid transparent',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            border: '3px solid #00b4ff',
                                        },
                                    }}
                                >
                                    <img
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>

                {/* Content */}
                <Box sx={{ p: 3 }}>
                    {/* Category Chip */}
                    <Chip 
                        label={service.category} 
                        color="primary" 
                        sx={{ 
                            mb: 2,
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                        }} 
                    />

                    {/* Description */}
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            mb: 3, 
                            lineHeight: 1.7,
                            color: '#555',
                        }}
                    >
                        {service.description}
                    </Typography>

                    {/* Service Details */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 2,
                                background: 'linear-gradient(135deg, #f8f9ff, #e3f2fd)',
                                borderRadius: 2,
                                border: '1px solid #e3f2fd',
                            }}
                        >
                            <AttachMoney sx={{ color: '#00b4ff', fontSize: 24 }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Giá dịch vụ
                                </Typography>
                                <Typography variant="h6" fontWeight={700} color="#00b4ff">
                                    {service.price?.toLocaleString()} VNĐ
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 2,
                                background: 'linear-gradient(135deg, #fff8e1, #ffecb3)',
                                borderRadius: 2,
                                border: '1px solid #ffecb3',
                            }}
                        >
                            <Schedule sx={{ color: '#ff9800', fontSize: 24 }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Thời lượng
                                </Typography>
                                <Typography variant="h6" fontWeight={700} color="#ff9800">
                                    {service.duration} phút
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 2,
                                background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)',
                                borderRadius: 2,
                                border: '1px solid #e1bee7',
                                gridColumn: { xs: '1', sm: 'span 2' },
                            }}
                        >
                            <Group sx={{ color: '#9c27b0', fontSize: 24 }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Số lượng tối đa
                                </Typography>
                                <Typography variant="h6" fontWeight={700} color="#9c27b0">
                                    {service.maxParticipants} người
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            disabled={!service.isActive}
                            onClick={() => alert('Đi tới đăng ký')}
                            sx={{
                                py: 1.5,
                                background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #0099e6, #0052cc)',
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease',
                                fontWeight: 600,
                            }}
                        >
                            Đăng ký ngay
                        </Button>

                        <Button 
                            fullWidth 
                            variant="outlined" 
                            onClick={onClose}
                            sx={{
                                py: 1.5,
                                borderColor: '#00b4ff',
                                color: '#00b4ff',
                                '&:hover': {
                                    borderColor: '#0066ff',
                                    background: 'rgba(0, 180, 255, 0.1)',
                                },
                                fontWeight: 600,
                            }}
                        >
                            Đóng
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ServiceDetailModal;