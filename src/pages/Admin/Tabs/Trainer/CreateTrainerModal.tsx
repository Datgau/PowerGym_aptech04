import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Alert,
  CircularProgress,
  LinearProgress,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Close,
  Person,
  School,
  CloudUpload,
  CheckCircle,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  createTrainer,
  uploadTrainerAvatar,
  uploadTrainerCoverPhoto,
  uploadTrainerDocument,
  type CreateTrainerRequest,
  type TrainerSpecialtyRequest
} from '../../../../services/trainerService';

// Import step components
import BasicInfoStep from './components/BasicInfoStep';
import SpecialtiesStep from './components/SpecialtiesStep';
import DocumentsStep from './components/DocumentsStep';

interface CreateTrainerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface DocumentUpload {
  file: File;
  documentType: string;
  description: string;
  expiryDate?: string;
}

const steps = [
  { label: 'Basic Info', icon: <Person sx={{ fontSize: 18 }} /> },
  { label: 'Specialties', icon: <School sx={{ fontSize: 18 }} /> },
  { label: 'Documents', icon: <CloudUpload sx={{ fontSize: 18 }} /> },
];

// Styled Components
const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #00b4ff 0%, #0066ff 100%)',
  color: '#fff',
  fontWeight: 700,
  letterSpacing: '0.5px',
  borderRadius: 10,
  padding: '10px 28px',
  boxShadow: '0 4px 20px rgba(0, 102, 255, 0.35)',
  transition: 'all 0.25s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #00c8ff 0%, #1a7aff 100%)',
    boxShadow: '0 6px 28px rgba(0, 102, 255, 0.5)',
    transform: 'translateY(-1px)',
  },
  '&:disabled': {
    background: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    boxShadow: 'none',
    transform: 'none',
  },
}));

const StyledConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 18 },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#e8ecf4',
    borderRadius: 1,
    transition: 'background-color 0.4s ease',
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    background: 'linear-gradient(90deg, #00b4ff, #0066ff)',
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    background: 'linear-gradient(90deg, #00b4ff, #0066ff)',
  },
}));

const StepIconRoot = styled('div')<{ ownerState: { active?: boolean; completed?: boolean } }>(
  ({ ownerState }) => ({
    width: 38,
    height: 38,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    transition: 'all 0.3s ease',
    ...(ownerState.completed && {
      background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
      color: '#fff',
      boxShadow: '0 4px 12px rgba(0, 102, 255, 0.35)',
    }),
    ...(ownerState.active && {
      background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
      color: '#fff',
      boxShadow: '0 4px 16px rgba(0, 102, 255, 0.4)',
      transform: 'scale(1.1)',
    }),
    ...(!ownerState.active && !ownerState.completed && {
      background: '#f0f2f8',
      color: '#9aa3b8',
    }),
  })
);

// Validation
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  fullName: Yup.string().min(2).max(100).required('Full name is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number')
    .required('Phone number is required'),
  bio: Yup.string().max(1000),
  totalExperienceYears: Yup.number().min(0).max(50),
  education: Yup.string().max(200),
  emergencyContact: Yup.string().max(100),
  emergencyPhone: Yup.string().matches(/^[0-9+\-\s()]*$/, 'Invalid phone number'),
  specialties: Yup.array().min(1, 'At least one specialty is required').required(),
});

// Step Icon Component
function CustomStepIcon(props: { active?: boolean; completed?: boolean; icon: React.ReactNode; stepIndex: number }) {
  const { active, completed, stepIndex } = props;
  return (
    <StepIconRoot ownerState={{ active, completed }}>
      {completed ? <CheckCircle sx={{ fontSize: 18 }} /> : steps[stepIndex]?.icon}
    </StepIconRoot>
  );
}

