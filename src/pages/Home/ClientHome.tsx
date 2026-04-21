import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembership } from '../../hooks/useMembership';
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
import BankPaymentModal from '../../components/Payment/BankPaymentModal.tsx';
import PromoCodeModal from '../../components/Payment/PromoCodeModal.tsx';
import { toast } from 'react-toastify';
import type { ApplyPromotionResponse } from '../../@type/reward';

const ClientHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, requireAuth } = useAuth();
  const { packages, loading: membershipLoading  } = useMembership();
  const { services,  } = useGymServices();
  const { storiesData, refetchStories } = useGymStory();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [activePackageIds, setActivePackageIds] = useState<number[]>([]);
  
  // Promo state — set after PromoCodeModal confirms
  const [promoData, setPromoData] = useState<ApplyPromotionResponse | null>(null);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showBankPayment, setShowBankPayment] = useState(false);
  
  const finalAmount = promoData?.finalAmount ?? selectedPackage?.numericPrice;

  console.log('ClientHome state:', { 
    selectedPackage, 
    promoData, 
    finalAmount,
    showPromoModal,
    showBankPayment 
  });

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
    if (!requireAuth()) return;
    
    const pkg = packages.find(p => p.id === numericId);
    console.log('Package selected:', { 
      numericId, 
      pkg, 
      pkgId: pkg?.id,
      pkgPackageId: pkg?.packageId,
      allPackages: packages 
    });
    if (pkg) {
      // Create the formatted package object with numericPrice
      const formattedPackage = {
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
      };
      
      setSelectedPackage(formattedPackage);
      setPromoData(null);
      // Skip payment method selection — open promo modal directly
      setShowPromoModal(true);
    } else {
      console.error('Package not found for id:', numericId);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success('Payment successful! Your membership has been activated.');
    loadActivePackages();
    setShowBankPayment(false);
    setSelectedPackage(null);
    setPromoData(null);
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

      <PromoCodeModal
        open={showPromoModal}
        onClose={() => setShowPromoModal(false)}
        orderAmount={selectedPackage?.numericPrice ?? 0}
        serviceName={selectedPackage?.name}
        onConfirm={(promo) => {
          console.log('PromoCodeModal onConfirm:', { promo, selectedPackage });
          setPromoData(promo);
          setShowPromoModal(false);
          setShowBankPayment(true);
        }}
      />

      <BankPaymentModal
        open={showBankPayment && !!selectedPackage}
        onClose={() => setShowBankPayment(false)}
        onSuccess={handlePaymentSuccess}
        serviceName={selectedPackage?.name}
        amount={finalAmount}
        serviceId={selectedPackage?.id?.toString()}
        itemType="MEMBERSHIP"
      />
    </div>
  );
};

export default ClientHome;