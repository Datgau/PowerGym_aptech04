import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Chip,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
} from '@mui/material';
import { Calculate, CalendarToday, Height, MonitorWeight, Person } from '@mui/icons-material';

interface BMIResult {
    bmi: number;
    category: string;
    color: string;
    advice: string;
}

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00b4ff' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1366ba', borderWidth: 2 },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#1366ba' },
};

const BMICalculator: React.FC = () => {
    const [height, setHeight] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [result, setResult] = useState<BMIResult | null>(null);

    const calculateBMI = () => {
        const heightInM = parseFloat(height) / 100;
        const weightInKg = parseFloat(weight);
        if (heightInM > 0 && weightInKg > 0) {
            setResult(getBMICategory(weightInKg / (heightInM * heightInM)));
        }
    };

    const getBMICategory = (bmi: number): BMIResult => {
        if (bmi < 18.5) return { bmi, category: 'Underweight', color: '#2196F3', advice: 'You should gain weight by eating nutritious food and exercising appropriately.' };
        if (bmi < 25) return { bmi, category: 'Normal', color: '#4CAF50', advice: 'Congratulations! Your weight is at an ideal level. Maintain a healthy lifestyle.' };
        if (bmi < 30) return { bmi, category: 'Overweight', color: '#FF9800', advice: 'You should lose weight by exercising regularly and adjusting your diet.' };
        return { bmi, category: 'Obese', color: '#F44336', advice: 'You should consult a doctor and have a serious weight loss plan.' };
    };

    const resetCalculator = () => { setHeight(''); setWeight(''); setAge(''); setGender(''); setResult(null); };

    const isValidInput = height && weight && parseFloat(height) > 0 && parseFloat(weight) > 0;

    // BMI percentage bar width (cap at ~45 for obese)
    const bmiBarWidth = result ? Math.min((result.bmi / 40) * 100, 100) : 0;

    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                background: '#fff',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(19,102,186,0.12)',
                boxShadow: '0 4px 24px rgba(19,102,186,0.08)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                // Top accent bar
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '3px',
                    background: BRAND_GRADIENT,
                    zIndex: 2,
                },
            }}
        >
            <CardContent sx={{ p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{
                        width: 48, height: 48, borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(0,180,255,0.12), rgba(19,102,186,0.12))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(0,180,255,0.2)',
                        flexShrink: 0,
                    }}>
                        <Calculate sx={{ fontSize: 26, color: '#1366ba' }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{
                            fontWeight: 800, color: '#0d1b2a',
                            fontSize: { xs: '1.2rem', md: '1.4rem' },
                            lineHeight: 1.2, letterSpacing: '-0.3px',
                        }}>
                            Calculate BMI
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888', fontSize: '0.82rem', mt: 0.3 }}>
                            Check your body mass index
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3, borderColor: 'rgba(19,102,186,0.08)' }} />

                {/* Fields */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth label="Age" type="number" value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Age"
                        InputProps={{ startAdornment: <InputAdornment position="start"><CalendarToday sx={{ color: '#1366ba', fontSize: 18 }} /></InputAdornment> }}
                        sx={inputSx}
                    />
                    <FormControl fullWidth sx={inputSx}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                            value={gender} label="Gender"
                            onChange={(e) => setGender(e.target.value as string)}
                            startAdornment={<InputAdornment position="start"><Person sx={{ color: '#1366ba', fontSize: 18, mr: 0.5 }} /></InputAdornment>}
                            sx={{ borderRadius: '10px' }}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <TextField
                    fullWidth label="Height" value={height}
                    onChange={(e) => setHeight(e.target.value)} type="number"
                    placeholder="Enter height"
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Height sx={{ color: '#1366ba', fontSize: 18 }} /></InputAdornment>,
                        endAdornment: <InputAdornment position="end"><Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>cm</Typography></InputAdornment>,
                    }}
                    sx={{ ...inputSx, mb: 2 }}
                />

                <TextField
                    fullWidth label="Weight" value={weight}
                    onChange={(e) => setWeight(e.target.value)} type="number"
                    placeholder="Enter weight"
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><MonitorWeight sx={{ color: '#1366ba', fontSize: 18 }} /></InputAdornment>,
                        endAdornment: <InputAdornment position="end"><Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>kg</Typography></InputAdornment>,
                    }}
                    sx={{ ...inputSx, mb: 3, flex: 1 }}
                />

                {/* Buttons */}
                <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                    <Button
                        variant="contained"
                        onClick={calculateBMI}
                        disabled={!isValidInput}
                        sx={{
                            flex: 1, py: 1.4,
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 700, fontSize: '0.92rem',
                            background: BRAND_GRADIENT,
                            boxShadow: '0 4px 16px rgba(4,86,104,0.3)',
                            '&:hover': { boxShadow: '0 8px 24px rgba(4,86,104,0.42)', background: BRAND_GRADIENT },
                            '&.Mui-disabled': { background: '#e0e0e0', boxShadow: 'none' },
                        }}
                    >
                        Calculate BMI
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={resetCalculator}
                        sx={{
                            px: 3, py: 1.4,
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 600, fontSize: '0.92rem',
                            borderColor: 'rgba(19,102,186,0.3)',
                            color: '#1366ba',
                            '&:hover': { borderColor: '#1366ba', background: 'rgba(19,102,186,0.05)' },
                        }}
                    >
                        Reset
                    </Button>
                </Box>

                {/* Result */}
                {result && (
                    <Box sx={{
                        p: 2.5,
                        background: `${result.color}08`,
                        borderRadius: '12px',
                        border: `1.5px solid ${result.color}30`,
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', color: '#0d1b2a', letterSpacing: '-0.5px' }}>
                                BMI <Box component="span" sx={{ color: result.color }}>{result.bmi.toFixed(1)}</Box>
                            </Typography>
                            <Chip
                                label={result.category}
                                size="small"
                                sx={{
                                    background: result.color,
                                    color: '#fff',
                                    fontWeight: 700, fontSize: '0.75rem',
                                    borderRadius: '8px',
                                    px: 0.5,
                                }}
                            />
                        </Box>

                        {/* Progress bar */}
                        <Box sx={{ mb: 1.5 }}>
                            <Box sx={{
                                height: 6, borderRadius: 3,
                                background: 'rgba(0,0,0,0.07)',
                                overflow: 'hidden',
                            }}>
                                <Box sx={{
                                    height: '100%',
                                    width: `${bmiBarWidth}%`,
                                    background: result.color,
                                    borderRadius: 3,
                                    transition: 'width 0.6s cubic-bezier(.22,.97,.44,1)',
                                }} />
                            </Box>
                        </Box>

                        <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6, fontSize: '0.85rem' }}>
                            {result.advice}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default BMICalculator;