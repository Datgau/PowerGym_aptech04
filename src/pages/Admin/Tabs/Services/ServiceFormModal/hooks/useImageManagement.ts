import { useState, useRef, useEffect } from 'react';
import { MAX_IMAGES, MAX_IMAGE_SIZE } from '../constants';
import type {GymServiceDto} from "../../../../../../services/gymService.ts";

export const useImageManagement = (
  service: GymServiceDto | null | undefined,
  mode: 'create' | 'edit',
  open: boolean
) => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (service && mode === 'edit') {
      setExistingImages(service.images || []);
      setDeletedImages([]);
      setImagePreviews([]);
      setImages([]);
    } else {
      setExistingImages([]);
      setDeletedImages([]);
      setImages([]);
      setImagePreviews([]);
    }
  }, [service, mode, open]);

  const getTotalImageCount = () => {
    return existingImages.length + images.length;
  };

  const canAddMoreImages = () => {
    return getTotalImageCount() < MAX_IMAGES;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of newFiles) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > MAX_IMAGE_SIZE) continue;
      if (getTotalImageCount() + validFiles.length >= MAX_IMAGES) break;

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveNewImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = (imageUrl: string) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
    setDeletedImages(prev => [...prev, imageUrl]);
  };

  const cleanupPreviews = () => {
    imagePreviews.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
  };

  const resetImages = () => {
    cleanupPreviews();
    setImages([]);
    setImagePreviews([]);
    setExistingImages([]);
    setDeletedImages([]);
  };

  return {
    images,
    imagePreviews,
    existingImages,
    deletedImages,
    fileInputRef,
    getTotalImageCount,
    canAddMoreImages,
    handleFileSelect,
    handleRemoveNewImage,
    handleDeleteExistingImage,
    resetImages
  };
};
