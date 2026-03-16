import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close,
  Email,
  Phone,
  School,
  Work,
  Person,
  Description,
  Verified,
  Warning,
  Download,
  FiberManualRecord,
} from '@mui/icons-material';
import {
  getTrainerById,
  verifyTrainerDocument,
  type TrainerResponse,
} from '../../../../services/trainerService';

interface TrainerDetailModalProps {
  open: boolean;
  onClose: () => void;
  trainerId: number | null;
}

/* ─── Helpers ─────────────────────────────────────────────── */

const specialtyColorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
  PERSONAL_TRAINER: 'primary',
  BOXING: 'warning',
  YOGA: 'success',
  CARDIO: 'info',
  GYM: 'secondary',
};

const levelColorMap: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
  BEGINNER: 'info',
  INTERMEDIATE: 'warning',
  ADVANCED: 'success',
  EXPERT: 'error',
};

const documentTypeLabels: Record<string, string> = {
  ID_CARD: 'National ID',
  PASSPORT: 'Passport',
  CERTIFICATE: 'Certificate',
  LICENSE: 'License',
  DIPLOMA: 'Diploma',
  HEALTH_CERTIFICATE: 'Health Certificate',
  CRIMINAL_RECORD: 'Criminal Record',
  CV: 'Curriculum Vitae',
};

const getSpecialtyColor = (s: string) => specialtyColorMap[s] ?? 'default';
const getLevelColor = (s: string) => levelColorMap[s] ?? 'default';
const formatDocumentType = (t: string) => documentTypeLabels[t] ?? t;

/* ─── Section header ──────────────────────────────────────── */
const SectionHeader = ({ icon, title, count }: { icon: React.ReactNode; title: string; count?: number }) => (
    <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={2}
        pb={1.5}
        sx={{ borderBottom: '2px solid', borderColor: 'primary.main' }}
    >
      <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>{icon}</Box>
      <Typography variant="h6" fontWeight={700} letterSpacing={-0.3}>
        {title}
      </Typography>
      {count !== undefined && (
          <Chip
              label={count}
              size="small"
              sx={{ ml: 'auto', fontWeight: 700, bgcolor: 'primary.main', color: '#fff', height: 22, fontSize: 12 }}
          />
      )}
    </Box>
);

