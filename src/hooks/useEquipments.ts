import { useState, useEffect, useCallback } from 'react';
import {type Equipment, type EquipmentCategory, equipmentService} from '../services/equipmentService';

export const useEquipments = (activeOnly: boolean = true, categoryId?: number) => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: Equipment[];
      
      if (categoryId) {
        data = activeOnly 
          ? await equipmentService.getActiveEquipmentsByCategory(categoryId)
          : await equipmentService.getEquipmentsByCategory(categoryId);
      } else {
        data = activeOnly 
          ? await equipmentService.getActiveEquipments()
          : await equipmentService.getAllEquipments();
      }
      
      setEquipments(data);
    } catch (err: any) {
      console.error('Error fetching equipments:', err);
      setError(err.response?.data?.message || 'Failed to fetch equipments');
    } finally {
      setLoading(false);
    }
  }, [activeOnly, categoryId]);

  useEffect(() => {
    fetchEquipments();
  }, [fetchEquipments]);

  const refresh = () => {
    fetchEquipments();
  };

  return {
    equipments,
    loading,
    error,
    refresh
  };
};

export const useEquipmentCategories = (activeOnly: boolean = true) => {
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = activeOnly 
        ? await equipmentService.getActiveCategories()
        : await equipmentService.getAllCategories();
      
      setCategories(data);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const refresh = () => {
    fetchCategories();
  };

  return {
    categories,
    loading,
    error,
    refresh
  };
};