import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Car, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { inventoryService } from '@/services/inventoryService'
import { contentService } from '@/services/contentService'
import { useNotification } from '@/hooks'
import { mockVehicles } from '@/data/mockVehicles'
import { Vehicle } from '@/types/vehicle'
import { SiteContent } from '@/types/content'

const contactReasons = [
  'General Inquiry',
  'Schedule Test Drive',
  'Financing Information',
  'Trade-in Information',
  'Service Appointment',
  'Part Inquiry',
  'Other'
]

const contactMethods = [
  'Phone',
  'Email',
  'Text Message',
  'In Person'
]

export default function ContactPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [, setLoading] = useState(true)
  const [content, setContent] = useState<SiteContent | null>(null)
  const { error: showError } = useNotification()
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => { contentService.getContent().then(setContent) }, [])
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredContact: 'Email',
    reason: 'General Inquiry',
    message: '',
    vehicleId: searchParams.get('vehicle') || ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    try {
      const data = await inventoryService.getVehicles()
      const availableVehicles = data.filter(v => v.status === 'available')
      setVehicles(availableVehicles)
    } catch (err) {
      console.error('Failed to load vehicles', err)
      showError('Failed to load vehicle list. Showing sample data.')
      const availableVehicles = mockVehicles.filter(v => v.status === 'available')
      setVehicles(availableVehicles)
    } finally {
      setLoading(false)
    }
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.firstName.trim()) errs.firstName = 'First name is required'
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address'
    }
    if (formData.phone && !/^[\d\s\-().+]{7,}$/.test(formData.phone)) {
      errs.phone = 'Please enter a valid phone number'
    }
    if (!formData.message.trim()) errs.message = 'Message is required'
    return errs
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitted(true)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        preferredContact: 'Email',
        reason: 'General Inquiry',
        message: '',
        vehicleId: searchParams.get('vehicle') || ''
      })
    } catch (err) {
      console.error('Failed to submit form', err)
      showError('Failed to send your message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId)

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="max-w-2xl mx-auto text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">Thank You!</h1>
            <p className="text-gray-600 mb-6">
              Your message has been sent successfully. We'll get back to you within 24 hours.
            </p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">{content?.contact?.hero?.title || 'Contact Us'}</h1>
            <p className="text-gray-600 text-lg">
              {content?.contact?.hero?.subtitle || 'Get in touch with our team for any questions or to schedule a visit'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <h2 className="text-2xl font-bold text-primary mb-6">Send us a message</h2>
              
              {selectedVehicle && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    You're interested in:
                  </p>
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">
                      {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                    </span>
                    <span className="text-blue-600">
                      ({formatCurrency(selectedVehicle.price)})
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    required
                    error={errors.firstName}
                  />

                  <Input
                    id="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    required
                    error={errors.lastName}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john.doe@example.com"
                    required
                    error={errors.email}
                  />

                  <Input
                    id="phone"
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    error={errors.phone}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                    <Select
                      value={formData.preferredContact}
                      onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                    >
                      {contactMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Contact</label>
                    <Select
                      value={formData.reason}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                    >
                      {contactReasons.map(reason => (
                        <option key={reason} value={reason}>{reason}</option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us how we can help you..."
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none placeholder:text-gray-400 ${errors.message ? 'border-accent' : 'border-gray-200 hover:border-gray-300'}`}
                  />
                  {errors.message && <p className="text-accent text-sm mt-1.5">{errors.message}</p>}
                </div>

                <Button 
                  type="submit"
                  variant="primary" 
                  size="lg"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Visit Us */}
            <Card>
              <h3 className="text-xl font-bold text-primary mb-4">Visit Our Showroom</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">{content?.global?.dealershipName || 'Eagle Vision Edge'} Dealership</p>
                    <p className="text-gray-600">{content?.global?.address?.street || '123 Main Street'}</p>
                    <p className="text-gray-600">{content ? `${content.global.address.city}, ${content.global.address.state} ${content.global.address.zip}` : 'City, State 12345'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-gray-600">{content?.global?.businessHours?.weekday || 'Monday - Friday: 9:00 AM - 7:00 PM'}</p>
                    <p className="text-gray-600">{content?.global?.businessHours?.saturday || 'Saturday: 9:00 AM - 5:00 PM'}</p>
                    <p className="text-gray-600">{content?.global?.businessHours?.sunday || 'Sunday: Closed'}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Methods */}
            <Card>
              <h3 className="text-xl font-bold text-primary mb-4">Get in Touch</h3>
              <div className="space-y-4">
                {(content?.contact?.departments || [
                  { name: 'Sales Department', phone: '(305) 555-0100', availability: 'Available Monday - Saturday' },
                  { name: 'Service Department', phone: '(305) 555-0101', availability: 'Available Monday - Friday' },
                ]).map((dept, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Phone className={`w-5 h-5 mt-1 ${i === 0 ? 'text-green-600' : 'text-purple-600'}`} />
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-gray-600">{dept.phone}</p>
                      <p className="text-sm text-gray-500">{dept.availability}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Email Us</p>
                    <p className="text-gray-600">{content?.global?.email || 'info@eaglevisionedge.com'}</p>
                    <p className="text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Links */}
            <Card>
              <h3 className="text-xl font-bold text-primary mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Button 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={() => navigate('/inventory')}
                >
                  <Car className="w-4 h-4 mr-3" />
                  Browse Inventory
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={() => navigate('/financing')}
                >
                  Get Pre-Approved
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={() => navigate('/about')}
                >
                  About Us
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
