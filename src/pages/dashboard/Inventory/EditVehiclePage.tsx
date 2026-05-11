import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Upload, X, Plus, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { inventoryService } from '@/services/inventoryService'
import { mockVehicles } from '@/data/mockVehicles'
import { Vehicle } from '@/types/vehicle'

const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Nissan', 'Hyundai', 'Kia', 'Volkswagen', 'Mazda', 'Subaru', 'Lexus', 'Acura']
const bodyTypes = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Hatchback', 'Minivan', 'Wagon']
const fuelTypes = ['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid']
const transmissions = ['Automatic', 'Manual', 'CVT']

export default function EditVehiclePage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newFeature, setNewFeature] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([])

  useEffect(() => {
    loadVehicle()
  }, [id])

  const loadVehicle = async () => {
    if (!id) return

    try {
      const data = await inventoryService.getVehicleById(id)
      setVehicle(data)
      setImageUrls(data.images || [])
    } catch (err) {
      console.error('Failed to load vehicle', err)
      const fallbackVehicle = mockVehicles.find(v => v.id === id)
      if (fallbackVehicle) {
        setVehicle(fallbackVehicle)
        setImageUrls(fallbackVehicle.images || [])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof Vehicle, value: any) => {
    if (!vehicle) return
    setVehicle({ ...vehicle, [field]: value })
  }

  const handleAddFeature = () => {
    if (newFeature.trim() && vehicle) {
      setVehicle({
        ...vehicle,
        features: [...(vehicle.features || []), newFeature.trim()]
      })
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    if (!vehicle) return
    setVehicle({
      ...vehicle,
      features: vehicle.features?.filter((_, i) => i !== index) || []
    })
  }

  const handleAddImage = () => {
    if (newFeature.trim() && !imageUrls.includes(newFeature.trim())) {
      const newImageUrls = [...imageUrls, newFeature.trim()]
      setImageUrls(newImageUrls)
      if (vehicle) {
        setVehicle({ ...vehicle, images: newImageUrls })
      }
      setNewFeature('')
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index)
    setImageUrls(newImageUrls)
    if (vehicle) {
      setVehicle({ ...vehicle, images: newImageUrls })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicle) return

    setSaving(true)

    try {
      const updatedVehicle = {
        ...vehicle,
        updatedAt: new Date()
      }

      await inventoryService.updateVehicle(vehicle.id, updatedVehicle)
      navigate('/dashboard/inventory')
    } catch (err) {
      console.error('Failed to update vehicle', err)
    } finally {
      setSaving(false)
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

  if (loading) {
    return <div className="text-center py-12">Loading vehicle...</div>
  }

  if (!vehicle) {
    return <div className="text-center py-12">Vehicle not found</div>
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
            <h1 className="text-4xl font-bold text-primary">Edit Vehicle</h1>
            <p className="text-gray-600 mt-2">
              Edit {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
          </div>
        </div>
        <Button 
          variant="primary" 
          size="md"
          onClick={handleSubmit}
          disabled={saving}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
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
                  value={vehicle.vin || ''}
                  onChange={(e) => handleInputChange('vin', e.target.value)}
                  placeholder="Vehicle Identification Number"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
                  <Select
                    value={vehicle.make || ''}
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
                    value={vehicle.model || ''}
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
                    value={vehicle.year || ''}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                  <Select
                    value={vehicle.bodyType || ''}
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
                    value={vehicle.price || ''}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                    placeholder="0"
                    min="0"
                    required
                  />
                  {vehicle.price && (
                    <p className="text-sm text-gray-600 mt-1">{formatCurrency(vehicle.price)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Estimate</label>
                  <Input
                    type="number"
                    value={vehicle.monthlyEstimate || ''}
                    onChange={(e) => handleInputChange('monthlyEstimate', parseInt(e.target.value))}
                    placeholder="0"
                    min="0"
                  />
                  {vehicle.monthlyEstimate && (
                    <p className="text-sm text-gray-600 mt-1">{formatCurrency(vehicle.monthlyEstimate)}/mo</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mileage *</label>
                <Input
                  type="number"
                  value={vehicle.mileage || ''}
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
                    value={vehicle.status || 'available'}
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
                    value={vehicle.financingAvailable ? 'true' : 'false'}
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
                    value={vehicle.fuelType || ''}
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
                    value={vehicle.transmission || ''}
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
                    value={vehicle.exteriorColor || ''}
                    onChange={(e) => handleInputChange('exteriorColor', e.target.value)}
                    placeholder="Exterior color"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interior Color</label>
                  <Input
                    value={vehicle.interiorColor || ''}
                    onChange={(e) => handleInputChange('interiorColor', e.target.value)}
                    placeholder="Interior color"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={vehicle.description || ''}
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
                {vehicle.features?.map((feature, index) => (
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
