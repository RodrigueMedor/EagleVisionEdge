import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { useToast } from '@/hooks/useFinancing'
import { User, Mail, Phone, Calendar, MapPin, AlertCircle, Car } from 'lucide-react'

interface RentalReservationModalProps {
  isOpen: boolean
  onClose: () => void
  vehicleName?: string
  vehicleType?: string
  dailyRate?: string
}

interface ReservationFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  pickupDate: string
  returnDate: string
  pickupLocation: string
  driversLicense: string
  insurance: boolean
  additionalInfo: string
}

export default function RentalReservationModal({ 
  isOpen, 
  onClose, 
  vehicleName = '', 
  vehicleType = '', 
  dailyRate = '' 
}: RentalReservationModalProps) {
  const { showSuccess, showError } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ReservationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    driversLicense: '',
    insurance: false,
    additionalInfo: ''
  })
  const [errors, setErrors] = useState<Partial<ReservationFormData>>({})

  const validateForm = () => {
    const newErrors: Partial<ReservationFormData> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
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

    if (!formData.pickupDate) {
      newErrors.pickupDate = 'Pickup date is required'
    }

    if (!formData.returnDate) {
      newErrors.returnDate = 'Return date is required'
    }

    if (formData.pickupDate && formData.returnDate && new Date(formData.returnDate) <= new Date(formData.pickupDate)) {
      newErrors.returnDate = 'Return date must be after pickup date'
    }

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required'
    }

    if (!formData.driversLicense.trim()) {
      newErrors.driversLicense = 'Driver\'s license number is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setFormData(prev => ({ ...prev, [name]: checked }))
    
    // Clear error for this field
    if (errors[name as keyof ReservationFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const calculateTotalDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0
    const pickup = new Date(formData.pickupDate)
    const returnDate = new Date(formData.returnDate)
    const diffTime = Math.abs(returnDate.getTime() - pickup.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateTotalCost = () => {
    const days = calculateTotalDays()
    const rate = parseFloat(dailyRate.replace(/[$,]/g, '')) || 0
    return days * rate
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call to submit reservation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real application, this would send the data to your backend
      const reservation = {
        ...formData,
        vehicleName,
        vehicleType,
        dailyRate,
        totalDays: calculateTotalDays(),
        totalCost: calculateTotalCost(),
        id: `reservation_${Date.now()}`,
        timestamp: new Date().toISOString()
      }
      
      console.log('Rental reservation submitted:', reservation)
      
      showSuccess(
        'Reservation Submitted!', 
        `Thank you ${formData.firstName} ${formData.lastName}! Your rental reservation for ${vehicleName} has been received. We'll contact you within 24 hours to confirm availability and complete the booking.`
      )
      
      // Reset form and close modal
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        pickupDate: '',
        returnDate: '',
        pickupLocation: '',
        driversLicense: '',
        insurance: false,
        additionalInfo: ''
      })
      setErrors({})
      onClose()
    } catch (error) {
      showError('Submission Failed', 'Failed to submit reservation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalDays = calculateTotalDays()
  const totalCost = calculateTotalCost()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vehicle Reservation" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Summary */}
        {vehicleName && (
          <div className="bg-primary text-white rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Car className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-lg">{vehicleName}</h3>
                <p className="text-primary-100">{vehicleType} - {dailyRate}/day</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John"
            />
            {errors.firstName && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.firstName}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.lastName}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
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
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Pickup Date *
            </label>
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.pickupDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.pickupDate && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.pickupDate}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Return Date *
            </label>
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleInputChange}
              required
              min={formData.pickupDate || new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.returnDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.returnDate && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.returnDate}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Pickup Location *
          </label>
          <select
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.pickupLocation ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select pickup location</option>
            <option value="main-office">Main Office - 123 Main St</option>
            <option value="airport">Airport Location</option>
            <option value="downtown">Downtown Location</option>
            <option value="suburban">Suburban Location</option>
          </select>
          {errors.pickupLocation && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.pickupLocation}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Driver's License Number *
          </label>
          <input
            type="text"
            name="driversLicense"
            value={formData.driversLicense}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.driversLicense ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="D123456789"
          />
          {errors.driversLicense && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.driversLicense}
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="insurance"
              checked={formData.insurance}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm text-gray-700">
              I would like to add rental insurance coverage (+$15/day)
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Information
          </label>
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Any special requests or additional information..."
          />
        </div>

        {/* Cost Summary */}
        {totalDays > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Cost Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Daily Rate:</span>
                <span>{dailyRate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Rental Days:</span>
                <span>{totalDays}</span>
              </div>
              {formData.insurance && (
                <div className="flex justify-between text-sm">
                  <span>Insurance ($15/day):</span>
                  <span>${totalDays * 15}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Cost:</span>
                  <span className="text-primary">
                    ${totalCost + (formData.insurance ? totalDays * 15 : 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Reservation Policy:</strong> This is a reservation request, not a confirmed booking. We'll contact you within 24 hours to confirm availability and finalize the rental agreement. No charges will be made until confirmation.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="flex-1"
          >
            Submit Reservation
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
