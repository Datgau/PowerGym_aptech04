import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Fade,
    Zoom,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";
import type { ServiceItem } from '../../../@type/powergym.ts';
import RichTextDisplay from "../../../components/Common/RichTextDisplay.tsx";

interface ServicesSectionProps {
    readonly servicesData: ServiceItem[];
    readonly onServiceClick: (serviceId: string) => void;
}

// ── Collage Slideshow for See More card ──
const SeeMoreCollage = ({ services }: { services: ServiceItem[] }) => {
    const allImages = services
        .flatMap(s => s.images?.length ? s.images : ['/images/default-service.jpg'])
        .slice(0, 12);

    const [activeIdx, setActiveIdx] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (allImages.length <= 1) return;
        intervalRef.current = setInterval(() => {
            setActiveIdx(prev => (prev + 1) % allImages.length);
        }, 1800);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [allImages.length]);

    if (allImages.length === 0) return null;

    return (
        <Box sx={{
            position: 'absolute', inset: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
            gap: '2px',
            overflow: 'hidden',
        }}>
            {Array.from({ length: 12 }).map((_, i) => {
                const img = allImages[i % allImages.length];
                const isActive = i === activeIdx;
                return (
                    <Box
                        key={i}
                        sx={{
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'filter 0.6s ease, transform 0.6s ease',
                            filter: isActive ? 'brightness(1.15) saturate(1.3)' : 'brightness(0.55) saturate(0.7)',
                            transform: isActive ? 'scale(1.06)' : 'scale(1)',
                            zIndex: isActive ? 2 : 1,
                        }}
                    >
                        <Box
                            component="img"
                            src={img}
                            alt=""
                            sx={{
                                width: '100%', height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                transition: 'transform 4s ease',
                                transform: isActive ? 'scale(1.12)' : 'scale(1)',
                            }}
                        />
                    </Box>
                );
            })}
        </Box>
    );
};

