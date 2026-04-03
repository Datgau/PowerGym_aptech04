export const PRESET_COLORS = [
  '#1976d2', '#2196F3', '#FF4444', '#FF6B6B', 
  '#4ECDC4', '#FFD93D', '#6BCF7F', '#9B59B6'
];

export const INITIAL_FORM_DATA = {
  packageId: '',
  name: '',
  description: '',
  duration: 30,
  price: 0,
  originalPrice: undefined,
  discount: undefined,
  features: [''],
  isPopular: false,
  isActive: true,
  color: '#1976d2'
};

export const VALIDATION_MESSAGES = {
  NAME_REQUIRED: 'Package name is required',
  NAME_TOO_LONG: 'Package name must not exceed 100 characters',
  DURATION_INVALID: 'Duration must be greater than 0',
  PRICE_INVALID: 'Price must be greater than 0',
  ORIGINAL_PRICE_INVALID: 'Original price must be greater than current price',
  DISCOUNT_INVALID: 'Discount must be between 0 and 100',
  FEATURES_REQUIRED: 'At least one feature is required',
  FEATURES_TOO_MANY: 'Maximum 20 features allowed'
};

export const MAX_FEATURES = 20;
export const MAX_NAME_LENGTH = 100;
