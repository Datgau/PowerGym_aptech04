import React from 'react';
import {
    Dialog, DialogContent, Box, Typography, Avatar, Divider, IconButton,
} from '@mui/material';
import {
    Close, Email, Phone, Person, CalendarToday, Payment, Computer,
    FitnessCenter, AttachMoney, Schedule, Group, CheckCircle, Cancel,
    AssignmentInd, EventBusy, AccessTime, AccountCircle,
} from '@mui/icons-material';
import type {ServiceRegistrationResponse} from "../../../../../types/serviceRegistration.ts";

interface Props {
    open: boolean;
    onClose: () => void;
    registration: ServiceRegistrationResponse | null;
}

/* ── helpers ─────────────────────────────────────────────────── */
const fmtDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    }) : '—';

const fmtDateOnly = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
    }) : '—';

const STATUS_MAP: Record<string, { label: string; bg: string; color: string; border: string }> = {
    ACTIVE:    { label: 'Active',    bg: 'rgba(46,125,50,0.1)',  color: '#2e7d32', border: 'rgba(46,125,50,0.25)'  },
    CANCELLED: { label: 'Cancelled', bg: 'rgba(198,40,40,0.08)', color: '#c62828', border: 'rgba(198,40,40,0.2)'   },
    COMPLETED: { label: 'Completed', bg: 'rgba(2,136,209,0.1)',  color: '#01579b', border: 'rgba(2,136,209,0.25)'  },
    EXPIRED:   { label: 'Expired',   bg: 'rgba(230,81,0,0.08)',  color: '#e65100', border: 'rgba(230,81,0,0.2)'    },
};

const PAYMENT_MAP: Record<string, { label: string; bg: string; color: string; border: string }> = {
    PAID:    { label: 'Paid',    bg: 'rgba(46,125,50,0.1)',  color: '#2e7d32', border: 'rgba(46,125,50,0.25)'  },
    PENDING: { label: 'Pending', bg: 'rgba(230,81,0,0.08)',  color: '#e65100', border: 'rgba(230,81,0,0.2)'    },
    FAILED:  { label: 'Failed',  bg: 'rgba(198,40,40,0.08)', color: '#c62828', border: 'rgba(198,40,40,0.2)'   },
};

const Badge = ({ map, value }: { map: Record<string, any>; value: string }) => {
    const s = map[value] ?? { label: value, bg: '#f5f5f5', color: '#555', border: '#ddd' };
    return (
        <Box sx={{
            display: 'inline-flex', alignItems: 'center',
            px: 1.5, py: 0.35, borderRadius: '6px',
            bgcolor: s.bg, color: s.color, border: `1px solid ${s.border}`,
            fontSize: '0.75rem', fontWeight: 700,
        }}>
            {s.label}
        </Box>
    );
};

const InfoRow = ({
                     icon, label, children,
                 }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
    <Box sx={{ display: 'flex', gap: 1.5, py: 1, alignItems: 'flex-start' }}>
        <Box sx={{ color: '#00b4ff', mt: 0.15, flexShrink: 0, fontSize: 18 }}>{icon}</Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.2, mb: 0.2 }}>
                {label}
            </Typography>
            <Box>{children}</Box>
        </Box>
    </Box>
);

const TextVal = ({ v }: { v?: string | number | null }) => (
    <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
        {v ?? <span style={{ color: '#aaa', fontWeight: 400, fontStyle: 'italic' }}>N/A</span>}
    </Typography>
);

