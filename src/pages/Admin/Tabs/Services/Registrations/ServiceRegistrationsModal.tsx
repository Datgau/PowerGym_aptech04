import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogContent, DialogActions, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, Alert, Box, Typography, Avatar,
} from '@mui/material';
import { Email, Phone, CalendarToday, Group, CheckCircle, Close, OpenInNew } from '@mui/icons-material';
import { getServiceRegistrationsLegacy, type ServiceRegistrationResponse } from '../../../../../services/serviceRegistrationService.ts';
import type { GymServiceDto } from '../../../../../services/gymService.ts';
import RegistrationDetailModal from './RegistrationDetailModal.tsx';

interface Props {
    open: boolean;
    onClose: () => void;
    service: GymServiceDto | null;
}

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    });

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
            px: 1.25, py: 0.3, borderRadius: '6px',
            bgcolor: s.bg, color: s.color, border: `1px solid ${s.border}`,
            fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap',
        }}>
            {s.label}
        </Box>
    );
};

/* ── component ───────────────────────────────────────────────── */
const ServiceRegistrationsModal: React.FC<Props> = ({ open, onClose, service }) => {
    const [registrations, setRegistrations] = useState<ServiceRegistrationResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState<ServiceRegistrationResponse | null>(null);

    useEffect(() => {
        if (open && service) loadRegistrations();
    }, [open, service]);

    const loadRegistrations = async () => {
        if (!service) return;
        try {
            setLoading(true); setError('');
            const res = await getServiceRegistrationsLegacy(parseInt(service.id));
            if (res.success) setRegistrations(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Data not found');
        } finally {
            setLoading(false);
        }
    };

    const activeCount = registrations.filter(r => r.status === 'ACTIVE').length;

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="xl"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '16px', maxHeight: '90vh',
                            display: 'flex', flexDirection: 'column', overflow: 'hidden',
                            boxShadow: '0 24px 80px rgba(0,0,0,0.15)',
                        }
                    }
                }}
            >
                {/* ── Header ─────────────────────────────────────────── */}
                <Box sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    px: 3, py: 2,
                    background: 'linear-gradient(135deg, #00b4ff 0%, #0066ff 100%)',
                    flexShrink: 0,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            src={service?.images?.[0]}
                            variant="rounded"
                            sx={{
                                width: 46, height: 46, borderRadius: '10px',
                                border: '2px solid rgba(255,255,255,0.4)',
                                bgcolor: 'rgba(255,255,255,0.2)',
                                fontWeight: 700, color: '#fff',
                            }}
                        >
                            {service?.name?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1, display: 'block' }}>
                                SERVICE REGISTRATIONS
                            </Typography>
                            <Typography variant="h6" fontWeight={700} color="#fff" sx={{ lineHeight: 1.3 }}>
                                {service?.name}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        {registrations.length > 0 && (
                            <>
                                <Box sx={{
                                    display: 'flex', alignItems: 'center', gap: 0.75,
                                    bgcolor: 'rgba(255,255,255,0.18)', borderRadius: '8px', px: 1.5, py: 0.5,
                                }}>
                                    <Group sx={{ color: '#fff', fontSize: 15 }} />
                                    <Typography variant="caption" fontWeight={700} color="#fff">{registrations.length} Total</Typography>
                                </Box>
                                <Box sx={{
                                    display: 'flex', alignItems: 'center', gap: 0.75,
                                    bgcolor: 'rgba(76,175,80,0.3)', borderRadius: '8px', px: 1.5, py: 0.5,
                                }}>
                                    <CheckCircle sx={{ color: '#a5d6a7', fontSize: 15 }} />
                                    <Typography variant="caption" fontWeight={700} color="#a5d6a7">{activeCount} Active</Typography>
                                </Box>
                            </>
                        )}
                        <Box onClick={onClose} sx={{
                            width: 32, height: 32, borderRadius: '8px', cursor: 'pointer',
                            bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                        }}>
                            <Close fontSize="small" />
                        </Box>
                    </Box>
                </Box>

                {/* ── Body ───────────────────────────────────────────── */}
                <DialogContent sx={{
                    p: 0, flex: 1, overflow: 'auto', bgcolor: '#f7f9fc',
                    '&::-webkit-scrollbar': { width: 6 },
                    '&::-webkit-scrollbar-thumb': { bgcolor: '#00b4ff', borderRadius: 3 },
                }}>
                    {error && <Alert severity="error" sx={{ m: 2, borderRadius: '10px' }}>{error}</Alert>}

                    {loading ? (
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="280px" gap={2}>
                            <CircularProgress sx={{ color: '#00b4ff' }} />
                            <Typography variant="body2" color="text.secondary">Loading registrations...</Typography>
                        </Box>
                    ) : registrations.length === 0 ? (
                        <Box textAlign="center" py={8}>
                            <Box sx={{
                                width: 72, height: 72, mx: 'auto', mb: 2, borderRadius: '50%',
                                bgcolor: 'rgba(0,180,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Group sx={{ fontSize: 36, color: '#00b4ff', opacity: 0.6 }} />
                            </Box>
                            <Typography variant="h6" fontWeight={600} color="#555" gutterBottom>No registrations yet</Typography>
                            <Typography variant="body2" color="text.secondary">No users have registered for this service.</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ p: 2.5 }}>
                            {/* hint */}
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, pl: 0.5 }}>
                                💡 Click any row to view full registration details
                            </Typography>

                            <TableContainer sx={{
                                borderRadius: '12px', border: '1px solid rgba(0,0,0,0.07)',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.05)', bgcolor: '#fff', overflow: 'hidden',
                            }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {['#', 'User', 'Email', 'Contact', 'Reg. Date', 'Exp. Date', 'Status', 'Payment', ''].map(col => (
                                                <TableCell key={col} sx={{
                                                    fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.06em',
                                                    textTransform: 'uppercase', color: '#888',
                                                    bgcolor: '#f8f9fb', borderBottom: '1px solid rgba(0,0,0,0.08)',
                                                    py: 1.5, px: 2, whiteSpace: 'nowrap',
                                                }}>
                                                    {col}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {registrations.map((reg, idx) => (
                                            <TableRow
                                                key={reg.id}
                                                onClick={() => setSelected(reg)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    bgcolor: idx % 2 === 0 ? '#fff' : '#fafbfc',
                                                    '&:hover': { bgcolor: 'rgba(0,180,255,0.05)' },
                                                    transition: 'background 0.15s',
                                                    '& td': { borderBottom: '1px solid rgba(0,0,0,0.05)', px: 2, py: 1.5 },
                                                    '&:last-child td': { borderBottom: 'none' },
                                                }}
                                            >
                                                {/* ID */}
                                                <TableCell>
                                                    <Typography variant="caption" color="text.disabled" fontWeight={600}>#{reg.id}</Typography>
                                                </TableCell>

                                                {/* User */}
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1.5}>
                                                        <Avatar sx={{
                                                            width: 34, height: 34, fontSize: '0.85rem', fontWeight: 700,
                                                            background: 'linear-gradient(135deg, #00b4ff, #0066ff)', flexShrink: 0,
                                                        }}>
                                                            {reg.user.fullName?.charAt(0) ?? '?'}
                                                        </Avatar>
                                                        <Box sx={{ minWidth: 0 }}>
                                                            <Typography fontWeight={600} fontSize="0.85rem" noWrap>{reg.user.fullName}</Typography>
                                                            <Typography variant="caption" color="text.disabled" noWrap>
                                                                {reg.user.role?.name ?? 'USER'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                {/* Email */}
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={0.75}>
                                                        <Email sx={{ fontSize: 14, color: '#00b4ff', flexShrink: 0 }} />
                                                        <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>{reg.user.email}</Typography>
                                                    </Box>
                                                </TableCell>

                                                {/* Phone */}
                                                <TableCell>
                                                    {reg.user.phoneNumber ? (
                                                        <Box display="flex" alignItems="center" gap={0.75}>
                                                            <Phone sx={{ fontSize: 14, color: '#00b4ff', flexShrink: 0 }} />
                                                            <Typography variant="body2">{reg.user.phoneNumber}</Typography>
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="body2" color="text.disabled" fontStyle="italic">N/A</Typography>
                                                    )}
                                                </TableCell>

                                                {/* Reg date */}
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={0.75}>
                                                        <CalendarToday sx={{ fontSize: 13, color: '#aaa', flexShrink: 0 }} />
                                                        <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{fmtDate(reg.registrationDate)}</Typography>
                                                    </Box>
                                                </TableCell>

                                                {/* Exp date */}
                                                <TableCell>
                                                    {reg.expirationDate ? (
                                                        <Box display="flex" alignItems="center" gap={0.75}>
                                                            <CalendarToday sx={{ fontSize: 13, color: '#aaa', flexShrink: 0 }} />
                                                            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{fmtDate(reg.expirationDate)}</Typography>
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="body2" color="text.disabled" fontStyle="italic">N/A</Typography>
                                                    )}
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell><Badge map={STATUS_MAP} value={reg.status} /></TableCell>

                                                {/* Payment */}
                                                <TableCell><Badge map={PAYMENT_MAP} value={reg.paymentStatus} /></TableCell>

                                                {/* Detail icon */}
                                                <TableCell>
                                                    <Box sx={{
                                                        width: 28, height: 28, borderRadius: '6px', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        bgcolor: 'rgba(0,180,255,0.1)', color: '#00b4ff',
                                                        '&:hover': { bgcolor: 'rgba(0,180,255,0.2)' },
                                                        transition: 'bgcolor 0.15s',
                                                    }}>
                                                        <OpenInNew sx={{ fontSize: 14 }} />
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Footer summary */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, px: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Showing <strong>{registrations.length}</strong> registration{registrations.length !== 1 ? 's' : ''}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {Object.entries(STATUS_MAP).map(([key, s]) => {
                                        const count = registrations.filter(r => r.status === key).length;
                                        if (!count) return null;
                                        return (
                                            <Box key={key} sx={{
                                                px: 1, py: 0.25, borderRadius: '6px',
                                                bgcolor: s.bg, border: `1px solid ${s.border}`,
                                            }}>
                                                <Typography variant="caption" fontWeight={700} sx={{ color: s.color }}>
                                                    {count} {s.label}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>
                        </Box>
                    )}
                </DialogContent>

                {/* ── Footer ─────────────────────────────────────────── */}
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0,0,0,0.07)', bgcolor: '#fff', flexShrink: 0 }}>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 3,
                            background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                            boxShadow: '0 4px 14px rgba(0,102,255,0.3)',
                            '&:hover': { background: 'linear-gradient(135deg, #0099e6, #0052cc)' },
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Detail modal */}
            <RegistrationDetailModal
                open={!!selected}
                onClose={() => setSelected(null)}
                registration={selected}
            />
        </>
    );
};

export default ServiceRegistrationsModal;