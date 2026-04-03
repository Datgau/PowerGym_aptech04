import React from 'react';
import {
    Box, Typography, Chip, Alert, Button, Divider, Avatar,
} from '@mui/material';
import {
    Person, School, Description, Verified, Warning, Download,
    CalendarToday, WorkspacePremium,
} from '@mui/icons-material';
import type { TrainerResponse } from '../../../../../services/trainerService';
import StatCell from './StatCell';
import { getSpecialtyColor, getLevelColor, formatDocumentType } from '../helpers';

interface Props {
    trainer: TrainerResponse;
    onVerifyDocument: (documentId: number, isVerified: boolean) => void;
}

/* ─── Reusable section wrapper ─────────────────────────────────────────── */
const SectionCard: React.FC<{
    accentColor: string;
    avatarBg: string;
    icon: React.ReactNode;
    title: string;
    badge?: number;
    children: React.ReactNode;
}> = ({ accentColor, avatarBg, icon, title, badge, children }) => (
    <Box
        sx={{
            width: '100%',
            boxSizing: 'border-box',
            borderRadius: '12px',
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)',
            borderLeft: `4px solid ${accentColor}`,
            borderTop: '1px solid rgba(0,0,0,0.07)',
            borderRight: '1px solid rgba(0,0,0,0.07)',
            borderBottom: '1px solid rgba(0,0,0,0.07)',
        }}
    >
        {/* Header */}
        <Box sx={{ px: 3, pt: 2.5, pb: 0 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
                <Avatar
                    sx={{
                        width: 36, height: 36,
                        background: avatarBg,
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </Avatar>
                <Typography variant="h6" fontWeight={700} fontSize="1rem" letterSpacing="-0.2px">
                    {title}
                </Typography>
                {badge !== undefined && badge > 0 && (
                    <Chip
                        label={badge}
                        size="small"
                        sx={{
                            height: 20, fontSize: '0.7rem', fontWeight: 700,
                            bgcolor: `${accentColor}18`,
                            color: accentColor,
                            border: `1px solid ${accentColor}33`,
                            ml: 0.5,
                        }}
                    />
                )}
            </Box>
            <Divider sx={{ mt: 2, opacity: 0.4 }} />
        </Box>

        {/* Body */}
        <Box sx={{ px: 3, pt: 2, pb: 3 }}>
            {children}
        </Box>
    </Box>
);

/* ─── Main component ────────────────────────────────────────────────────── */
const ProfileTab: React.FC<Props> = ({ trainer, onVerifyDocument }) => (
    <Box
        sx={{
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            boxSizing: 'border-box',
            p: { xs: 2, md: 3 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            bgcolor: '#f7f8fa',
        }}
    >

        {/* ── About ─────────────────────────────────────────────────────────── */}
        {trainer.bio && (
            <SectionCard
                accentColor="#1976d2"
                avatarBg="linear-gradient(135deg, #1976d2, #42a5f5)"
                icon={<Person sx={{ fontSize: 18 }} />}
                title="About"
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                    lineHeight={1.85}
                    sx={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}
                >
                    {trainer.bio}
                </Typography>
            </SectionCard>
        )}

        {/* ── Specialties ───────────────────────────────────────────────────── */}
        <SectionCard
            accentColor="#388e3c"
            avatarBg="linear-gradient(135deg, #388e3c, #66bb6a)"
            icon={<School sx={{ fontSize: 18 }} />}
            title="Specialties"
            badge={trainer.specialties?.length ?? 0}
        >
            {trainer.specialties?.length ? (
                <Box display="flex" flexDirection="column" gap={1.5}>
                    {trainer.specialties.map((specialty, i) => (
                        <Box
                            key={i}
                            sx={{
                                border: '1px solid rgba(0,0,0,0.08)',
                                borderRadius: '10px',
                                p: 2,
                                bgcolor: 'rgba(0,0,0,0.015)',
                                '&:hover': {
                                    borderColor: '#66bb6a',
                                    boxShadow: '0 2px 10px rgba(56,142,60,0.1)',
                                },
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                            }}
                        >
                            <Box display="flex" gap={1} alignItems="center" mb={1.5} flexWrap="wrap">
                                <Chip
                                    label={specialty.specialty?.displayName ?? 'Unknown'}
                                    color={getSpecialtyColor(specialty.specialty?.name ?? '')}
                                    sx={{ fontWeight: 700, fontSize: '0.8rem', borderRadius: '6px' }}
                                />
                                <Chip
                                    label={specialty.level}
                                    color={getLevelColor(specialty.level ?? 'BEGINNER')}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 600, borderRadius: '6px' }}
                                />
                            </Box>

                            {specialty.description && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1.5, lineHeight: 1.7, fontSize: '0.85rem' }}
                                >
                                    {specialty.description}
                                </Typography>
                            )}

                            {(specialty.experienceYears || specialty.certifications) && (
                                <Box
                                    display="flex"
                                    gap={2}
                                    sx={{
                                        bgcolor: 'rgba(0,0,0,0.025)',
                                        borderRadius: '8px',
                                        p: 1.5,
                                        border: '1px solid rgba(0,0,0,0.05)',
                                    }}
                                >
                                    {specialty.experienceYears && (
                                        <Box flex={1}>
                                            <StatCell label="Experience" value={`${specialty.experienceYears} yrs`} />
                                        </Box>
                                    )}
                                    {specialty.certifications && (
                                        <Box flex={1}>
                                            <StatCell label="Certifications" value={specialty.certifications} />
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
            ) : (
                <Alert severity="info" sx={{ borderRadius: '8px' }}>No specialties on record.</Alert>
            )}
        </SectionCard>

        {/* ── Documents ─────────────────────────────────────────────────────── */}
        <SectionCard
            accentColor="#7b1fa2"
            avatarBg="linear-gradient(135deg, #7b1fa2, #ba68c8)"
            icon={<Description sx={{ fontSize: 18 }} />}
            title="Documents"
            badge={trainer.documents?.length ?? 0}
        >
            {trainer.documents?.length ? (
                <Box display="flex" flexDirection="column" gap={1.5}>
                    {trainer.documents.map((doc, i) => (
                        <Box
                            key={i}
                            sx={{
                                border: doc.isVerified
                                    ? '1px solid rgba(56,142,60,0.25)'
                                    : '1px solid rgba(237,108,2,0.22)',
                                borderRadius: '10px',
                                p: 2,
                                bgcolor: doc.isVerified ? 'rgba(56,142,60,0.02)' : 'rgba(237,108,2,0.02)',
                                '&:hover': {
                                    boxShadow: doc.isVerified
                                        ? '0 2px 10px rgba(56,142,60,0.12)'
                                        : '0 2px 10px rgba(237,108,2,0.12)',
                                },
                                transition: 'box-shadow 0.2s',
                            }}
                        >
                            {/* Top row */}
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                flexWrap="wrap"
                                gap={1}
                                mb={1.5}
                            >
                                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                    <WorkspacePremium
                                        sx={{ fontSize: 17, color: doc.isVerified ? 'success.main' : 'warning.main' }}
                                    />
                                    <Typography variant="subtitle2" fontWeight={700} fontSize="0.85rem">
                                        {formatDocumentType(doc.documentType)}
                                    </Typography>
                                    <Chip
                                        icon={doc.isVerified
                                            ? <Verified sx={{ fontSize: '13px !important' }} />
                                            : <Warning sx={{ fontSize: '13px !important' }} />}
                                        label={doc.isVerified ? 'Verified' : 'Pending'}
                                        color={doc.isVerified ? 'success' : 'warning'}
                                        size="small"
                                        sx={{ fontWeight: 700, borderRadius: '6px' }}
                                    />
                                </Box>

                                <Box display="flex" gap={1} flexShrink={0}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<Download sx={{ fontSize: '14px !important' }} />}
                                        onClick={() => window.open(doc.fileUrl, '_blank')}
                                        sx={{
                                            borderRadius: '8px', textTransform: 'none',
                                            fontWeight: 600, fontSize: '0.75rem', px: 1.5, py: 0.5,
                                        }}
                                    >
                                        Download
                                    </Button>
                                    <Button
                                        size="small"
                                        variant={doc.isVerified ? 'outlined' : 'contained'}
                                        color={doc.isVerified ? 'error' : 'success'}
                                        onClick={() => onVerifyDocument(doc.id, !doc.isVerified)}
                                        sx={{
                                            fontWeight: 700, borderRadius: '8px', textTransform: 'none',
                                            fontSize: '0.75rem', px: 1.5, py: 0.5,
                                        }}
                                    >
                                        {doc.isVerified ? 'Revoke' : 'Verify'}
                                    </Button>
                                </Box>
                            </Box>

                            {/* Filename */}
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    bgcolor: 'rgba(0,0,0,0.04)',
                                    border: '1px solid rgba(0,0,0,0.07)',
                                    borderRadius: '6px',
                                    px: 1.5, py: 0.4,
                                    mb: doc.description ? 1.5 : 1,
                                }}
                            >
                                <Typography sx={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'text.secondary' }}>
                                    {doc.fileName}
                                </Typography>
                            </Box>

                            {doc.description && (
                                <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.7, fontSize: '0.84rem' }}>
                                    {doc.description}
                                </Typography>
                            )}

                            {/* Dates */}
                            <Box
                                display="flex"
                                gap={2}
                                sx={{
                                    bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '8px',
                                    p: 1.5, border: '1px solid rgba(0,0,0,0.05)',
                                }}
                            >
                                <Box flex={1} display="flex" alignItems="center" gap={0.75}>
                                    <CalendarToday sx={{ fontSize: 12, color: 'text.disabled' }} />
                                    <StatCell
                                        label="Uploaded"
                                        value={new Date(doc.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'short', day: 'numeric',
                                        })}
                                    />
                                </Box>
                                {doc.expiryDate && (
                                    <Box flex={1} display="flex" alignItems="center" gap={0.75}>
                                        <CalendarToday sx={{ fontSize: 12, color: 'text.disabled' }} />
                                        <StatCell
                                            label="Expires"
                                            value={new Date(doc.expiryDate).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                            })}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Alert severity="info" sx={{ borderRadius: '8px' }}>No documents uploaded yet.</Alert>
            )}
        </SectionCard>

    </Box>
);

export default ProfileTab;