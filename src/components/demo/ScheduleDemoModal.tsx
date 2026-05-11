import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useDemoModal } from '@/hooks/useDemoModal';
import DemoStepper from './DemoStepper';
import DemoFormStep from './DemoFormStep';
import DemoSuccessScreen from './DemoSuccessScreen';
import { CheckCircle, Loader2 } from 'lucide-react';

interface ScheduleDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleDemoModal({ isOpen, onClose }: ScheduleDemoModalProps) {
  const {
    formState,
    updateFormData,
    nextStep,
    prevStep,
    submitForm,
    resetForm,
    getCurrentStep,
    getStepsWithStatus
  } = useDemoModal();

  const handleClose = () => {
    if (!formState.isSubmitting) {
      onClose();
      resetForm();
    }
  };

  const handleSubmit = async () => {
    await submitForm();
  };

  const renderContent = () => {
    if (formState.isSuccess) {
      return <DemoSuccessScreen onClose={handleClose} />;
    }

    return (
      <div className="space-y-6">
        <DemoStepper steps={getStepsWithStatus()} />

        <DemoFormStep
          step={getCurrentStep()}
          formData={formState.data}
          errors={formState.errors}
          onUpdate={updateFormData}
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={formState.currentStep === 1 || formState.isSubmitting}
          >
            Previous
          </Button>

          <div className="flex gap-3">
            {formState.currentStep < 3 ? (
              <Button
                onClick={nextStep}
                disabled={formState.isSubmitting}
                className="min-w-[100px]"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={formState.isSubmitting}
                className="min-w-[120px] bg-primary hover:bg-primary/90"
              >
                {formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Schedule Demo
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Schedule Your Demo"
      size="lg"
    >
      {renderContent()}
    </Modal>
  );
}
