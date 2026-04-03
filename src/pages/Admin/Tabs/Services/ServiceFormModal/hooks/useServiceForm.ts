import { useState, useEffect } from 'react';
import type { GymServiceDto } from '../../../../../services/gymService';
import type { ServiceFormData } from '../types';
import { INITIAL_FORM_DATA } from '../constants';

export const useServiceForm = (
  service: GymServiceDto | null | undefined,
  mode: 'create' | 'edit',
  open: boolean
) => {
  const [formData, setFormData] = useState<ServiceFormData>(INITIAL_FORM_DATA);

  useEffect(() => {
    if (service && mode === 'edit') {
      let categoryId = '';
      if (service.category) {
        if (typeof service.category === 'object' && service.category.id) {
          categoryId = service.category.id.toString();
        }
      }
      
      setFormData({
        name: service.name || '',
        description: service.description || '',
        categoryId: categoryId,
        price: service.price?.toString() || '',
        duration: service.duration?.toString() || '',
        maxParticipants: service.maxParticipants?.toString() || '',
        isActive: service.isActive ?? true
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [service, mode, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      description: value
    }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
  };

  return {
    formData,
    handleChange,
    handleDescriptionChange,
    resetForm
  };
};
