import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembership } from '../../hooks/useMembership';
import {
  MembershipPackagesSection,
  BMISection
} from '../../components/PowerGym';
import {
  bannerPromotionData,
  membershipPackagesData,
} from '../../data/powerGymData';
import globalStyles from '../../styles/PowerGym/PowerGym.module.css';
import HeroBanner from "../../components/PowerGym/HeroBanner/HeroBanner.tsx";
import ServicesSection from "../../components/PowerGym/ServicesSection/ServicesSection.tsx";
import StoriesSection from "../../components/PowerGym/StoriesSection/StoriesSection.tsx";
import {useGymServices} from "../../hooks/useGymServices.ts";
import {useGymStory} from "../../hooks/useGymStory.ts";
// Import test for debugging
import '../../utils/testApiCall';

const ClientHome: React.FC = () => {
  const navigate = useNavigate();
  const { packages, registerPackage, loading: membershipLoading  } = useMembership();
  const { services, loading: servicesLoading, error: servicesError } = useGymServices();
  const { storiesData } = useGymStory();

  // Debug logging
  React.useEffect(() => {
    console.log('ClientHome - Services loading:', servicesLoading);
    console.log('ClientHome - Services error:', servicesError);
    console.log('ClientHome - Services data:', services);
  }, [services, servicesLoading, servicesError]);


  // Event Handlers
  const handleRegisterClick = (): void => {
    navigate('/powergym/register-package');
  };


  const handleServiceClick = (serviceId: string): void => {
    const serviceRoutes: Record<string, string> = {
      'personal-trainer': '/powergym/personal-trainer',
      'yoga': '/powergym/classes/yoga',
      'group-x': '/powergym/classes/group-x',
      'cardio-more': '/powergym/services'
    };

    navigate(serviceRoutes[serviceId] || '/powergym/services');
  };

  const handleStoryClick = (storyId: string): void => {
    navigate(`/powergym/stories/${storyId}`);
  };

  const handlePackageSelect = async (packageId: string): Promise<void> => {
    try {
      const success = await registerPackage(packageId, 'CARD');

      if (success) {
        alert('Đăng ký gói thành công!');
        navigate('/powergym/membership');
      } else {
        alert('Đăng ký gói thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Package registration error:', error);
      alert('Có lỗi xảy ra khi đăng ký gói.');
    }
  };


  // Use real membership data if available, otherwise use mock data
  const availablePackages = packages.length > 0 ? packages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    duration: `${pkg.duration} ngày`,
    price: `${pkg.price.toLocaleString('vi-VN')}đ`,
    originalPrice: pkg.originalPrice ? `${pkg.originalPrice.toLocaleString('vi-VN')}đ` : undefined,
    features: pkg.features,
    isPopular: pkg.isPopular,
    color: pkg.isPopular ? '#FF4444' : '#155e9a',
    description: pkg.description
  })) : membershipPackagesData;

  return (
    <div className={`${globalStyles.container} ${globalStyles.fullWidth}`}>
      <HeroBanner
        promotion={bannerPromotionData}
        onRegisterClick={handleRegisterClick}
      />
      {/* Services Section */}
      <ServicesSection
        servicesData={services}
        onServiceClick={handleServiceClick}
      />

      {/* Stories Section */}
      <StoriesSection
        stories={storiesData}
        onStoryClick={handleStoryClick}
      />

      {/* BMI Section */}
      <BMISection />

      {/* Membership Packages Section */}
      <MembershipPackagesSection
        packages={availablePackages}
        onSelectPackage={handlePackageSelect}
        loading={membershipLoading}
      />
    </div>
  );
};

export default ClientHome;