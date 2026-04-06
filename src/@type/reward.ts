export interface UserReward {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  totalPoints: number;
  membershipLevel: 'SILVER' | 'GOLD' | 'PLATINUM';
  membershipLevelDisplay: string;
  pointsToNextLevel: number;
  pointsValue: number;
  nextLevel: string | null;
}

export interface RewardTransaction {
  id: number;
  transactionType: 'EARN' | 'REDEEM';
  transactionTypeDisplay: string;
  points: number;
  description: string;
  createdAt: string;
  formattedDate: string;
}

export interface Promotion {
  id: number;
  code: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  backgroundImage?: string;
  type: string;
  discountPercentage?: number;
  discountAmount?: number;
  maxDiscountAmount?: number;
  minPurchaseAmount?: number;
  validFrom?: string;
  validUntil?: string;
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
  isFeatured: boolean;
  usageLimit?: number;
  usageCount: number;
}

export interface ApplyPromotionRequest {
  promotionCode: string;
  orderAmount: number;
}

export interface ApplyPromotionResponse {
  success: boolean;
  message: string;
  promotionId?: number;
  promotionCode?: string;
  promotionName?: string;
  originalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  debugInfo?: {
    isActive?: boolean;
    validFrom?: string;
    validUntil?: string;
    currentTime?: string;
    usageCount?: number;
    usageLimit?: number;
    minPurchaseAmount?: number;
    orderAmount?: number;
    failureReason?: string;
  };
}

export interface CheckoutRequest {
  itemType: 'MEMBERSHIP' | 'SERVICE' | 'TRAINER_BOOKING';
  itemId: string;
  itemName: string;
  originalAmount: number;
  promotionCode?: string;
  rewardPointsToUse?: number;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  paymentOrderId: string;
  originalAmount: number;
  promotionDiscount: number;
  rewardDiscount: number;
  finalAmount: number;
  pointsEarned: number;
  newTotalPoints: number;
  paymentUrl?: string;
  qrCodeUrl?: string;
}
