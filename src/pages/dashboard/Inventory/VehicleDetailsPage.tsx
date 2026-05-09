import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Phone, Mail, Calendar, DollarSign, Car, Fuel, Settings, Palette } from 'lucide-react'
import Card, { StatusBadge } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { inventoryService } from '@/services/inventoryService'
import { mockVehicles } from '@/data/mockVehicles'
import { Vehicle } from '@/types/vehicle'

export default function VehicleDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

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

  const handleDeleteVehicle = () => {
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!vehicle) return

    try {
      await inventoryService.deleteVehicle(vehicle.id)
      navigate('/dashboard/inventory')
    } catch (err) {
      console.error('Failed to delete vehicle', err)
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  if (loading) {
    return <div className="text-center py-12">Loading vehicle details...</div>
  }

  if (!vehicle) {
    return <div className="text-center py-12">Vehicle not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
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
            <h1 className="text-4xl font-bold text-primary">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-gray-600 mt-2">VIN: {vehicle.vin}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="md"
            onClick={() => navigate(`/dashboard/inventory/edit/${vehicle.id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Vehicle
          </Button>
          <Button 
            variant="secondary" 
            size="md"
            onClick={handleDeleteVehicle}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
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
            <h3 className="text-lg font-bold text-primary mb-4">Vehicle Information</h3>
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
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Transmission</p>
                    <p className="font-medium">{vehicle.transmission}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Exterior/Interior</p>
                    <p className="font-medium">
                      {vehicle.exteriorColor} / {vehicle.interiorColor}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Body Type</p>
                    <p className="font-medium">{vehicle.bodyType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={vehicle.status} variant="success" />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium capitalize">{vehicle.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {vehicle.description || 'No description available for this vehicle.'}
            </p>
          </Card>

          {/* Features */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {vehicle.features && vehicle.features.length > 0 ? (
                vehicle.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="primary" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Schedule Test Drive
              </Button>
              <Button variant="secondary" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Send Inquiry
              </Button>
              <Button variant="secondary" className="w-full">
                <DollarSign className="w-4 h-4 mr-2" />
                Check Financing
              </Button>
            </div>
          </Card>

          {/* Pricing Details */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Pricing Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle Price</span>
                <span className="font-medium">{formatCurrency(vehicle.price)}</span>
              </div>
              {vehicle.monthlyEstimate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Monthly</span>
                  <span className="font-medium">{formatCurrency(vehicle.monthlyEstimate)}/mo</span>
                </div>
              )}
              {vehicle.financingAvailable && (
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Financing Available</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Vehicle Status */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Status Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Status</span>
                <StatusBadge status={vehicle.status} variant="success" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Added Date</span>
                <span className="font-medium">{formatDate(vehicle.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{formatDate(vehicle.updatedAt)}</span>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card>
            <h3 className="text-lg font-bold text-primary mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">sales@eaglevisionedge.com</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete the{' '}
            <strong>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmDelete}>
              Delete Vehicle
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
