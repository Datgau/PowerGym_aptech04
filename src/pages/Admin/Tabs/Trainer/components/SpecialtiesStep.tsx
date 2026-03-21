import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    IconButton,
    Chip,
    Paper,
    Tooltip,
    Fade,
    Stack,
    Divider,
    MenuItem,
    CircularProgress,
    Alert
} from "@mui/material";

import { styled, alpha } from "@mui/material/styles";
import { School, Add, Delete, FitnessCenter } from "@mui/icons-material";
import type { FormikProps } from "formik";

import {
    type CreateTrainerRequest,
    LEVELS,
    type TrainerSpecialtyRequest
} from "../../../../../services/trainerService.ts";

import { 
    getAllServiceCategoriesNoPaging,
    type ServiceCategoryResponse 
} from "../../../../../services/serviceCategoryService.ts";

import TextField from "@mui/material/TextField";

/* ───────────────── styled components ───────────────── */

const StyledTextField = styled(TextField)(() => ({
    "& .MuiOutlinedInput-root": {
        borderRadius: 10,
        transition: "all .2s",

        "&:hover fieldset": {
            borderColor: "#0066ff"
        },

        "&.Mui-focused": {
            boxShadow: "0 0 0 3px rgba(0,102,255,.1)"
        },

        "&.Mui-focused fieldset": {
            borderColor: "#0066ff",
            borderWidth: 2
        }
    },

    "& label.Mui-focused": {
        color: "#0066ff"
    }
}));

const SpecialtyCard = styled(Card)(() => ({
    borderRadius: 16,
    border: "1.5px solid #e8ecf4",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    transition: "all .2s",

    "&:hover": {
        borderColor: alpha("#0066ff", 0.35),
        boxShadow: "0 6px 24px rgba(0,102,255,0.08)"
    }
}));

/* ───────────────── component ───────────────── */

interface Props {
    formik: FormikProps<CreateTrainerRequest>;
    addSpecialty: () => void;
    removeSpecialty: (index: number) => void;
    updateSpecialty: (
        index: number,
        field: keyof TrainerSpecialtyRequest,
        value: any
    ) => void;
}

