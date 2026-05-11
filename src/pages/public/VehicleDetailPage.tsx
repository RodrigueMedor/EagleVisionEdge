import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, Calendar, MapPin, DollarSign, Car, Fuel, Settings, Palette, Shield, Star, Share2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { inventoryService } from '@/services/inventoryService'
import { mockVehicles } from '@/data/mockVehicles'
import { Vehicle } from '@/types/vehicle'

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)

  useEffect(() => {
    loadVehicle()
  }, [id])

  const loadVehicle = async () => {
    if (!id) return

    try {
      const data = await inventoryService.getVehicleById(id)
      setVehicle(data)
    } catch (err) {
      console.error('Failed to load vehicle', err)
      const fallbackVehicle = mockVehicles.find(v => v.id === id)
      if (fallbackVehicle) {
        setVehicle(fallbackVehicle)
      }
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(dateObj)
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const handleContactClick = () => {
    setShowContactModal(true)
  }

  if (loading) {
    return <div className="text-center py-12">Loading vehicle details...</div>
  }

  if (!vehicle) {
    return <div className="text-center py-12">Vehicle not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Inventory
            </Button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-primary">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-gray-600">VIN: {vehicle.vin}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <h2 className="text-xl font-bold text-primary mb-4">Photos</h2>
              <div className="space-y-4">
                {/* Main Image */}
                <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <img
                      src={vehicle.images[selectedImageIndex]}
                      alt={`${vehicle.make} ${vehicle.model} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {vehicle.images && vehicle.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {vehicle.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index 
                            ? 'border-blue-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Vehicle Information */}
            <Card>
              <h2 className="text-xl font-bold text-primary mb-4">Vehicle Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Year/Make/Model</p>
                      <p className="font-medium">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-medium text-lg text-primary">
                        {formatCurrency(vehicle.price)}
                      </p>
                      {vehicle.monthlyEstimate && (
                        <p className="text-sm text-gray-600">
                          Est. {formatCurrency(vehicle.monthlyEstimate)}/month
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Mileage</p>
                      <p className="font-medium">
                        {vehicle.mileage.toLocaleString()} miles
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Fuel className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Fuel Type</p>
                      <p className="font-medium">{vehicle.fuelType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Transmission</p>
                      <p className="font-medium">{vehicle.transmission}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Exterior Color</p>
                      <p className="font-medium">{vehicle.exteriorColor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Interior Color</p>
                      <p className="font-medium">{vehicle.interiorColor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Body Type</p>
                      <p className="font-medium">{vehicle.bodyType}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card>
              <h2 className="text-xl font-bold text-primary mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {vehicle.description || 'No description available for this vehicle.'}
              </p>
            </Card>

            {/* Features */}
            <Card>
              <h2 className="text-xl font-bold text-primary mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {vehicle.features && vehicle.features.length > 0 ? (
                  vehicle.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full">No features listed</p>
                )}
              </div>
            </Card>

            {/* Actions */}
            <Card>
              <h2 className="text-xl font-bold text-primary mb-4">Next Steps</h2>
              <div className="space-y-4">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="w-full"
                  onClick={handleContactClick}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Test Drive
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="w-full"
                  onClick={() => window.location.href = `/contact?vehicle=${vehicle.id}`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Make an Inquiry
                </Button>

                <Button 
                  variant="secondary" 
                  size="lg"
                  className="w-full"
                  onClick={() => window.location.href = '/financing'}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Check Financing
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <h3 className="text-lg font-bold text-primary mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium capitalize text-green-600">
                    {vehicle.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock #</span>
                  <span className="font-medium">{vehicle.vin.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-medium">{formatDate(vehicle.createdAt)}</span>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card>
              <h3 className="text-lg font-bold text-primary mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Sales</p>
                    <p className="font-medium">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">sales@eaglevisionedge.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">123 Main Street, City, State 12345</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Trust Badges */}
            <Card>
              <h3 className="text-lg font-bold text-primary mb-4">Why Buy From Us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Quality Assured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">Trusted Dealer</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Best Prices</span>
                </div>
              </div>
            </Card>

            {/* Share */}
            <Card>
              <h3 className="text-lg font-bold text-primary mb-4">Share This Vehicle</h3>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                        text: `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} at Eagle Vision Edge - ${formatCurrency(vehicle.price)}`,
                        url: window.location.href
                      })
                    }
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary">Schedule Test Drive</h3>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setShowContactModal(false)}
              >
                ×
              </Button>
            </div>
            <p className="text-gray-600 mb-4">
              Interested in the {vehicle.year} {vehicle.make} {vehicle.model}? 
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
            <Button 
              variant="primary" 
              size="lg"
              className="w-full"
              onClick={() => window.location.href = `/contact?vehicle=${vehicle.id}`}
            >
              Schedule Test Drive
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