const CreateTrainerModal: React.FC<CreateTrainerModalProps> = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // File uploads
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);

  const formik = useFormik<CreateTrainerRequest>({
    initialValues: {
      email: '',
      fullName: '',
      phoneNumber: '',
      bio: '',
      totalExperienceYears: 0,
      education: '',
      emergencyContact: '',
      emergencyPhone: '',
      specialties: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleSubmit(values);
    },
  });

  const handleSubmit = async (values: CreateTrainerRequest) => {
    try {
      setLoading(true);
      setError('');
      
      const trainerResponse = await createTrainer(values);
      if (!trainerResponse.success) throw new Error(trainerResponse.message);

      const trainerId = trainerResponse.data.id;
      
      if (avatarFile) await uploadTrainerAvatar(trainerId, avatarFile);
      if (coverFile) await uploadTrainerCoverPhoto(trainerId, coverFile);
      
      for (const doc of documents) {
        await uploadTrainerDocument(trainerId, doc.file, doc.documentType, doc.description, doc.expiryDate);
      }

      setSuccess('Trainer created successfully!');
      setTimeout(() => { onSuccess(); handleClose(); }, 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the trainer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    formik.resetForm();
    setActiveStep(0);
    setAvatarFile(null); setAvatarPreview('');
    setCoverFile(null); setCoverPreview('');
    setDocuments([]);
    setError(''); setSuccess('');
    onClose();
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const basicFields = ['email', 'fullName', 'phoneNumber'];
      const hasErrors = basicFields.some(f => formik.errors[f as keyof typeof formik.errors] && formik.touched[f as keyof typeof formik.touched]);
      if (hasErrors || !formik.values.email || !formik.values.fullName || !formik.values.phoneNumber) {
        formik.setTouched({ email: true, fullName: true, phoneNumber: true });
        return;
      }
    }
    if (activeStep === 1 && formik.values.specialties.length === 0) {
      setError('Please add at least one specialty');
      return;
    }
    setActiveStep(p => p + 1);
    setError('');
  };

  const handleBack = () => { setActiveStep(p => p - 1); setError(''); };

  const addSpecialty = () => {
    const s: TrainerSpecialtyRequest = { specialty: '', description: '', experienceYears: 0, certifications: '', level: 'BEGINNER' };
    formik.setFieldValue('specialties', [...formik.values.specialties, s]);
  };

  const removeSpecialty = (i: number) => formik.setFieldValue('specialties', formik.values.specialties.filter((_, idx) => idx !== i));

  const updateSpecialty = (i: number, field: keyof TrainerSpecialtyRequest, value: any) => {
    const arr = [...formik.values.specialties];
    arr[i] = { ...arr[i], [field]: value };
    formik.setFieldValue('specialties', arr);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setAvatarFile(file); const r = new FileReader(); r.onload = ev => setAvatarPreview(ev.target?.result as string); r.readAsDataURL(file); }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setCoverFile(file); const r = new FileReader(); r.onload = ev => setCoverPreview(ev.target?.result as string); r.readAsDataURL(file); }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) Array.from(files).forEach(file => setDocuments(p => [...p, { file, documentType: 'CERTIFICATE', description: '' }]));
  };

  const updateDocument = (i: number, field: keyof DocumentUpload, value: any) => {
    const arr = [...documents]; arr[i] = { ...arr[i], [field]: value }; setDocuments(arr);
  };

  const removeDocument = (i: number) => setDocuments(p => p.filter((_, idx) => idx !== i));

  const getStepContent = (step: number) => {
    switch (step) {
      case 0: 
        return <BasicInfoStep formik={formik} />;
      case 1: 
        return (
          <SpecialtiesStep 
            formik={formik}
            addSpecialty={addSpecialty}
            removeSpecialty={removeSpecialty}
            updateSpecialty={updateSpecialty}
          />
        );
      case 2: 
        return (
          <DocumentsStep
            avatarFile={avatarFile}
            avatarPreview={avatarPreview}
            coverFile={coverFile}
            coverPreview={coverPreview}
            documents={documents}
            handleAvatarUpload={handleAvatarUpload}
            handleCoverUpload={handleCoverUpload}
            handleDocumentUpload={handleDocumentUpload}
            updateDocument={updateDocument}
            removeDocument={removeDocument}
          />
        );
      default: 
        return null;
    }
  };

  const progress = ((activeStep) / (steps.length - 1)) * 100;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '18px',
          overflow: 'hidden',
          minHeight: '72vh',
          boxShadow: '0 24px 80px rgba(0,20,80,0.18)',
        }
      }}
      TransitionComponent={Fade}
      transitionDuration={250}
    >
      {/* Header */}
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{
          background: 'linear-gradient(135deg, #00b4ff 0%, #0044cc 100%)',
          px: 3.5, pt: 3, pb: 2.5,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background decoration */}
          <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <Box sx={{ position: 'absolute', bottom: -20, right: 80, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h5" fontWeight={800} color="#fff" letterSpacing="-0.3px">
                Create New Trainer
              </Typography>
              <Typography fontSize={13} sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5 }}>
                Step {activeStep + 1} of {steps.length} · {steps[activeStep].label}
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size="small"
              sx={{ color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.12)', borderRadius: '10px', '&:hover': { background: 'rgba(255,255,255,0.22)' } }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Stepper */}
          <Box sx={{ mt: 2.5 }}>
            <Stepper activeStep={activeStep} alternativeLabel connector={<StyledConnector />}>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={(props) => <CustomStepIcon {...props} stepIndex={index} />}
                    sx={{
                      '& .MuiStepLabel-label': {
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: 500,
                        fontSize: 12,
                        mt: 0.5,
                        '&.Mui-active': { color: '#fff', fontWeight: 700 },
                        '&.Mui-completed': { color: 'rgba(255,255,255,0.85)', fontWeight: 600 },
                      }
                    }}
                  >
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Box>

        {/* Progress bar */}
        <LinearProgress variant="determinate" value={progress}
          sx={{ height: 3, background: '#e8ecf4', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #00b4ff, #0066ff)' } }}
        />
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 3.5, pt: 3, pb: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3, border: '1px solid #ffcdd2' }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2.5, borderRadius: 3, border: '1px solid #c8e6c9' }}>
            {success}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          {getStepContent(activeStep)}
        </form>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ px: 3.5, py: 2.5, background: '#fafbff', borderTop: '1.5px solid #f0f2f8' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBack sx={{ fontSize: 16 }} />}
          sx={{
            borderRadius: 10, textTransform: 'none', fontWeight: 600, color: '#6b7491',
            '&:hover': { background: '#f0f2f8' },
            '&:disabled': { color: '#c8d0e4' },
          }}
        >
          Back
        </Button>

        <Box flex={1} />

        <Box display="flex" alignItems="center" gap={1}>
          <Typography fontSize={12} color="text.secondary">
            {activeStep + 1} / {steps.length}
          </Typography>

          {activeStep === steps.length - 1 ? (
            <GradientButton
              onClick={() => formik.handleSubmit()}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} sx={{ color: 'inherit' }} /> : <CheckCircle sx={{ fontSize: 18 }} />}
            >
              {loading ? 'Creating...' : 'Create Trainer'}
            </GradientButton>
          ) : (
            <GradientButton onClick={handleNext} endIcon={<ArrowForward sx={{ fontSize: 18 }} />}>
              Next Step
            </GradientButton>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTrainerModal;