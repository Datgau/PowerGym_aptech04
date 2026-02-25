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
        alert('Đăng ký gói thành công!');
      } else {
        alert('Đăng ký gói thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Package registration error:', error);
      alert('Có lỗi xảy ra khi đăng ký gói.');
    }
  };

  // Transform backend data to match component props
  const transformedPackages = packages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    duration: `${pkg.duration} ngày`,
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
            <p>Đang tải gói membership...</p>
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
            <p>Có lỗi xảy ra: {error}</p>
          </div>
        </div>
      </PowerGymLayout>
    );
  }

  return (
    <PowerGymLayout>
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1>Chính sách giá</h1>
          <p>Chọn gói tập phù hợp với nhu cầu của bạn</p>
        </div>
        
        <div className={styles.content}>
          <MembershipPackages 
            packages={transformedPackages}
            onSelectPackage={handlePackageSelect}
            loading={loading}
          />
          
          <div className={styles.section}>
            <h2>Ưu đãi đặc biệt</h2>
            <ul>
              <li>Giảm 20% cho học sinh, sinh viên (có thẻ)</li>
              <li>Giảm 15% khi đăng ký nhóm từ 3 người trở lên</li>
              <li>Tặng 1 tháng khi gia hạn gói 1 năm</li>
              <li>Miễn phí tư vấn PT cho thành viên mới</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Chính sách thanh toán</h2>
            <ul>
              <li>Thanh toán tiền mặt tại quầy</li>
              <li>Chuyển khoản ngân hàng</li>
              <li>Thanh toán qua thẻ tín dụng/ghi nợ</li>
              <li>Ví điện tử: MoMo, ZaloPay, VNPay</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Điều khoản sử dụng</h2>
            <ul>
              <li>Gói membership có hiệu lực từ ngày đăng ký</li>
              <li>Không hoàn tiền sau khi đã kích hoạt</li>
              <li>Có thể tạm dừng gói tối đa 30 ngày (phí 50.000đ)</li>
              <li>Chuyển nhượng gói cho người khác (phí 100.000đ)</li>
            </ul>
          </div>
        </div>
      </div>
    </PowerGymLayout>
  );
};

export default Pricing;