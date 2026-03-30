export const specialtyColorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
  PERSONAL_TRAINER: 'primary',
  BOXING: 'warning',
  YOGA: 'success',
  CARDIO: 'info',
  GYM: 'secondary',
};

export const levelColorMap: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
  BEGINNER: 'info',
  INTERMEDIATE: 'warning',
  ADVANCED: 'success',
  EXPERT: 'error',
};

export const documentTypeLabels: Record<string, string> = {
  ID_CARD: 'National ID',
  PASSPORT: 'Passport',
  CERTIFICATE: 'Certificate',
  LICENSE: 'License',
  DIPLOMA: 'Diploma',
  HEALTH_CERTIFICATE: 'Health Certificate',
  CRIMINAL_RECORD: 'Criminal Record',
  CV: 'Curriculum Vitae',
};

export const dialogPaper = {
  borderRadius: 3,
  height: '90vh',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
} as const;

export const sectionCard = {
  borderRadius: 2.5,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  border: '1px solid',
  borderColor: 'divider',
} as const;

export const specialtyItem = {
  borderRadius: 2,
  mb: 2,
  '&:last-child': { mb: 0 },
  bgcolor: 'grey.50',
  '&:hover': { bgcolor: 'grey.100' },
  transition: 'background-color 0.15s',
} as const;

export const docItem = (verified: boolean) => ({
  borderRadius: 2,
  mb: 2,
  '&:last-child': { mb: 0 },
  borderLeft: '4px solid',
  borderLeftColor: verified ? 'success.main' : 'warning.main',
  bgcolor: verified ? 'rgba(46,125,50,0.03)' : 'rgba(237,108,2,0.03)',
});
