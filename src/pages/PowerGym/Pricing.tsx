import React from 'react';
import { CircularProgress } from '@mui/material';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout';
import MembershipPackages from '../../components/PowerGym/MembershipPackages/MembershipPackages';
import { useMembership } from '../../hooks/useMembership';
import styles from './PowerGymPages.module.css';

const Pricing: React.FC = () => {
  const { packages, loading, error, registerPackage } = useMembership();

  const handlePackageSelect = async (packageId: string) => {
    try {
      const success = await registerPackage(packageId, 'CARD');
      if (success) {
        alert('Package registration successful!');
      } else {
        alert('Package registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Package registration error:', error);
      alert('An error occurred while registering the package.');
    }
  };

  // Transform backend data to match component props
  const transformedPackages = packages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    duration: `${pkg.duration} days`,
    price: `${pkg.price.toLocaleString('vi-VN')}đ`,
    originalPrice: pkg.originalPrice ? `${pkg.originalPrice.toLocaleString('vi-VN')}đ` : undefined,
    features: pkg.features,
    isPopular: pkg.isPopular,
    color: pkg.isPopular ? '#FF4444' : '#2196F3',
    description: pkg.description
  }));

  if (loading) {
    return (
      <PowerGymLayout>
        <div className={styles.pageContainer}>
          <div className={styles.loadingContainer}>
            <CircularProgress />
            <p>Loading membership packages...</p>
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
          <h1>Pricing Policy</h1>
          <p>Choose a package that suits your needs</p>
        </div>
        
        <div className={styles.content}>
          <MembershipPackages 
            packages={transformedPackages}
            onSelectPackage={handlePackageSelect}
            loading={loading}
          />
          
          <div className={styles.section}>
            <h2>Special Offers</h2>
            <ul>
              <li>20% discount for students (with valid ID)</li>
              <li>15% discount for group registration of 3 or more people</li>
              <li>Get 1 free month when renewing 1-year package</li>
              <li>Free PT consultation for new members</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Payment Policy</h2>
            <ul>
              <li>Cash payment at counter</li>
              <li>Bank transfer</li>
              <li>Credit/debit card payment</li>
              <li>E-wallets: MoMo, ZaloPay, VNPay</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Terms of Use</h2>
            <ul>
              <li>Membership package is valid from registration date</li>
              <li>No refund after activation</li>
              <li>Can pause package for maximum 30 days (50,000 VND fee)</li>
              <li>Transfer package to others (100,000 VND fee)</li>
            </ul>
          </div>
        </div>
      </div>
    </PowerGymLayout>
  );
};

export default Pricing;