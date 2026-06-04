import { Car, DollarSign, CreditCard, User, Mail, Phone, Briefcase, MessageSquare, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useFinancingForm } from '@/hooks/useFinancing'
import { useToast } from '@/hooks/useFinancing'

interface FinancingFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function FinancingForm({ onSuccess, onCancel }: FinancingFormProps) {
  const { formData, errors, isSubmitting, submitted, handleInputChange, handleSubmit, resetForm } = useFinancingForm()
  const { showSuccess, showError } = useToast()

  const onSubmit = async (e: React.FormEvent) => {
    const result = await handleSubmit(e)
    
    if (result?.success) {
      showSuccess('Application Submitted!', 'Your financing application has been received successfully.')
      onSuccess?.()
    } else {
      showError('Submission Failed', result?.error || 'Failed to submit application. Please try again.')
    }
  }

  const handleRequestInformation = async () => {
    if (!formData.email) {
      showError('Email Required', 'Please provide your email address to request information.')
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      showSuccess('Information Requested', 'A representative will contact you shortly with financing information.')
    } catch (error) {
      showError('Request Failed', 'Failed to send information request. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Application Received!</h3>
        <p className="text-green-700 mb-4">
          Thank you for your financing application. Our team will review your information and contact you within 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="primary" 
            onClick={() => {
              resetForm()
              onSuccess?.()
            }}
          >
            Continue
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => {
              resetForm()
            }}
          >
            Submit Another Application
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
          />
          {errors.fullName && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.fullName}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.phone}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Car className="w-4 h-4 inline mr-2" />
            Vehicle Interested In
          </label>
          <input
            type="text"
            name="vehicleInterested"
            value={formData.vehicleInterested}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="2023 Honda Accord"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Down Payment Amount
          </label>
          <input
            type="text"
            name="downPayment"
            value={formData.downPayment}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.downPayment ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="$5,000"
          />
          {errors.downPayment && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.downPayment}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CreditCard className="w-4 h-4 inline mr-2" />
            Estimated Credit Score
          </label>
          <select
            name="creditScore"
            value={formData.creditScore}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Range</option>
            <option value="excellent">750+ (Excellent)</option>
            <option value="good">700-749 (Good)</option>
            <option value="fair">650-699 (Fair)</option>
            <option value="poor">Below 650 (Poor)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Monthly Income
          </label>
          <input
            type="text"
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.monthlyIncome ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="$4,000"
          />
          {errors.monthlyIncome && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.monthlyIncome}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="w-4 h-4 inline mr-2" />
            Employment Status
          </label>
          <select
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Status</option>
            <option value="employed-full">Full-time Employed</option>
            <option value="employed-part">Part-time Employed</option>
            <option value="self-employed">Self-Employed</option>
            <option value="retired">Retired</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Additional Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Tell us about your financing needs..."
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="flex-1"
        >
          Apply Now
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={handleRequestInformation}
        >
          Request Information
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
