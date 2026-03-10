import React from 'react';
import TopHeader from '../Navigation/TopHeader';
import Footer from "../../Footer/Footer.tsx";

interface PowerGymLayoutProps {
  children: React.ReactNode;
}

const PowerGymLayout: React.FC<PowerGymLayoutProps> = ({ children }) => {
  return (
    <div >
      <TopHeader />
      <main >
        {children}
      </main>
      <Footer/>
    </div>
  );
};

export default PowerGymLayout;