// Import Receipt types and interfaces

export interface ImportReceiptItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ImportReceipt {
  id: number;
  supplierName: string;
  totalCost: number;
  notes?: string;
  createdById: number;
  createdByName: string;
  createdAt: string;
  itemCount: number;
}

export interface ImportReceiptDetail {
  id: number;
  supplierName: string;
  totalCost: number;
  notes?: string;
  createdById: number;
  createdByName: string;
  createdAt: string;
  items: ImportReceiptItem[];
}

export interface ImportReceiptItemRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreateImportReceiptRequest {
  supplierName: string;
  notes?: string;
  items: ImportReceiptItemRequest[];
}
