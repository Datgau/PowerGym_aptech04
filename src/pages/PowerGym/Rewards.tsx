import React from 'react';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout';
import styles from './PowerGymPages.module.css';

const Rewards: React.FC = () => {
  return (
    <PowerGymLayout>
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1>PowerRewards</h1>
          <p>Chương trình tích điểm thành viên</p>
        </div>
        
        <div className={styles.content}>
          <div className={styles.section}>
            <h2>Cách thức hoạt động</h2>
            <p>PowerRewards là chương trình tích điểm dành cho thành viên PowerGym. Mỗi lần check-in tập luyện, bạn sẽ được tích điểm và có thể đổi những phần quà hấp dẫn.</p>
          </div>
          
          <div className={styles.serviceGrid}>
            <div className={styles.serviceCard}>
              <h3>Tích điểm</h3>
              <p>Mỗi lần check-in = 10 điểm<br/>Tham gia lớp nhóm = 15 điểm<br/>Giới thiệu bạn bè = 100 điểm</p>
            </div>
            
            <div className={styles.serviceCard}>
              <h3>Đổi quà</h3>
              <p>500 điểm = 1 buổi PT miễn phí<br/>1000 điểm = Áo thun PowerGym<br/>2000 điểm = 1 tháng tập miễn phí</p>
            </div>
            
            <div className={styles.serviceCard}>
              <h3>Hạng thành viên</h3>
              <p>Bronze: 0-999 điểm<br/>Silver: 1000-2999 điểm<br/>Gold: 3000+ điểm</p>
            </div>
            
            <div className={styles.serviceCard}>
              <h3>Ưu đãi đặc biệt</h3>
              <p>Thành viên Gold được giảm 10% tất cả dịch vụ và ưu tiên đặt lịch PT</p>
            </div>
          </div>
          
          <div className={styles.section}>
            <h2>Quà tặng hiện có</h2>
            <ul>
              <li>Áo thun PowerGym (1000 điểm)</li>
              <li>Bình nước thể thao (800 điểm)</li>
              <li>Khăn tập PowerGym (600 điểm)</li>
              <li>1 buổi PT miễn phí (500 điểm)</li>
              <li>1 tuần tập miễn phí (1500 điểm)</li>
              <li>1 tháng tập miễn phí (2000 điểm)</li>
            </ul>
          </div>
        </div>
      </div>
    </PowerGymLayout>
  );
};

export default Rewards;