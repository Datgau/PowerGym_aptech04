import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import { Assessment, Circle } from '@mui/icons-material';

const BMIChart: React.FC = () => {
  const bmiCategories = [
    {
      range: 'Dưới 18.5',
      category: 'Thiếu cân',
      color: '#2196F3',
      description: 'Cần tăng cân để đạt mức lý tưởng'
    },
    {
      range: '18.5 - 24.9',
      category: 'Bình thường',
      color: '#4CAF50',
      description: 'Cân nặng lý tưởng, duy trì hiện tại'
    },
    {
      range: '25.0 - 29.9',
      category: 'Thừa cân',
      color: '#FF9800',
      description: 'Nên giảm cân để tránh rủi ro sức khỏe'
    },
    {
      range: '30.0 trở lên',
      category: 'Béo phì',
      color: '#F44336',
      description: 'Cần giảm cân nghiêm túc, tham khảo bác sĩ'
    }
  ];

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
      <CardContent sx={{ p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Assessment sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
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
            BẢNG CHỈ SỐ BMI
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              fontSize: { xs: '0.9rem', md: '1rem' }
            }}
          >
            Phân loại theo tiêu chuẩn WHO
          </Typography>
        </Box>

        {/* BMI Categories */}
        <Box sx={{ flex: 1 }}>
          <List sx={{ p: 0 }}>
            {bmiCategories.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  mb: 2,
                  backgroundColor: `${item.color}08`,
                  borderRadius: 2,
                  border: `1px solid ${item.color}20`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: `${item.color}15`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${item.color}30`
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Circle sx={{ color: item.color, fontSize: 16 }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '1rem', md: '1.1rem' }
                        }}
                      >
                        {item.range}
                      </Typography>
                      <Chip
                        label={item.category}
                        size="small"
                        sx={{
                          backgroundColor: item.color,
                          color: 'white',
                          fontWeight: 600,
                          fontSize: { xs: '0.7rem', md: '0.75rem' }
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#666',
                        fontSize: { xs: '0.8rem', md: '0.9rem' },
                        lineHeight: 1.4
                      }}
                    >
                      {item.description}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Image Placeholder */}
        <Box
          sx={{
            mt: 2,
            height: { xs: 120, md: 150 },
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #ddd',
            backgroundImage: 'url(/images/bmi.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >

        </Box>
      </CardContent>
    </Card>
  );
};

export default BMIChart;