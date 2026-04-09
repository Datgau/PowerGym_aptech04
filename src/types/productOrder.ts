// Product Order types and interfaces

export enum SaleType {
  ONLINE = 'ONLINE',
  COUNTER = 'COUNTER'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface ProductOrderItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ProductOrder {
  id: number;
  userId?: number;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  saleType: SaleType;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
}

export interface ProductOrderDetail {
  id: number;
  userId?: number;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  saleType: SaleType;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: ProductOrderItem[];
}

export interface ProductOrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateProductOrderRequest {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  saleType: SaleType;
  notes?: string;
  items: ProductOrderItemRequest[];
}

export interface UpdatePaymentStatusRequest {
  paymentStatus: PaymentStatus;
}

export interface UpdateDeliveryStatusRequest {
  deliveryStatus: DeliveryStatus;
}
