// Layout
export { default as PowerGymLayout } from './Layout/PowerGymLayout';

// Navigation
export { default as TopHeader } from './Navigation/TopHeader';

// Home Page Sections
export { default as HeroBanner } from '../../pages/Home/HeroBanner/HeroBanner';
export { default as ServicesSection } from '../../pages/Home/ServicesSection/ServicesSection';
export { default as StoriesSection } from '../../pages/Home/StoriesSection/StoriesSection';
// export { default as QuickActionsSection } from './QuickActionsSection/QuickActionsSection';
export { default as MembershipStatsSection } from '../../pages/Home/MembershipStatsSection/MembershipStatsSection';
export { default as MembershipPackagesSection } from './MembershipPackagesSection/MembershipPackagesSection';

// Legacy Components (for backward compatibility)
export { default as GymStats } from './GymStats/GymStats';
// export { default as QuickActions } from './QuickActions/QuickActions';
export { default as MembershipPackages } from './MembershipPackages/MembershipPackages';

// Admin Components
export { default as AdminStats } from '../../pages/Admin/Tabs/AdminStats.tsx';
export { default as MembersList } from '../../pages/Admin/Tabs/Members/MembersList.tsx';