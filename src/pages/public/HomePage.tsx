import { useState, useEffect } from 'react'
import { Search, Phone, Mail, MapPin, Star, ArrowRight, Car, DollarSign, Shield, Clock } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { inventoryService } from '@/services/inventoryService'
import { mockVehicles } from '@/data/mockVehicles'
import { Vehicle } from '@/types/vehicle'

export default function HomePage() {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedVehicles()
  }, [])

  const loadFeaturedVehicles = async () => {
    try {
      const vehicles = await inventoryService.getVehicles()
      // Get first 6 available vehicles as featured
      const featured = vehicles
        .filter(v => v.status === 'available')
        .slice(0, 6)
      setFeaturedVehicles(featured)
    } catch (err) {
      console.error('Failed to load featured vehicles', err)
      const featured = mockVehicles
        .filter(v => v.status === 'available')
        .slice(0, 6)
      setFeaturedVehicles(featured)
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

  const handleSearch = () => {
    if (searchTerm.trim()) {
      window.location.href = `/inventory?search=${encodeURIComponent(searchTerm)}`
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Find Your Perfect Vehicle at Eagle Vision Edge
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Quality vehicles, competitive prices, and exceptional service. 
              Your trusted dealership partner.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2 bg-white rounded-lg p-2">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by make, model, or VIN..."
                  className="flex-1 text-gray-900"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-blue-100">Vehicles in Stock</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">4.8★</div>
                <div className="text-blue-100">Customer Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">10+ Years</div>
                <div className="text-blue-100">In Business</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Featured Vehicles</h2>
            <p className="text-gray-600 text-lg">Check out our handpicked selection of quality vehicles</p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading featured vehicles...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Vehicle Image */}
                  <div className="h-48 bg-gray-200 relative">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0]}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                      Available
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-primary">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {vehicle.mileage.toLocaleString()} miles • {vehicle.fuelType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(vehicle.price)}
                        </p>
                        {vehicle.monthlyEstimate && (
                          <p className="text-sm text-gray-600">
                            {formatCurrency(vehicle.monthlyEstimate)}/mo
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 text-sm text-gray-600 mb-4">
                      <span>{vehicle.transmission}</span>
                      <span>•</span>
                      <span>{vehicle.exteriorColor}</span>
                      <span>•</span>
                      <span>{vehicle.bodyType}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.location.href = `/inventory/${vehicle.id}`}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => window.location.href = `/contact?vehicle=${vehicle.id}`}
                      >
                        Inquire
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => window.location.href = '/inventory'}
            >
              View All Inventory
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Why Choose Eagle Vision Edge</h2>
            <p className="text-gray-600 text-lg">We're committed to providing the best car buying experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Quality Assurance</h3>
              <p className="text-gray-600">All vehicles undergo rigorous inspection and reconditioning</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Competitive Pricing</h3>
              <p className="text-gray-600">Fair market prices with no hidden fees or charges</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Quick Approval</h3>
              <p className="text-gray-600">Fast financing decisions with competitive rates</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Expert Service</h3>
              <p className="text-gray-600">Knowledgeable staff dedicated to your satisfaction</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Dream Car?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Visit us today or schedule a test drive online
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => window.location.href = '/contact'}
            >
              <Phone className="w-4 h-4 mr-2" />
              Schedule Test Drive
            </Button>
            <Button 
              variant="primary" 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/inventory'}
            >
              Browse Inventory
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Call Us</h3>
              <p className="text-gray-600">(555) 123-4567</p>
              <p className="text-sm text-gray-500">Mon-Fri: 9AM-7PM, Sat: 9AM-5PM</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Email Us</h3>
              <p className="text-gray-600">info@eaglevisionedge.com</p>
              <p className="text-sm text-gray-500">We respond within 24 hours</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Main Street</p>
              <p className="text-sm text-gray-500">City, State 12345</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

