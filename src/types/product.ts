// Product types and interfaces

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  lowStockThreshold: number;
  lowStock: boolean;
  outOfStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  lowStockThreshold?: number;
}

export interface UpdateProductRequest {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  lowStockThreshold?: number;
}

export type StockStatus = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