/* ─── Component ───────────────────────────────────────────── */
const TrainerDetailModal: React.FC<TrainerDetailModalProps> = ({ open, onClose, trainerId }) => {
  const [trainer, setTrainer] = useState<TrainerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && trainerId) loadTrainerDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, trainerId]);

  const loadTrainerDetail = async () => {
    if (!trainerId) return;
    try {
      setLoading(true);
      setError('');
      const response = await getTrainerById(trainerId);
      if (response.success) setTrainer(response.data);
      else setError(response.message);
    } catch (err: any) {
      setError(err.message || 'Failed to load trainer details.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDocument = async (documentId: number, isVerified: boolean) => {
    try {
      await verifyTrainerDocument(documentId, isVerified);
      await loadTrainerDetail();
    } catch (err: any) {
      setError(err.message || 'Failed to update document status.');
    }
  };

  /* ── Loading state ── */
  if (loading) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: dialogPaper }}>
          <DialogContent>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={240}>
              <CircularProgress />
            </Box>
          </DialogContent>
        </Dialog>
    );
  }

  /* ── Empty state ── */
  if (!trainer && !loading) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: dialogPaper }}>
          <DialogContent>
            <Alert severity="error" sx={{ mt: 1 }}>Trainer not found.</Alert>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} variant="outlined">Close</Button>
          </DialogActions>
        </Dialog>
    );
  }

  const displayExp = (() => {
    const total = trainer?.totalExperienceYears ?? 0;
    const maxSpec = trainer?.specialties?.reduce((m, s) => Math.max(m, s.experienceYears ?? 0), 0) ?? 0;
    return total || maxSpec;
  })();

  return (
      <Dialog
          open={open}
          onClose={onClose}
          maxWidth="lg"
          fullWidth
          PaperProps={{ sx: dialogPaper }}
      >
        {/* ── Title bar ── */}
        <DialogTitle sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing={1.5}>
                Trainer Profile
              </Typography>
              <Typography variant="h5" fontWeight={800} letterSpacing={-0.5} lineHeight={1.2}>
                {trainer?.fullName}
              </Typography>
            </Box>
            <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3, bgcolor: 'grey.50' }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Grid container spacing={3}>
            {/* ── Left column: Profile card ── */}
            <Grid item xs={12} md={4}>
              <Card sx={profileCard}>
                <CardContent sx={{ textAlign: 'center', pt: 4, pb: 3 }}>
                  <Avatar
                      src={trainer?.avatar}
                      sx={{
                        width: 110,
                        height: 110,
                        mx: 'auto',
                        mb: 2,
                        fontSize: 40,
                        fontWeight: 700,
                        bgcolor: 'primary.light',
                        border: '4px solid',
                        borderColor: 'primary.main',
                      }}
                  >
                    {trainer?.fullName?.charAt(0)}
                  </Avatar>

                  <Chip
                      icon={<FiberManualRecord sx={{ fontSize: '10px !important' }} />}
                      label={trainer?.isActive ? 'Active' : 'Inactive'}
                      color={trainer?.isActive ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 700, mb: 3 }}
                  />

                  <Divider sx={{ mb: 2 }} />

                  <List dense disablePadding>
                    <InfoRow icon={<Email />} text={trainer?.email} />
                    <InfoRow icon={<Phone />} text={trainer?.phoneNumber || 'Not provided'} />
                    {displayExp > 0 && (
                        <InfoRow icon={<Work />} text={`${displayExp} yrs experience`} />
                    )}
                    {trainer?.education && (
                        <InfoRow icon={<School />} text={trainer.education} />
                    )}
                  </List>

                  {trainer?.emergencyContact && (
                      <Box mt={2.5} textAlign="left">
                        <Divider sx={{ mb: 1.5 }} />
                        <Typography
                            variant="caption"
                            fontWeight={700}
                            textTransform="uppercase"
                            letterSpacing={1}
                            color="text.secondary"
                        >
                          Emergency Contact
                        </Typography>
                        <Typography variant="body2" fontWeight={600} mt={0.5}>
                          {trainer.emergencyContact}
                        </Typography>
                        {trainer.emergencyPhone && (
                            <Typography variant="body2" color="text.secondary">
                              {trainer.emergencyPhone}
                            </Typography>
                        )}
                      </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* ── Right column ── */}
            <Grid item xs={12} md={8}>
              {/* Bio */}
              {trainer?.bio && (
                  <Card sx={{ ...sectionCard, mb: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <SectionHeader icon={<Person />} title="About" />
                      <Typography variant="body2" color="text.secondary" lineHeight={1.8} sx={{ whiteSpace: 'pre-wrap' }}>
                        {trainer.bio}
                      </Typography>
                    </CardContent>
                  </Card>
              )}

              {/* Specialties */}
              <Card sx={{ ...sectionCard, mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <SectionHeader icon={<School />} title="Specialties" count={trainer?.specialties?.length ?? 0} />

                  {trainer?.specialties?.length ? (
                      trainer.specialties.map((specialty, i) => (
                          <Card key={i} variant="outlined" sx={specialtyItem}>
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                              <Box display="flex" gap={1} alignItems="center" mb={1.5} flexWrap="wrap">
                                <Chip
                                    label={specialty.specialty?.displayName ?? 'Unknown'}
                                    color={getSpecialtyColor(specialty.specialty?.name ?? '')}
                                    sx={{ fontWeight: 700 }}
                                />
                                <Chip
                                    label={specialty.level}
                                    color={getLevelColor(specialty.level ?? 'BEGINNER')}
                                    size="small"
                                    variant="outlined"
                                />
                              </Box>

                              {specialty.description && (
                                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1.5 }}>
                                    {specialty.description}
                                  </Typography>
                              )}

                              <Grid container spacing={2}>
                                {specialty.experienceYears && (
                                    <Grid item xs={6}>
                                      <StatCell label="Experience" value={`${specialty.experienceYears} yrs`} />
                                    </Grid>
                                )}
                                {specialty.certifications && (
                                    <Grid item xs={6}>
                                      <StatCell label="Certifications" value={specialty.certifications} />
                                    </Grid>
                                )}
                              </Grid>
                            </CardContent>
                          </Card>
                      ))
                  ) : (
                      <Alert severity="info">No specialties on record.</Alert>
                  )}
                </CardContent>
              </Card>

              {/* Documents */}
              <Card sx={sectionCard}>
                <CardContent sx={{ p: 3 }}>
                  <SectionHeader icon={<Description />} title="Documents" count={trainer?.documents?.length ?? 0} />

                  {trainer?.documents?.length ? (
                      trainer.documents.map((doc, i) => (
                          <Card key={i} variant="outlined" sx={docItem(doc.isVerified)}>
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                              {/* Doc header */}
                              <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                  <Typography variant="subtitle2" fontWeight={700}>
                                    {formatDocumentType(doc.documentType)}
                                  </Typography>
                                  <Chip
                                      icon={doc.isVerified ? <Verified sx={{ fontSize: '14px !important' }} /> : <Warning sx={{ fontSize: '14px !important' }} />}
                                      label={doc.isVerified ? 'Verified' : 'Pending'}
                                      color={doc.isVerified ? 'success' : 'warning'}
                                      size="small"
                                      sx={{ fontWeight: 700 }}
                                  />
                                </Box>

                                <Box display="flex" gap={1}>
                                  <Button
                                      size="small"
                                      variant="outlined"
                                      startIcon={<Download />}
                                      onClick={() => window.open(doc.fileUrl, '_blank')}
                                  >
                                    Download
                                  </Button>
                                  <Button
                                      size="small"
                                      variant={doc.isVerified ? 'outlined' : 'contained'}
                                      color={doc.isVerified ? 'error' : 'success'}
                                      onClick={() => handleVerifyDocument(doc.id, !doc.isVerified)}
                                      sx={{ fontWeight: 700 }}
                                  >
                                    {doc.isVerified ? 'Revoke' : 'Verify'}
                                  </Button>
                                </Box>
                              </Box>

                              {/* File name */}
                              <Typography variant="body2" color="text.secondary" mt={1} sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                                {doc.fileName}
                              </Typography>

                              {doc.description && (
                                  <Typography variant="body2" mt={0.5} paragraph sx={{ mb: 1 }}>
                                    {doc.description}
                                  </Typography>
                              )}

                              <Grid container spacing={2} mt={0.5}>
                                <Grid item xs={6}>
                                  <StatCell label="Uploaded" value={new Date(doc.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />
                                </Grid>
                                {doc.expiryDate && (
                                    <Grid item xs={6}>
                                      <StatCell label="Expires" value={new Date(doc.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />
                                    </Grid>
                                )}
                              </Grid>
                            </CardContent>
                          </Card>
                      ))
                  ) : (
                      <Alert severity="info">No documents uploaded yet.</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: '#fff', borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={onClose} variant="outlined" sx={{ fontWeight: 700 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
  );
};

/* ─── Small sub-components ────────────────────────────────── */
const InfoRow = ({ icon, text }: { icon: React.ReactNode; text?: string | null }) => (
    <ListItem disablePadding sx={{ mb: 1 }}>
      <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>{icon}</ListItemIcon>
      <ListItemText
          primary={text}
          primaryTypographyProps={{ variant: 'body2', color: 'text.primary', fontWeight: 500 }}
      />
    </ListItem>
);

const StatCell = ({ label, value }: { label: string; value: string }) => (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.8}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {value}
      </Typography>
    </Box>
);

/* ─── Style objects ───────────────────────────────────────── */
const dialogPaper = {
  borderRadius: 3,
  maxHeight: '90vh',
  boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
};

const profileCard = {
  borderRadius: 2.5,
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  border: '1px solid',
  borderColor: 'divider',
  height: 'fit-content',
  position: 'sticky',
  top: 0,
};

const sectionCard = {
  borderRadius: 2.5,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  border: '1px solid',
  borderColor: 'divider',
};

const specialtyItem = {
  borderRadius: 2,
  mb: 2,
  '&:last-child': { mb: 0 },
  bgcolor: 'grey.50',
  '&:hover': { bgcolor: 'grey.100' },
  transition: 'background-color 0.15s',
};

const docItem = (verified: boolean) => ({
  borderRadius: 2,
  mb: 2,
  '&:last-child': { mb: 0 },
  borderLeft: '4px solid',
  borderLeftColor: verified ? 'success.main' : 'warning.main',
  bgcolor: verified ? 'rgba(46,125,50,0.03)' : 'rgba(237,108,2,0.03)',
});

export default TrainerDetailModal;