import { useState } from 'react'
import { Car, Calendar, MapPin, CheckCircle, Info, Loader2 } from 'lucide-react'
import { AIRecommendation } from '@/types/ai'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'

interface AIRentalAssistantProps {
  className?: string
}

export default function AIRentalAssistant({ className }: AIRentalAssistantProps) {
  const [rentalType, setRentalType] = useState('')
  const [duration, setDuration] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [drivers, setDrivers] = useState('1')
  const [budget, setBudget] = useState('')
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<AIRecommendation | null>(null)

  const rentalTypes = [
    { value: 'economy', label: 'Economy Car', icon: '🚗' },
    { value: 'suv', label: 'SUV', icon: '🚙' },
    { value: 'truck', label: 'Truck', icon: '🚚' },
    { value: 'cargo_van', label: 'Cargo Van', icon: '🚐' },
    { value: 'luxury', label: 'Luxury', icon: '🏎️' },
    { value: 'electric', label: 'Electric', icon: '🔋' }
  ]

  const durations = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'long_term', label: 'Long Term (3+ months)' }
  ]

  const locations = [
    { value: 'downtown', label: 'Downtown Location' },
    { value: 'airport', label: 'Airport Location' },
    { value: 'suburban', label: 'Suburban Location' },
    { value: 'delivery', label: 'Delivery Available' }
  ]

  const searchRentals = async () => {
    if (!rentalType || !duration || !pickupDate) return

    setIsSearching(true)
    try {
      // Mock rental recommendations based on type
      const mockRecommendations: AIRecommendation[] = [
        {
          id: 'rental-1',
          title: `${rentalType === 'cargo_van' ? 'Cargo Van' : rentalType === 'suv' ? 'SUV' : 'Sedan'} Rental`,
          description: `Perfect ${duration} rental solution with unlimited mileage and comprehensive insurance`,
          type: 'rental',
          score: 9.0,
          confidence: 0.9,
          metadata: {
            price: rentalType === 'cargo_van' ? 89 : rentalType === 'suv' ? 65 : 45,
            available: true,
            features: ['Unlimited Mileage', 'Insurance Included', '24/7 Support'],
            category: rentalType
          },
          createdAt: new Date()
        },
        {
          id: 'rental-2',
          title: `${rentalType === 'cargo_van' ? 'Large Cargo Van' : rentalType === 'suv' ? 'Premium SUV' : 'Premium Sedan'} Rental`,
          description: `Upgraded ${duration} rental with premium features and additional coverage`,
          type: 'rental',
          score: 8.0,
          confidence: 0.8,
          metadata: {
            price: rentalType === 'cargo_van' ? 120 : rentalType === 'suv' ? 85 : 60,
            available: true,
            features: ['Premium Insurance', 'GPS Navigation', 'Roadside Assistance'],
            category: rentalType
          },
          createdAt: new Date()
        }
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setRecommendations(mockRecommendations)
      setShowResults(true)
    } catch (error) {
      console.error('Failed to search rentals:', error)
    } finally {
      setIsSearching(false)
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(date)
    } catch {
      return dateString
    }
  }

  const handleBookRental = (vehicle: AIRecommendation) => {
    setSelectedVehicle(vehicle)
    // In a real app, this would navigate to booking page
    alert(`Booking ${vehicle.title} - ${formatCurrency(vehicle.metadata?.price || 0)}/${duration}`)
  }

  const resetSearch = () => {
    setRentalType('')
    setDuration('')
    setPickupDate('')
    setPickupLocation('')
    setDrivers('1')
    setBudget('')
    setRecommendations([])
    setShowResults(false)
    setSelectedVehicle(null)
  }

  return (
    <Card className={clsx("p-6", className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Car className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">AI Rental Assistant</h3>
          <p className="text-sm text-gray-600">Find the perfect rental vehicle for your needs</p>
        </div>

        {!showResults ? (
          <>
            {/* Search Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <Select
                  value={rentalType}
                  onChange={(e) => setRentalType(e.target.value)}
                  className="w-full"
                >
                  <option value="">Select vehicle type</option>
                  {rentalTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rental Duration
                  </label>
                  <Select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full"
                  >
                    <option value="">Select duration</option>
                    {durations.map((dur) => (
                      <option key={dur.value} value={dur.value}>
                        {dur.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Date
                  </label>
                  <Input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <Select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full"
                  >
                    <option value="">Select location</option>
                    {locations.map((loc) => (
                      <option key={loc.value} value={loc.value}>
                        {loc.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Drivers
                  </label>
                  <Select
                    value={drivers}
                    onChange={(e) => setDrivers(e.target.value)}
                    className="w-full"
                  >
                    <option value="1">1 Driver</option>
                    <option value="2">2 Drivers</option>
                    <option value="3+">3+ Drivers</option>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Budget (Optional)
                </label>
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="0"
                  className="w-full"
                />
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={searchRentals}
              disabled={!rentalType || !duration || !pickupDate || isSearching}
              variant="primary"
              className="w-full"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Searching Available Rentals...
                </>
              ) : (
                <>
                  <Car className="w-4 h-4 mr-2" />
                  Search Available Rentals
                </>
              )}
            </Button>

            {/* Quick Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-800 mb-1">Rental Information</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• All rentals include basic insurance</li>
                    <li>• Unlimited mileage on most vehicles</li>
                    <li>• 24/7 roadside assistance included</li>
                    <li>• Flexible pickup and return options</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Search Results */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Available Rentals</h4>
                <Button variant="secondary" onClick={resetSearch}>
                  New Search
                </Button>
              </div>

              {/* Search Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{rentalType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium capitalize">{duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium capitalize">{pickupLocation.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(pickupDate)}</span>
                  </div>
                </div>
              </div>

              {/* Rental Options */}
              <div className="space-y-4">
                {recommendations.map((vehicle) => (
                  <div key={vehicle.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h5 className="font-semibold text-gray-900 text-lg">{vehicle.title}</h5>
                          {vehicle.metadata?.available && (
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                              Available
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-4">{vehicle.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-600">Daily Rate:</span>
                            <span className="ml-2 text-lg font-bold text-blue-600">
                              {formatCurrency(vehicle.metadata?.price || 0)}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Confidence:</span>
                            <span className="ml-2 font-medium text-green-600">
                              {Math.round((vehicle.confidence || 0) * 100)}% match
                            </span>
                          </div>
                        </div>

                        {vehicle.metadata?.features && (
                          <div className="mb-4">
                            <h6 className="font-medium text-gray-900 mb-2">Features:</h6>
                            <div className="flex flex-wrap gap-2">
                              {vehicle.metadata.features.map((feature: string, index: number) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                      <Button
                        variant="primary"
                        onClick={() => handleBookRental(vehicle)}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Book This Rental
                      </Button>
                      <Button variant="secondary">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* No Results Message */}
              {recommendations.length === 0 && (
                <div className="text-center py-8">
                  <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No rentals available</h4>
                  <p className="text-gray-600 mb-4">
                    No rentals match your criteria. Try adjusting your search parameters.
                  </p>
                  <Button variant="secondary" onClick={resetSearch}>
                    Modify Search
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
