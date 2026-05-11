import { useState, useCallback } from 'react';
import { DemoFormState, DemoRequest, DemoStep } from '@/types/demo';
import { demoService } from '@/services/demoService';

const initialFormState: DemoFormState = {
  currentStep: 1,
  isSubmitting: false,
  isSuccess: false,
  errors: {},
  data: {}
};

const steps: DemoStep[] = [
  { id: 1, title: 'Dealership Information', description: 'Tell us about your dealership', isCompleted: false, isActive: true },
  { id: 2, title: 'Business Needs', description: 'What challenges can we help with?', isCompleted: false, isActive: false },
  { id: 3, title: 'Schedule Demo', description: 'Choose your preferred time', isCompleted: false, isActive: false },
  { id: 4, title: 'Confirmation', description: 'Review and submit', isCompleted: false, isActive: false }
];

export const useDemoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<DemoFormState>(initialFormState);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setFormState(initialFormState);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setFormState(initialFormState);
  }, []);

  const updateFormData = useCallback((updates: Partial<DemoRequest>) => {
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, ...updates },
      errors: {} // Clear errors when data changes
    }));
  }, []);

  const nextStep = useCallback(() => {
    const currentStepData = steps.find(s => s.id === formState.currentStep);
    if (!currentStepData) return;

    // Validate current step
    const errors = demoService.validateDemoRequest(formState.data);

    // Filter errors for current step only
    const stepErrors: Record<string, string> = {};
    const stepFields = getStepFields(formState.currentStep);

    Object.keys(errors).forEach(field => {
      if (stepFields.includes(field)) {
        stepErrors[field] = errors[field];
      }
    });

    if (Object.keys(stepErrors).length > 0) {
      setFormState(prev => ({ ...prev, errors: stepErrors }));
      return;
    }

    // Move to next step
    if (formState.currentStep < steps.length) {
      setFormState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        errors: {}
      }));
    }
  }, [formState.currentStep, formState.data]);

  const prevStep = useCallback(() => {
    if (formState.currentStep > 1) {
      setFormState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
        errors: {}
      }));
    }
  }, [formState.currentStep]);

  const submitForm = useCallback(async () => {
    // Validate all data
    const errors = demoService.validateDemoRequest(formState.data);
    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({ ...prev, errors }));
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true, errors: {} }));

    try {
      await demoService.submitDemoRequest(formState.data as DemoRequest);
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        isSuccess: true,
        currentStep: 4
      }));
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        errors: { submit: error instanceof Error ? error.message : 'An error occurred' }
      }));
    }
  }, [formState.data]);

  const resetForm = useCallback(() => {
    setFormState(initialFormState);
  }, []);

  const getCurrentStep = useCallback(() => {
    return steps.find(s => s.id === formState.currentStep) || steps[0];
  }, [formState.currentStep]);

  const getStepsWithStatus = useCallback(() => {
    return steps.map(step => ({
      ...step,
      isCompleted: step.id < formState.currentStep,
      isActive: step.id === formState.currentStep
    }));
  }, [formState.currentStep]);

  return {
    isOpen,
    formState,
    openModal,
    closeModal,
    updateFormData,
    nextStep,
    prevStep,
    submitForm,
    resetForm,
    getCurrentStep,
    getStepsWithStatus
  };
};

// Helper function to get fields for each step
function getStepFields(step: number): string[] {
  switch (step) {
    case 1:
      return ['fullName', 'dealershipName', 'email', 'phone', 'businessLocation', 'vehiclesManaged'];
    case 2:
      return ['businessNeeds'];
    case 3:
      return ['preferredDate', 'preferredTime', 'timeZone', 'contactMethod'];
    default:
      return [];
  }
}
