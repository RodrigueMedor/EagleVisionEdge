import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, Car, DollarSign, Fuel, Calendar, MapPin } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { inventoryService } from '@/services/inventoryService'
import { mockVehicles } from '@/data/mockVehicles'
import { Vehicle } from '@/types/vehicle'

const makes = ['All', 'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Nissan', 'Hyundai', 'Kia', 'Volkswagen', 'Mazda', 'Subaru', 'Lexus', 'Acura']
const bodyTypes = ['All', 'Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Hatchback', 'Minivan', 'Wagon']
const fuelTypes = ['All', 'Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid']
const priceRanges = [
  { label: 'Any Price', min: 0, max: 999999 },
  { label: 'Under $20,000', min: 0, max: 19999 },
  { label: '$20,000 - $30,000', min: 20000, max: 30000 },
  { label: '$30,000 - $40,000', min: 30000, max: 40000 },
  { label: '$40,000 - $50,000', min: 40000, max: 50000 },
  { label: 'Over $50,000', min: 50000, max: 999999 }
]

export default function InventoryPage() {
  const [searchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [makeFilter, setMakeFilter] = useState('All')
  const [bodyTypeFilter, setBodyTypeFilter] = useState('All')
  const [fuelTypeFilter, setFuelTypeFilter] = useState('All')
  const [priceRangeFilter, setPriceRangeFilter] = useState('Any Price')
  const [sortBy, setSortBy] = useState('createdAt')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadVehicles()
  }, [])

  useEffect(() => {
    filterAndSortVehicles()
  }, [vehicles, searchTerm, makeFilter, bodyTypeFilter, fuelTypeFilter, priceRangeFilter, sortBy])

  const loadVehicles = async () => {
    setLoading(true)
    try {
      const data = await inventoryService.getVehicles()
      const availableVehicles = data.filter(v => v.status === 'available')
      setVehicles(availableVehicles)
    } catch (err) {
      console.error('Failed to load vehicles', err)
      const availableVehicles = mockVehicles.filter(v => v.status === 'available')
      setVehicles(availableVehicles)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortVehicles = () => {
    let filtered = vehicles

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply make filter
    if (makeFilter !== 'All') {
      filtered = filtered.filter(vehicle => vehicle.make === makeFilter)
    }

    // Apply body type filter
    if (bodyTypeFilter !== 'All') {
      filtered = filtered.filter(vehicle => vehicle.bodyType === bodyTypeFilter)
    }

    // Apply fuel type filter
    if (fuelTypeFilter !== 'All') {
      filtered = filtered.filter(vehicle => vehicle.fuelType === fuelTypeFilter)
    }

    // Apply price range filter
    const priceRange = priceRanges.find(range => range.label === priceRangeFilter)
    if (priceRange) {
      filtered = filtered.filter(vehicle => 
        vehicle.price >= priceRange.min && vehicle.price <= priceRange.max
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        case 'mileage':
          return a.mileage - b.mileage
        case 'year':
          return b.year - a.year
        case 'make':
          return a.make.localeCompare(b.make)
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredVehicles(filtered)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (loading) {
    return <div className="text-center py-12">Loading inventory...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Vehicle Inventory</h1>
            <p className="text-gray-600 text-lg">
              Browse our selection of quality vehicles
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by make, model, or VIN..."
                  className="pl-12 h-12 text-lg"
                />
              </div>
              <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant="secondary"
                className="h-12"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="max-w-6xl mx-auto">
              <Card>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                    <Select
                      value={makeFilter}
                      onChange={(e) => setMakeFilter(e.target.value)}
                    >
                      {makes.map(make => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                    <Select
                      value={bodyTypeFilter}
                      onChange={(e) => setBodyTypeFilter(e.target.value)}
                    >
                      {bodyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                    <Select
                      value={fuelTypeFilter}
                      onChange={(e) => setFuelTypeFilter(e.target.value)}
                    >
                      {fuelTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <Select
                      value={priceRangeFilter}
                      onChange={(e) => setPriceRangeFilter(e.target.value)}
                    >
                      {priceRanges.map(range => (
                        <option key={range.label} value={range.label}>{range.label}</option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="createdAt">Newest First</option>
                      <option value="price">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="year">Year: New to Old</option>
                      <option value="mileage">Mileage: Low to High</option>
                      <option value="make">Make: A to Z</option>
                    </Select>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Results Count */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredVehicles.length}</span> vehicles
            </p>
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No vehicles found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
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
      </div>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't see what you're looking for?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Let us help you find the perfect vehicle
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => window.location.href = '/contact'}
          >
            Contact Us
          </Button>
        </div>
      </section>
    </div>
  )
}

