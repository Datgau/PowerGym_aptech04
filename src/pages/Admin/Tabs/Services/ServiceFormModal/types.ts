import type { GymServiceDto } from '../../../../../services/gymService';

export interface ServiceFormData {
  name: string;
  description: string;
  categoryId: string;
  price: string;
  duration: string;
  maxParticipants: string;
  isActive: boolean;
}

export interface ServiceFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  service?: GymServiceDto | null;
  mode: 'create' | 'edit';
}

export interface ImageManagementProps {
  images: File[];
  imagePreviews: string[];
  existingImages: string[];
  deletedImages: string[];
  loading: boolean;
  imageError: string;
  mode: 'create' | 'edit';
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveNewImage: (index: number) => void;
  onDeleteExistingImage: (imageUrl: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}
