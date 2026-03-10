import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembership } from '../../hooks/useMembership';

import {
  bannerPromotionData,
  membershipPackagesData,
} from '../../data/powerGymData';
import ServicesSection from "./ServicesSection/ServicesSection.tsx";
import StoriesSection from "./StoriesSection/StoriesSection.tsx";
import {useGymServices} from "../../hooks/useGymServices.ts";
import {useGymStory} from "../../hooks/useGymStory.ts";
import BMISection from "../BMISection/BMISection.tsx";
import HeroBanner from "../../components/PowerGym/HeroBanner/HeroBanner.tsx";
import {MembershipPackagesSection} from "../../components/PowerGym";
// Import test for debugging

const ClientHome: React.FC = () => {
  const navigate = useNavigate();
  const { packages, registerPackage, loading: membershipLoading  } = useMembership();
  const { services,  } = useGymServices();
  const { storiesData, refetchStories } = useGymStory();


  // Event Handlers
  const handleRegisterClick = (): void => {
    navigate('/pricing');
  };


  const handleServiceClick = (serviceId: string): void => {
    navigate('/service/' + serviceId);
  };

  const handleStoryClick = (storyId: string): void => {
    navigate(`/stories/${storyId}`);
  };

  const handlePackageSelect = async (packageId: string): Promise<void> => {
    try {
      const success = await registerPackage(packageId, 'CARD');

      if (success) {
        alert('Package registration successful!');
        navigate('/membership');
      } else {
        alert('Package registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Package registration error:', error);
      alert('An error occurred while registering the package.');
    }
  };


  // Use real membership data if available, otherwise use mock data
  const availablePackages = packages.length > 0 ? packages.map(pkg => ({
    id: pkg.packageId, // Use packageId as string ID for compatibility
    name: pkg.name,
    duration: `${pkg.duration} days`,
    price: `${pkg.price.toLocaleString('vi-VN')}đ`,
    originalPrice: pkg.originalPrice ? `${pkg.originalPrice.toLocaleString('vi-VN')}đ` : undefined,
    features: pkg.features,
    isPopular: pkg.isPopular,
    color: pkg.color || (pkg.isPopular ? '#FF4444' : '#155e9a'),
    description: pkg.description
  })) : membershipPackagesData;

  return (
    <div >
      {/* Debug Auth Info - Remove after fixing */}

      <HeroBanner
        promotion={bannerPromotionData}
        onRegisterClick={handleRegisterClick}
      />
      {/* Equipments Section */}
      <ServicesSection
        servicesData={services}
        onServiceClick={handleServiceClick}
      />

      {/* Stories Section */}
      <StoriesSection
        stories={storiesData}
        onStoryClick={handleStoryClick}
        onStoriesUpdate={refetchStories}
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