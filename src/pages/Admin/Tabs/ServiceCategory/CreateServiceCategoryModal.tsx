import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  Avatar,
  Stack,
  Chip
} from '@mui/material';
import { Close, Category, Save } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  createServiceCategory,
  type CreateServiceCategoryRequest,
  DEFAULT_COLORS,
  DEFAULT_ICONS
} from '../../../../services/serviceCategoryService';

interface CreateServiceCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    transition: 'all 0.2s',
    '&:hover fieldset': {
      borderColor: '#0066ff',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 3px rgba(0,102,255,0.1)',
    },
    '& fieldset': {
      borderColor: '#e8ecf4',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0066ff',
      borderWidth: 2,
    },
  },
  '& label.Mui-focused': {
    color: '#0066ff',
  },
}));

const ColorChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  cursor: 'pointer',
  border: selected ? '3px solid #0066ff' : '2px solid transparent',
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const IconChip = styled(Avatar)<{ selected?: boolean }>(({ selected }) => ({
  width: 40,
  height: 40,
  cursor: 'pointer',
  border: selected ? '3px solid #0066ff' : '2px solid #e8ecf4',
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Z_]+$/, 'Name must be uppercase letters and underscores only')
    .required('Name is required'),
  displayName: Yup.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(200, 'Display name must be less than 200 characters')
    .required('Display name is required'),
  description: Yup.string().max(500, 'Description must be less than 500 characters'),
});

const CreateServiceCategoryModal: React.FC<CreateServiceCategoryModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_ICONS[0]);

  const formik = useFormik<CreateServiceCategoryRequest>({
    initialValues: {
      name: '',
      displayName: '',
      description: '',
      icon: DEFAULT_ICONS[0],
      color: DEFAULT_COLORS[0],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');

        const response = await createServiceCategory({
          ...values,
          icon: selectedIcon,
          color: selectedColor,
        });

        if (response.success) {
          onSuccess();
          handleClose();
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        const errorMessage =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to create service category';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setSelectedColor(DEFAULT_COLORS[0]);
    setSelectedIcon(DEFAULT_ICONS[0]);
    setError('');
    onClose();
  };

  const generateNameFromDisplayName = (displayName: string) => {
    return displayName
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .trim();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '18px',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #00b4ff 0%, #0044cc 100%)',
            px: 3,
            py: 2.5,
            position: 'relative',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                }}
              >
                <Category />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} color="#fff">
                  Create Service Category
                </Typography>
                <Typography fontSize={13} sx={{ color: 'rgba(255,255,255,0.75)' }}>
                  Add a new service category for trainers and services
                </Typography>
              </Box>
            </Stack>
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{
                color: 'rgba(255,255,255,0.85)',
                background: 'rgba(255,255,255,0.12)',
                borderRadius: '10px',
                '&:hover': { background: 'rgba(255,255,255,0.22)' },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 3, pb: 1, mt:5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Box container spacing={3}>
            <Grid item xs={12}
            sx={{mt:2, mb:2}}>
              <StyledTextField
                fullWidth
                label="Display Name"
                {...formik.getFieldProps('displayName')}
                error={formik.touched.displayName && Boolean(formik.errors.displayName)}
                helperText={formik.touched.displayName && formik.errors.displayName}
                onChange={(e) => {
                  formik.handleChange(e);
                  const generatedName = generateNameFromDisplayName(e.target.value);
                  formik.setFieldValue('name', generatedName);
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Name (System Identifier)"
                {...formik.getFieldProps('name')}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={
                  formik.touched.name && formik.errors.name
                    ? formik.errors.name
                    : 'Uppercase letters and underscores only (auto-generated)'
                }
              />
            </Grid>


                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    {...formik.getFieldProps('description')}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Grid>
            {/* Color Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Color
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {DEFAULT_COLORS.map((color) => (
                  <ColorChip
                    key={color}
                    selected={selectedColor === color}
                    sx={{ bgcolor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </Stack>
            </Grid>

            {/* Icon Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Icon
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {DEFAULT_ICONS.map((icon) => (
                  <IconChip
                    key={icon}
                    selected={selectedIcon === icon}
                    sx={{ bgcolor: selectedIcon === icon ? selectedColor : '#f5f5f5' }}
                    onClick={() => setSelectedIcon(icon)}
                  >
                    <span className="material-icons" style={{ fontSize: 20 }}>
                      {icon}
                    </span>
                  </IconChip>
                ))}
              </Stack>
            </Grid>

            {/* Preview */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Preview
              </Typography>
              <Box
                sx={{
                  p: 2,
                  border: '1px solid #e8ecf4',
                  borderRadius: 2,
                  bgcolor: '#fafbff',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: selectedColor }}>
                    <span className="material-icons">{selectedIcon}</span>
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600}>
                      {formik.values.displayName || 'Display Name'}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {formik.values.name || 'SYSTEM_NAME'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Box>
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, background: '#fafbff' }}>
        <Button onClick={handleClose} sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <Save />}
          sx={{
            background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
          }}
        >
          {loading ? 'Creating...' : 'Create Category'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateServiceCategoryModal;