import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Divider,
  Stack,
  Fade,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Person } from '@mui/icons-material';
import type {FormikProps} from "formik";
import type {CreateTrainerRequest} from "../../../../../services/trainerService.ts";

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    transition: 'box-shadow 0.2s ease',
    '&:hover fieldset': { borderColor: '#0066ff' },
    '&.Mui-focused': {
      boxShadow: '0 0 0 3px rgba(0, 102, 255, 0.1)',
    },
    '&.Mui-focused fieldset': { borderColor: '#0066ff', borderWidth: 2 },
  },
  '& label.Mui-focused': { color: '#0066ff' },
}));

interface BasicInfoStepProps {
  formik: FormikProps<CreateTrainerRequest>;
  emailCheckLoading?: boolean;
  emailError?: string;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ formik, emailCheckLoading, emailError }) => {
  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          background: "#ffffff",
          border: "1px solid #eef1f6",
          boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
        }}
      >
        {/* Header */}
        <Stack direction="row" spacing={2} alignItems="center" mb={4}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              background: "linear-gradient(135deg,#00b4ff,#0066ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,102,255,0.25)",
            }}
          >
            <Person sx={{ color: "#fff", fontSize: 22 }} />
          </Box>

          <Box>
            <Typography fontWeight={700} fontSize={17}>
              Basic Information
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              Fill in the trainer's personal details
            </Typography>
          </Box>
        </Stack>

        {/* Basic form */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 3,
          }}
        >
          <StyledTextField
            fullWidth
            label="Email *"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={(formik.touched.email && Boolean(formik.errors.email)) || Boolean(emailError)}
            helperText={
              emailError || 
              (formik.touched.email && formik.errors.email) || 
              'This email can be registered.'
            }
            InputProps={{
              endAdornment: emailCheckLoading ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null,
            }}
          />

          <StyledTextField
            fullWidth
            label="Full Name *"
            name="fullName"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
          />

          <StyledTextField
            fullWidth
            label="Phone Number *"
            name="phoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />

          <StyledTextField
            fullWidth
            label="Years of Experience"
            name="totalExperienceYears"
            type="number"
            value={formik.values.totalExperienceYears}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.totalExperienceYears &&
              Boolean(formik.errors.totalExperienceYears)
            }
            helperText={
              formik.touched.totalExperienceYears &&
              formik.errors.totalExperienceYears
            }
          />

          {/* Bio full width */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <StyledTextField
              fullWidth
              label="Bio"
              name="bio"
              multiline
              rows={3}
              value={formik.values.bio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.bio && Boolean(formik.errors.bio)}
              helperText={formik.touched.bio && formik.errors.bio}
            />
          </Box>
        </Box>

        {/* Optional section */}
        <Box mt={5} mb={2}>
          <Typography fontWeight={700} fontSize={16}>
            Optional Information
          </Typography>
          <Divider sx={{ mt: 1 }} />
        </Box>

        {/* Optional form */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 3,
          }}
        >
          <StyledTextField
            fullWidth
            label="Education"
            name="education"
            value={formik.values.education}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.education && Boolean(formik.errors.education)}
            helperText={formik.touched.education && formik.errors.education}
          />

          <StyledTextField
            fullWidth
            label="Emergency Contact"
            name="emergencyContact"
            value={formik.values.emergencyContact}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.emergencyContact &&
              Boolean(formik.errors.emergencyContact)
            }
            helperText={
              formik.touched.emergencyContact &&
              formik.errors.emergencyContact
            }
          />

          <StyledTextField
            fullWidth
            label="Emergency Phone"
            name="emergencyPhone"
            value={formik.values.emergencyPhone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.emergencyPhone &&
              Boolean(formik.errors.emergencyPhone)
            }
            helperText={
              formik.touched.emergencyPhone &&
              formik.errors.emergencyPhone
            }
          />
        </Box>
      </Box>
    </Fade>
  );
};

export default BasicInfoStep;