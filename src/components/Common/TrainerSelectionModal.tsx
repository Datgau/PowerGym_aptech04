import React, { useState, useEffect } from 'react';
import { X, Star, Clock, Award, User, Phone, Mail, Calendar } from 'lucide-react';
import type { 
  TrainerAvailabilityDTO, 
  ServiceRegistrationWithTrainerSelectionResponse 
} from '../../services/enhancedServiceRegistrationService';
import enhancedServiceRegistrationService from '../../services/enhancedServiceRegistrationService';

interface TrainerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationData: ServiceRegistrationWithTrainerSelectionResponse;
  onTrainerSelected: (trainerId: number, trainerName: string) => void;
  onBookingRequested?: (registrationId: number, trainerId: number) => void;
}

const TrainerSelectionModal: React.FC<TrainerSelectionModalProps> = ({
  isOpen,
  onClose,
  registrationData,
  onTrainerSelected,
  onBookingRequested
}) => {
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerAvailabilityDTO | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedTrainer(null);
      setNotes('');
    }
  }, [isOpen]);

  const handleTrainerSelect = (trainer: TrainerAvailabilityDTO) => {
    setSelectedTrainer(trainer);
  };

  const handleAssignTrainer = async () => {
    if (!selectedTrainer) return;

    setIsAssigning(true);
    try {
      await enhancedServiceRegistrationService.assignTrainer(
        registrationData.registrationId,
        selectedTrainer.trainerId,
        notes || undefined
      );

      onTrainerSelected(selectedTrainer.trainerId, selectedTrainer.trainerName);
      
      // Optionally trigger booking flow
      if (onBookingRequested) {
        onBookingRequested(registrationData.registrationId, selectedTrainer.trainerId);
      }
      
      onClose();
    } catch (error) {
      console.error('Error assigning trainer:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsAssigning(false);
    }
  };

  const getWorkloadColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MODERATE': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'OVERLOADED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getWorkloadText = (level: string) => {
    switch (level) {
      case 'LOW': return 'Rảnh rỗi';
      case 'MODERATE': return 'Vừa phải';
      case 'HIGH': return 'Bận rộn';
      case 'OVERLOADED': return 'Quá tải';
      default: return level;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Chọn Trainer</h2>
            <p className="text-gray-600 mt-1">
              {registrationData.serviceName} - {registrationData.serviceCategory}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Trainer List */}
          <div className="flex-1 p-6 overflow-y-auto border-r">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Trainer có sẵn ({registrationData.totalAvailableTrainers})
              </h3>
              {registrationData.totalAvailableTrainers === 0 && (
                <p className="text-gray-500">Hiện tại chưa có trainer phù hợp cho dịch vụ này.</p>
              )}
            </div>

            <div className="space-y-4">
              {registrationData.availableTrainers.map((trainer) => (
                <div
                  key={trainer.trainerId}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTrainer?.trainerId === trainer.trainerId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTrainerSelect(trainer)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {trainer.trainerAvatar ? (
                        <img
                          src={trainer.trainerAvatar}
                          alt={trainer.trainerName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {trainer.trainerName}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {/* Availability Status */}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              trainer.isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {trainer.isAvailable ? 'Có sẵn' : 'Bận'}
                          </span>
                          
                          {/* Workload */}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getWorkloadColor(
                              trainer.workloadLevel
                            )}`}
                          >
                            {getWorkloadText(trainer.workloadLevel)}
                          </span>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{trainer.trainerEmail}</span>
                        </div>
                        {trainer.trainerPhone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{trainer.trainerPhone}</span>
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{trainer.rating.toFixed(1)} ({trainer.totalRatings} đánh giá)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4" />
                          <span>{trainer.completedSessions} buổi hoàn thành</span>
                        </div>
                        {trainer.totalExperienceYears && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{trainer.totalExperienceYears} năm kinh nghiệm</span>
                          </div>
                        )}
                      </div>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-2">
                        {trainer.specialties.slice(0, 3).map((specialty) => (
                          <span
                            key={specialty.id}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {specialty.specialty.displayName}
                            {specialty.experienceYears && ` (${specialty.experienceYears}y)`}
                          </span>
                        ))}
                        {trainer.specialties.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{trainer.specialties.length - 3} khác
                          </span>
                        )}
                      </div>

                      {/* Next Available */}
                      {trainer.nextAvailableSlot && (
                        <div className="mt-2 flex items-center space-x-1 text-sm text-green-600">
                          <Calendar className="w-4 h-4" />
                          <span>Có thể đặt lịch: {new Date(trainer.nextAvailableSlot).toLocaleString('vi-VN')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selection Panel */}
          <div className="w-80 p-6 bg-gray-50">
            {selectedTrainer ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Xác nhận chọn trainer
                </h3>
                
                <div className="bg-white p-4 rounded-lg mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {selectedTrainer.trainerAvatar ? (
                        <img
                          src={selectedTrainer.trainerAvatar}
                          alt={selectedTrainer.trainerName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {selectedTrainer.trainerName}
                      </h4>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{selectedTrainer.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Email:</strong> {selectedTrainer.trainerEmail}</p>
                    {selectedTrainer.trainerPhone && (
                      <p><strong>SĐT:</strong> {selectedTrainer.trainerPhone}</p>
                    )}
                    <p><strong>Kinh nghiệm:</strong> {selectedTrainer.totalExperienceYears} năm</p>
                    <p><strong>Đã hoàn thành:</strong> {selectedTrainer.completedSessions} buổi</p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Thêm ghi chú về yêu cầu đặc biệt..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleAssignTrainer}
                  disabled={isAssigning}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAssigning ? 'Đang xử lý...' : 'Chọn trainer này'}
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Chọn một trainer từ danh sách để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerSelectionModal;