import React from 'react';
import { Box, Container, Zoom } from '@mui/material';
import type { PackageOption } from '../../../@type/powergym';
import SectionHeader from './SectionHeader';
import PackageCard from './PackageCard';
import PackagesSkeleton from './PackagesSkeleton';
import ConfirmationDialog from './ConfirmationDialog';
import NotificationSnackbar from './NotificationSnackbar';
import { usePackageSelection } from './usePackageSelection';

interface MembershipPackagesSectionProps {
  readonly packages: readonly PackageOption[];
  readonly onSelectPackage: (packageId: string) => Promise<void>;
  readonly loading?: boolean;
}

const MembershipPackagesSection: React.FC<MembershipPackagesSectionProps> = ({
  packages,
  onSelectPackage,
  loading = false
}) => {
  const {
    selectedPackage,
    confirmDialogOpen,
    processingPackage,
    notification,
    handlePackageSelect,
    handleConfirmSelection,
    handleCloseDialog,
    handleCloseNotification
  } = usePackageSelection({ onSelectPackage });

  if (loading) {
    return (
      <Box 
        component="section" 
        sx={{
          py: { xs: 6, md: 8 },
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <PackagesSkeleton />
        </Container>
      </Box>
    );
  }

  if (packages.length === 0) {
    return null;
  }

  return (
    <Box 
      component="section" 
      sx={{
        py: { xs: 6, md: 8 },
        background: '#00b4ff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            gap: { xs: 3, md: 4 },
            justifyContent: 'center',
            maxWidth: '1200px',
            mx: 'auto'
          }}
        >
          {packages.map((pkg, index) => (
            <Zoom in timeout={500 + index * 100} key={pkg.id}>
              <div>
                <PackageCard
                  package={pkg}
                  onSelect={() => handlePackageSelect(pkg)}
                  processing={processingPackage === pkg.id}
                />
              </div>
            </Zoom>
          ))}
        </Box>
      </Container>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialogOpen}
        package={selectedPackage}
        processing={!!processingPackage}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmSelection}
      />

      {/* Notification Snackbar */}
      <NotificationSnackbar
        notification={notification}
        onClose={handleCloseNotification}
      />
    </Box>
  );
};

export default MembershipPackagesSection;