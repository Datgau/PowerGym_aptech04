import  { useState, useCallback, useMemo } from 'react';
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
    Divider, Card,
    CardContent,
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    Close,
    FitnessCenter,
    Group,
    Schedule,
    AttachMoney,
    Edit,
    Visibility,
    CheckCircle,
    Cancel,
} from '@mui/icons-material';
import type { GymServiceDto } from '../../../../services/gymService';
import RichTextDisplay from "../../../../components/Common/RichTextDisplay.tsx";

interface Props {
    open: boolean;
    service: GymServiceDto | null;
    onClose: () => void;
    onEdit?: (service: GymServiceDto) => void;
}

const AdminServiceDetailModal = ({ open, service, onClose, onEdit }: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = useMemo(() => 
        service?.images?.length ? service.images : ['/images/default-service.jpg'], 
        [service?.images]
    );
    
    const hasMultipleImages = images.length > 1;

    const nextImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const goToImage = useCallback((index: number) => {
        setCurrentImageIndex(index);
    }, []);

    const getCategoryColor = (category: any) => {
        let categoryName = '';
        if (typeof category === 'string') {
            categoryName = category;
        } else if (category && typeof category === 'object') {
            categoryName = category.name;
        }
        
        switch (categoryName) {
            case 'PERSONAL_TRAINER':
                return 'primary';
            case 'BOXING':
                return 'error';
            case 'YOGA':
                return 'success';
            case 'CARDIO':
                return 'warning';
            case 'GYM':
                return 'info';
            default:
                return 'primary';
        }
    };


    if (!service) return null;
    const stats = [
        {
            label: "Price",
            value: `$${service.price?.toLocaleString()}`,
            icon: <AttachMoney />,
            color: "#00b4ff"
        },
        {
            label: "Duration",
            value: `${service.duration} days`,
            icon: <Schedule />,
            color: "#00b4ff"
        },
        {
            label: "Max Participants",
            value: service.maxParticipants,
            icon: <Group />,
            color: "#00b4ff"
        },
        {
            label: "Status",
            value: service.isActive ? "Active" : "Inactive",
            icon: <Visibility />,
            color: service.isActive ? "#4caf50" : "#f44336"
        }
    ];

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="lg" 
            fullWidth
            fullScreen={isMobile}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: isMobile ? 0 : 3,
                        maxHeight: '95vh',
                        display: 'flex',
                        flexDirection: 'column',
                    }
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
                    flexShrink: 0,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FitnessCenter />
                    <Typography variant="h6" fontWeight={700}>
                        Service Details - {service.name}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>

                    <IconButton 
                        onClick={onClose} 
                        sx={{ color: 'white' }}
                        size="small"
                        title="Close"
                    >
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent 
                sx={{ 
                    p: 0, 
                    overflow: 'auto',
                    flex: 1,
                    '&::-webkit-scrollbar': {
                        width: 8,
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: 4,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#00b4ff',
                        borderRadius: 4,
                        '&:hover': {
                            background: '#0099e6',
                        },
                    },
                }}
            >
                {/* Image Carousel */}
                <Box sx={{ position: 'relative', mb: 3 }}>
                    {/* Main Image */}
                    <Box
                        sx={{
                            position: 'relative',
                            height: { xs: 350, sm: 450 },
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
                                        },
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
                                        },
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

                        {/* Status Badge */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 16,
                                left: 16,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                background: service.isActive 
                                    ? 'rgba(76, 175, 80, 0.9)' 
                                    : 'rgba(244, 67, 54, 0.9)',
                                color: 'white',
                                px: 2,
                                py: 0.5,
                                borderRadius: 2,
                                fontSize: '0.875rem',
                                fontWeight: 600,
                            }}
                        >
                            {service.isActive ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                            {service.isActive ? 'Active' : 'Inactive'}
                        </Box>
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
                                        height: 80,
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
                <Box sx={{ p: 3}}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Chip 
                            label={service.category?.name}
                            color={getCategoryColor(service.category)}
                            sx={{ 
                                fontWeight: 600,
                            }} 
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <RichTextDisplay content={service.description} />
                    </Box>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#333' }}>
                        Service Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2}}>
                        {stats.map((item, index) => (
                            <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: "100%",
                                        borderRadius: 3,
                                        transition: "all 0.25s ease",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
                                        }
                                    }}
                                >
                                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                                        <Box
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                mx: "auto",
                                                mb: 1.5,
                                                borderRadius: "50%",
                                                background: `${item.color}15`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: item.color,
                                                fontSize: 28
                                            }}
                                        >
                                            {item.icon}
                                        </Box>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                            sx={{ mb: 0.5 }}
                                        >
                                            {item.label}
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                            sx={{ color: item.color }}
                                        >
                                            {item.value}
                                        </Typography>

                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Registration Stats */}
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 1, color: "#333" }}
                    >
                        Registration Information
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    p: 2,
                                    borderRadius: 3,
                                    bgcolor: "#f8f9fa",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        bgcolor: "#f1f3f5"
                                    }
                                }}
                            >
                                <Group sx={{ color: "#6c757d" }} />

                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Current Registrations
                                    </Typography>

                                    <Typography variant="body2" fontWeight={600}>
                                        {service.registrationCount || 0} people registered
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        
                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    p: 2,
                                    borderRadius: 3,
                                    bgcolor: "#f8f9fa",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        bgcolor: "#f1f3f5"
                                    }
                                }}
                            >
                                <Visibility sx={{ color: "#6c757d" }} />

                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Availability
                                    </Typography>

                                    <Typography variant="body2" fontWeight={600}>
                                        {service.maxParticipants 
                                            ? `${(service.maxParticipants - (service.registrationCount || 0))} slots available`
                                            : 'Unlimited slots'
                                        }
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 4, mb: 2, justifyContent:'flex-end' }}>
                        {onEdit && (
                            <Button
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={() => onEdit(service)}
                                sx={{
                                    background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0099e6, #0052cc)',
                                    },
                                    fontWeight: 600,
                                }}
                            >
                                Edit Service
                            </Button>
                        )}

                        <Button 
                            variant="outlined" 
                            onClick={onClose}
                            sx={{
                                borderColor: '#00b4ff',
                                color: '#00b4ff',
                                '&:hover': {
                                    borderColor: '#0066ff',
                                    background: 'rgba(0, 180, 255, 0.1)',
                                },
                                fontWeight: 600,
                            }}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AdminServiceDetailModal;