import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { useToast } from '@/hooks/useFinancing'
import { User, Mail, Phone, MessageSquare, AlertCircle } from 'lucide-react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  preferredContact: 'email' | 'phone' | 'both'
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { showSuccess, showError } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  })
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})

  const validateForm = () => {
    const newErrors: Partial<ContactFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call to submit contact request
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real application, this would send the data to your backend
      const contactRequest = {
        ...formData,
        id: `contact_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'financing_inquiry'
      }
      
      console.log('Contact request submitted:', contactRequest)
      
      showSuccess(
        'Contact Request Submitted!', 
        `Thank you ${formData.name}! Our financing team will contact you within 1 business day via ${formData.preferredContact === 'both' ? 'email and phone' : formData.preferredContact}.`
      )
      
      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        preferredContact: 'email'
      })
      setErrors({})
      onClose()
    } catch (error) {
      showError('Submission Failed', 'Failed to submit contact request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Financing Team" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
          />
          {errors.name && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
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
            Preferred Contact Method
          </label>
          <select
            name="preferredContact"
            value={formData.preferredContact}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.subject ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a subject</option>
            <option value="financing_application">Financing Application Status</option>
            <option value="pre_approval">Pre-Approval Inquiry</option>
            <option value="payment_calculator">Payment Calculator Help</option>
            <option value="credit_questions">Credit Score Questions</option>
            <option value="trade_in">Trade-In Information</option>
            <option value="general">General Financing Question</option>
            <option value="other">Other</option>
          </select>
          {errors.subject && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.subject}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Tell us how we can help you with your financing needs..."
          />
          {errors.message && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.message}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Response Time:</strong> Our financing team typically responds within 1 business day during business hours (Monday-Friday, 9 AM - 6 PM EST).
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="flex-1"
          >
            Send Message
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
