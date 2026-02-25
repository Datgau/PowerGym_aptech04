// PowerGym specific types and interfaces with MUI support
//
// import type { SvgIconComponent } from '@mui/icons-material';
// import type { AlertColor } from '@mui/material/Alert';

import type { SvgIconComponent } from "@mui/icons-material";

// dịch vụ của phòng gym
export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  category: 'PERSONAL_TRAINER' | 'BOXING' | 'YOGA' | 'CARDIO' | 'OTHER';
  images: string[];
  price: number;
  duration?: number;
  maxParticipants?: number;
  isActive: boolean;
}



// banner quảng cáo
export interface BannerPromotion {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly price: string;
  readonly originalPrice?: string;
  readonly features: readonly BannerFeature[];
  readonly ctaText: string;
  readonly backgroundImage: string;
  readonly isActive: boolean;
  readonly validUntil?: string;
}


// đặc điểm nổi bật trên banner
export interface BannerFeature {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly highlight?: boolean;
  readonly icon?: SvgIconComponent;
}

// nhanh hành động
// export interface QuickActionItem {
//   readonly id: string;
//   readonly title: string;
//   readonly icon: SvgIconComponent;
//   readonly path: string;
//   readonly color: string;
//   readonly requiresAuth?: boolean;
//   readonly tooltip?: string;
//   readonly badge?: number;
// }

// thành viên hiện tại
// export interface MembershipStats {
//   readonly membershipType: string;
//   readonly daysLeft: number;
//   readonly totalDays: number;
//   readonly expiryDate: string;
//   readonly isActive: boolean;
//   readonly startDate?: string;
//   readonly status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
//   readonly nextPaymentDate?: string;
// }


// gói hội viên
export interface PackageOption {
  readonly id: string;
  readonly name: string;
  readonly duration: string;
  readonly price: string;
  readonly originalPrice?: string;
  readonly features: readonly string[];
  readonly isPopular?: boolean;
  readonly color: string;
  readonly description?: string;
  readonly icon?: SvgIconComponent;
  readonly discount?: number;
}

// thông báo hệ thống
// export interface NotificationMessage {
//   readonly id: string;
//   readonly type: AlertColor;
//   readonly title: string;
//   readonly message: string;
//   readonly autoHide?: boolean;
//   readonly duration?: number;
// }

// trạng thái tải
// export interface LoadingState {
//   readonly isLoading: boolean;
//   readonly message?: string;
//   readonly progress?: number;
// }

// trạng thái lỗi
// export interface ErrorState {
//   readonly hasError: boolean;
//   readonly message?: string;
//   readonly code?: string;
//   readonly retry?: () => void;
// }