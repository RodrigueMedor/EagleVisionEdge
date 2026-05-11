import { DemoRequest, DemoTimeSlot } from '@/types/demo';

// Mock async service functions
export const demoService = {
  // Submit demo request
  submitDemoRequest: async (data: DemoRequest): Promise<{ success: boolean; message: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock validation - in real app, this would be server-side
    if (!data.email.includes('@')) {
      throw new Error('Invalid email address');
    }

    // Mock success response
    return {
      success: true,
      message: 'Demo request submitted successfully. Our team will contact you shortly.'
    };
  },

  // Get available time slots for a date
  getAvailableTimeSlots: async (date: string): Promise<DemoTimeSlot[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock time slots - in real app, this would check availability
    const allSlots = [
      '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
    ];

    return allSlots.map(time => ({
      time,
      available: Math.random() > 0.3 // Randomly make some unavailable
    }));
  },

  // Validate demo request data
  validateDemoRequest: (data: Partial<DemoRequest>): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Step 1 validation
    if (!data.fullName?.trim()) errors.fullName = 'Full name is required';
    if (!data.dealershipName?.trim()) errors.dealershipName = 'Dealership name is required';
    if (!data.email?.trim()) errors.email = 'Email is required';
    else if (!data.email.includes('@')) errors.email = 'Please enter a valid email';
    if (!data.phone?.trim()) errors.phone = 'Phone number is required';
    if (!data.businessLocation?.trim()) errors.businessLocation = 'Business location is required';
    if (!data.vehiclesManaged?.trim()) errors.vehiclesManaged = 'Number of vehicles is required';

    // Step 2 validation
    if (!data.businessNeeds || data.businessNeeds.length === 0) {
      errors.businessNeeds = 'Please select at least one business need';
    }

    // Step 3 validation
    if (!data.preferredDate) errors.preferredDate = 'Preferred date is required';
    if (!data.preferredTime) errors.preferredTime = 'Preferred time is required';
    if (!data.timeZone) errors.timeZone = 'Time zone is required';
    if (!data.contactMethod) errors.contactMethod = 'Contact method is required';

    return errors;
  }
};
