import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Alert,
    Chip,
    InputAdornment,
    FormControl, InputLabel,
    Select, MenuItem
} from '@mui/material';
import { Calculate, CalendarToday, Height, MonitorWeight, Person } from '@mui/icons-material';

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  advice: string;
}

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculateBMI = () => {
    const heightInM = parseFloat(height) / 100; // Convert cm to m
    const weightInKg = parseFloat(weight);

    if (heightInM > 0 && weightInKg > 0) {
      const bmi = weightInKg / (heightInM * heightInM);
      const bmiResult = getBMICategory(bmi);
      setResult(bmiResult);
    }
  };

  const getBMICategory = (bmi: number): BMIResult => {
    if (bmi < 18.5) {
      return {
        bmi,
        category: 'Thiếu cân',
        color: '#2196F3',
        advice: 'Bạn nên tăng cân bằng cách ăn uống đầy đủ dinh dưỡng và tập luyện phù hợp.'
      };
    } else if (bmi >= 18.5 && bmi < 25) {
      return {
        bmi,
        category: 'Bình thường',
        color: '#4CAF50',
        advice: 'Chúc mừng! Cân nặng của bạn đang ở mức lý tưởng. Hãy duy trì lối sống lành mạnh.'
      };
    } else if (bmi >= 25 && bmi < 30) {
      return {
        bmi,
        category: 'Thừa cân',
        color: '#FF9800',
        advice: 'Bạn nên giảm cân bằng cách tập luyện thường xuyên và điều chỉnh chế độ ăn uống.'
      };
    } else {
      return {
        bmi,
        category: 'Béo phì',
        color: '#F44336',
        advice: 'Bạn nên tham khảo ý kiến bác sĩ và có kế hoạch giảm cân nghiêm túc.'
      };
    }
  };

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setResult(null);
  };

  const isValidInput = height && weight && parseFloat(height) > 0 && parseFloat(weight) > 0;

  return (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Calculate sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              color: '#1976d2',
              fontSize: { xs: '1.5rem', md: '2rem' },
              mb: 1
            }}
          >
            TÍNH CHỈ SỐ BMI
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              fontSize: { xs: '0.9rem', md: '1rem' }
            }}
          >
            Kiểm tra chỉ số khối cơ thể của bạn
          </Typography>
        </Box>

        {/* Input Fields */}
          <Box sx={{ mb: 3 }}>
              {/* Tuổi */}
              <TextField
                  fullWidth
                  label="Tuổi"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                              <CalendarToday sx={{ color: '#1976d2' }} />
                          </InputAdornment>
                      )
                  }}
                  placeholder="Nhập tuổi"
                  sx={{ mb: 2 }}
              />

              {/* Giới tính */}
              <FormControl fullWidth>
                  <InputLabel>Giới tính</InputLabel>
                  <Select
                      value={gender}
                      label="Giới tính"
                      onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                      startAdornment={
                          <InputAdornment position="start">
                              <Person sx={{ color: '#1976d2', mr: 1 }} />
                          </InputAdornment>
                      }
                  >
                      <MenuItem value="male">Nam</MenuItem>
                      <MenuItem value="female">Nữ</MenuItem>
                  </Select>
              </FormControl>
          </Box>

          <Box sx={{  flex: 1 }}>
          <TextField
            fullWidth
            label="Chiều cao"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Height sx={{ color: '#1976d2' }} />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">cm</InputAdornment>,
            }}
            sx={{ mb: 2 }}
            placeholder="Nhập chiều cao (cm)"
          />

          <TextField
            fullWidth
            label="Cân nặng"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MonitorWeight sx={{ color: '#1976d2' }} />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            placeholder="Nhập cân nặng (kg)"
          />
        </Box>

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            onClick={calculateBMI}
            disabled={!isValidInput}
            sx={{
              flex: 1,
              py: 1.5,
              fontSize: { xs: '0.9rem', md: '1rem' },
              fontWeight: 600
            }}
          >
            Tính BMI
          </Button>
          <Button
            variant="outlined"
            onClick={resetCalculator}
            sx={{
              px: 3,
              py: 1.5,
              fontSize: { xs: '0.9rem', md: '1rem' }
            }}
          >
            Làm mới
          </Button>
        </Box>

        {/* Result */}
        {result && (
          <Box>
            <Alert
              severity="info"
              sx={{
                mb: 2,
                backgroundColor: `${result.color}15`,
                border: `1px solid ${result.color}30`,
                '& .MuiAlert-icon': {
                  color: result.color
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  BMI: {result.bmi.toFixed(1)}
                </Typography>
                <Chip
                  label={result.category}
                  sx={{
                    backgroundColor: result.color,
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                {result.advice}
              </Typography>
            </Alert>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default BMICalculator;