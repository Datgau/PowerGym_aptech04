import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembership } from '../../hooks/useMembership';
import { useMembershipRegistrationFlow } from '../../hooks/useMembershipRegistrationFlow';
import membershipPackageService from '../../services/membershipPackageService';
import { useAuth } from '../../hooks/useAuth';

import {
  bannerPromotionData,
  membershipPackagesData,
} from '../../data/powerGymData';
import ServicesSection from "./ServicesSection/ServicesSection.tsx";
import StoriesSection from "./StoriesSection/StoriesSection.tsx";
import {useGymServices} from "../../hooks/useGymServices.ts";
import {useGymStory} from "../../hooks/useGymStory.ts";
import BMISection from "./BMISection/BMISection.tsx";
import HeroBanner from "./HeroBanner/HeroBanner.tsx";
import {MembershipPackagesSection} from "../../components/PowerGym";
import PaymentMethodSelectionModal from '../../components/Payment/PaymentMethodSelectionModal.tsx';
import BankPaymentModal from '../../components/Payment/BankPaymentModal.tsx';
import { toast } from 'react-toastify';

const ClientHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { packages, loading: membershipLoading  } = useMembership();
  const { services,  } = useGymServices();
  const { storiesData, refetchStories } = useGymStory();
  const [selectedPackage, setSelectedPackage] = React.useState<any>(null);
  const [activePackageIds, setActivePackageIds] = React.useState<number[]>([]);
  
  const flow = useMembershipRegistrationFlow(selectedPackage?.packageId);

  useEffect(() => {
    if (user?.id) {
      loadActivePackages();
    }
  }, [user?.id]);

  const loadActivePackages = async () => {
    if (!user?.id) return;
    try {
      const activeIds = await membershipPackageService.getMyActivePackages();
      setActivePackageIds(activeIds);
    } catch (error) {
      console.error('Failed to load active packages:', error);
    }
  };

  const handleRegisterClick = (): void => {
    navigate('/pricing');
  };

  const handleServiceClick = (serviceId: string): void => {
    navigate('/service/' + serviceId);
  };

  const handleStoryClick = (storyId: string): void => {
    navigate(`/stories/${storyId}`);
  };

  const handlePackageSelect = async (numericId: number): Promise<void> => {
    const pkg = packages.find(p => p.id === numericId);
    console.log('Package selected:', { 
      numericId, 
      pkg, 
      pkgId: pkg?.id,
      pkgPackageId: pkg?.packageId,
      allPackages: packages 
    });
    if (pkg) {
      setSelectedPackage(pkg);
    } else {
      console.error('Package not found for id:', numericId);
    }
  };

  useEffect(() => {
    if (selectedPackage) {
      console.log('Selected package changed, triggering payment flow:', selectedPackage);
      flow.handleRegisterNow();
    }
  }, [selectedPackage?.id]);

  const handlePaymentSuccess = () => {
    toast.success('Payment successful! Your membership has been activated.');
    navigate('/membership');
  };

  const availablePackages = packages.length > 0 ? (() => {
    const popular = packages
      .filter(pkg => pkg.isPopular)
      .sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime())
      .slice(0, 3);
    
    const normal = packages
      .filter(pkg => !pkg.isPopular)
      .sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime())
      .slice(0, 3);
    
    const finalPackages = [...popular, ...normal];
    
    return finalPackages.map(pkg => ({
      id: pkg.id,
      packageId: pkg.packageId,
      name: pkg.name,
      duration: `${pkg.duration} days`,
      price: `${pkg.price.toLocaleString('vi-VN')}đ`,
      numericPrice: pkg.price,
      originalPrice: pkg.originalPrice ? `${pkg.originalPrice.toLocaleString('vi-VN')}đ` : undefined,
      features: pkg.features,
      isPopular: pkg.isPopular,
      color: pkg.color || (pkg.isPopular ? '#FF4444' : '#155e9a'),
      description: pkg.description
    }));
  })() : membershipPackagesData;

  return (
    <div >
      <HeroBanner
        promotion={bannerPromotionData}
        onRegisterClick={handleRegisterClick}
      />

      <ServicesSection
        servicesData={services}
        onServiceClick={handleServiceClick}
      />

      <StoriesSection
        stories={storiesData}
        onStoryClick={handleStoryClick}
        onStoriesUpdate={refetchStories}
      />

      <BMISection />

      <MembershipPackagesSection
        packages={availablePackages}
        onSelectPackage={handlePackageSelect}
        loading={membershipLoading}
        activePackageIds={activePackageIds}
      />

      <PaymentMethodSelectionModal
        open={flow.showPaymentMethodSelection}
        onClose={() => flow.setShowPaymentMethodSelection(false)}
        onSelectBankTransfer={flow.handleSelectBankTransfer}
        serviceName={selectedPackage?.name}
        amount={selectedPackage?.price}
      />

      <BankPaymentModal
        open={flow.showBankPayment && !!selectedPackage}
        onClose={() => flow.setShowBankPayment(false)}
        onSuccess={() => flow.handlePaymentSuccess(handlePaymentSuccess)}
        serviceName={selectedPackage?.name}
        amount={selectedPackage?.numericPrice}
        serviceId={selectedPackage?.id?.toString()}
        itemType="MEMBERSHIP"
      />
    </div>
  );
};

export default ClientHome;