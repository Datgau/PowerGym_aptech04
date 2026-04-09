export const MAX_IMAGES = 5;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_DESCRIPTION_LENGTH = 2000;
export const MIN_EDITOR_HEIGHT = 150;

export const INITIAL_FORM_DATA = {
  name: '',
  description: '',
  categoryId: '',
  price: '',
  duration: '',
  maxParticipants: '',
  isActive: true,
  trainerPercentage: '0.30'
};

export const VALIDATION_MESSAGES = {
  NAME_REQUIRED: 'Service name is required',
  DESCRIPTION_REQUIRED: 'Description is required',
  CATEGORY_REQUIRED: 'Please select a category',
  IMAGE_REQUIRED_CREATE: 'Please upload at least one image',
  IMAGE_REQUIRED_EDIT: 'A service must have at least one image',
  CATEGORIES_LOAD_FAILED: 'Failed to load service categories',
};
