import { useState, useEffect } from 'react';
import type { MembershipPackageResponse } from '../../../../../services/membershipPackageService';
import type { PackageFormData } from '../types';
import { INITIAL_FORM_DATA } from '../constants';

export const usePackageForm = (
  packageData: MembershipPackageResponse | null,
  open: boolean
) => {
  const [formData, setFormData] = useState<PackageFormData>(INITIAL_FORM_DATA);

  useEffect(() => {
    if (packageData) {
      setFormData({
        packageId: packageData.packageId,
        name: packageData.name,
        description: packageData.description || '',
        duration: packageData.duration,
        price: packageData.price,
        originalPrice: packageData.originalPrice,
        discount: packageData.discount,
        features: packageData.features.length > 0 ? packageData.features : [''],
        isPopular: packageData.isPopular,
        isActive: packageData.isActive,
        color: packageData.color || '#1976d2'
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [packageData, open]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
  };

  return {
    formData,
    updateField,
    resetForm
  };
};
