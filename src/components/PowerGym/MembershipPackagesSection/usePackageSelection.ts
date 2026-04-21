import { useState, useCallback } from 'react';
import type { PackageOption, NotificationMessage } from '../../../@type/powergym';
import {useAuth} from "../../../hooks/useAuth.ts";

interface UsePackageSelectionProps {
  onSelectPackage: (packageId: number) => Promise<void>;
}

interface UsePackageSelectionReturn {
  selectedPackage: PackageOption | null;
  confirmDialogOpen: boolean;
  processingPackage: string | null;
  notification: NotificationMessage | null;
  handlePackageSelect: (pkg: PackageOption) => Promise<void>;
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
  const { requireAuth } = useAuth();

  const handlePackageSelect = useCallback(async (pkg: PackageOption): Promise<void> => {
    if (!requireAuth()) return;
    
    try {
      setProcessingPackage(String(pkg.id));
      await onSelectPackage(Number(pkg.id));
      
      setNotification({
        id: 'package-success',
        type: 'success',
        title: 'Package selected',
        message: `${pkg.name} package selected successfully!`,
        autoHide: true,
        duration: 3000
      });
    } catch (error) {
      setNotification({
        id: 'package-error',
        type: 'error',
        title: 'Selection failed',
        message: error instanceof Error ? error.message : 'Please try again later',
        autoHide: true,
        duration: 5000
      });
    } finally {
      setProcessingPackage(null);
    }
  }, [requireAuth, onSelectPackage]);

  const handleConfirmSelection = useCallback(async (): Promise<void> => {
    // This is no longer used since we removed the confirmation dialog
    return Promise.resolve();
  }, []);

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