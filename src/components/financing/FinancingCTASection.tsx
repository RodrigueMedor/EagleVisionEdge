import { useState } from 'react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/hooks/useFinancing'
import { Phone, Mail, Calendar } from 'lucide-react'

export default function FinancingCTASection({ onApplyNow, onGetPreApproved, onScheduleConsultation, onContactTeam }: {
  onApplyNow?: () => void
  onGetPreApproved?: () => void
  onScheduleConsultation?: () => void
  onContactTeam?: () => void
}) {
  const { showSuccess, showError, showInfo } = useToast()

  const handleApplyNow = () => {
    onApplyNow?.()
  }

  const handleGetPreApproved = () => {
    onGetPreApproved?.()
    showInfo('Pre-Approval', 'Complete our application to get pre-approved for financing.')
  }

  const handleScheduleConsultation = () => {
    onScheduleConsultation?.()
  }

  const handleContactTeam = async () => {
    try {
      // Simulate contact request
      await new Promise(resolve => setTimeout(resolve, 1000))
      showSuccess('Contact Request Sent', 'Our financing team will contact you within 1 business day.')
      onContactTeam?.()
    } catch (error) {
      showError('Request Failed', 'Failed to send contact request. Please try again.')
    }
  }

  const handleCallNow = () => {
    showInfo('Call Us', 'Please call (555) 123-4567 to speak with our financing team.')
    // Also try to open phone dialer on mobile devices
    window.open('tel:5551234567', '_self')
  }

  const handleEmailUs = () => {
    showInfo('Email Us', 'Please email financing@eaglevisionedge.com for inquiries.')
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Button 
        variant="secondary" 
        size="lg" 
        className="bg-white text-primary hover:bg-gray-100"
        onClick={handleApplyNow}
      >
        Apply Now
      </Button>
      <Button 
        variant="accent" 
        size="lg" 
        className="border-2 border-white"
        onClick={handleGetPreApproved}
      >
        Get Pre-Approved
      </Button>
      <Button 
        variant="primary" 
        size="lg"
        onClick={handleScheduleConsultation}
      >
        <Calendar className="w-4 h-4 mr-2" />
        Schedule Consultation
      </Button>
      <Button 
        variant="secondary" 
        size="lg"
        onClick={handleContactTeam}
      >
        <Mail className="w-4 h-4 mr-2" />
        Contact Team
      </Button>
      <Button 
        variant="ghost" 
        size="lg"
        onClick={handleCallNow}
        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
      >
        <Phone className="w-4 h-4 mr-2" />
        <span className="font-semibold">(555) 123-4567</span>
      </Button>
    </div>
  )
}

// Add a dedicated phone number display component
export function PhoneNumberDisplay() {
  const handleCallNow = () => {
    window.open('tel:5551234567')
  }

  return (
    <div className="mt-8 text-center">
      <p className="text-white/80 text-sm mb-2">Call us directly:</p>
      <button
        onClick={handleCallNow}
        className="text-white text-2xl font-bold hover:text-yellow-300 transition-colors flex items-center justify-center gap-2 mx-auto"
      >
        <Phone className="w-6 h-6" />
        (555) 123-4567
      </button>
      <p className="text-white/60 text-xs mt-2">Mon-Fri 9AM-6PM EST</p>
    </div>
  )
}

interface ConsultationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const { showSuccess, showError } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      showSuccess('Consultation Scheduled', 'Your financing consultation has been scheduled. We will confirm the details shortly.')
      onClose()
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        message: ''
      })
    } catch (error) {
      showError('Scheduling Failed', 'Failed to schedule consultation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Financing Consultation" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
            <select
              value={formData.preferredTime}
              onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Time</option>
              <option value="9:00 AM">9:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="2:00 PM">2:00 PM</option>
              <option value="3:00 PM">3:00 PM</option>
              <option value="4:00 PM">4:00 PM</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Tell us about your financing needs..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="flex-1"
          >
            Schedule Consultation
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
