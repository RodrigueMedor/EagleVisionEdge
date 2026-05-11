import { useState } from 'react'
import { Car, User, Mail, Phone, Calendar, MapPin } from 'lucide-react'
import Button from '@/components/ui/Button'

interface FormData {
  customerName: string
  email: string
  phone: string
  rentalType: string
  rentalDuration: string
  preferredVehicle: string
  pickupDate: string
  message: string
}

export default function RentalForm() {
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    email: '',
    phone: '',
    rentalType: '',
    rentalDuration: '',
    preferredVehicle: '',
    pickupDate: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Rental Inquiry Received!</h3>
        <p className="text-green-700 mb-4">
          Thank you for your rental inquiry. Our team will contact you shortly to confirm availability and complete your reservation.
        </p>
        <Button 
          variant="primary" 
          onClick={() => {
            setSubmitted(false)
            setFormData({
              customerName: '',
              email: '',
              phone: '',
              rentalType: '',
              rentalDuration: '',
              preferredVehicle: '',
              pickupDate: '',
              message: ''
            })
          }}
        >
          Submit Another Inquiry
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name *
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="John Doe"
          />
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="john@example.com"
          />
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Car className="w-4 h-4 inline mr-2" />
            Rental Type *
          </label>
          <select
            name="rentalType"
            value={formData.rentalType}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Rental Type</option>
            <option value="uber">Uber/Driver Rental</option>
            <option value="cargo">Cargo Van Rental</option>
            <option value="daily">Daily Rental</option>
            <option value="weekly">Weekly Rental</option>
            <option value="fleet">Commercial Fleet</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Rental Duration *
          </label>
          <select
            name="rentalDuration"
            value={formData.rentalDuration}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Duration</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="long-term">Long-term (3+ months)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Car className="w-4 h-4 inline mr-2" />
            Preferred Vehicle
          </label>
          <input
            type="text"
            name="preferredVehicle"
            value={formData.preferredVehicle}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Toyota Camry, Cargo Van, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Preferred Pickup Date *
          </label>
          <input
            type="date"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Tell us about your rental needs..."
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        className="w-full"
      >
        Submit Rental Inquiry
      </Button>
    </form>
  )
}