const SectionHead = ({ children }: { children: React.ReactNode }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Box sx={{ width: 3, height: 16, borderRadius: 2, bgcolor: '#00b4ff' }} />
        <Typography variant="subtitle2" fontWeight={700} color="#1a1a2e" sx={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.07em' }}>
            {children}
        </Typography>
    </Box>
);

/* ── main ───────────────────────────────────────────────────── */
const RegistrationDetailModal: React.FC<Props> = ({ open, onClose, registration: reg }) => {
    if (!reg) return null;

    const svc = reg.service;
    const user = reg.user;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '16px',
                        maxHeight: '92vh',
                        overflow: 'hidden',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
                    }
                }
            }}
        >
            {/* Header */}
            <Box sx={{
                background: 'linear-gradient(135deg, #00b4ff 0%, #0066ff 100%)',
                px: 3, py: 2.5, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', lineHeight: 1, mb: 0.25 }}>
                        REGISTRATION #{reg.id}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="#fff">
                        Registration Detail
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{
                    color: '#fff', bgcolor: 'rgba(255,255,255,0.15)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                }}>
                    <Close fontSize="small" />
                </IconButton>
            </Box>

            {/* Body */}
            <DialogContent sx={{
                p: 0, overflow: 'auto', bgcolor: '#f7f9fc',
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': { bgcolor: '#00b4ff', borderRadius: 3 },
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2.5 }}>

                    {/* ── Status strip ──────────────────────────────────── */}
                    <Box sx={{
                        display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center',
                        bgcolor: '#fff', borderRadius: '12px', p: 2,
                        border: '1px solid rgba(0,0,0,0.07)',
                    }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.3 }}>Registration Status</Typography>
                            <Badge map={STATUS_MAP} value={reg.status} />
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.3 }}>Payment</Typography>
                            <Badge map={PAYMENT_MAP} value={reg.paymentStatus} />
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.3 }}>Type</Typography>
                            <Box sx={{
                                display: 'inline-flex', alignItems: 'center', gap: 0.5,
                                px: 1.5, py: 0.35, borderRadius: '6px',
                                bgcolor: 'rgba(0,180,255,0.1)', color: '#0066ff',
                                border: '1px solid rgba(0,102,255,0.2)',
                                fontSize: '0.75rem', fontWeight: 700,
                            }}>
                                <Computer sx={{ fontSize: 13 }} />
                                {reg.registrationType ?? 'N/A'}
                            </Box>
                        </Box>
                    </Box>

                    {/* ── User info ─────────────────────────────────────── */}
                    <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.07)', p: 2.5 }}>
                        <SectionHead>Registered User</SectionHead>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar
                                src={user.avatar ?? undefined}
                                sx={{
                                    width: 52, height: 52, fontWeight: 700, fontSize: '1.2rem',
                                    background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                                    border: '2px solid rgba(0,180,255,0.25)',
                                }}
                            >
                                {user.fullName?.charAt(0) ?? '?'}
                            </Avatar>
                            <Box>
                                <Typography fontWeight={700} fontSize="1rem">{user.fullName}</Typography>
                                <Box sx={{
                                    display: 'inline-flex', mt: 0.25, px: 1, py: 0.1,
                                    borderRadius: '4px', bgcolor: 'rgba(0,180,255,0.1)',
                                    color: '#0066ff', fontSize: '0.68rem', fontWeight: 700,
                                }}>
                                    {user.role?.name ?? 'USER'}
                                </Box>
                            </Box>
                            <Box sx={{ ml: 'auto' }}>
                                <Box sx={{
                                    px: 1.25, py: 0.3, borderRadius: '6px',
                                    bgcolor: user.isActive ? 'rgba(46,125,50,0.1)' : 'rgba(198,40,40,0.08)',
                                    color: user.isActive ? '#2e7d32' : '#c62828',
                                    border: `1px solid ${user.isActive ? 'rgba(46,125,50,0.25)' : 'rgba(198,40,40,0.2)'}`,
                                    fontSize: '0.72rem', fontWeight: 700,
                                }}>
                                    {user.isActive ? 'Active Account' : 'Inactive'}
                                </Box>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 1.5, opacity: 0.4 }} />

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                            <Box sx={{ flex: '1 1 200px' }}>
                                <InfoRow icon={<Person sx={{ fontSize: 18 }} />} label="User ID">
                                    <TextVal v={`#${user.id}`} />
                                </InfoRow>
                                <InfoRow icon={<Email sx={{ fontSize: 18 }} />} label="Email">
                                    <TextVal v={user.email} />
                                </InfoRow>
                                <InfoRow icon={<AccountCircle sx={{ fontSize: 18 }} />} label="Username">
                                    <TextVal v={user.username} />
                                </InfoRow>
                            </Box>
                            <Box sx={{ flex: '1 1 200px' }}>
                                <InfoRow icon={<Phone sx={{ fontSize: 18 }} />} label="Phone Number">
                                    <TextVal v={user.phoneNumber} />
                                </InfoRow>
                                <InfoRow icon={<CalendarToday sx={{ fontSize: 18 }} />} label="Date of Birth">
                                    <TextVal v={fmtDateOnly(user.dateOfBirth)} />
                                </InfoRow>
                                <InfoRow icon={<CalendarToday sx={{ fontSize: 18 }} />} label="Member Since">
                                    <TextVal v={fmtDateOnly(user.createDate)} />
                                </InfoRow>
                            </Box>
                        </Box>

                        {user.bio && (
                            <Box sx={{ mt: 1, pt: 1.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                                <InfoRow icon={<AssignmentInd sx={{ fontSize: 18 }} />} label="Bio">
                                    <TextVal v={user.bio} />
                                </InfoRow>
                            </Box>
                        )}
                    </Box>

                    {/* ── Service info ──────────────────────────────────── */}
                    {svc && (
                        <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                            {/* Service image strip */}
                            {svc.images?.length > 0 && (
                                <Box sx={{ height: 100, overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={svc.images[0]}
                                        alt={svc.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                    <Box sx={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 60%)',
                                    }} />
                                    <Box sx={{ position: 'absolute', bottom: 12, left: 16 }}>
                                        <Typography fontWeight={700} color="#fff" fontSize="0.95rem">{svc.name}</Typography>
                                        {svc.category && (
                                            <Box sx={{
                                                display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 0.25,
                                                px: 1, py: 0.15, borderRadius: '4px',
                                                bgcolor: 'rgba(255,255,255,0.2)', color: '#fff',
                                                fontSize: '0.68rem', fontWeight: 700,
                                            }}>
                                                {svc.category.displayName ?? svc.category.name}
                                            </Box>
                                        )}
                                    </Box>
                                    {svc.images.length > 1 && (
                                        <Box sx={{
                                            position: 'absolute', top: 8, right: 10,
                                            bgcolor: 'rgba(0,0,0,0.55)', color: '#fff',
                                            px: 1, py: 0.2, borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600,
                                        }}>
                                            +{svc.images.length - 1} photos
                                        </Box>
                                    )}
                                </Box>
                            )}

                            <Box sx={{ p: 2.5 }}>
                                <SectionHead>Service Information</SectionHead>

                                {/* Stats row */}
                                <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                                    {[
                                        { icon: <AttachMoney sx={{ fontSize: 16 }} />, label: 'Price', value: `$${svc.price?.toLocaleString()}`, color: '#00b4ff' },
                                        { icon: <Schedule sx={{ fontSize: 16 }} />, label: 'Duration', value: `${svc.duration} days`, color: '#0066ff' },
                                        { icon: <Group sx={{ fontSize: 16 }} />, label: 'Max', value: svc.maxParticipants ?? '∞', color: '#7c3aed' },
                                    ].map(item => (
                                        <Box key={item.label} sx={{
                                            flex: '1 1 80px', textAlign: 'center', p: 1.5,
                                            borderRadius: '10px', border: '1px solid rgba(0,0,0,0.07)',
                                            bgcolor: '#f8f9fb',
                                        }}>
                                            <Box sx={{ color: item.color, mb: 0.25 }}>{item.icon}</Box>
                                            <Typography variant="caption" color="text.secondary" display="block">{item.label}</Typography>
                                            <Typography variant="subtitle2" fontWeight={700} sx={{ color: item.color }}>{item.value}</Typography>
                                        </Box>
                                    ))}
                                    <Box sx={{
                                        flex: '1 1 80px', textAlign: 'center', p: 1.5,
                                        borderRadius: '10px', border: '1px solid rgba(0,0,0,0.07)',
                                        bgcolor: '#f8f9fb',
                                    }}>
                                        <Box sx={{ color: svc.isActive ? '#2e7d32' : '#c62828', mb: 0.25 }}>
                                            {svc.isActive ? <CheckCircle sx={{ fontSize: 16 }} /> : <Cancel sx={{ fontSize: 16 }} />}
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" display="block">Status</Typography>
                                        <Typography variant="subtitle2" fontWeight={700} sx={{ color: svc.isActive ? '#2e7d32' : '#c62828' }}>
                                            {svc.isActive ? 'Active' : 'Inactive'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Occupancy bar */}
                                {svc.maxParticipants && (
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="caption" color="text.secondary">Occupancy</Typography>
                                            <Typography variant="caption" fontWeight={700} color="#00b4ff">
                                                {svc.registrationCount ?? 0} / {svc.maxParticipants}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ height: 6, bgcolor: 'rgba(0,0,0,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                                            <Box sx={{
                                                height: '100%', borderRadius: 3,
                                                width: `${Math.min(Math.round(((svc.registrationCount ?? 0) / svc.maxParticipants) * 100), 100)}%`,
                                                background: 'linear-gradient(90deg, #00b4ff, #0066ff)',
                                            }} />
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}

                    {/* ── Registration timeline ─────────────────────────── */}
                    <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.07)', p: 2.5 }}>
                        <SectionHead>Registration Timeline</SectionHead>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                            <Box sx={{ flex: '1 1 200px' }}>
                                <InfoRow icon={<CalendarToday sx={{ fontSize: 18 }} />} label="Registration Date">
                                    <TextVal v={fmtDate(reg.registrationDate)} />
                                </InfoRow>
                                <InfoRow icon={<AccessTime sx={{ fontSize: 18 }} />} label="Expiration Date">
                                    <TextVal v={fmtDate(reg.expirationDate)} />
                                </InfoRow>
                            </Box>
                            <Box sx={{ flex: '1 1 200px' }}>
                                {reg.cancelledDate && (
                                    <InfoRow icon={<EventBusy sx={{ fontSize: 18 }} />} label="Cancelled Date">
                                        <TextVal v={fmtDate(reg.cancelledDate)} />
                                    </InfoRow>
                                )}
                                {reg.trainerName && (
                                    <InfoRow icon={<FitnessCenter sx={{ fontSize: 18 }} />} label="Assigned Trainer">
                                        <TextVal v={reg.trainerName} />
                                    </InfoRow>
                                )}
                                {reg.notes && (
                                    <InfoRow icon={<AssignmentInd sx={{ fontSize: 18 }} />} label="Notes">
                                        <TextVal v={reg.notes} />
                                    </InfoRow>
                                )}
                            </Box>
                        </Box>

                        {reg.cancellationReason && (
                            <Box sx={{
                                mt: 1.5, p: 1.5, borderRadius: '8px',
                                bgcolor: 'rgba(198,40,40,0.05)', border: '1px solid rgba(198,40,40,0.15)',
                            }}>
                                <Typography variant="caption" color="error" fontWeight={600} display="block" sx={{ mb: 0.25 }}>
                                    Cancellation Reason
                                </Typography>
                                <Typography variant="body2" color="#c62828">{reg.cancellationReason}</Typography>
                            </Box>
                        )}
                    </Box>

                    {/* ── Payment ───────────────────────────────────────── */}
                    <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.07)', p: 2.5 }}>
                        <SectionHead>Payment & Billing</SectionHead>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                            <Box sx={{ flex: '1 1 180px' }}>
                                <InfoRow icon={<Payment sx={{ fontSize: 18 }} />} label="Payment Status">
                                    <Badge map={PAYMENT_MAP} value={reg.paymentStatus} />
                                </InfoRow>
                                <InfoRow icon={<AttachMoney sx={{ fontSize: 18 }} />} label="Amount">
                                    <TextVal v={svc ? `$${svc.price?.toLocaleString()}` : undefined} />
                                </InfoRow>
                            </Box>
                            <Box sx={{ flex: '1 1 180px' }}>
                                <InfoRow icon={<Computer sx={{ fontSize: 18 }} />} label="Registration Type">
                                    <TextVal v={reg.registrationType} />
                                </InfoRow>
                                <InfoRow icon={<FitnessCenter sx={{ fontSize: 18 }} />} label="Registration ID">
                                    <TextVal v={`#${reg.id}`} />
                                </InfoRow>
                            </Box>
                        </Box>
                    </Box>

                </Box>
            </DialogContent>

            {/* Footer */}
            <Box sx={{
                px: 3, py: 2, borderTop: '1px solid rgba(0,0,0,0.07)',
                bgcolor: '#fff', display: 'flex', justifyContent: 'flex-end',
            }}>
                <Box
                    onClick={onClose}
                    sx={{
                        px: 3, py: 1, borderRadius: '10px', cursor: 'pointer',
                        background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                        color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                        boxShadow: '0 4px 14px rgba(0,102,255,0.3)',
                        '&:hover': { opacity: 0.9 },
                        userSelect: 'none',
                    }}
                >
                    Close
                </Box>
            </Box>
        </Dialog>
    );
};

export default RegistrationDetailModal;