// PowerGym specific types and interfaces with MUI support
//
import type { SvgIconComponent } from "@mui/icons-material";
import type { AlertColor } from '@mui/material/Alert';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  category: {
    id: number;
    name: string;
    displayName: string;
    description?: string;
    icon?: string;
    color?: string;
    isActive: boolean;
    sortOrder: number;
  };
  images: string[];
  price: number;
  duration?: number;
  maxParticipants?: number;
  isActive: boolean;
  registrationCount?: number; // Số lượng người đã đăng ký
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


export interface BannerFeature {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly highlight?: boolean;
  readonly icon?: SvgIconComponent;
}


// gói hội viên
export interface PackageOption {
  readonly id: number;
  readonly packageId?: string;
  readonly name: string;
  readonly duration: string;
  readonly price: string;
  readonly numericPrice?: number;
  readonly originalPrice?: string;
  readonly features: readonly string[];
  readonly isPopular?: boolean;
  readonly color: string;
  readonly description?: string;
  readonly icon?: SvgIconComponent;
  readonly discount?: number;
}

// thông báo hệ thống
export interface NotificationMessage {
  readonly id: string;
  readonly type: AlertColor;
  readonly title: string;
  readonly message: string;
  readonly autoHide?: boolean;
  readonly duration?: number;
}
