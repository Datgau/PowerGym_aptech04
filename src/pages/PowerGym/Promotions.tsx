import React from 'react';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout';
import styles from './PowerGymPages.module.css';

const Promotions: React.FC = () => {
  const promotions = [
    {
      id: 1,
      title: 'KHUYẾN MÃI TẾT 2024',
      description: 'Giảm 50% gói tập 6 tháng + Tặng 1 tháng miễn phí',
      validUntil: '29/02/2024'
    },
    {
      id: 2,
      title: 'ƯU ĐÃI SINH VIÊN',
      description: 'Giảm 30% tất cả gói tập cho sinh viên có thẻ',
      validUntil: '31/12/2024'
    },
    {
      id: 3,
      title: 'ĐĂNG KÝ NHÓM',
      description: 'Giảm 20% khi đăng ký nhóm từ 3 người trở lên',
      validUntil: '31/03/2024'
    }
  ];

  return (
    <PowerGymLayout>
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1>Khuyến mãi</h1>
          <p>Những ưu đãi hấp dẫn dành cho bạn</p>
        </div>
        
        <div className={styles.content}>
          {promotions.map((promotion) => (
            <div key={promotion.id} className={styles.promotionCard}>
              <h3>{promotion.title}</h3>
              <p>{promotion.description}</p>
              <p>Có hiệu lực đến: {promotion.validUntil}</p>
              <button className={styles.promotionButton}>
                Đăng ký ngay
              </button>
            </div>
          ))}
          
          <div className={styles.section}>
            <h2>Điều kiện áp dụng</h2>
            <ul>
              <li>Khuyến mãi không áp dụng đồng thời với các chương trình khác</li>
              <li>Ưu đãi sinh viên cần xuất trình thẻ sinh viên còn hiệu lực</li>
              <li>Đăng ký nhóm cần thanh toán cùng lúc</li>
              <li>PowerGym có quyền thay đổi điều kiện mà không cần báo trước</li>
            </ul>
          </div>
        </div>
      </div>
    </PowerGymLayout>
  );
};

export default Promotions;