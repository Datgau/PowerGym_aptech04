// TypeScript types and interfaces for Admin Service Registration Management
// Matches backend DTOs from PowerGymBackEnd_Aptech04

// ============================================================================
// Enums
// ============================================================================

/**
 * Registration type enum - how the registration was created
 * Matches: com.example.project_backend04.enums.RegistrationType
 */
export enum RegistrationType {
  ONLINE = 'ONLINE',
  COUNTER = 'COUNTER'
}

/**
 * Registration status enum - lifecycle status of a registration
 * Matches: com.example.project_backend04.enums.RegistrationStatus
 */
export enum RegistrationStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED'
}

/**
 * Payment status enum - status of payment for a registration
 * Matches: com.example.project_backend04.enums.PaymentStatus
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED'
}

// ============================================================================
// Nested Response Interfaces
// ============================================================================

/**
 * User response interface
 * Matches: com.example.project_backend04.dto.response.User.UserResponse
 */
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatar: string | null;
  bio: string | null;
  coverPhoto: string | null;
  createDate: string; // ISO date string
  role: {
    id: number;
    name: string;
  };
  isActive: boolean;
  dateOfBirth: string | null;
}

/**
 * Service category DTO
 * Matches: GymServiceResponse.ServiceCategoryDto
 */
export interface ServiceCategoryDto {
  id: number;
  name: string;
  displayName: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  isActive: boolean;
  sortOrder: number;
}

/**
 * Gym service response interface
 * Matches: com.example.project_backend04.dto.response.Service.GymServiceResponse
 */
export interface GymServiceResponse {
  id: number;
  name: string;
  description: string;
  category: ServiceCategoryDto;
  images: string[];
  price: number;
  duration: number | null;
  maxParticipants: number | null;
  isActive: boolean;
  registrationCount: number | null;
}

// ============================================================================
// Main Response Interfaces
// ============================================================================

/**
 * Service registration response interface
 */
export interface ServiceRegistrationResponse {
  id: number;
  user: UserResponse;
  service: GymServiceResponse;
  status: RegistrationStatus;
  notes: string | null;
  registrationDate: string;
  expirationDate: string;
  cancelledDate: string | null;
  cancellationReason: string | null;
  paymentStatus: PaymentStatus | null;
  trainerName: string | null;
  trainerId: number | null;
  registrationType: RegistrationType;
  paymentOrderId: string | null;
}

/**
 * Available trainer response interface
 */
export interface AvailableTrainerResponse {
  id: number;
  fullName: string;
  avatar: string | null;
  specialtyNames: string[];
  totalExperienceYears: number;
}

/**
 * Filter state interface for component state management
 * Used by ServiceRegistrationsGrid component
 */
export interface FilterState {
  status: RegistrationStatus | null;
  paymentStatus: PaymentStatus | null;
  registrationType: RegistrationType | null;
  searchQuery: string;
}
