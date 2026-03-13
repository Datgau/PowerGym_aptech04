import {privateClient, publicClient} from "./api.ts";
import type {ApiResponse} from "../@type/apiResponse.ts";

export interface EquipmentCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createDate: string;
  updateDate: string;
}

export interface Equipment {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  isActive: boolean;
  category: EquipmentCategory;
  createDate: string;
  updateDate: string;
}

export interface CreateEquipmentDto {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
  categoryId: number;
  isActive?: boolean;
}

export interface CreateEquipmentCategoryDto {
  name: string;
  description?: string;
  isActive?: boolean;
}

class EquipmentService {
  // Equipment methods
  async getAllEquipments(): Promise<Equipment[]> {
    try {
      const response = await publicClient.get<ApiResponse<Equipment[]>>('/equipments');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching all equipments:', error);
      throw error;
    }
  }

  async getActiveEquipments(): Promise<Equipment[]> {
    try {
      const response = await publicClient.get<ApiResponse<Equipment[]>>('/equipments/active');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching active equipments:', error);
      throw error;
    }
  }

  async getEquipmentsByCategory(categoryId: number): Promise<Equipment[]> {
    try {
      const response = await publicClient.get<ApiResponse<Equipment[]>>(`/equipments/category/${categoryId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching equipments by category:', error);
      throw error;
    }
  }

  async getActiveEquipmentsByCategory(categoryId: number): Promise<Equipment[]> {
    try {
      const response = await publicClient.get<ApiResponse<Equipment[]>>(`/equipments/category/${categoryId}/active`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching active equipments by category:', error);
      throw error;
    }
  }

  async getEquipmentById(id: number): Promise<Equipment> {
    try {
      const response = await publicClient.get<ApiResponse<Equipment>>(`/equipments/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching equipment by id:', error);
      throw error;
    }
  }

  // Admin equipment methods
  async createEquipment(data: CreateEquipmentDto, imageFile?: File): Promise<Equipment> {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('price', data.price.toString());
      formData.append('quantity', data.quantity.toString());
      formData.append('categoryId', data.categoryId.toString());
      formData.append('isActive', (data.isActive ?? true).toString());
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await privateClient.post<ApiResponse<Equipment>>('/equipments/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating equipment:', error);
      throw error;
    }
  }

  async updateEquipment(id: number, data: CreateEquipmentDto, imageFile?: File): Promise<Equipment> {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('price', data.price.toString());
      formData.append('quantity', data.quantity.toString());
      formData.append('categoryId', data.categoryId.toString());
      formData.append('isActive', (data.isActive ?? true).toString());
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await privateClient.put<ApiResponse<Equipment>>(`/equipments/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating equipment:', error);
      throw error;
    }
  }

  async deleteEquipment(id: number): Promise<void> {
    try {
      await privateClient.delete<ApiResponse<void>>(`/equipments/${id}`);
    } catch (error) {
      console.error('Error deleting equipment:', error);
      throw error;
    }
  }

  // Category methods
  async getAllCategories(): Promise<EquipmentCategory[]> {
    try {
      const response = await publicClient.get<ApiResponse<EquipmentCategory[]>>('/equipment-categories');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching all categories:', error);
      throw error;
    }
  }

  async getActiveCategories(): Promise<EquipmentCategory[]> {
    try {
      const response = await publicClient.get<ApiResponse<EquipmentCategory[]>>('/equipment-categories/active');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching active categories:', error);
      throw error;
    }
  }

  async getCategoryById(id: number): Promise<EquipmentCategory> {
    try {
      const response = await publicClient.get<ApiResponse<EquipmentCategory>>(`/equipment-categories/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching category by id:', error);
      throw error;
    }
  }

  // Admin category methods
  async createCategory(data: CreateEquipmentCategoryDto): Promise<EquipmentCategory> {
    try {
      const response = await privateClient.post<ApiResponse<EquipmentCategory>>('/equipment-categories/create', data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: number, data: CreateEquipmentCategoryDto): Promise<EquipmentCategory> {
    try {
      const response = await privateClient.put<ApiResponse<EquipmentCategory>>(`/equipment-categories/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await privateClient.delete<ApiResponse<void>>(`/equipment-categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}

export const equipmentService = new EquipmentService();