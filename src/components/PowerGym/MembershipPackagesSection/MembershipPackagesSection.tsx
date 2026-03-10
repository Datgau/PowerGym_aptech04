import React from 'react';
import { Box, Container, Typography, Zoom } from '@mui/material';
import { WorkspacePremium } from '@mui/icons-material';
import type { PackageOption } from '../../../@type/powergym';
import PackageCard from './PackageCard';
import PackagesSkeleton from './PackagesSkeleton';
import ConfirmationDialog from './ConfirmationDialog';
import { usePackageSelection } from './usePackageSelection';

interface MembershipPackagesSectionProps {
    readonly packages: readonly PackageOption[];
    readonly onSelectPackage: (packageId: string) => Promise<void>;
    readonly loading?: boolean;
}

const MembershipPackagesSection: React.FC<MembershipPackagesSectionProps> = ({
                                                                                 packages,
                                                                                 onSelectPackage,
                                                                                 loading = false,
                                                                             }) => {
    const {
        selectedPackage,
        confirmDialogOpen,
        processingPackage,
        handlePackageSelect,
        handleConfirmSelection,
        handleCloseDialog,
    } = usePackageSelection({ onSelectPackage });

    if (loading) {
        return (
            <Box component="section" sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)', position: 'relative' }}>
                <Container maxWidth="xl">
                    <PackagesSkeleton />
                </Container>
            </Box>
        );
    }

    if (packages.length === 0) return null;

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
                    top: 0, left: 0, right: 0, height: '100%',
                    background: `
            radial-gradient(circle at 20% 50%, rgba(0,180,255,0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(19,102,186,0.05) 0%, transparent 50%)
          `,
                    pointerEvents: 'none',
                },
            }}
        >
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

                {/* ── Header ── */}
                <Box sx={{ mb: { xs: 6, md: 10 }, position: 'relative' }}>
                    {/* Decorative background text */}
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
                        MEMBERSHIP
                    </Typography>

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        {/* Pill badge */}
                        <Box sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2.5,
                            px: 2.5, py: 0.8,
                            background: 'linear-gradient(135deg, rgba(0,180,255,0.1), rgba(0,102,255,0.1))',
                            borderRadius: '50px',
                            border: '1px solid rgba(0,180,255,0.2)',
                        }}>
                            <WorkspacePremium sx={{ color: '#00b4ff', fontSize: 18 }} />
                            <Typography variant="overline" sx={{
                                color: '#00b4ff', fontWeight: 700,
                                letterSpacing: '0.12em', fontSize: '0.75rem',
                            }}>
                                MEMBERSHIP PLANS
                            </Typography>
                        </Box>

                        {/* Title row */}
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
                                }}>
                                    Choose Your<br />
                                    <Box component="span" sx={{
                                        background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}>Perfect Plan</Box>
                                </Typography>
                            </Box>

                            <Box sx={{ maxWidth: 320, mb: { md: 0.5 } }}>
                                <Box sx={{
                                    width: 48, height: 3,
                                    background: 'linear-gradient(90deg, #00b4ff, #0066ff)',
                                    borderRadius: 2, mb: 1.5,
                                }} />
                                <Typography variant="body1" sx={{
                                    color: '#666', lineHeight: 1.75,
                                    fontSize: { xs: '0.95rem', md: '1rem' }, fontWeight: 400,
                                }}>
                                    Flexible membership options designed to fit your goals and budget
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* ── Packages Grid ── */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: { xs: 3, md: 4 },
                    }}
                >
                    {packages.map((pkg, index) => (
                        <Zoom in timeout={500 + index * 100} key={pkg.id}>
                            <Box
                                sx={{
                                    flex: {
                                        xs: '1 1 100%',
                                        sm: '1 1 calc(50% - 16px)',
                                        lg: '1 1 calc(33.333% - 22px)',
                                    },
                                    maxWidth: {
                                        xs: '100%',
                                        sm: 'calc(50% - 16px)',
                                        lg: 'calc(33.333% - 22px)',
                                    },
                                    minWidth: 260,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                        zIndex: 2,
                                    },
                                    ...((pkg as any).isPopular && {
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: -2,
                                            borderRadius: '16px',
                                            background: 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)',
                                            zIndex: 0,
                                            opacity: 0.3,
                                            filter: 'blur(8px)',
                                        },
                                    }),
                                    '& > *': { position: 'relative', zIndex: 1, height: '100%' },
                                }}
                            >
                                <PackageCard
                                    package={pkg}
                                    onSelect={() => handlePackageSelect(pkg)}
                                    processing={processingPackage === pkg.id}
                                />
                            </Box>
                        </Zoom>
                    ))}
                </Box>
            </Container>

            <ConfirmationDialog
                open={confirmDialogOpen}
                package={selectedPackage}
                processing={!!processingPackage}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmSelection}
            />
        </Box>
    );
};

export default MembershipPackagesSection;