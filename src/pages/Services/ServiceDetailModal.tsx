import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
    Dialog,
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
    CheckCircleOutline,
    CancelOutlined,
} from '@mui/icons-material';
import RichTextDisplay from '../../components/Common/RichTextDisplay';
import type { ServiceItem } from "../../@type/powergym.ts";

interface Props {
    open: boolean;
    service: ServiceItem;
    onClose: () => void;
    onRegister?: (serviceId: string) => void;
}

const BRAND = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const ServiceDetailModal = ({ open, service, onClose, onRegister }: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const images = useMemo(() =>
            service?.images?.length ? service.images : ['/images/default-service.jpg'],
        [service?.images]
    );

    const hasMultipleImages = images.length > 1;

    // Auto-slide
    useEffect(() => {
        if (!hasMultipleImages || isHovered) return;
        intervalRef.current = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, 3500);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [images.length, hasMultipleImages, isHovered]);

    // Reset index when modal opens
    useEffect(() => {
        if (open) setCurrentImageIndex(0);
    }, [open]);

    const nextImage = useCallback(() => setCurrentImageIndex(p => (p + 1) % images.length), [images.length]);
    const prevImage = useCallback(() => setCurrentImageIndex(p => (p - 1 + images.length) % images.length), [images.length]);

    if (!service) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : '20px',
                    maxHeight: '95vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    boxShadow: '0 32px 80px rgba(0,102,255,0.22)',
                }
            }}
        >
            <DialogContent
                sx={{
                    p: 0,
                    overflow: 'auto',
                    flex: 1,
                    '&::-webkit-scrollbar': { width: 6 },
                    '&::-webkit-scrollbar-track': { background: '#f1f6ff' },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#00b4ff',
                        borderRadius: 3,
                        '&:hover': { background: '#0066ff' },
                    },
                }}
            >
                {/* ── Hero Image Carousel ── */}
                <Box
                    sx={{ position: 'relative', height: { xs: 260, sm: 380 }, overflow: 'hidden' }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Slides */}
                    {images.map((img, idx) => (
                        <Box
                            key={idx}
                            component="img"
                            src={img}
                            alt={`${service.name} ${idx + 1}`}
                            sx={{
                                position: 'absolute', inset: 0,
                                width: '100%', height: '100%',
                                objectFit: 'cover',
                                opacity: idx === currentImageIndex ? 1 : 0,
                                transform: idx === currentImageIndex ? 'scale(1.04)' : 'scale(1)',
                                transition: 'opacity 0.9s ease, transform 5s ease',
                            }}
                        />
                    ))}

                    {/* Gradient overlay */}
                    <Box sx={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(0,20,80,0.75) 100%)',
                        zIndex: 1,
                    }} />

                    {/* Close button */}
                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{
                            position: 'absolute', top: 14, right: 14, zIndex: 4,
                            background: 'rgba(0,0,0,0.45)',
                            backdropFilter: 'blur(6px)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.2)',
                            '&:hover': { background: 'rgba(0,0,0,0.7)' },
                        }}
                    >
                        <Close fontSize="small" />
                    </IconButton>

                    {/* Status chip */}
                    <Chip
                        icon={service.isActive
                            ? <CheckCircleOutline sx={{ fontSize: 14, color: '#fff !important' }} />
                            : <CancelOutlined sx={{ fontSize: 14, color: '#fff !important' }} />}
                        label={service.isActive ? 'Active' : 'Tạm ngưng'}
                        size="small"
                        sx={{
                            position: 'absolute', top: 14, left: 14, zIndex: 4,
                            background: service.isActive
                                ? 'rgba(16,185,129,0.85)'
                                : 'rgba(220,38,38,0.85)',
                            color: '#fff',
                            fontWeight: 700, fontSize: '0.7rem',
                            letterSpacing: 0.5,
                            backdropFilter: 'blur(6px)',
                            border: '1px solid rgba(255,255,255,0.25)',
                        }}
                    />

                    {/* Category chip */}
                    <Chip
                        label={service.category}
                        size="small"
                        sx={{
                            position: 'absolute', top: 46, left: 14, zIndex: 4,
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(8px)',
                            color: '#fff', fontWeight: 600, fontSize: '0.68rem',
                            letterSpacing: 1, textTransform: 'uppercase',
                            border: '1px solid rgba(255,255,255,0.25)',
                        }}
                    />

                    {/* Nav arrows */}
                    {hasMultipleImages && (
                        <>
                            <IconButton onClick={prevImage} sx={{
                                position: 'absolute', left: 12, top: '50%',
                                transform: 'translateY(-50%)', zIndex: 3,
                                background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)',
                                color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                                transition: 'all 0.25s',
                                '&:hover': { background: 'rgba(0,180,255,0.7)', transform: 'translateY(-50%) scale(1.1)' },
                            }}>
                                <ChevronLeft />
                            </IconButton>
                            <IconButton onClick={nextImage} sx={{
                                position: 'absolute', right: 12, top: '50%',
                                transform: 'translateY(-50%)', zIndex: 3,
                                background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)',
                                color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                                transition: 'all 0.25s',
                                '&:hover': { background: 'rgba(0,180,255,0.7)', transform: 'translateY(-50%) scale(1.1)' },
                            }}>
                                <ChevronRight />
                            </IconButton>
                        </>
                    )}

                    {/* Service name over image */}
                    <Box sx={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        p: { xs: 2.5, sm: 3 }, zIndex: 2,
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <FitnessCenter sx={{ color: '#00b4ff', fontSize: 20 }} />
                            <Typography variant="overline" sx={{
                                color: '#00b4ff', fontWeight: 700, letterSpacing: 3, fontSize: '0.68rem',
                            }}>
                                PowerGym Service
                            </Typography>
                        </Box>
                        <Typography variant="h5" fontWeight={800} sx={{
                            color: '#fff',
                            fontSize: { xs: '1.3rem', sm: '1.6rem' },
                            letterSpacing: '-0.3px',
                            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                        }}>
                            {service.name}
                        </Typography>
                    </Box>

                    {/* Dot indicators + progress bar */}
                    {hasMultipleImages && (
                        <>
                            <Box sx={{
                                position: 'absolute', bottom: 12, right: 16,
                                display: 'flex', gap: 0.6, zIndex: 3,
                            }}>
                                {images.map((_, idx) => (
                                    <Box
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        sx={{
                                            width: idx === currentImageIndex ? 20 : 6,
                                            height: 6, borderRadius: 3, cursor: 'pointer',
                                            background: idx === currentImageIndex ? '#00b4ff' : 'rgba(255,255,255,0.45)',
                                            transition: 'all 0.4s ease',
                                        }}
                                    />
                                ))}
                            </Box>

                            {/* Progress bar */}
                            {!isHovered && (
                                <Box sx={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    height: '2px', background: 'rgba(255,255,255,0.2)', zIndex: 3,
                                }}>
                                    <Box
                                        key={currentImageIndex}
                                        sx={{
                                            height: '100%', background: '#00b4ff',
                                            animation: 'slideProgress 3.5s linear forwards',
                                            '@keyframes slideProgress': {
                                                from: { width: '0%' },
                                                to: { width: '100%' },
                                            },
                                        }}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </Box>

                {/* Thumbnail strip */}
                {hasMultipleImages && (
                    <Box sx={{
                        display: 'flex', gap: 1, px: 2, py: 1.5,
                        overflowX: 'auto', background: '#f4f6f9',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        '&::-webkit-scrollbar': { height: 4 },
                        '&::-webkit-scrollbar-thumb': { background: '#00b4ff', borderRadius: 2 },
                    }}>
                        {images.map((img, idx) => (
                            <Box
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                sx={{
                                    minWidth: 72, height: 52,
                                    borderRadius: '8px', overflow: 'hidden',
                                    cursor: 'pointer', flexShrink: 0,
                                    border: currentImageIndex === idx
                                        ? '2.5px solid #00b4ff'
                                        : '2px solid transparent',
                                    transition: 'all 0.25s',
                                    opacity: currentImageIndex === idx ? 1 : 0.6,
                                    '&:hover': { opacity: 1, border: '2.5px solid #00b4ff' },
                                }}
                            >
                                <Box component="img" src={img}
                                     sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            </Box>
                        ))}
                    </Box>
                )}

                {/* ── Content ── */}
                <Box sx={{ p: { xs: 2.5, sm: 3.5 }, background: '#f4f6f9' }}>

                    {/* Stats row */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 2, mb: 3,
                    }}>
                        {[
                            {
                                icon: <AttachMoney sx={{ fontSize: 22, color: '#00b4ff' }} />,
                                label: 'Price',
                                value: `$${service.price?.toLocaleString()}`,
                                color: '#00b4ff',
                                bg: 'linear-gradient(135deg, #f0fbff, #e0f4ff)',
                                border: 'rgba(0,180,255,0.2)',
                            },
                            {
                                icon: <Schedule sx={{ fontSize: 22, color: '#1366ba' }} />,
                                label: 'Duration',
                                value: `${service.duration}d`,
                                color: '#1366ba',
                                bg: 'linear-gradient(135deg, #f0f4ff, #e0eaff)',
                                border: 'rgba(19,102,186,0.2)',
                            },
                            {
                                icon: <Group sx={{ fontSize: 22, color: '#045668' }} />,
                                label: 'Registered',
                                value: `${service.registrationCount || 0}/${service.maxParticipants || 0}`,
                                color: (service.registrationCount || 0) >= (service.maxParticipants || 0) ? '#dc2626' : '#045668',
                                bg: (service.registrationCount || 0) >= (service.maxParticipants || 0) 
                                    ? 'linear-gradient(135deg, #fef2f2, #fee2e2)' 
                                    : 'linear-gradient(135deg, #f0fafc, #e0f5f8)',
                                border: (service.registrationCount || 0) >= (service.maxParticipants || 0) 
                                    ? 'rgba(220,38,38,0.2)' 
                                    : 'rgba(4,86,104,0.2)',
                            },
                        ].map((stat, i) => (
                            <Box key={i} sx={{
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                p: { xs: 1.5, sm: 2 },
                                background: stat.bg,
                                borderRadius: '14px',
                                border: `1px solid ${stat.border}`,
                                gap: 0.5,
                                textAlign: 'center',
                            }}>
                                {stat.icon}
                                <Typography variant="h6" fontWeight={800} sx={{
                                    color: stat.color,
                                    fontSize: { xs: '1rem', sm: '1.15rem' },
                                    lineHeight: 1,
                                }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: '#888', fontWeight: 600,
                                    fontSize: '0.68rem', letterSpacing: 0.5,
                                    textTransform: 'uppercase',
                                }}>
                                    {stat.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Description card */}
                    <Box sx={{
                        background: '#fff',
                        borderRadius: '16px',
                        border: '1px solid rgba(0,0,0,0.07)',
                        p: { xs: 2, sm: 3 },
                        mb: 2,
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Box sx={{
                                width: 4, height: 20, borderRadius: 2,
                                background: BRAND,
                            }} />
                            <Typography variant="subtitle1" fontWeight={700} color="#1a1a2e">
                                Service Description
                            </Typography>
                        </Box>
                        <RichTextDisplay content={service.description} />
                    </Box>

                    {/* Action buttons */}
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            disabled={!service.isActive || (service.registrationCount || 0) >= (service.maxParticipants || 0)}
                            onClick={() => {
                                if ((service.registrationCount || 0) >= (service.maxParticipants || 0)) {
                                    alert('This service is fully booked. No more registrations available.');
                                    return;
                                }
                                onRegister?.(service.id);
                            }}
                            sx={{
                                py: 1.5,
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                background: BRAND,
                                boxShadow: '0 8px 24px rgba(4,86,104,0.35)',
                                transition: 'all 0.25s',
                                '&:hover': {
                                    boxShadow: '0 12px 32px rgba(4,86,104,0.5)',
                                    transform: 'translateY(-1px)',
                                    background: BRAND,
                                },
                                '&.Mui-disabled': { background: '#ccc', boxShadow: 'none' },
                            }}
                        >
                            {!service.isActive 
                                ? 'Unavailable' 
                                : (service.registrationCount || 0) >= (service.maxParticipants || 0) 
                                    ? 'Fully Booked' 
                                    : 'Register Now'}
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={onClose}
                            sx={{
                                py: 1.5,
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                borderColor: 'rgba(0,0,0,0.18)',
                                color: 'text.primary',
                                '&:hover': {
                                    borderColor: '#00b4ff',
                                    color: '#00b4ff',
                                    background: 'rgba(0,180,255,0.05)',
                                },
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

export default ServiceDetailModal;