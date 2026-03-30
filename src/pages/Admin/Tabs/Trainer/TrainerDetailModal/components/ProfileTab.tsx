import React from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Alert, Button,
} from '@mui/material';
import { Person, School, Description, Verified, Warning, Download } from '@mui/icons-material';
import type { TrainerResponse } from '../../../../../services/trainerService';
import SectionHeader from './SectionHeader';
import StatCell from './StatCell';
import { sectionCard, specialtyItem, docItem } from '../constants';
import { getSpecialtyColor, getLevelColor, formatDocumentType } from '../helpers';

interface Props {
  trainer: TrainerResponse;
  onVerifyDocument: (documentId: number, isVerified: boolean) => void;
}

const ProfileTab: React.FC<Props> = ({ trainer, onVerifyDocument }) => (
  <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
    {/* Bio */}
    {trainer.bio && (
      <Card sx={sectionCard}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader icon={<Person />} title="About" />
          <Typography variant="body2" color="text.secondary" lineHeight={1.8} sx={{ whiteSpace: 'pre-wrap' }}>
            {trainer.bio}
          </Typography>
        </CardContent>
      </Card>
    )}

    {/* Specialties */}
    <Card sx={sectionCard}>
      <CardContent sx={{ p: 3 }}>
        <SectionHeader icon={<School />} title="Specialties" count={trainer.specialties?.length ?? 0} />
        {trainer.specialties?.length ? (
          trainer.specialties.map((specialty, i) => (
            <Card key={i} variant="outlined" sx={specialtyItem}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box display="flex" gap={1} alignItems="center" mb={1.5} flexWrap="wrap">
                  <Chip label={specialty.specialty?.displayName ?? 'Unknown'}
                    color={getSpecialtyColor(specialty.specialty?.name ?? '')} sx={{ fontWeight: 700 }} />
                  <Chip label={specialty.level} color={getLevelColor(specialty.level ?? 'BEGINNER')}
                    size="small" variant="outlined" />
                </Box>
                {specialty.description && (
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1.5 }}>
                    {specialty.description}
                  </Typography>
                )}
                <Box display="flex" gap={2}>
                  {specialty.experienceYears && (
                    <Box flex={1}><StatCell label="Experience" value={`${specialty.experienceYears} yrs`} /></Box>
                  )}
                  {specialty.certifications && (
                    <Box flex={1}><StatCell label="Certifications" value={specialty.certifications} /></Box>
                  )}
                </Box>
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
        <SectionHeader icon={<Description />} title="Documents" count={trainer.documents?.length ?? 0} />
        {trainer.documents?.length ? (
          trainer.documents.map((doc, i) => (
            <Card key={i} variant="outlined" sx={docItem(doc.isVerified)}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                  <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                    <Typography variant="subtitle2" fontWeight={700}>
                      {formatDocumentType(doc.documentType)}
                    </Typography>
                    <Chip
                      icon={doc.isVerified
                        ? <Verified sx={{ fontSize: '14px !important' }} />
                        : <Warning sx={{ fontSize: '14px !important' }} />}
                      label={doc.isVerified ? 'Verified' : 'Pending'}
                      color={doc.isVerified ? 'success' : 'warning'}
                      size="small" sx={{ fontWeight: 700 }}
                    />
                  </Box>
                  <Box display="flex" gap={1}>
                    <Button size="small" variant="outlined" startIcon={<Download />}
                      onClick={() => window.open(doc.fileUrl, '_blank')}>
                      Download
                    </Button>
                    <Button size="small"
                      variant={doc.isVerified ? 'outlined' : 'contained'}
                      color={doc.isVerified ? 'error' : 'success'}
                      onClick={() => onVerifyDocument(doc.id, !doc.isVerified)}
                      sx={{ fontWeight: 700 }}>
                      {doc.isVerified ? 'Revoke' : 'Verify'}
                    </Button>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" mt={1}
                  sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                  {doc.fileName}
                </Typography>
                {doc.description && (
                  <Typography variant="body2" mt={0.5} paragraph sx={{ mb: 1 }}>{doc.description}</Typography>
                )}
                <Box display="flex" gap={2} mt={0.5}>
                  <Box flex={1}>
                    <StatCell label="Uploaded"
                      value={new Date(doc.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />
                  </Box>
                  {doc.expiryDate && (
                    <Box flex={1}>
                      <StatCell label="Expires"
                        value={new Date(doc.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Alert severity="info">No documents uploaded yet.</Alert>
        )}
      </CardContent>
    </Card>
  </Box>
);

export default ProfileTab;
