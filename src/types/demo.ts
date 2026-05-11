export interface DemoRequest {
  // Step 1: Dealership Information
  fullName: string;
  dealershipName: string;
  email: string;
  phone: string;
  businessLocation: string;
  vehiclesManaged: string;

  // Step 2: Business Needs
  businessNeeds: string[];
  additionalNeeds: string;

  // Step 3: Demo Scheduling
  preferredDate: string;
  preferredTime: string;
  timeZone: string;
  contactMethod: 'zoom' | 'meet' | 'phone';
  additionalNotes: string;
}

export interface DemoStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface DemoFormState {
  currentStep: number;
  isSubmitting: boolean;
  isSuccess: boolean;
  errors: Record<string, string>;
  data: Partial<DemoRequest>;
}

export interface DemoTimeSlot {
  time: string;
  available: boolean;
}

export interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}
