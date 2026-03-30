import type { TrainerResponse } from '../../../../../services/trainerService';
import type {
  TrainerScheduleResponse,
  TrainerBookingInfo,
  TrainerStatisticsResponse,
} from '../../../../../services/trainerManagementService';

export interface TrainerDetailModalProps {
  open: boolean;
  onClose: () => void;
  trainerId: number | null;
}

export interface TrainerDetailState {
  trainer: TrainerResponse | null;
  loading: boolean;
  error: string;
  activeTab: number;
  schedule: TrainerScheduleResponse | null;
  pendingRequests: TrainerBookingInfo[];
  statistics: TrainerStatisticsResponse | null;
  loadingSchedule: boolean;
  loadingRequests: boolean;
  loadingStats: boolean;
}
