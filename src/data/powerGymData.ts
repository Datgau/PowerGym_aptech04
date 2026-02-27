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
  subtitle: 'ONLY 299,000đ/MONTH',
  price: '299,000đ',
  originalPrice: '400,000đ',
  features: [
    {
      id: 'feature-1',
      title: 'Group Discount',
      description: 'Free 1 month for members when registering in groups of 5 or more.',
      highlight: true,
      icon: Groups
    },
    {
      id: 'feature-2',
      title: 'Free Usage',
      description: '02 towels/day, free filtered water, gloves, locker, shower & laundry',
      highlight: true,
      icon: DryCleaningIcon,
    },
    {
      id: 'feature-3',
      title: 'Club',
      description: 'The most modern fitness club with advanced equipment. Includes other disciplines such as Yoga, Zumba, Aerobic, Boxing...',
      highlight: true,
      icon: SportsGymnasticsIcon,

    }
  ] as const,
  ctaText: 'REGISTER NOW',
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
    name: '1 Month Package',
    duration: '30 days',
    price: '299,000đ',
    features: [
      'Unlimited training',
      'Use all equipment',
      'Join basic group classes',
      'Basic technical support'
    ] as const,
    color: '#2196F3',
    description: 'Suitable for beginners',
    icon: Star
  },
  {
    id: 'quarterly',
    name: '3 + 1 Month Package',
    duration: '120 days',
    price: '897,000đ',
    originalPrice: '1,196,000đ',
    features: [
      'Unlimited training',
      'Use all equipment',
      'Join all group classes',
      'Free PT consultation 2 sessions',
      'Periodic fitness assessment',
      'Personalized nutrition plan'
    ] as const,
    isPopular: true,
    color: '#FF4444',
    description: 'Most popular package - Save 25%',
    icon: LocalOffer,
    discount: 25
  },
  {
    id: 'yearly',
    name: '12 Month Package',
    duration: '365 days',
    price: '2,990,000đ',
    originalPrice: '3,588,000đ',
    features: [
      'All benefits of 3+1 month package',
      'Personal PT 8 sessions/month',
      'Relaxing massage 2 times/month',
      'Priority booking',
      'Join VIP events',
      'Premium member gifts'
    ] as const,
    color: '#9C27B0',
    description: 'VIP Package - Maximum savings',
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