const SpecialtiesStep: React.FC<Props> = ({
                                              formik,
                                              addSpecialty,
                                              removeSpecialty,
                                              updateSpecialty
                                          }) => {
    const [categories, setCategories] = useState<ServiceCategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const response = await getAllServiceCategoriesNoPaging();
                if (response.success) {
                    setCategories(response.data);
                } else {
                    setError('Failed to load service categories');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load service categories');
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                <CircularProgress />
                <Typography ml={2}>Loading service categories...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }
    return (
        <Fade in timeout={300}>
            <Box>

                {/* HEADER */}

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                    spacing={2}
                    mb={3}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2.5,
                                background: "linear-gradient(135deg,#00b4ff22,#0066ff22)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <School sx={{ color: "#0066ff" }} />
                        </Box>

                        <Box>
                            <Typography fontWeight={700} fontSize={17}>
                                Specialties
                            </Typography>

                            <Typography fontSize={13} color="text.secondary">
                                Define trainer expertise
                            </Typography>
                        </Box>
                    </Stack>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={addSpecialty}
                        sx={{
                            background: "linear-gradient(135deg,#00b4ff,#0066ff)",
                            borderRadius: 2.5,
                            textTransform: "none",
                            fontWeight: 600,
                            px: 3,
                            height: 42
                        }}
                    >
                        Add Specialty
                    </Button>
                </Stack>

                {/* EMPTY STATE */}

                {formik.values.specialties.length === 0 ? (
                    <Paper
                        sx={{
                            border: "2px dashed #d0d7e8",
                            borderRadius: 3,
                            p: 6,
                            textAlign: "center",
                            background: "#fafbff"
                        }}
                    >
                        <FitnessCenter sx={{ fontSize: 52, color: "#c8d0e4" }} />

                        <Typography fontWeight={600} mt={1}>
                            No specialties added yet
                        </Typography>

                        <Typography fontSize={13} color="#b8bfd0">
                            Click "Add Specialty" to get started
                        </Typography>
                    </Paper>
                ) : (
                    <Stack spacing={3}>

                        {formik.values.specialties.map((specialty, index) => {
                            return (
                                <SpecialtyCard key={index}>

                                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>

                                        {/* CARD HEADER */}

                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            mb={2}
                                        >
                                            <Stack direction="row" spacing={1.5} alignItems="center">

                                                <Box
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: 2,
                                                        background:
                                                            "linear-gradient(135deg,#00b4ff,#0066ff)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <Typography fontSize={13} fontWeight={700} color="#fff">
                                                        {index + 1}
                                                    </Typography>
                                                </Box>

                                                <Typography fontWeight={700}>
                                                    Specialty #{index + 1}
                                                </Typography>

                                                {specialty.specialtyId && (
                                                    <Chip
                                                        size="small"
                                                        label={
                                                            categories.find(
                                                                c => c.id === specialty.specialtyId
                                                            )?.displayName || 'Unknown'
                                                        }
                                                        sx={{
                                                            background: alpha("#0066ff", 0.1),
                                                            color: "#0066ff"
                                                        }}
                                                    />
                                                )}
                                            </Stack>

                                            <Tooltip title="Remove specialty">
                                                <IconButton
                                                    onClick={() => removeSpecialty(index)}
                                                    sx={{
                                                        color: "#e53935",
                                                        background: "#fff0f0"
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>

                                        <Divider sx={{ mb: 2.5 }} />

                                        {/* FORM */}

                                        <Stack spacing={2}>

                                            {/* row 1 */}

                                            <Stack
                                                direction={{ xs: "column", sm: "row" }}
                                                spacing={2}
                                            >
                                                <StyledTextField
                                                    select
                                                    fullWidth
                                                    label="Specialty Type"
                                                    value={specialty.specialtyId || ''}
                                                    onChange={(e) => {
                                                        const selectedCategoryId = Number(e.target.value);
                                                        updateSpecialty(index, 'specialtyId', selectedCategoryId);
                                                    }}
                                                    error={!specialty.specialtyId || specialty.specialtyId === 0}
                                                    helperText={!specialty.specialtyId || specialty.specialtyId === 0 ? 'Please select a specialty type' : ''}
                                                >
                                                    {categories.map(category => (
                                                        <MenuItem key={category.id} value={category.id}>
                                                            {category.displayName}
                                                        </MenuItem>
                                                    ))}
                                                </StyledTextField>

                                                <StyledTextField
                                                    select
                                                    fullWidth
                                                    label="Level"
                                                    value={specialty.level || ''}
                                                    onChange={(e) => updateSpecialty(index, 'level', e.target.value)}
                                                    error={!specialty.level}
                                                    helperText={!specialty.level ? 'Level is required' : ''}
                                                >
                                                    {LEVELS.map(level => (
                                                        <MenuItem key={level.value} value={level.value}>
                                                            {level.label}
                                                        </MenuItem>
                                                    ))}
                                                </StyledTextField>
                                            </Stack>

                                            {/* row 2 */}

                                            <Stack
                                                direction={{ xs: "column", sm: "row" }}
                                                spacing={2}
                                            >
                                                <StyledTextField
                                                    fullWidth
                                                    type="number"
                                                    label="Years of Experience"
                                                    value={specialty.experienceYears || ''}
                                                    onChange={(e) => updateSpecialty(index, 'experienceYears', Number(e.target.value))}
                                                    error={specialty.experienceYears !== undefined && (specialty.experienceYears < 0 || specialty.experienceYears > 50)}
                                                    helperText={specialty.experienceYears !== undefined && (specialty.experienceYears < 0 || specialty.experienceYears > 50) ? 'Must be between 0 and 50' : ''}
                                                />

                                                <StyledTextField
                                                    fullWidth
                                                    label="Certifications"
                                                    value={specialty.certifications || ''}
                                                    onChange={(e) => updateSpecialty(index, 'certifications', e.target.value)}
                                                />
                                            </Stack>

                                            {/* row 3 */}

                                            <StyledTextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label="Description"
                                                value={specialty.description || ''}
                                                onChange={(e) => updateSpecialty(index, 'description', e.target.value)}
                                            />

                                        </Stack>

                                    </CardContent>
                                </SpecialtyCard>
                            );
                        })}
                    </Stack>
                )}
            </Box>
        </Fade>
    );
};

export default SpecialtiesStep;