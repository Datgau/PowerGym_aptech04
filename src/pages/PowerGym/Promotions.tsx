import React from 'react';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout';
import styles from './PowerGymPages.module.css';

const Promotions: React.FC = () => {
  const promotions = [
    {
      id: 1,
      title: 'TET 2024 PROMOTION',
      description: '50% off 6-month package + 1 free month',
      validUntil: '29/02/2024'
    },
    {
      id: 2,
      title: 'STUDENT DISCOUNT',
      description: '30% off all packages for students with valid ID',
      validUntil: '31/12/2024'
    },
    {
      id: 3,
      title: 'GROUP REGISTRATION',
      description: '20% off for group registration of 3 or more people',
      validUntil: '31/03/2024'
    }
  ];

  return (
    <PowerGymLayout>
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1>Promotions</h1>
          <p>Attractive offers for you</p>
        </div>
        
        <div className={styles.content}>
          {promotions.map((promotion) => (
            <div key={promotion.id} className={styles.promotionCard}>
              <h3>{promotion.title}</h3>
              <p>{promotion.description}</p>
              <p>Valid until: {promotion.validUntil}</p>
              <button className={styles.promotionButton}>
                Register Now
              </button>
            </div>
          ))}
          
          <div className={styles.section}>
            <h2>Terms and Conditions</h2>
            <ul>
              <li>Promotions cannot be combined with other programs</li>
              <li>Student discount requires valid student ID</li>
              <li>Group registration requires simultaneous payment</li>
              <li>PowerGym reserves the right to change terms without prior notice</li>
            </ul>
          </div>
        </div>
      </div>
    </PowerGymLayout>
  );
};

export default Promotions;