import React, { useState } from 'react';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout.tsx';
import styles from '../PowerGym/PowerGymPages.module.css';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  CircularProgress, Snackbar, Alert
} from '@mui/material';
import {useGymServices} from "../../hooks/useGymServices.ts";
import ServiceDetailModal from "./ServiceDetailModal.tsx";
import { registerService } from '../../services/serviceRegistrationService';
import {useAuth} from "../../services/useAuth.ts";

const Service: React.FC = () => {
  const { services } = useGymServices();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [registering, setRegistering] = useState<string | null>(null);
  const { requireAuth } = useAuth();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning"
  });

  const getServiceImage = (service: any) => {
    const firstImage = service.images?.[0] || '/images/default-service.jpg';
    return firstImage;
  };

  const handleRegister = async (serviceId: string) => {
    if (!requireAuth()) return;
    {
      try {
        setRegistering(serviceId);
        const response = await registerService({
          serviceId: parseInt(serviceId)
        });
        if (response.success) {
          setSnackbar({
            open: true,
            message: "Đăng ký thành công! Admin sẽ nhận được thông báo.",
            severity: "success"
          });
        }
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || 'Đăng ký thất bại',
          severity: "error"
        });
      } finally {
        setRegistering(null);
      }
    }
  };

  return (
      <PowerGymLayout>
        <div className={styles.pageContainer}>
          <div className={styles.pageHeader}>
            <h1>Câu lạc bộ PowerGym</h1>
            <p>Khám phá hệ thống phòng gym hiện đại nhất</p>
          </div>

          <div className={styles.content}>
            <div className={styles.section}>
              <h2>Dịch vụ & Gói tập</h2>

              <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                    gap: 3,
                    mt: 3,
                  }}
              >
                {services.map((service) => (
                    <Card
                        key={service.id}
                        sx={{
                          borderRadius: 3,
                          overflow: 'hidden',
                          transition: '0.3s',
                          opacity: service.isActive ? 1 : 0.5,
                          '&:hover': {
                            transform: 'translateY(-6px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                          },
                        }}
                    >
                      <CardMedia
                          component="img"
                          height="180"
                          image={getServiceImage(service)}
                          alt={service.name}
                          sx={{
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            }
                          }}
                      />

                      <CardContent>
                        <Typography variant="h6" fontWeight={700}>
                          {service.name}
                        </Typography>

                        <Chip
                            label={service.category}
                            size="small"
                            sx={{ my: 1 }}
                        />

                        <Typography variant="body2" color="text.secondary">
                          {service.description.length > 90
                              ? service.description.slice(0, 90) + '...'
                              : service.description}
                        </Typography>

                        <Typography fontWeight={700} sx={{ mt: 1 }}>
                          {service.price.toLocaleString()} VNĐ / {service.duration}
                        </Typography>

                        <Box display="flex" gap={1} mt={2}>
                          <Button
                              fullWidth
                              variant="outlined"
                              onClick={() => setSelectedService(service)}
                          >
                            Xem chi tiết
                          </Button>
                          <Button
                              fullWidth
                              variant="contained"
                              disabled={!service.isActive || registering === service.id}
                              onClick={() => handleRegister(service.id)}
                              sx={{
                                background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                              }}
                          >
                            {registering === service.id ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Đăng ký'
                            )}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                ))}
              </Box>
            </div>
          </div>
        </div>

        <ServiceDetailModal
            open={Boolean(selectedService)}
            service={selectedService}
            onClose={() => setSelectedService(null)}
        />
        <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
              severity={snackbar.severity}
              variant="filled"
              onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </PowerGymLayout>
  );
};

export default Service;