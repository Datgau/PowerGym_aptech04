import React from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    Fade,
    Zoom,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";
import type { ServiceItem } from '../../../@type/powergym';

interface ServicesSectionProps {
    readonly servicesData: ServiceItem[];
    readonly onServiceClick: (serviceId: string) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ servicesData, onServiceClick }) => {
    const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);
    const navigate = useNavigate();

    const onSeeMoreClick = () => {
        navigate('/services');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const getServiceImage = (service: ServiceItem): string => {
        return service.images?.[0] || '/images/default-service.jpg';
    };

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 8, md: 12 },
                background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    background: `
                        radial-gradient(circle at 20% 50%, rgba(0, 180, 255, 0.05) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(0, 102, 255, 0.05) 0%, transparent 50%)
                    `,
                    pointerEvents: 'none',
                }
            }}
        >
            <Container maxWidth="xl">
                {/* Header Section */}
                <Fade in timeout={800}>
                    <Box
                        textAlign="center"
                        mb={{ xs: 6, md: 8 }}
                        sx={{
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '80px',
                                height: '4px',
                                background: 'linear-gradient(90deg, #00b4ff, #0066ff)',
                                borderRadius: '2px',
                            }
                        }}
                    >
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1.5,
                                mb: 2,
                                px: 3,
                                py: 1,
                                background: 'linear-gradient(135deg, rgba(0, 180, 255, 0.1), rgba(0, 102, 255, 0.1))',
                                borderRadius: '50px',
                                border: '1px solid rgba(0, 180, 255, 0.2)',
                            }}
                        >
                            <FitnessCenterIcon sx={{ color: '#00b4ff', fontSize: 24 }} />
                            <Typography
                                variant="overline"
                                sx={{
                                    color: '#00b4ff',
                                    fontWeight: 700,
                                    letterSpacing: '0.1em',
                                    fontSize: '0.875rem'
                                }}
                            >
                                DỊCH VỤ CỦA CHÚNG TÔI
                            </Typography>
                        </Box>

                        <Typography
                            variant="h1"
                            component="h1"
                            sx={{
                                height: 60,
                                fontWeight: 700,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                color: '#1a1a1a',
                                textTransform: 'capitalize',
                                letterSpacing: '0.02em',
                                mb: 3,
                                background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Trải nghiệm tuyệt vời
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#666',
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                lineHeight: 1.7,
                                maxWidth: '700px',
                                mx: 'auto',
                                fontWeight: 400,
                            }}
                        >
                            Luyện tập tại POWERGYM để cùng hưởng thụ được mọi tiện ích tốt và tối ưu nhất
                        </Typography>
                    </Box>
                </Fade>

                {/* Services Grid */}
                {!servicesData || servicesData.length === 0 ? (
                    <Box textAlign="center" py={4}>
                        <Typography variant="h4" color="error">
                            Không có dịch vụ nào để hiển thị
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                lg: 'repeat(4, 1fr)'
                            },
                            gap: { xs: 3, sm: 3, md: 4 },
                            px: { xs: 2, sm: 0 }
                        }}
                    >
                        {/* Regular Service Cards - Show first 3 services */}
                        {servicesData.slice(0, 3).map((service, index) => (
                            <Zoom
                                key={service.id}
                                in
                                timeout={500}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <Card
                                    onMouseEnter={() => setHoveredCard(service.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    sx={{
                                        width: '100%',
                                        height: { xs: 'auto', md: 600 },
                                        minHeight: { xs: 500, md: 600 },
                                        background: 'linear-gradient(145deg, #00d4ff 0%, #00b4ff 40%, #0066ff 100%)',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: 3,
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: hoveredCard === service.id
                                            ? '0 25px 50px -12px rgba(0, 102, 255, 0.5), 0 0 0 1px rgba(0, 180, 255, 0.1)'
                                            : '0 10px 30px -10px rgba(0, 102, 255, 0.3)',
                                        display: 'flex',
                                        flexDirection: 'column',

                                        '&:hover': {
                                            transform: 'translateY(-12px)',
                                        },

                                        '&:active': {
                                            transform: 'translateY(-8px)',
                                        }
                                    }}
                                    onClick={() => onServiceClick(service.id)}
                                >
                                    {/* Image Section - Fixed size, no scaling */}
                                    <Box 
                                        sx={{ 
                                            position: 'relative', 
                                            overflow: 'hidden', 
                                            height: { xs: 300, md: 400 },
                                            width: '100%',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={getServiceImage(service)}
                                            alt={service.name}
                                            loading="lazy"
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                                display: 'block',
                                            }}
                                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                                e.currentTarget.src = '/images/default-service.jpg';
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: '50%',
                                                background: 'linear-gradient(to top, rgba(0, 102, 255, 0.4), transparent)',
                                                pointerEvents: 'none',
                                            }}
                                        />
                                    </Box>

                                    {/* Content Section - Fixed height */}
                                    <Box
                                        sx={{
                                            p: 2.5,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: 200,
                                            position: 'relative',
                                            zIndex: 2,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {/* Service Name */}
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: '#fff',
                                                fontWeight: 700,
                                                mb: 1,
                                                fontSize: { xs: '1.15rem', sm: '1.25rem' },
                                                lineHeight: 1.3,
                                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                                            }}
                                        >
                                            {service.name}
                                        </Typography>

                                        {/* Description - Optimized */}
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.95)',
                                                lineHeight: 1.5,
                                                mb: 1.5,
                                                fontSize: '0.9rem',
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {service.description}
                                        </Typography>

                                        {/* Info Section */}
                                        <Box sx={{ mt: 'auto' }}>
                                            {/* Participants */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    mb: 1.5,
                                                    p: 1.2,
                                                    background: 'rgba(255, 255, 255, 0.15)',
                                                    borderRadius: 2,
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                }}
                                            >
                                                <GroupIcon sx={{ color: '#fff', fontSize: 20 }} />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#fff',
                                                        fontWeight: 600,
                                                        fontSize: '0.9rem',
                                                    }}
                                                >
                                                    Tối đa {service.maxParticipants} người
                                                </Typography>
                                            </Box>

                                            {/* Price Badge - Optimized */}
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 1.5,
                                                backgroundColor: '#ffffff',
                                                padding: '12px 18px',
                                                borderRadius: 2.5,
                                                boxShadow: '0 0 25px rgba(255, 80, 38, 0.4), 0 8px 20px rgba(0, 0, 0, 0.15)',
                                                border: '2px solid rgba(255, 255, 255, 0.95)',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                transition: 'all 0.3s ease',

                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 0 30px rgba(255, 80, 38, 0.5), 0 10px 25px rgba(0, 0, 0, 0.2)',
                                                }
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AttachMoneyIcon sx={{
                                                        color: '#ff5026',
                                                        fontSize: 24,
                                                        filter: 'drop-shadow(0 2px 4px rgba(255, 80, 38, 0.3))'
                                                    }} />
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            color: '#ff5026',
                                                            fontWeight: 700,
                                                            fontSize: { xs: '1.15rem', sm: '1.3rem' },
                                                            textShadow: '0 1px 2px rgba(255, 80, 38, 0.2)',
                                                            letterSpacing: '0.3px'
                                                        }}
                                                    >
                                                        {service.price?.toLocaleString('vi-VN')}đ
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: '#666',
                                                        fontWeight: 600,
                                                        fontSize: '0.8rem',
                                                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                                        px: 1.2,
                                                        py: 0.4,
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    {service.duration} tháng
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Card>
                            </Zoom>
                        ))}

                        {/* Special "See More" Card - Fixed size */}
                        <Zoom in timeout={500} style={{ transitionDelay: '300ms' }}>
                            <Card
                                onMouseEnter={() => setHoveredCard('see-more')}
                                onMouseLeave={() => setHoveredCard(null)}
                                sx={{
                                    width: '100%',
                                    height: { xs: 'auto', md: 600 },
                                    minHeight: { xs: 500, md: 600 },
                                    background: 'linear-gradient(135deg, rgb(4,100,223) 0%, rgb(15,110,236) 100%)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderRadius: 3,
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: hoveredCard === 'see-more'
                                        ? '0 25px 50px -12px rgba(0, 102, 255, 0.5)'
                                        : '0 10px 30px -10px rgba(0, 102, 255, 0.3)',
                                    border: '3px solid rgba(255, 255, 255, 0.3)',

                                    '&:hover': {
                                        transform: 'translateY(-12px)',
                                    },

                                    '&:active': {
                                        transform: 'translateY(-8px)',
                                    }
                                }}
                                onClick={onSeeMoreClick}
                            >
                                {/* Content - Centered Design */}
                                <Box
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        p: { xs: 3, sm: 4 },
                                        position: 'relative',
                                        zIndex: 2,
                                    }}
                                >
                                    {/* Icon with rotation animation */}
                                    <Box
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            borderRadius: '50%',
                                            background: 'rgba(255, 255, 255, 0.25)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 3,
                                            backdropFilter: 'blur(10px)',
                                            border: '3px solid rgba(255, 255, 255, 0.4)',
                                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                                            transition: 'all 0.4s ease',
                                            transform: hoveredCard === 'see-more' ? 'rotate(360deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                                        }}
                                    >
                                        <MoreHorizIcon sx={{
                                            color: '#fff',
                                            fontSize: 60,
                                            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                                        }} />
                                    </Box>

                                    {/* Title */}
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            color: '#fff',
                                            fontWeight: 800,
                                            mb: 2,
                                            fontSize: { xs: '2rem', sm: '2.5rem' },
                                            textAlign: 'center',
                                            textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        Xem Thêm
                                    </Typography>

                                    {/* Subtitle */}
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.95)',
                                            fontWeight: 600,
                                            mb: 4,
                                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                            textAlign: 'center',
                                            maxWidth: '280px',
                                            lineHeight: 1.5,
                                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                                        }}
                                    >
                                        Khám phá các dịch vụ tuyệt vời khác
                                    </Typography>

                                    {/* CTA Button */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            px: 4,
                                            py: 2,
                                            background: '#ffffff',
                                            borderRadius: 3,
                                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                                            transition: 'all 0.3s ease',
                                            transform: hoveredCard === 'see-more' ? 'scale(1.05)' : 'scale(1)',
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: '#ff5026',
                                                fontWeight: 700,
                                                fontSize: '1.15rem',
                                            }}
                                        >
                                            Khám Phá Ngay
                                        </Typography>
                                        <ArrowForwardIcon sx={{
                                            color: '#ff5228',
                                            fontSize: 28,
                                            transition: 'transform 0.3s ease',
                                            transform: hoveredCard === 'see-more' ? 'translateX(5px)' : 'translateX(0)',
                                        }} />
                                    </Box>

                                    {/* Service count badge */}
                                    <Box
                                        sx={{
                                            mt: 3,
                                            px: 3,
                                            py: 1,
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            borderRadius: 2,
                                            backdropFilter: 'blur(10px)',
                                            border: '2px solid rgba(255, 255, 255, 0.3)',
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#fff',
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                            }}
                                        >
                                            +{servicesData.length - 3} dịch vụ khác
                                        </Typography>
                                    </Box>
                                </Box>
                            </Card>
                        </Zoom>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ServicesSection;
