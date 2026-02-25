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
} from '@mui/material';
import {useGymServices} from "../../hooks/useGymServices.ts";
import ServiceDetailModal from "./ServiceDetailModal.tsx";

const Club: React.FC = () => {
  const { services } = useGymServices();
  const [selectedService, setSelectedService] = useState<any>(null);

  // Helper function to get first image from array
  const getServiceImage = (service: any) => {
    console.log('Club - Getting image for service:', service.name, 'Images:', service.images);
    const firstImage = service.images?.[0] || '/images/default-service.jpg';
    console.log('Club - Selected image:', firstImage);
    return firstImage;
  };

  return (
      <PowerGymLayout>
        <div className={styles.pageContainer}>
          <div className={styles.pageHeader}>
            <h1>Câu lạc bộ PowerGym</h1>
            <p>Khám phá hệ thống phòng gym hiện đại nhất</p>
          </div>

          <div className={styles.content}>
            {/* GIỚI THIỆU */}
            <div className={styles.section}>
              <h2>Về PowerGym</h2>
              <p>
                PowerGym là hệ thống phòng gym hàng đầu với trang thiết bị hiện đại
                và đội ngũ huấn luyện viên chuyên nghiệp.
              </p>
            </div>

            {/* DỊCH VỤ */}
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

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2 }}
                            disabled={!service.isActive}
                            onClick={() => setSelectedService(service)}
                        >
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </Card>
                ))}
              </Box>
            </div>

            {/* CƠ SỞ VẬT CHẤT */}
            <div className={styles.section}>
              <h2>Cơ sở vật chất</h2>
              <ul>
                <li>Khu vực cardio với máy chạy bộ, xe đạp tập hiện đại</li>
                <li>Khu tập tạ với đầy đủ thiết bị</li>
                <li>Phòng tập yoga và aerobic</li>
                <li>Khu vực thư giãn và massage</li>
              </ul>
            </div>
          </div>
        </div>

        <ServiceDetailModal
            open={Boolean(selectedService)}
            service={selectedService}
            onClose={() => setSelectedService(null)}
        />
      </PowerGymLayout>
  );
};

export default Club;
