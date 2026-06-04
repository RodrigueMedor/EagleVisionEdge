import React, { useState, useEffect } from 'react';
import { DemoStep, DemoRequest, DemoTimeSlot } from '@/types/demo';
import { demoService } from '@/services/demoService';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Clock, Video, Monitor, Phone as PhoneIcon } from 'lucide-react';

interface DemoFormStepProps {
  step: DemoStep;
  formData: Partial<DemoRequest>;
  errors: Record<string, string>;
  onUpdate: (updates: Partial<DemoRequest>) => void;
}

const businessNeedsOptions = [
  { value: 'inventory-management', label: 'Inventory Management' },
  { value: 'dealer-website', label: 'Dealer Website' },
  { value: 'crm', label: 'CRM' },
  { value: 'financing-system', label: 'Financing System' },
  { value: 'rental-management', label: 'Rental Management' },
  { value: 'ai-automation', label: 'AI Automation' },
  { value: 'lead-management', label: 'Lead Management' },
  { value: 'marketplace-integration', label: 'Marketplace Integration' }
];

const timeZoneOptions = [
  { value: 'EST', label: 'Eastern Time (EST)' },
  { value: 'CST', label: 'Central Time (CST)' },
  { value: 'MST', label: 'Mountain Time (MST)' },
  { value: 'PST', label: 'Pacific Time (PST)' },
  { value: 'AKT', label: 'Alaska Time (AKT)' },
  { value: 'HST', label: 'Hawaii Time (HST)' }
];

const contactMethodOptions = [
  { value: 'zoom', label: 'Zoom', icon: Video },
  { value: 'meet', label: 'Google Meet', icon: Monitor },
  { value: 'phone', label: 'Phone Call', icon: PhoneIcon }
];

export default function DemoFormStep({ step, formData, errors, onUpdate }: DemoFormStepProps) {
  const [availableSlots, setAvailableSlots] = useState<DemoTimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Load available time slots when date changes
  useEffect(() => {
    if (step.id === 3 && formData.preferredDate) {
      loadTimeSlots(formData.preferredDate);
    }
  }, [step.id, formData.preferredDate]);

  const loadTimeSlots = async (date: string) => {
    setLoadingSlots(true);
    try {
      const slots = await demoService.getAvailableTimeSlots(date);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Failed to load time slots:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleInputChange = (field: keyof DemoRequest, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onUpdate({ [field]: event.target.value });
  };

  const handleCheckboxChange = (need: string, checked: boolean) => {
    const currentNeeds = formData.businessNeeds || [];
    const updatedNeeds = checked
      ? [...currentNeeds, need]
      : currentNeeds.filter(n => n !== need);
    onUpdate({ businessNeeds: updatedNeeds });
  };

  return (
    <div>
      {step.id === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">Tell us about your dealership</h3>
            <p className="text-gray-600">We'll use this information to customize your demo experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.fullName || ''}
              onChange={(e) => handleInputChange('fullName', e)}
              error={errors.fullName}
              placeholder="John Smith"
              required
            />

            <Input
              label="Dealership Name"
              value={formData.dealershipName || ''}
              onChange={(e) => handleInputChange('dealershipName', e)}
              error={errors.dealershipName}
              placeholder="ABC Auto Sales"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e)}
              error={errors.email}
              placeholder="john@abcauto.com"
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e)}
              error={errors.phone}
              placeholder="(555) 123-4567"
              required
            />

            <Input
              label="Business Location"
              value={formData.businessLocation || ''}
              onChange={(e) => handleInputChange('businessLocation', e)}
              error={errors.businessLocation}
              placeholder="City, State"
              required
              className="md:col-span-2"
            />

            <Select
              label="Number of Vehicles Managed"
              value={formData.vehiclesManaged || ''}
              onChange={(e) => handleInputChange('vehiclesManaged', e)}
              error={errors.vehiclesManaged}
              options={[
                { value: '1-50', label: '1-50 vehicles' },
                { value: '51-200', label: '51-200 vehicles' },
                { value: '201-500', label: '201-500 vehicles' },
                { value: '500+', label: '500+ vehicles' }
              ]}
              required
            />
          </div>
        </div>
      )}

      {step.id === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">What challenges can we help with?</h3>
            <p className="text-gray-600">Select all that apply to customize your demo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {businessNeedsOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={(formData.businessNeeds || []).includes(option.value)}
                  onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>

          {errors.businessNeeds && (
            <p className="text-red-500 text-sm">{errors.businessNeeds}</p>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tell us about your dealership needs <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={formData.additionalNeeds || ''}
              onChange={(e) => handleInputChange('additionalNeeds', e)}
              placeholder="Describe any specific challenges or goals you'd like to discuss..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={4}
            />
          </div>
        </div>
      )}

      {step.id === 3 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">Choose your preferred time</h3>
            <p className="text-gray-600">We'll send a calendar invite with the meeting details</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.preferredDate || ''}
                onChange={(e) => handleInputChange('preferredDate', e)}
                error={errors.preferredDate}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <Select
              label="Time Zone"
              value={formData.timeZone || ''}
              onChange={(e) => handleInputChange('timeZone', e)}
              error={errors.timeZone}
              options={timeZoneOptions}
              required
            />
          </div>

          {formData.preferredDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available Times <span className="text-red-500">*</span>
              </label>
              {loadingSlots ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => onUpdate({ preferredTime: slot.time })}
                      className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                        formData.preferredTime === slot.time
                          ? 'border-primary bg-primary text-white'
                          : slot.available
                          ? 'border-gray-300 hover:border-primary hover:bg-primary/5'
                          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Clock className="w-4 h-4 inline mr-2" />
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
              {errors.preferredTime && (
                <p className="text-red-500 text-sm mt-2">{errors.preferredTime}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preferred Contact Method <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {contactMethodOptions.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => onUpdate({ contactMethod: method.value as any })}
                    className={`p-4 border rounded-lg text-center transition-all ${
                      formData.contactMethod === method.value
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.contactMethod && (
              <p className="text-red-500 text-sm mt-2">{errors.contactMethod}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={formData.additionalNotes || ''}
              onChange={(e) => handleInputChange('additionalNotes', e)}
              placeholder="Any specific topics you'd like to cover in the demo..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={3}
            />
          </div>
        </div>
      )}

      {step.id === 4 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">Review Your Information</h3>
            <p className="text-gray-600">Please review your details before scheduling</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-primary mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Name:</strong> {formData.fullName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2">Dealership Details</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Dealership:</strong> {formData.dealershipName}</p>
                  <p><strong>Location:</strong> {formData.businessLocation}</p>
                  <p><strong>Vehicles:</strong> {formData.vehiclesManaged}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Business Needs</h4>
              <div className="flex flex-wrap gap-2">
                {(formData.businessNeeds || []).map(need => (
                  <span key={need} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {businessNeedsOptions.find(opt => opt.value === need)?.label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Demo Schedule</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Date:</strong> {formData.preferredDate}</p>
                <p><strong>Time:</strong> {formData.preferredTime}</p>
                <p><strong>Time Zone:</strong> {formData.timeZone}</p>
                <p><strong>Contact Method:</strong> {contactMethodOptions.find(opt => opt.value === formData.contactMethod)?.label}</p>
              </div>
            </div>

            {formData.additionalNotes && (
              <div>
                <h4 className="font-semibold text-primary mb-2">Additional Notes</h4>
                <p className="text-sm text-gray-600">{formData.additionalNotes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
