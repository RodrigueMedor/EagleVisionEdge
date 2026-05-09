import { useEffect, useState } from 'react'
import { Search, Filter, Plus, Car, Edit, Trash2, Eye, DollarSign } from 'lucide-react'
import Card, { StatusBadge } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import { inventoryService } from '@/services/inventoryService'
import { mockVehicles } from '@/data/mockVehicles'
import { Vehicle } from '@/types/vehicle'

export default function InventoryListPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null)

  useEffect(() => {
    loadVehicles()
  }, [])

  useEffect(() => {
    filterAndSortVehicles()
  }, [vehicles, searchTerm, statusFilter, sortBy])

  const loadVehicles = async () => {
    setLoading(true)
    try {
      const data = await inventoryService.getVehicles()
      setVehicles(data)
    } catch (err) {
      console.error('Failed to load vehicles', err)
      setVehicles(mockVehicles)
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

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price
        case 'mileage':
          return a.mileage - b.mileage
        case 'year':
          return b.year - a.year
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredVehicles(filtered)
  }

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!vehicleToDelete) return

    try {
      await inventoryService.deleteVehicle(vehicleToDelete.id)
      setVehicles(vehicles.filter(v => v.id !== vehicleToDelete.id))
      setDeleteModalOpen(false)
      setVehicleToDelete(null)
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

  if (loading) {
    return <div className="text-center py-12">Loading inventory...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-primary">Inventory Management</h1>
          <p className="text-gray-600 mt-2">Manage your vehicle inventory</p>
        </div>
        <Button variant="primary" size="md">
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by make, model, or VIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
            <option value="rented">Rented</option>
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Date Added</option>
            <option value="price">Price</option>
            <option value="mileage">Mileage</option>
            <option value="year">Year</option>
          </Select>

          <Button variant="secondary" size="md">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Vehicles</p>
              <p className="text-2xl font-bold text-primary">{vehicles.length}</p>
            </div>
            <Car className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {vehicles.filter(v => v.status === 'available').length}
              </p>
            </div>
            <StatusBadge status="Available" variant="success" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sold</p>
              <p className="text-2xl font-bold text-red-600">
                {vehicles.filter(v => v.status === 'sold').length}
              </p>
            </div>
            <StatusBadge status="Sold" variant="error" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(vehicles.reduce((sum, v) => sum + v.price, 0))}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="overflow-hidden">
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
              <div className="absolute top-2 right-2">
                <StatusBadge status={vehicle.status} variant="success" />
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-primary">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-gray-600 text-sm">{vehicle.vin}</p>
                </div>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(vehicle.price)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                <div>{vehicle.mileage.toLocaleString()} miles</div>
                <div>{vehicle.fuelType}</div>
                <div>{vehicle.transmission}</div>
                <div>{vehicle.exteriorColor}</div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleDeleteVehicle(vehicle)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
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
              {vehicleToDelete?.year} {vehicleToDelete?.make} {vehicleToDelete?.model}
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
