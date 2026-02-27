import React, {  useState } from 'react';
import { CircularProgress, Chip } from '@mui/material';
import { FitnessCenter, Schedule, Group, Person } from '@mui/icons-material';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout';
import { useGymServices } from '../../hooks/useGymServices';
import styles from './PowerGymPages.module.css';

const Services: React.FC = () => {
  const { services, loading, error } = useGymServices('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { value: 'ALL', label: 'All' },
    { value: 'PERSONAL_TRAINER', label: 'Personal Trainer' },
    { value: 'GROUP_CLASS', label: 'Group Classes' },
    { value: 'YOGA', label: 'Yoga' },
    { value: 'CARDIO', label: 'Cardio' }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PERSONAL_TRAINER': return <Person />;
      case 'BOXING': return <Group />;
      case 'YOGA': return <FitnessCenter />;
      case 'CARDIO': return <Schedule />;
      default: return <FitnessCenter />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const filteredServices = selectedCategory === 'ALL' 
    ? services 
    : services.filter(service => service.category === selectedCategory);
  //
  // const getServiceSchedules = (serviceId: string) => {
  //   return schedules.filter(schedule => schedule.serviceId === serviceId);
  // };
  //
  // const handleBookClass = async (scheduleId: string) => {
  //   const success = await bookClass(scheduleId);
  //   if (success) {
  //     alert('Đặt lịch thành công!');
  //   } else {
  //     alert('Đặt lịch thất bại. Vui lòng thử lại.');
  //   }
  // };

  if (loading) {
    return (
      <PowerGymLayout>
        <div className={styles.pageContainer}>
          <div className={styles.loadingContainer}>
            <CircularProgress />
            <p>Loading services...</p>
          </div>
        </div>
      </PowerGymLayout>
    );
  }

  if (error) {
    return (
      <PowerGymLayout>
        <div className={styles.pageContainer}>
          <div className={styles.errorContainer}>
            <p>An error occurred: {error}</p>
          </div>
        </div>
      </PowerGymLayout>
    );
  }

  return (
    <PowerGymLayout>
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1>PowerGym Services</h1>
          <p>Professional training services</p>
        </div>
        
        {/* Category Filter */}
        <div className={styles.filterSection}>
          <div className={styles.categoryTabs}>
            {categories.map((category) => (
              <Chip
                key={category.value}
                label={category.label}
                onClick={() => setSelectedCategory(category.value)}
                color={selectedCategory === category.value ? 'primary' : 'default'}
                variant={selectedCategory === category.value ? 'filled' : 'outlined'}
                className={styles.categoryChip}
              />
            ))}
          </div>
        </div>
        
        <div className={styles.content}>
          {filteredServices.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No services available in this category.</p>
            </div>
          ) : (
            <div className={styles.serviceGrid}>
              {filteredServices.map((service) => {
                // const serviceSchedules = getServiceSchedules(service.id);
                
                return (
                  <div key={service.id} className={styles.serviceCard}>
                    <div className={styles.serviceHeader}>
                      <div className={styles.serviceIcon}>
                        {getCategoryIcon(service.category)}
                      </div>
                      <div className={styles.serviceInfo}>
                        <h3>{service.name}</h3>
                        <p className={styles.serviceDescription}>{service.description}</p>
                      </div>
                    </div>
                    
                    <div className={styles.serviceDetails}>
                      {service.price && (
                        <div className={styles.priceInfo}>
                          <span className={styles.price}>{formatPrice(service.price)}</span>
                          {service.duration && (
                            <span className={styles.duration}>/ {service.duration} minutes</span>
                          )}
                        </div>
                      )}
                      
                      {service.maxParticipants && (
                        <div className={styles.participantInfo}>
                          <Group fontSize="small" />
                          <span>Max {service.maxParticipants} people</span>
                        </div>
                      )}
                    </div>

                    {/* Available Schedules */}
                    {/*{serviceSchedules.length > 0 && (*/}
                    {/*  <div className={styles.scheduleSection}>*/}
                    {/*    <h4>Lịch có sẵn:</h4>*/}
                    {/*    <div className={styles.scheduleList}>*/}
                    {/*      {serviceSchedules.slice(0, 3).map((schedule) => (*/}
                    {/*        <div key={schedule.id} className={styles.scheduleItem}>*/}
                    {/*          <div className={styles.scheduleInfo}>*/}
                    {/*            <span className={styles.scheduleTime}>*/}
                    {/*              {new Date(schedule.startTime).toLocaleTimeString('vi-VN', {*/}
                    {/*                hour: '2-digit',*/}
                    {/*                minute: '2-digit'*/}
                    {/*              })}*/}
                    {/*            </span>*/}
                    {/*            <span className={styles.instructor}>{schedule.instructorName}</span>*/}
                    {/*          </div>*/}
                    {/*          <div className={styles.scheduleActions}>*/}
                    {/*            <span className={styles.availability}>*/}
                    {/*              {schedule.currentParticipants}/{schedule.maxParticipants}*/}
                    {/*            </span>*/}
                    {/*            {!schedule.isBooked && schedule.currentParticipants < schedule.maxParticipants && (*/}
                    {/*              <Button*/}
                    {/*                size="small"*/}
                    {/*                variant="outlined"*/}
                    {/*                // onClick={() => handleBookClass(schedule.id)}*/}
                    {/*                className={styles.bookButton}*/}
                    {/*              >*/}
                    {/*                Đặt lịch*/}
                    {/*              </Button>*/}
                    {/*            )}*/}
                    {/*            {schedule.isBooked && (*/}
                    {/*              <Chip label="Đã đặt" color="success" size="small" />*/}
                    {/*            )}*/}
                    {/*          </div>*/}
                    {/*        </div>*/}
                    {/*      ))}*/}
                    {/*    </div>*/}
                    {/*  </div>*/}
                    {/*)}*/}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PowerGymLayout>
  );
};

export default Services;