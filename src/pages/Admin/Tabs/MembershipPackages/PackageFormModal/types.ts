import type { MembershipPackageResponse } from '../../../../../services/membershipPackageService';

export interface PackageFormData {
  packageId: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  color: string;
}

export interface PackageFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  package: MembershipPackageResponse | null;
}

export interface BasicInfoFieldsProps {
  name: string;
  description: string;
  packageId?: string;
  isEdit: boolean;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export interface PricingFieldsProps {
  duration: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  errors: Record<string, string>;
  onChange: (field: string, value: number | undefined) => void;
}

export interface FeaturesFieldsProps {
  features: string[];
  error?: string;
  onFeatureChange: (index: number, value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
}

export interface SettingsFieldsProps {
  isActive: boolean;
  isPopular: boolean;
  color: string;
  onChange: (field: string, value: boolean | string) => void;
}
