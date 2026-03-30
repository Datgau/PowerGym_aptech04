import { specialtyColorMap, levelColorMap, documentTypeLabels } from './constants';

export const getSpecialtyColor = (s: string): 'primary' | 'secondary' | 'success' | 'warning' | 'info' =>
  specialtyColorMap[s] ?? 'primary';

export const getLevelColor = (s: string): 'success' | 'warning' | 'info' | 'error' =>
  levelColorMap[s] ?? 'info';

export const formatDocumentType = (t: string): string =>
  documentTypeLabels[t] ?? t;

export const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' | 'primary' => {
  switch (status) {
    case 'CONFIRMED': return 'success';
    case 'PENDING':   return 'warning';
    case 'REJECTED':  return 'error';
    case 'COMPLETED': return 'info';
    default:          return 'primary';
  }
};

export const formatTime = (timeString: string): string => {
  if (!timeString) return 'N/A';
  try {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return timeString;
  }
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};
