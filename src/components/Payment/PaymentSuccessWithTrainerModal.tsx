import React, { useState, useEffect } from 'react';
import { X, CheckCircle, User, Calendar, ArrowRight } from 'lucide-react';
import type { PaymentWithTrainerSelectionResponse } from '../../services/paymentService';
import TrainerSelectionModal from '../Common/TrainerSelectionModal';
import type { ServiceRegistrationWithTrainerSelectionResponse } from '../../services/enhancedServiceRegistrationService';

interface PaymentSuccessWithTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: PaymentWithTrainerSelectionResponse;
  onAllTrainersSelected?: () => void;
}

const PaymentSuccessWithTrainerModal: React.FC<PaymentSuccessWithTrainerModalProps> = ({
  isOpen,
  onClose,
  paymentData,
  onAllTrainersSelected
}) => {
  const [currentStep, setCurrentStep] = useState<'success' | 'trainer-selection'>('success');
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [completedServices, setCompletedServices] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('success');
      setSelectedServiceIndex(0);
      setCompletedServices(new Set());
    }
  }, [isOpen]);

  const handleStartTrainerSelection = () => {
    if (paymentData.needsTrainerSelection && paymentData.serviceRegistrations.length > 0) {
      setCurrentStep('trainer-selection');
    }
  };

  const handleTrainerSelected = (trainerId: number, trainerName: string) => {
    const currentRegistration = paymentData.serviceRegistrations[selectedServiceIndex];
    setCompletedServices(prev => new Set([...prev, currentRegistration.registrationId]));
    
    // Move to next service or complete
    const nextIndex = selectedServiceIndex + 1;
    if (nextIndex < paymentData.serviceRegistrations.length) {
      // Find next service that needs trainer selection
      const nextServiceNeedingTrainer = paymentData.serviceRegistrations
        .slice(nextIndex)
        .findIndex(service => !service.hasSelectedTrainer && !service.hasActiveBooking);
      
      if (nextServiceNeedingTrainer !== -1) {
        setSelectedServiceIndex(nextIndex + nextServiceNeedingTrainer);
      } else {
        // All services have trainers selected
        setCurrentStep('success');
        if (onAllTrainersSelected) {
          onAllTrainersSelected();
        }
      }
    } else {
      // All services processed
      setCurrentStep('success');
      if (onAllTrainersSelected) {
        onAllTrainersSelected();
      }
    }
  };

  const handleSkipService = () => {
    const nextIndex = selectedServiceIndex + 1;
    if (nextIndex < paymentData.serviceRegistrations.length) {
      setSelectedServiceIndex(nextIndex);
    } else {
      setCurrentStep('success');
    }
  };

  const getNextActionText = () => {
    switch (paymentData.nextAction) {
      case 'SELECT_TRAINER':
        return 'Chọn trainer cho dịch vụ';
      case 'BOOK_SESSION':
        return 'Đặt lịch với trainer';
      case 'COMPLETE':
        return 'Hoàn tất';
      default:
        return 'Tiếp tục';
    }
  };

  const servicesNeedingTrainer = paymentData.serviceRegistrations.filter(
    service => !service.hasSelectedTrainer && !service.hasActiveBooking
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {currentStep === 'success' && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Thanh toán thành công!</h2>
                    <p className="text-gray-600">Đơn hàng #{paymentData.orderId}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Payment Summary */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Số tiền đã thanh toán:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {paymentData.amount.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Phương thức: {paymentData.paymentMethod}</span>
                    <span>Thời gian: {new Date(paymentData.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>

                {/* Service Registrations */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Dịch vụ đã đăng ký ({paymentData.totalRegistrations})
                  </h3>
                  
                  <div className="space-y-4">
                    {paymentData.serviceRegistrations.map((service, index) => (
                      <div
                        key={service.registrationId}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {service.serviceName}
                            </h4>
                            <p className="text-gray-600 text-sm mb-2">
                              {service.serviceCategory} - {service.servicePrice.toLocaleString('vi-VN')} VNĐ
                            </p>
                            
                            {/* Trainer Status */}
                            <div className="flex items-center space-x-2">
                              {service.hasSelectedTrainer ? (
                                <div className="flex items-center space-x-2 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm">
                                    Đã chọn trainer: {service.selectedTrainerName}
                                  </span>
                                </div>
                              ) : service.hasActiveBooking ? (
                                <div className="flex items-center space-x-2 text-blue-600">
                                  <Calendar className="w-4 h-4" />
                                  <span className="text-sm">Đã có lịch hẹn</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2 text-orange-600">
                                  <User className="w-4 h-4" />
                                  <span className="text-sm">Cần chọn trainer</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {completedServices.has(service.registrationId) && (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workflow Message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Bước tiếp theo</h4>
                  <p className="text-blue-800 text-sm">
                    {paymentData.needsTrainerSelection
                      ? `Bạn cần chọn trainer cho ${paymentData.registrationsNeedingTrainer} dịch vụ để có thể đặt lịch tập luyện.`
                      : 'Tất cả dịch vụ đã sẵn sàng. Bạn có thể đặt lịch với trainer ngay bây giờ.'}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t bg-gray-50">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Đóng
                </button>
                
                {paymentData.needsTrainerSelection && servicesNeedingTrainer.length > 0 && (
                  <button
                    onClick={handleStartTrainerSelection}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>{getNextActionText()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Trainer Selection Modal */}
      {currentStep === 'trainer-selection' && 
       selectedServiceIndex < paymentData.serviceRegistrations.length && (
        <TrainerSelectionModal
          isOpen={true}
          onClose={() => setCurrentStep('success')}
          registrationData={paymentData.serviceRegistrations[selectedServiceIndex]}
          onTrainerSelected={handleTrainerSelected}
        />
      )}
    </>
  );
};

export default PaymentSuccessWithTrainerModal;