const ServicesSection: React.FC<ServicesSectionProps> = ({ servicesData, onServiceClick }) => {
    const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);
    const navigate = useNavigate();

    const onSeeMoreClick = () => {
        navigate('/service');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getServiceImage = (service: ServiceItem): string => {
        return service.images?.[0] || '/images/default-service.jpg';
    };

    // remaining services (after first 3) used as collage source
    const remainingServices = servicesData.slice(3);
    // if fewer than 4 remaining, fallback to all services for collage
    const collageServices = remainingServices.length > 0 ? remainingServices : servicesData;

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
                    top: 0, left: 0, right: 0,
                    height: '100%',
                    background: `
                        radial-gradient(circle at 20% 50%, rgba(0,180,255,0.05) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(0,102,255,0.05) 0%, transparent 50%)
                    `,
                    pointerEvents: 'none',
                }
            }}
        >
            <Container maxWidth="xl">

                {/* ── Header ── */}
                <Fade in timeout={800}>
                    <Box sx={{ mb: { xs: 6, md: 10 }, position: 'relative' }}>
                        <Typography sx={{
                            position: 'absolute',
                            top: { xs: -20, md: -40 },
                            left: -10,
                            fontSize: { xs: '5rem', md: '10rem' },
                            fontWeight: 900,
                            color: 'rgba(0,102,255,0.04)',
                            lineHeight: 1,
                            userSelect: 'none',
                            pointerEvents: 'none',
                            letterSpacing: '-4px',
                            whiteSpace: 'nowrap',
                        }}>
                            SERVICES
                        </Typography>

                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 2.5,
                                px: 2.5,
                                py: 0.8,
                                background: 'linear-gradient(135deg, rgba(0,180,255,0.1), rgba(0,102,255,0.1))',
                                borderRadius: '50px',
                                border: '1px solid rgba(0,180,255,0.2)',
                            }}>
                                <FitnessCenterIcon sx={{ color: '#00b4ff', fontSize: 18 }} />
                                <Typography variant="overline" sx={{
                                    color: '#00b4ff', fontWeight: 700,
                                    letterSpacing: '0.12em', fontSize: '0.75rem',
                                }}>
                                    OUR SERVICES
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: { xs: 'flex-start', md: 'flex-end' },
                                justifyContent: 'space-between',
                                gap: 3,
                            }}>
                                <Box>
                                    <Typography variant="h1" component="h2" sx={{
                                        fontWeight: 800,
                                        fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                                        lineHeight: 1.1,
                                        letterSpacing: '-1px',
                                        background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        mb: 0,
                                    }}>
                                        Amazing<br />
                                        <Box component="span" sx={{
                                            background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}>Experience</Box>
                                    </Typography>
                                </Box>

                                <Box sx={{ maxWidth: 340, mb: { md: 0.5 } }}>
                                    <Box sx={{
                                        width: 48, height: 3,
                                        background: 'linear-gradient(90deg, #00b4ff, #0066ff)',
                                        borderRadius: 2, mb: 1.5,
                                    }} />
                                    <Typography variant="body1" sx={{
                                        color: '#666', lineHeight: 1.75,
                                        fontSize: { xs: '0.95rem', md: '1rem' }, fontWeight: 400,
                                    }}>
                                        Train at POWERGYM to enjoy the best and most optimal facilities
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Fade>

                {/* ── Grid ── */}
                {!servicesData || servicesData.length === 0 ? (
                    <Box textAlign="center" py={4}>
                        <Typography variant="h4" color="error">No services to display</Typography>
                    </Box>
                ) : (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' },
                        gap: { xs: 3, md: 3 },
                    }}>

                        {/* ── Service Cards ── */}
                        {servicesData.slice(0, 3).map((service, index) => (
                            <Zoom key={service.id} in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                                <Box
                                    onMouseEnter={() => setHoveredCard(service.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    onClick={() => onServiceClick(service.id)}
                                    sx={{
                                        position: 'relative',
                                        height: { xs: 520, md: 600 },
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        background: 'linear-gradient(145deg, #00d4ff 0%, #00b4ff 40%, #0066ff 100%)',
                                        boxShadow: hoveredCard === service.id
                                            ? '0 32px 64px -12px rgba(0,102,255,0.5)'
                                            : '0 12px 32px -8px rgba(0,102,255,0.28)',
                                        transition: 'transform 0.45s cubic-bezier(.22,.97,.44,1), box-shadow 0.45s ease',
                                        '&:hover': { transform: 'translateY(-10px)' },
                                    }}
                                >
                                    <Typography sx={{
                                        position: 'absolute',
                                        top: 16, left: 20,
                                        fontSize: '4.5rem',
                                        fontWeight: 900,
                                        lineHeight: 1,
                                        color: 'rgba(255,255,255,0.15)',
                                        zIndex: 3,
                                        userSelect: 'none',
                                        letterSpacing: '-3px',
                                    }}>
                                        {String(index + 1).padStart(2, '0')}
                                    </Typography>

                                    <Box sx={{
                                        position: 'absolute', inset: 0,
                                        transition: 'transform 0.55s cubic-bezier(.22,.97,.44,1)',
                                        transform: hoveredCard === service.id ? 'scale(1.06)' : 'scale(1)',
                                    }}>
                                        <Box
                                            component="img"
                                            src={getServiceImage(service)}
                                            alt={service.name}
                                            loading="lazy"
                                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                                e.currentTarget.src = '/images/default-service.jpg';
                                            }}
                                            sx={{
                                                width: '100%', height: '100%',
                                                objectFit: 'cover', objectPosition: 'center',
                                                display: 'block',
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(180deg, rgba(0,60,160,0.15) 0%, transparent 35%, rgba(0,30,120,0.85) 75%, rgba(0,20,100,0.97) 100%)',
                                        zIndex: 2,
                                    }} />

                                    <Box sx={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        p: { xs: 2.5, md: 3 },
                                        zIndex: 3,
                                    }}>
                                        <Typography variant="h5" sx={{
                                            color: '#fff', fontWeight: 800,
                                            fontSize: { xs: '1.15rem', md: '1.3rem' },
                                            lineHeight: 1.25, mb: 1,
                                            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                                            letterSpacing: '-0.2px',
                                        }}>
                                            {service.name}
                                        </Typography>

                                        <Box sx={{ mb: 3 }}>
                                            <RichTextDisplay content={service.description} />
                                        </Box>

                                        <Box sx={{
                                            display: 'inline-flex', alignItems: 'center', gap: 0.75,
                                            px: 1.5, py: 0.6,
                                            background: 'rgba(255,255,255,0.15)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255,255,255,0.22)',
                                            borderRadius: '50px', mb: 2,
                                        }}>
                                            <GroupIcon sx={{ color: '#fff', fontSize: 15 }} />
                                            <Typography variant="caption" sx={{
                                                color: '#fff', fontWeight: 600, fontSize: '0.78rem',
                                            }}>
                                                {service.registrationCount || 0}/{service.maxParticipants || 0} registered
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            background: '#fff',
                                            borderRadius: '12px',
                                            px: 2, py: 1.2,
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <AttachMoneyIcon sx={{ color: '#ff5026', fontSize: 20 }} />
                                                <Typography sx={{
                                                    color: '#ff5026', fontWeight: 800,
                                                    fontSize: { xs: '1.05rem', md: '1.15rem' },
                                                    letterSpacing: '-0.3px',
                                                }}>
                                                    {service.price?.toLocaleString('vi-VN')}đ
                                                </Typography>
                                            </Box>
                                            <Box sx={{
                                                px: 1.2, py: 0.3,
                                                background: 'rgba(0,102,255,0.08)',
                                                borderRadius: '6px',
                                            }}>
                                                <Typography variant="caption" sx={{
                                                    color: '#0066ff', fontWeight: 700, fontSize: '0.75rem',
                                                }}>
                                                    {service.duration} days
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Zoom>
                        ))}

                        {/* ── See More Card with Collage Slideshow ── */}
                        <Zoom in timeout={500} style={{ transitionDelay: '300ms' }}>
                            <Box
                                onMouseEnter={() => setHoveredCard('see-more')}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={onSeeMoreClick}
                                sx={{
                                    position: 'relative',
                                    height: { xs: 520, md: 600 },
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    boxShadow: hoveredCard === 'see-more'
                                        ? '0 32px 64px -12px rgba(0,102,255,0.5)'
                                        : '0 12px 32px -8px rgba(0,102,255,0.3)',
                                    transition: 'transform 0.45s cubic-bezier(.22,.97,.44,1), box-shadow 0.45s ease',
                                    '&:hover': { transform: 'translateY(-10px)' },
                                }}
                            >
                                {/* Collage background */}
                                <SeeMoreCollage services={collageServices} />

                                {/* Dark overlay so content is readable */}
                                <Box sx={{
                                    position: 'absolute', inset: 0, zIndex: 3,
                                    background: 'linear-gradient(160deg, rgba(0,20,80,0.55) 0%, rgba(0,40,120,0.72) 50%, rgba(0,10,60,0.88) 100%)',
                                    backdropFilter: 'blur(1px)',
                                }} />

                                {/* Grid texture overlay */}
                                <Box sx={{
                                    position: 'absolute', inset: 0, zIndex: 4,
                                    backgroundImage: `
                                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                                    `,
                                    backgroundSize: '32px 32px',
                                    pointerEvents: 'none',
                                }} />

                                {/* Centered content */}
                                <Box sx={{
                                    position: 'absolute', inset: 0, zIndex: 5,
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    p: { xs: 3, md: 4 }, textAlign: 'center',
                                    gap: 0,
                                }}>
                                    {/* Animated ring icon */}
                                    <Box sx={{
                                        width: 100, height: 100, borderRadius: '50%',
                                        border: '2.5px solid rgba(255,255,255,0.45)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        mb: 3,
                                        position: 'relative',
                                        transition: 'transform 0.5s ease, border-color 0.3s',
                                        transform: hoveredCard === 'see-more' ? 'rotate(45deg) scale(1.08)' : 'rotate(0deg)',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute', inset: 8,
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.12)',
                                        },
                                    }}>
                                        <ArrowForwardIcon sx={{
                                            color: '#fff', fontSize: 36,
                                            transition: 'transform 0.5s ease',
                                            transform: hoveredCard === 'see-more' ? 'rotate(-45deg)' : 'rotate(0deg)',
                                        }} />
                                    </Box>

                                    <Typography variant="body1" sx={{
                                        color: 'rgba(255,255,255,0.85)',
                                        fontSize: '0.95rem', lineHeight: 1.6,
                                        maxWidth: 220, mb: 4, fontWeight: 400,
                                    }}>
                                        Discover other amazing services
                                    </Typography>

                                    {/* CTA Button */}
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', gap: 1.2,
                                        px: 3.5, py: 1.4,
                                        background: '#fff',
                                        borderRadius: '50px',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        transform: hoveredCard === 'see-more' ? 'scale(1.06)' : 'scale(1)',
                                        mb: 3,
                                    }}>
                                        <Typography sx={{
                                            color: '#ff5026', fontWeight: 800, fontSize: '1rem',
                                        }}>
                                            Explore Now
                                        </Typography>
                                        <ArrowForwardIcon sx={{
                                            color: '#ff5026', fontSize: 20,
                                            transition: 'transform 0.3s ease',
                                            transform: hoveredCard === 'see-more' ? 'translateX(4px)' : 'translateX(0)',
                                        }} />
                                    </Box>

                                    {/* Count badge */}
                                    <Box sx={{
                                        px: 2.5, py: 0.8,
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: '50px',
                                    }}>
                                        <Typography variant="body2" sx={{
                                            color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                                        }}>
                                            +{servicesData.length - 3} other services
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Zoom>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ServicesSection;