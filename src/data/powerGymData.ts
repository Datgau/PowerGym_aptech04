import type {
  // ServiceItem,
  // StoryItem,
  BannerPromotion, PackageOption,
  // QuickActionItem,
  // MembershipStats,
  // PackageOption
} from '../@type/powergym';

// MUI Icons
import {
  Groups,
  // CalendarToday,
  // Schedule,
  // Group,
  // CheckCircle,
  // QrCodeScanner,
  Star,
  LocalOffer,
  Diamond
} from '@mui/icons-material';
import DryCleaningIcon from '@mui/icons-material/DryCleaning';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
// Banner Promotion Data
export const bannerPromotionData: BannerPromotion = {
  id: 'citi-royal-x-promo',
  title: 'POWER-GYM',
  subtitle: 'CHỈ 299.000đ/THÁNG',
  price: '299.000đ',
  originalPrice: '400.000 Đ',
  features: [
    {
      id: 'feature-1',
      title: 'Ưu đãi nhóm',
      description: 'Miễn phí 1 tháng cho các thành viên khi đăng kí theo nhóm từ 5 người trở lên.',
      highlight: true,
      icon: Groups
    },
    {
      id: 'feature-2',
      title: 'Miễn phí sử dụng',
      description: '02 khăn/ngày, nước lọc miễn phí, găng tay, khóa tủ đồ, tắm giặt',
      highlight: true,
      icon: DryCleaningIcon,
    },
    {
      id: 'feature-3',
      title: 'Club ',
      description: 'Câu lạc bộ thể hình hiện đại bậc nhất với trang thiết bị tiên tiến. Đi kèm với các bộ môn khác như Yoga, Zumba, Aerobic, Boxing...',
      highlight: true,
      icon: SportsGymnasticsIcon,

    }
  ] as const,
  ctaText: 'ĐĂNG KÝ NGAY',
  backgroundImage: '/images/banner_background',
  isActive: true,
  validUntil: '2024-12-31'
} as const;

// Quick Actions Data
// export const quickActionsData: readonly QuickActionItem[] = [
//   {
//     id: 'schedule',
//     title: 'Lịch hẹn',
//     icon: CalendarToday,
//     path: '/powergym/schedule',
//     color: '#2196F3',
//     requiresAuth: true,
//     tooltip: 'Xem và đặt lịch tập với huấn luyện viên',
//     badge: 2
//   },
//   {
//     id: 'services',
//     title: 'Lịch dịch vụ',
//     icon: Schedule,
//     path: '/powergym/services',
//     color: '#4CAF50',
//     tooltip: 'Xem lịch các dịch vụ và lớp học'
//   },
//   {
//     id: 'classes',
//     title: 'Lớp cộng đồng',
//     icon: Group,
//     path: '/powergym/classes',
//     color: '#FF9800',
//     tooltip: 'Tham gia các lớp tập nhóm'
//   },
//   {
//     id: 'participation',
//     title: 'Lớp đã tham gia',
//     icon: CheckCircle,
//     path: '/powergym/my-classes',
//     color: '#9C27B0',
//     requiresAuth: true,
//     tooltip: 'Xem lịch sử các lớp đã tham gia'
//   },
//   {
//     id: 'checkin',
//     title: 'QR check-in',
//     icon: QrCodeScanner,
//     path: '/powergym/checkin',
//     color: '#FF4444',
//     requiresAuth: true,
//     tooltip: 'Quét mã QR để check-in vào phòng gym'
//   }
// ] as const;

// Membership Packages Data
export const membershipPackagesData: readonly PackageOption[] = [
  {
    id: 'monthly',
    name: 'Gói 1 tháng',
    duration: '30 ngày',
    price: '299.000đ',
    features: [
      'Tập luyện không giới hạn',
      'Sử dụng tất cả thiết bị',
      'Tham gia lớp nhóm cơ bản',
      'Hỗ trợ kỹ thuật cơ bản'
    ] as const,
    color: '#2196F3',
    description: 'Phù hợp cho người mới bắt đầu',
    icon: Star
  },
  {
    id: 'quarterly',
    name: 'Gói 3 + 1 tháng',
    duration: '120 ngày',
    price: '897.000đ',
    originalPrice: '1.196.000đ',
    features: [
      'Tập luyện không giới hạn',
      'Sử dụng tất cả thiết bị',
      'Tham gia tất cả lớp nhóm',
      'Tư vấn PT miễn phí 2 buổi',
      'Đánh giá thể trạng định kỳ',
      'Chế độ dinh dưỡng cá nhân hóa'
    ] as const,
    isPopular: true,
    color: '#FF4444',
    description: 'Gói phổ biến nhất - Tiết kiệm 25%',
    icon: LocalOffer,
    discount: 25
  },
  {
    id: 'yearly',
    name: 'Gói 12 tháng',
    duration: '365 ngày',
    price: '2.990.000đ',
    originalPrice: '3.588.000đ',
    features: [
      'Tất cả quyền lợi gói 3+1 tháng',
      'PT cá nhân 8 buổi/tháng',
      'Massage thư giãn 2 lần/tháng',
      'Ưu tiên đặt lịch tập',
      'Tham gia sự kiện VIP',
      'Quà tặng thành viên cao cấp'
    ] as const,
    color: '#9C27B0',
    description: 'Gói VIP - Tiết kiệm tối đa',
    icon: Diamond,
    discount: 17
  }
] as const;

// Mock Membership Stats
// export const mockMembershipStats: MembershipStats = {
//   membershipType: 'Gói 3 + 1 tháng',
//   daysLeft: 85,
//   totalDays: 120,
//   expiryDate: '2024-05-15',
//   startDate: '2024-01-15',
//   isActive: true,
//   status: 'ACTIVE',
//   nextPaymentDate: '2024-05-15'
// } as const;