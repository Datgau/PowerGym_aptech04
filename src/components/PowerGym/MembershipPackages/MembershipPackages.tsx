import React from 'react';
import styles from './MembershipPackages.module.css';

interface Package {
  id: string;
  name: string;
  duration: string;
  price: string;
  originalPrice?: string;
  features: string[];
  isPopular?: boolean;
  color?: string;
}

interface MembershipPackagesProps {
  packages: Package[];
  onSelectPackage: (packageId: string) => void;
}

const MembershipPackages: React.FC<MembershipPackagesProps> = ({ packages, onSelectPackage }) => {
  return (
    <div className={styles.packagesContainer}>
      <h3 className={styles.title}>Renewal Packages</h3>
      
      <div className={styles.packagesGrid}>
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`${styles.packageCard} ${pkg.isPopular ? styles.popular : ''}`}
            style={{ '--package-color': pkg.color || '#ff4444' } as React.CSSProperties}
          >
            {pkg.isPopular && (
              <div className={styles.popularBadge}>Popular</div>
            )}
            
            <div className={styles.packageHeader}>
              <h4 className={styles.packageName}>{pkg.name}</h4>
              <div className={styles.packageDuration}>{pkg.duration}</div>
            </div>
            
            <div className={styles.packagePrice}>
              <span className={styles.price}>{pkg.price}</span>
              {pkg.originalPrice && (
                <span className={styles.originalPrice}>{pkg.originalPrice}</span>
              )}
            </div>
            
            <ul className={styles.featuresList}>
              {pkg.features.map((feature, index) => (
                <li key={index} className={styles.feature}>
                  ✓ {feature}
                </li>
              ))}
            </ul>
            
            <button
              className={styles.selectButton}
              onClick={() => onSelectPackage(pkg.id)}
            >
              Select Package
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipPackages;