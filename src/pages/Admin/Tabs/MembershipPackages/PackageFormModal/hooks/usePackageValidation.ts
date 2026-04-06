import { useState, useCallback } from 'react';
import type { PackageFormData } from '../types';
import { VALIDATION_MESSAGES, MAX_FEATURES, MAX_NAME_LENGTH } from '../constants';

export const usePackageValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback((formData: PackageFormData): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = VALIDATION_MESSAGES.NAME_REQUIRED;
    } else if (formData.name.length > MAX_NAME_LENGTH) {
      newErrors.name = VALIDATION_MESSAGES.NAME_TOO_LONG;
    }

    if (formData.duration <= 0) {
      newErrors.duration = VALIDATION_MESSAGES.DURATION_INVALID;
    }

    if (formData.price <= 0) {
      newErrors.price = VALIDATION_MESSAGES.PRICE_INVALID;
    }

    if (formData.originalPrice && formData.originalPrice <= formData.price) {
      newErrors.originalPrice = VALIDATION_MESSAGES.ORIGINAL_PRICE_INVALID;
    }

    if (formData.discount !== undefined && (formData.discount < 0 || formData.discount > 100)) {
      newErrors.discount = VALIDATION_MESSAGES.DISCOUNT_INVALID;
    }

    const validFeatures = formData.features.filter(f => f.trim());
    if (validFeatures.length === 0) {
      newErrors.features = VALIDATION_MESSAGES.FEATURES_REQUIRED;
    } else if (validFeatures.length > MAX_FEATURES) {
      newErrors.features = VALIDATION_MESSAGES.FEATURES_TOO_MANY;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateForm,
    clearErrors
  };
};
