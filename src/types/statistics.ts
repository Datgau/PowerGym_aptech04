// Statistics types and interfaces

import { Product } from './product';

export interface TopSellingProduct {
  productId: number;
  productName: string;
  productImageUrl?: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface ProductStatistics {
  totalProducts: number;
  inStockProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  lowStockProductList: Product[];
  topSellingProducts: TopSellingProduct[];
}

export interface OrderStatistics {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  cancelledOrders: number;
  pendingDeliveries: number;
  processingDeliveries: number;
  shippedDeliveries: number;
  deliveredOrders: number;
}
