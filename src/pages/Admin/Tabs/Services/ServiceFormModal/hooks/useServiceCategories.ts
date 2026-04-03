import { useState, useEffect } from 'react';
import { VALIDATION_MESSAGES } from '../constants';
import {
  getAllServiceCategoriesNoPaging,
  type ServiceCategoryResponse
} from "../../../../../../services/serviceCategoryService.ts";

export const useServiceCategories = (open: boolean) => {
  const [categories, setCategories] = useState<ServiceCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      if (!open) return;
      
      try {
        setLoading(true);
        const response = await getAllServiceCategoriesNoPaging();
        if (response.success) {
          setCategories(response.data);
          setError('');
        } else {
          setError(VALIDATION_MESSAGES.CATEGORIES_LOAD_FAILED);
        }
      } catch (err: any) {
        setError(err.message || VALIDATION_MESSAGES.CATEGORIES_LOAD_FAILED);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [open]);

  return { categories, loading, error };
};
