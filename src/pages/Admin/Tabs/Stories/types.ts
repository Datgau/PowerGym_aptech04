export type StoryStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface StoryStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface MenuAnchorState {
  [key: string]: HTMLElement | null;
}