import React from 'react';
import TopHeader from '../Navigation/TopHeader';
import styles from './PowerGymLayout.module.css';
import {Footer} from "../../Footer";

interface PowerGymLayoutProps {
  children: React.ReactNode;
}

const PowerGymLayout: React.FC<PowerGymLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <TopHeader />
      
      <main className={styles.mainContent}>
        {children}
      </main>
      <Footer/>
    </div>
  );
};

export default PowerGymLayout;