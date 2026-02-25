import { useState, useCallback } from 'react';
import type { PackageOption, NotificationMessage } from '../../../@type/powergym';

interface UsePackageSelectionProps {
  onSelectPackage: (packageId: string) => Promise<void>;
}

interface UsePackageSelectionReturn {
  selectedPackage: PackageOption | null;
  confirmDialogOpen: boolean;
  processingPackage: string | null;
  notification: NotificationMessage | null;
  handlePackageSelect: (pkg: PackageOption) => void;
  handleConfirmSelection: () => Promise<void>;
  handleCloseDialog: () => void;
  handleCloseNotification: () => void;
}

export const usePackageSelection = ({ 
  onSelectPackage 
}: UsePackageSelectionProps): UsePackageSelectionReturn => {
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [processingPackage, setProcessingPackage] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationMessage | null>(null);

  const handlePackageSelect = useCallback((pkg: PackageOption): void => {
    setSelectedPackage(pkg);
    setConfirmDialogOpen(true);
  }, []);

  const handleConfirmSelection = useCallback(async (): Promise<void> => {
    if (!selectedPackage) return;

    try {
      setProcessingPackage(selectedPackage.id);
      await onSelectPackage(selectedPackage.id);
      
      setNotification({
        id: 'package-success',
        type: 'success',
        title: 'Đăng ký thành công',
        message: `Bạn đã đăng ký gói ${selectedPackage.name} thành công!`,
        autoHide: true,
        duration: 5000
      });
      
      setConfirmDialogOpen(false);
    } catch (error) {
      setNotification({
        id: 'package-error',
        type: 'error',
        title: 'Đăng ký thất bại',
        message: error instanceof Error ? error.message : 'Vui lòng thử lại sau',
        autoHide: true,
        duration: 5000
      });
    } finally {
      setProcessingPackage(null);
    }
  }, [selectedPackage, onSelectPackage]);

  const handleCloseDialog = useCallback((): void => {
    setConfirmDialogOpen(false);
    setSelectedPackage(null);
  }, []);

  const handleCloseNotification = useCallback((): void => {
    setNotification(null);
  }, []);

  return {
    selectedPackage,
    confirmDialogOpen,
    processingPackage,
    notification,
    handlePackageSelect,
    handleConfirmSelection,
    handleCloseDialog,
    handleCloseNotification
  };
};