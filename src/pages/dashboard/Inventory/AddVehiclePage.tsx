import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Upload, X, Plus, Trash2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { inventoryService } from '@/services/inventoryService'
import { Vehicle } from '@/types/vehicle'

const initialFormData: Partial<Vehicle> = {
  vin: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  mileage: 0,
  price: 0,
  monthlyEstimate: 0,
  bodyType: '',
  fuelType: '',
  transmission: '',
  exteriorColor: '',
  interiorColor: '',
  description: '',
  features: [],
  status: 'available',
  financingAvailable: true,
  images: []
}

const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Nissan', 'Hyundai', 'Kia', 'Volkswagen', 'Mazda', 'Subaru', 'Lexus', 'Acura']
const bodyTypes = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Hatchback', 'Minivan', 'Wagon']
const fuelTypes = ['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid']
const transmissions = ['Automatic', 'Manual', 'CVT']

export default function AddVehiclePage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<Partial<Vehicle>>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [newFeature, setNewFeature] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const handleInputChange = (field: keyof Vehicle, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }))
  }

  const handleAddImage = () => {
    if (newFeature.trim() && !imageUrls.includes(newFeature.trim())) {
      setImageUrls(prev => [...prev, newFeature.trim()])
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index)
    setImageUrls(newImageUrls)
    setFormData(prev => ({
      ...prev,
      images: newImageUrls
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const vehicleData = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      } as Vehicle

      await inventoryService.addVehicle(vehicleData)
      navigate('/dashboard/inventory')
    } catch (err) {
      console.error('Failed to add vehicle', err)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/dashboard/inventory')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-primary">Add Vehicle</h1>
            <p className="text-gray-600 mt-2">Add a new vehicle to your inventory</p>
          </div>
        </div>
        <Button 
          variant="primary" 
          size="md"
          onClick={handleSubmit}
          disabled={loading}
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Vehicle'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VIN *</label>
                <Input
                  value={formData.vin || ''}
                  onChange={(e) => handleInputChange('vin', e.target.value)}
                  placeholder="Vehicle Identification Number"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
                  <Select
                    value={formData.make || ''}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    required
                  >
                    <option value="">Select Make</option>
                    {makes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                  <Input
                    value={formData.model || ''}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="Model"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <Input
                    type="number"
                    value={formData.year || ''}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                  <Select
                    value={formData.bodyType || ''}
                    onChange={(e) => handleInputChange('bodyType', e.target.value)}
                  >
                    <option value="">Select Body Type</option>
                    {bodyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Pricing & Status */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Pricing & Status</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <Input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                    placeholder="0"
                    min="0"
                    required
                  />
                  {formData.price && (
                    <p className="text-sm text-gray-600 mt-1">{formatCurrency(formData.price)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Estimate</label>
                  <Input
                    type="number"
                    value={formData.monthlyEstimate || ''}
                    onChange={(e) => handleInputChange('monthlyEstimate', parseInt(e.target.value))}
                    placeholder="0"
                    min="0"
                  />
                  {formData.monthlyEstimate && (
                    <p className="text-sm text-gray-600 mt-1">{formatCurrency(formData.monthlyEstimate)}/mo</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mileage *</label>
                <Input
                  type="number"
                  value={formData.mileage || ''}
                  onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <Select
                    value={formData.status || 'available'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    required
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="reserved">Reserved</option>
                    <option value="rented">Rented</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Financing Available</label>
                  <Select
                    value={formData.financingAvailable ? 'true' : 'false'}
                    onChange={(e) => handleInputChange('financingAvailable', e.target.value === 'true')}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Vehicle Details */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Vehicle Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                  <Select
                    value={formData.fuelType || ''}
                    onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  >
                    <option value="">Select Fuel Type</option>
                    {fuelTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                  <Select
                    value={formData.transmission || ''}
                    onChange={(e) => handleInputChange('transmission', e.target.value)}
                  >
                    <option value="">Select Transmission</option>
                    {transmissions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exterior Color</label>
                  <Input
                    value={formData.exteriorColor || ''}
                    onChange={(e) => handleInputChange('exteriorColor', e.target.value)}
                    placeholder="Exterior color"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interior Color</label>
                  <Input
                    value={formData.interiorColor || ''}
                    onChange={(e) => handleInputChange('interiorColor', e.target.value)}
                    placeholder="Interior color"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Vehicle description..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </Card>

          {/* Features */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Features</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                />
                <Button type="button" onClick={handleAddFeature}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.features?.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Images */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Images</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add image URL..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                />
                <Button type="button" onClick={handleAddImage}>
                  <Upload className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Vehicle image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  )
}
